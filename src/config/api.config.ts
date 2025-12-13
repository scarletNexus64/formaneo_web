// Configuration des URLs primaire et fallback
const PRIMARY_URL = process.env.REACT_APP_API_URL_PRIMARY || 'https://admin.cleanestuaire.com/api/v1';
const FALLBACK_URL = process.env.REACT_APP_API_URL_FALLBACK || 'https://formaneo-adminpanel.shop/api/v1';

// Clé localStorage pour mémoriser l'URL active
const ACTIVE_URL_KEY = 'formaneo_active_api_url';

// Classe pour gérer le fallback automatique
class APIConfigManager {
  private currentBaseURL: string;
  private isFallbackMode: boolean = false;

  constructor() {
    // Récupérer l'URL sauvegardée ou utiliser l'URL primaire par défaut
    const savedURL = localStorage.getItem(ACTIVE_URL_KEY);
    this.currentBaseURL = savedURL || PRIMARY_URL;
    this.isFallbackMode = savedURL === FALLBACK_URL;

    console.log('🌐 API Configuration initialized:', {
      PRIMARY_URL,
      FALLBACK_URL,
      CURRENT_URL: this.currentBaseURL,
      IS_FALLBACK_MODE: this.isFallbackMode,
      NODE_ENV: process.env.NODE_ENV
    });
  }

  /**
   * Obtient l'URL de base actuelle
   */
  getBaseURL(): string {
    return this.currentBaseURL;
  }

  /**
   * Bascule vers l'URL de fallback en cas d'erreur 500
   */
  switchToFallback(): void {
    if (!this.isFallbackMode) {
      console.warn('⚠️ Switching to fallback API URL due to server error:', FALLBACK_URL);
      this.currentBaseURL = FALLBACK_URL;
      this.isFallbackMode = true;
      localStorage.setItem(ACTIVE_URL_KEY, FALLBACK_URL);
    }
  }

  /**
   * Tente de revenir à l'URL primaire
   */
  resetToPrimary(): void {
    console.log('🔄 Resetting to primary API URL:', PRIMARY_URL);
    this.currentBaseURL = PRIMARY_URL;
    this.isFallbackMode = false;
    localStorage.setItem(ACTIVE_URL_KEY, PRIMARY_URL);
  }

  /**
   * Vérifie si une erreur nécessite un fallback
   */
  shouldFallback(error: any): boolean {
    // Vérifier si c'est une erreur 500 (Server Error)
    return error?.response?.status === 500 || error?.status === 500;
  }

  /**
   * Gère une erreur API et bascule si nécessaire
   */
  handleAPIError(error: any): void {
    if (this.shouldFallback(error)) {
      this.switchToFallback();
    }
  }
}

// Instance singleton du gestionnaire de configuration
const apiConfigManager = new APIConfigManager();

// Export de la configuration API
export const API_CONFIG = {
  get BASE_URL() {
    return apiConfigManager.getBaseURL();
  },
  TIMEOUT: 30000,
  // Méthodes utilitaires
  switchToFallback: () => apiConfigManager.switchToFallback(),
  resetToPrimary: () => apiConfigManager.resetToPrimary(),
  handleError: (error: any) => apiConfigManager.handleAPIError(error),
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PROFILE: '/auth/profile',
  },
  FORMATIONS: {
    LIST: '/formations',
    MY_FORMATIONS: '/formations/my-formations',
    DETAIL: (id: string) => `/formations/${id}`,
    PROGRESS: (id: string) => `/formations/${id}/progress`,
    CERTIFICATE: (id: string) => `/formations/${id}/certificate`,
    NOTES: (id: string) => `/formations/${id}/notes`,
    PROGRESS_STATS: '/formations/progress-stats',
  },
  PACKS: {
    LIST: '/packs',
    DETAIL: (id: string) => `/packs/${id}`,
    PURCHASE: (id: string) => `/packs/${id}/purchase`,
  },
  WALLET: {
    INFO: '/wallet/info',
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    DEPOSIT: '/wallet/deposit',
    WITHDRAW: '/wallet/withdraw',
    TRANSFER: '/wallet/transfer',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAIL: (id: string) => `/transactions/${id}`,
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    PURCHASE: (id: string) => `/products/${id}/purchase`,
  },
  EBOOKS: {
    LIST: '/ebooks',
    SEARCH: '/ebooks/search',
    DETAIL: (id: string) => `/ebooks/${id}`,
    PURCHASE: (id: string) => `/ebooks/${id}/purchase`,
    DOWNLOAD: (id: string) => `/ebooks/${id}/download`,
    VIEW: (id: string) => `/ebooks/${id}/view`,
  },
  QUIZ: {
    LIST: '/quizzes',
    DETAIL: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    RESULTS: '/quizzes/results',
  },
  AFFILIATE: {
    DASHBOARD: '/affiliate/dashboard',
    DETAILED_STATS: '/affiliate/detailed-stats',
    LINKS: '/affiliate/links',
    COMMISSIONS: '/affiliate/commissions',
    BANNERS: '/affiliate/banners',
    CHECK_PROMO_CODE: '/affiliate/check-promo-code',
    UPDATE_PROMO_CODE: '/affiliate/update-promo-code',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: (id: string) => `/cart/remove/${id}`,
    UPDATE: (id: string) => `/cart/update/${id}`,
    CLEAR: '/cart/clear',
  },
  CINETPAY: {
    INITIATE: '/cinetpay/initiate',
    NOTIFY: '/cinetpay/notify',
    CHECK: (transactionId: string) => `/cinetpay/check/${transactionId}`,
  },
  CHALLENGES: {
    LIST: '/challenges',
    USER_CHALLENGES: '/challenges/user',
    COMPLETE: (id: string) => `/challenges/${id}/complete`,
    CLAIM_REWARD: (id: string) => `/challenges/${id}/claim`,
    UPDATE_PROGRESS: (id: string) => `/challenges/${id}/progress`,
  },
  SETTINGS: {
    GET: '/settings',
    WITHDRAWAL_SETTINGS: '/withdrawal-settings',
  },
  SUPPORT: {
    INFO: '/support/info',
  },
  BANNERS: '/banners',
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    DETAIL: (id: string) => `/announcements/${id}`,
  },
  MAINTENANCE: {
    STATUS: '/maintenance/status',
  },
  NOTIFICATIONS: {
    FCM_TOKEN: '/notifications/fcm-token',
  },
};

export const CINETPAY_CONFIG = {
  API_KEY: process.env.REACT_APP_CINETPAY_API_KEY || '45213166268af015b7d2734.50726534',
  SITE_ID: process.env.REACT_APP_CINETPAY_SITE_ID || '105905750',
  NOTIFY_URL: process.env.REACT_APP_CINETPAY_NOTIFY_URL || 'https://formaneo-adminpanel.shop/api/v1/cinetpay/notify',
};