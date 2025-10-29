import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';
import toast from 'react-hot-toast';

class ApiService {
  private axiosInstance: AxiosInstance;

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
        let token = localStorage.getItem('authToken');
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
              // toast.error('Accès refusé');
              console.error('❌ 403 Forbidden:', error.response.config.url);
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
              // toast.error('Erreur serveur, veuillez réessayer plus tard');
              console.error('❌ 500 Server Error:', error.response.data);
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
    localStorage.setItem('authToken', token);
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Auth token set in apiService');
  }

  public clearAuthToken() {
    localStorage.removeItem('authToken');
    delete this.axiosInstance.defaults.headers.common['Authorization'];
    console.log('🧹 Auth token cleared from apiService');
  }
}

const apiService = new ApiService();
export default apiService;
export { apiService as ApiService };