import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '../types';
import authService from '../services/auth.service';
import apiService from '../services/api.service';
import { challengeTracker } from '../services/challengeTracker.service';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        console.log('🏁 AuthStore.login started with:', credentials);
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          console.log('📦 AuthStore received response:', response);
          const { user, token } = response;
          
          apiService.setAuthToken(token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          console.log('✅ AuthStore state updated successfully');
          toast.success('Connexion réussie !');
          
          // Tracker la connexion pour les défis (avec un délai pour éviter les erreurs d'initialisation)
          setTimeout(() => {
            challengeTracker.trackDailyLogin();
          }, 2000);
        } catch (error: any) {
          console.error('❌ AuthStore.login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        console.log('🏁 AuthStore.register started with:', data);
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          console.log('📦 AuthStore received register response:', response);
          const { user, token } = response;
          
          apiService.setAuthToken(token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          console.log('✅ AuthStore state updated after registration');
          toast.success('Inscription réussie ! Bienvenue sur Formaneo');
        } catch (error: any) {
          console.error('❌ AuthStore.register error:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            data: error.response?.data
          });
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Remove FCM token from backend before logout
          const fcmToken = localStorage.getItem('fcm_token');
          if (fcmToken) {
            console.log('🧹 Removing FCM token from backend on logout');
            try {
              await apiService.delete('/notifications/fcm-token', {
                data: { fcm_token: fcmToken }
              });
              console.log('✅ FCM token removed from backend');
            } catch (error) {
              console.error('⚠️ Failed to remove FCM token from backend:', error);
            }
          }

          await authService.logout();
        } catch (error) {
          // Continue logout even if API call fails
          console.error('Erreur lors de l\'appel API de déconnexion:', error);
        } finally {
          get().clearAuth();

          // Clean up FCM token from localStorage
          console.log('🧹 Cleaning FCM token from localStorage on logout');
          localStorage.removeItem('fcm_token');
          localStorage.removeItem('notification_modal_dismissed_at');
          localStorage.removeItem('push_notification_prompt_dismissed');

          toast.success('Déconnexion réussie');
          // Redirection vers la page de login
          window.location.href = '/login';
        }
      },

      fetchUser: async () => {
        const token = get().token;
        if (!token) return;
        
        set({ isLoading: true });
        try {
          apiService.setAuthToken(token);
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          get().clearAuth();
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true });
        try {
          const user = await authService.updateProfile(data);
          set({ user, isLoading: false });
          toast.success('Profil mis à jour avec succès');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      clearAuth: () => {
        apiService.clearAuthToken();
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      initializeAuth: async () => {
        const { token, user, isAuthenticated } = get();
        console.log('🔄 Initializing auth, state:', { hasToken: !!token, hasUser: !!user, isAuthenticated });
        
        if (token && user) {
          console.log('🔄 Restoring auth with stored token and user');
          apiService.setAuthToken(token);
          
          // S'assurer que isAuthenticated est true après restoration
          if (!isAuthenticated) {
            set({ isAuthenticated: true });
          }
          
          // Vérifier si le token est toujours valide en arrière-plan
          try {
            const freshUser = await authService.getCurrentUser();
            set({ user: freshUser });
            console.log('✅ Token is valid, user refreshed');
          } catch (error) {
            console.log('❌ Token expired or invalid, clearing auth');
            get().clearAuth();
          }
        } else {
          console.log('🔄 No stored auth data found');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          console.log('🔄 Rehydrating auth state:', { user: state.user.name, hasToken: !!state.token });
          // Restaurer le token dans apiService
          apiService.setAuthToken(state.token);
        }
      },
    }
  )
);