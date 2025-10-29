import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';

class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔑 AuthService.login called with:', credentials);
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed in AuthService:', error);
      throw error;
    }
  }

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('📝 AuthService.register called with:', data);
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, data);
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed in AuthService:', error);
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
   * Mot de passe oublié
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiService.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    const response = await apiService.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  }
}

export default new AuthService();