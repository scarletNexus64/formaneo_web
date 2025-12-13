import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';
import toast from 'react-hot-toast';

class ApiService {
  private axiosInstance: AxiosInstance;
  private isRetrying: boolean = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': 'web',
      },
    });

    this.setupInterceptors();
  }

  private updateBaseURL() {
    this.axiosInstance.defaults.baseURL = API_CONFIG.BASE_URL;
    console.log('🔄 Base URL updated to:', API_CONFIG.BASE_URL);
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
          headers: config.headers,
          baseURL: config.baseURL
        });
        
        // Récupérer le token depuis Zustand persist storage ou le token manuel
        let token: string | null = null;
        try {
          token = localStorage.getItem('authToken');
          if (!token) {
            // Fallback: essayer de récupérer depuis le storage de Zustand
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
              try {
                const parsed = JSON.parse(authStorage);
                token = parsed.state?.token;
              } catch (e) {
                console.warn('Could not parse auth storage');
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Failed to read from localStorage (private mode?)', error);
          // In private mode, token will be set via apiService.setAuthToken directly in header
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Token added to request');
        }
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('❌ API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });

        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Unauthorized - redirect to login
              localStorage.removeItem('authToken');
              window.location.href = '/login';
              toast.error('Session expirée, veuillez vous reconnecter');
              break;
            case 403:
              const accountStatus = error.response.data?.account_status;

              // Handle suspended accounts (admin action)
              if (accountStatus === 'suspended') {
                console.error('❌ Account suspended by admin, forcing logout');
                this.clearAuthToken();
                localStorage.removeItem('auth-storage');
                toast.error('Votre compte a été suspendu. Veuillez contacter le support.');
                setTimeout(() => {
                  window.location.href = '/login';
                }, 1500);
              }
              // Handle pending_payment or expired - show activation prompt but don't logout
              else if (accountStatus === 'pending_payment' || accountStatus === 'expired') {
                console.warn('⚠️ Account requires activation:', accountStatus);
                // Don't logout - let the UI show activation prompts
                if (accountStatus === 'expired') {
                  toast('Votre abonnement a expiré. Renouvelez pour continuer.', { icon: '⚠️' });
                } else {
                  toast('Activez votre compte pour accéder à toutes les fonctionnalités.', { icon: '⚠️' });
                }
              }
              // Handle old 'inactive' status for backward compatibility
              else if (accountStatus === 'inactive') {
                console.warn('⚠️ Account inactive (legacy)');
                toast('Activez votre compte pour accéder à toutes les fonctionnalités.', { icon: '⚠️' });
              }
              else {
                console.error('❌ 403 Forbidden:', error.response.config.url);
              }
              break;
            case 404:
              // toast.error('Ressource non trouvée');
              console.error('❌ 404 Not Found:', error.response.config.url);
              break;
            case 422:
              console.error('Validation errors:', error.response.data.errors);
              toast.error(error.response.data.message || 'Erreur de validation');
              break;
            case 500:
              // Gérer le fallback automatique vers l'URL de secours
              console.error('❌ 500 Server Error:', error.response.data);

              // Basculer vers l'URL de fallback et retry une seule fois
              if (!this.isRetrying) {
                this.isRetrying = true;
                API_CONFIG.handleError(error);
                this.updateBaseURL();

                // Retry la requête avec la nouvelle URL
                console.log('🔄 Retrying request with fallback URL...');
                return this.axiosInstance.request(error.config)
                  .then(response => {
                    console.log('✅ Request succeeded with fallback URL');
                    this.isRetrying = false;
                    return response;
                  })
                  .catch(retryError => {
                    console.error('❌ Request failed even with fallback URL');
                    this.isRetrying = false;
                    toast.error('Erreur serveur, veuillez réessayer plus tard');
                    return Promise.reject(retryError);
                  });
              } else {
                // Si on est déjà en retry, ne pas retry à nouveau
                toast.error('Erreur serveur, veuillez réessayer plus tard');
                this.isRetrying = false;
              }
              break;
            case 503:
              // Service Unavailable - Maintenance mode
              const maintenanceData = error.response.data;
              if (maintenanceData?.maintenance) {
                console.warn('🛠️ Maintenance mode active');

                // Avoid redirect loop - only redirect if not already on maintenance page
                const currentPath = window.location.pathname;
                if (currentPath !== '/maintenance') {
                  // Store maintenance info in sessionStorage
                  sessionStorage.setItem('maintenanceInfo', JSON.stringify({
                    title: maintenanceData.title,
                    message: maintenanceData.message
                  }));
                  // Redirect to maintenance page
                  window.location.href = '/maintenance';
                } else {
                  console.log('Already on maintenance page, skipping redirect');
                }
              }
              break;
            default:
              toast.error(error.response.data.message || 'Une erreur est survenue');
          }
        } else if (error.request) {
          console.error('❌ No response received:', error.request);
          // toast.error('Erreur de connexion au serveur');
        } else {
          console.error('❌ Request setup error:', error.message);
          toast.error('Une erreur inattendue est survenue');
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public setAuthToken(token: string) {
    // Stocker le token à la fois dans authToken (pour compatibilité) et dans l'header
    try {
      localStorage.setItem('authToken', token);
      console.log('🔐 Auth token saved to localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to save token to localStorage (private mode?)', error);
      // Token will still work via header, just won't persist across refreshes in private mode
    }
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Auth token set in apiService');
  }

  public clearAuthToken() {
    try {
      localStorage.removeItem('authToken');
      console.log('🧹 Auth token removed from localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to remove token from localStorage', error);
    }
    delete this.axiosInstance.defaults.headers.common['Authorization'];
    console.log('🧹 Auth token cleared from apiService');
  }
}

const apiService = new ApiService();
export default apiService;
export { apiService as ApiService };