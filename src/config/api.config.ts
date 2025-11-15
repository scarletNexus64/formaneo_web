// export const API_CONFIG = {
//   BASE_URL: process.env.REACT_APP_API_URL || 'http://10.156.105.99:8000/api/v1',
//   TIMEOUT: 30000,
// };

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://admin.cleanestuaire.com/api/v1',
  TIMEOUT: 30000,
};

console.log('🌐 API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ENV_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

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
};

export const CINETPAY_CONFIG = {
  API_KEY: process.env.REACT_APP_CINETPAY_API_KEY || '45213166268af015b7d2734.50726534',
  SITE_ID: process.env.REACT_APP_CINETPAY_SITE_ID || '105905750',
  NOTIFY_URL: process.env.REACT_APP_CINETPAY_NOTIFY_URL || 'https://admin.cleanestuaire.com/api/v1/cinetpay/notify',
};