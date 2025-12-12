import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';

class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('========== FRONTEND LOGIN START ==========');
    console.log('🔑 AuthService.login called with:', {
      email: credentials.email,
      hasPassword: !!credentials.password,
      passwordLength: credentials.password?.length,
      timestamp: new Date().toISOString()
    });

    try {
      console.log('📤 Sending login request to:', ENDPOINTS.AUTH.LOGIN);
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);

      console.log('✅ Login API response received:', {
        success: response.data.success,
        hasUser: !!response.data.user,
        hasToken: !!response.data.token,
        userId: response.data.user?.id,
        userEmail: response.data.user?.email,
        accountStatus: response.data.user?.account_status,
        deactivationReason: response.data.user?.deactivation_reason,
        balance: response.data.user?.balance,
        isActive: response.data.user?.is_active
      });

      console.log('========== FRONTEND LOGIN SUCCESS ==========');
      return response.data;
    } catch (error: any) {
      console.error('========== FRONTEND LOGIN ERROR ==========');
      console.error('❌ Login failed in AuthService:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorData: error.response?.data,
        accountStatus: error.response?.data?.account_status,
        deactivationReason: error.response?.data?.deactivation_reason,
        timestamp: new Date().toISOString()
      });
      console.error('Full error object:', error);
      throw error;
    }
  }

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('========== FRONTEND REGISTER START ==========');
    console.log('📝 AuthService.register called with:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      hasPassword: !!data.password,
      hasPasswordConfirmation: !!data.password_confirmation,
      passwordsMatch: data.password === data.password_confirmation,
      passwordLength: data.password?.length,
      hasPromoCode: !!data.promo_code,
      promoCode: data.promo_code,
      timestamp: new Date().toISOString()
    });

    try {
      console.log('📤 Sending register request to:', ENDPOINTS.AUTH.REGISTER);
      const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, data);

      console.log('✅ Registration API response received:', {
        success: response.data.success,
        hasUser: !!response.data.user,
        hasToken: !!response.data.token,
        userId: response.data.user?.id,
        userEmail: response.data.user?.email,
        accountStatus: response.data.user?.account_status,
        deactivationReason: response.data.user?.deactivation_reason,
        balance: response.data.user?.balance,
        promoCode: response.data.user?.promo_code,
        isActive: response.data.user?.is_active
      });

      console.log('========== FRONTEND REGISTER SUCCESS ==========');
      return response.data;
    } catch (error: any) {
      console.error('========== FRONTEND REGISTER ERROR ==========');
      console.error('❌ Registration failed in AuthService:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorData: error.response?.data,
        validationErrors: error.response?.data?.errors,
        timestamp: new Date().toISOString()
      });
      console.error('Full error object:', error);
      throw error;
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    await apiService.post(ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get(ENDPOINTS.AUTH.ME);
    return response.data.user;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.put(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data.user;
  }

  /**
   * Mot de passe oublié - Vérifier email et téléphone
   */
  async forgotPassword(email: string, phone: string): Promise<{
    success: boolean;
    message: string;
    user_id?: number;
    reset_token?: string
  }> {
    const response = await apiService.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email, phone });
    return response.data;
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(data: {
    user_id: number;
    reset_token: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiService.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  }
}

export default new AuthService();