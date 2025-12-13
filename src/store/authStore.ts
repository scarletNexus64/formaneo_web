import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '../types';
import authService from '../services/auth.service';
import apiService from '../services/api.service';
import { challengeTracker } from '../services/challengeTracker.service';
import toast from 'react-hot-toast';

// Safe storage wrapper for private mode compatibility
const createSafeStorage = (): StateStorage => {
  let inMemoryStorage: { [key: string]: string } = {};
  let isLocalStorageAvailable = true;

  // Test localStorage availability
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
  } catch (e) {
    console.warn('⚠️ localStorage not available (private mode?), using in-memory storage');
    isLocalStorageAvailable = false;
  }

  return {
    getItem: (name: string): string | null => {
      try {
        if (isLocalStorageAvailable) {
          return localStorage.getItem(name);
        }
        return inMemoryStorage[name] || null;
      } catch (error) {
        console.error('❌ Storage getItem error:', error);
        return inMemoryStorage[name] || null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        if (isLocalStorageAvailable) {
          localStorage.setItem(name, value);
        }
        // Always keep in-memory backup
        inMemoryStorage[name] = value;
      } catch (error) {
        console.error('❌ Storage setItem error (falling back to memory):', error);
        // Fallback to in-memory storage
        isLocalStorageAvailable = false;
        inMemoryStorage[name] = value;
      }
    },
    removeItem: (name: string): void => {
      try {
        if (isLocalStorageAvailable) {
          localStorage.removeItem(name);
        }
        delete inMemoryStorage[name];
      } catch (error) {
        console.error('❌ Storage removeItem error:', error);
        delete inMemoryStorage[name];
      }
    },
  };
};

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
        console.log('========== AUTH STORE LOGIN START ==========');
        console.log('🏁 AuthStore.login started with:', {
          email: credentials.email,
          hasPassword: !!credentials.password,
          timestamp: new Date().toISOString()
        });

        set({ isLoading: true });
        console.log('🔄 AuthStore loading state set to true');

        try {
          console.log('📞 Calling authService.login...');
          const response = await authService.login(credentials);

          console.log('📦 AuthStore received response:', {
            hasUser: !!response.user,
            hasToken: !!response.token,
            userId: response.user?.id,
            userEmail: response.user?.email,
            accountStatus: response.user?.account_status,
            deactivationReason: response.user?.deactivation_reason
          });

          const { user, token } = response;

          console.log('🔐 Setting auth token in apiService...');
          apiService.setAuthToken(token);

          console.log('💾 Updating AuthStore state...');
          set({ user, token, isAuthenticated: true, isLoading: false });

          console.log('✅ AuthStore state updated successfully:', {
            userId: user.id,
            email: user.email,
            accountStatus: user.account_status,
            isAuthenticated: true,
            hasToken: !!token
          });

          toast.success('Connexion réussie !');

          console.log('🎯 Scheduling daily login tracking...');
          // Tracker la connexion pour les défis (avec un délai pour éviter les erreurs d'initialisation)
          setTimeout(() => {
            console.log('📊 Tracking daily login...');
            challengeTracker.trackDailyLogin();
          }, 2000);

          console.log('========== AUTH STORE LOGIN SUCCESS ==========');
        } catch (error: any) {
          console.error('========== AUTH STORE LOGIN ERROR ==========');
          console.error('❌ AuthStore.login error:', {
            message: error.message,
            status: error.response?.status,
            errorData: error.response?.data,
            timestamp: new Date().toISOString()
          });
          console.error('Full error:', error);

          set({ isLoading: false });
          console.log('🔄 AuthStore loading state set to false due to error');

          throw error;
        }
      },

      register: async (data: RegisterData) => {
        console.log('========== AUTH STORE REGISTER START ==========');
        console.log('🏁 AuthStore.register started with:', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          hasPassword: !!data.password,
          hasPromoCode: !!data.promo_code,
          timestamp: new Date().toISOString()
        });

        set({ isLoading: true });
        console.log('🔄 AuthStore loading state set to true');

        try {
          console.log('📞 Calling authService.register...');
          const response = await authService.register(data);

          console.log('📦 AuthStore received register response:', {
            hasUser: !!response.user,
            hasToken: !!response.token,
            userId: response.user?.id,
            userEmail: response.user?.email,
            accountStatus: response.user?.account_status,
            deactivationReason: response.user?.deactivation_reason,
            balance: response.user?.balance
          });

          const { user, token } = response;

          console.log('🔐 Setting auth token in apiService...');
          apiService.setAuthToken(token);

          console.log('💾 Updating AuthStore state...');
          set({ user, token, isAuthenticated: true, isLoading: false });

          console.log('✅ AuthStore state updated after registration:', {
            userId: user.id,
            email: user.email,
            accountStatus: user.account_status,
            isAuthenticated: true,
            hasToken: !!token
          });

          toast.success('Inscription réussie ! Bienvenue sur Formaneo');
          console.log('========== AUTH STORE REGISTER SUCCESS ==========');
        } catch (error: any) {
          console.error('========== AUTH STORE REGISTER ERROR ==========');
          console.error('❌ AuthStore.register error:', {
            message: error.message,
            status: error.response?.status,
            errorData: error.response?.data,
            validationErrors: error.response?.data?.errors,
            timestamp: new Date().toISOString()
          });
          console.error('Full error:', error);

          set({ isLoading: false });
          console.log('🔄 AuthStore loading state set to false due to error');

          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Remove FCM token from backend before logout
          let fcmToken: string | null = null;
          try {
            fcmToken = localStorage.getItem('fcm_token');
          } catch (e) {
            console.warn('⚠️ Failed to read fcm_token from localStorage');
          }

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
          try {
            localStorage.removeItem('fcm_token');
            localStorage.removeItem('notification_modal_dismissed_at');
            localStorage.removeItem('push_notification_prompt_dismissed');
          } catch (error) {
            console.warn('⚠️ Failed to clean localStorage on logout (private mode?)');
          }

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
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 onRehydrateStorage called');
        if (state?.token && state?.user) {
          console.log('🔄 Rehydrating auth state:', { user: state.user.name, hasToken: !!state.token });
          try {
            // Restaurer le token dans apiService
            apiService.setAuthToken(state.token);
          } catch (error) {
            console.error('❌ Error restoring token:', error);
          }
        } else {
          console.log('🔄 No auth state to rehydrate');
        }
      },
    }
  )
);