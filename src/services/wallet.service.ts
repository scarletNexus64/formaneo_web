import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';
import {
  Transaction,
  WalletInfo,
  DepositResponse,
  WithdrawalResponse,
  TransactionStatusResponse,
  WithdrawalSettings
} from '../types/wallet.types';

export interface PaymentProviderInfo {
  provider: 'freemopay' | 'cinetpay' | null;
  ussd_mode: boolean;
  web_portal: boolean;
}

class WalletService {

  /**
   * Récupère les informations du wallet de l'utilisateur
   */
  async getWalletInfo(): Promise<WalletInfo> {
    try {
      const response = await apiService.get(ENDPOINTS.WALLET.INFO);
      console.log('🏦 Données wallet reçues du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du wallet:', error);
      throw error;
    }
  }

  /**
   * Récupère le provider de paiement actif (FreeMoPay ou CinetPay)
   */
  async getPaymentProvider(): Promise<PaymentProviderInfo> {
    try {
      const response = await apiService.get('/wallet/payment-provider');
      console.log('💳 Provider de paiement actif:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du provider:', error);
      // Retourner CinetPay par défaut en cas d'erreur (pour compatibilité)
      return {
        provider: 'cinetpay',
        ussd_mode: false,
        web_portal: true
      };
    }
  }

  /**
   * Récupère les paramètres de retrait (montant min et max)
   */
  async getWithdrawalSettings(): Promise<WithdrawalSettings> {
    try {
      const response = await apiService.get(ENDPOINTS.SETTINGS.WITHDRAWAL_SETTINGS);
      console.log('⚙️ Paramètres de retrait reçus:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de retrait:', error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        min_amount: 1000,
        max_amount: 1000000
      };
    }
  }

  /**
   * Récupère l'historique des transactions avec pagination
   */
  async getTransactions(page: number = 1, limit: number = 20): Promise<{transactions: Transaction[], pagination: any}> {
    try {
      const response = await apiService.get(`${ENDPOINTS.TRANSACTIONS.LIST}?page=${page}&limit=${limit}`);
      console.log('📄 Transactions avec pagination reçues:', response.data);
      return {
        transactions: response.data.transactions || [],
        pagination: response.data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: 0
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
    }
  }

  /**
   * Initie un dépôt (FreeMoPay ou CinetPay selon la config)
   */
  async initiateDeposit(amount: number, phoneNumber?: string): Promise<DepositResponse> {
    try {
      // Détecter le provider actif
      const providerInfo = await this.getPaymentProvider();

      const payload: any = { amount };
      if (phoneNumber && phoneNumber.trim()) {
        payload.phone_number = phoneNumber;
      }

      // Choisir l'endpoint selon le provider
      let endpoint = '/cinetpay/deposit/initiate'; // Par défaut CinetPay
      if (providerInfo.provider === 'freemopay') {
        endpoint = '/freemopay/deposit/initiate';
      }

      console.log(`💳 Initiation dépôt via ${providerInfo.provider}:`, payload);

      const response = await apiService.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'initiation du dépôt:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      console.error('Status code:', error.response?.status);
      console.error('Request payload:', { amount, phoneNumber });

      // Afficher les erreurs de validation spécifiques
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        return {
          success: false,
          message: validationErrors.join(', ')
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erreur lors de l\'initiation du dépôt'
      };
    }
  }

  /**
   * Vérifie le statut d'une transaction de dépôt
   * Détecte automatiquement le provider (FreeMoPay ou CinetPay)
   */
  async checkDepositStatus(transactionId: string): Promise<TransactionStatusResponse> {
    try {
      // Récupérer le provider depuis le localStorage (si disponible)
      const provider = localStorage.getItem('deposit_provider');

      let endpoint = '/cinetpay/check-status'; // Par défaut CinetPay

      // Si FreeMoPay, utiliser l'endpoint FreeMoPay
      if (provider === 'freemopay') {
        endpoint = '/freemopay/check-status';
      }

      console.log('🔍 Vérification statut dépôt:', { transactionId, provider, endpoint });

      const response = await apiService.post(endpoint, {
        transaction_id: transactionId
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la vérification du statut:', error);
      // Ne pas afficher de toast d'erreur pour les vérifications automatiques
      return {
        success: false,
        status: 'pending', // Garder en attente en cas d'erreur de vérification
        message: 'Vérification en cours...'
      };
    }
  }

  /**
   * Initie un retrait (FreeMoPay ou CinetPay selon la config)
   * @param operator - Code opérateur optionnel (null pour détection automatique par CinetPay)
   */
  async initiateWithdrawal(amount: number, phoneNumber: string, operator: string | null = null): Promise<WithdrawalResponse> {
    try {
      // Détecter le provider actif
      const providerInfo = await this.getPaymentProvider();

      const payload: any = {
        amount,
        phone_number: phoneNumber,
      };

      // Si opérateur est spécifié et n'est pas AUTO, l'inclure (CinetPay uniquement)
      if (operator && operator !== 'AUTO' && providerInfo.provider === 'cinetpay') {
        payload.operator = operator;
      }

      console.log(`🏦 Initiation retrait via ${providerInfo.provider}:`, payload);

      // Utiliser l'endpoint unifié /wallet/withdraw qui route automatiquement
      const response = await apiService.post('/wallet/withdraw', payload);
      return {
        ...response.data,
        provider: providerInfo.provider,
        ussd_mode: providerInfo.ussd_mode
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'initiation du retrait:', error);

      // Gérer spécifiquement les timeouts
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          success: true, // Considérer comme succès car le retrait a été initié
          message: 'Retrait initié avec succès ! Le traitement se fait en arrière-plan. Vérifiez l\'historique pour suivre l\'avancement.',
          isTimeout: true
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erreur lors de l\'initiation du retrait'
      };
    }
  }

  /**
   * Formate un numéro de téléphone camerounais
   */
  formatPhoneNumber(phone: string): string {
    // Supprimer tous les caractères non numériques
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Si le numéro commence par 237, le garder tel quel
    if (cleanPhone.startsWith('237')) {
      return '+' + cleanPhone;
    }
    
    // Si le numéro fait 9 chiffres (format local), ajouter le préfixe 237
    if (cleanPhone.length === 9) {
      return '+237' + cleanPhone;
    }
    
    // Sinon, retourner le numéro avec un + au début
    return '+' + cleanPhone;
  }

  /**
   * Valide un montant de dépôt/retrait
   */
  validateAmount(amount: number, minAmount: number, maxAmount: number): { valid: boolean; message?: string } {
    if (!amount || amount <= 0) {
      return { valid: false, message: 'Veuillez entrer un montant valide' };
    }

    if (amount < minAmount) {
      return {
        valid: false,
        message: `Le montant minimum est de ${minAmount.toLocaleString('fr-FR')} FCFA`
      };
    }

    if (amount > maxAmount) {
      return {
        valid: false,
        message: `Le montant maximum est de ${maxAmount.toLocaleString('fr-FR')} FCFA`
      };
    }

    if (amount % 5 !== 0) {
      return {
        valid: false,
        message: 'Le montant doit être un multiple de 5'
      };
    }

    return { valid: true };
  }

  /**
   * Obtient la liste des opérateurs supportés pour les retraits (Cameroun uniquement)
   */
  getSupportedOperators() {
    return [
      { code: 'AUTO', name: 'Détection automatique', country: 'Cameroun', description: 'Recommandé' },
      { code: 'MTN', name: 'MTN Mobile Money', country: 'Cameroun', description: 'Pour MTN Cameroun' },
      { code: 'MOOV', name: 'Moov Money', country: 'Cameroun', description: 'Pour Orange Cameroun' },
    ];
  }

  /**
   * Ouvre l'URL de paiement CinetPay
   */
  async openPaymentUrl(paymentUrl: string): Promise<void> {
    try {
      // Ouvrir dans un nouvel onglet du même navigateur (sans spécifier les dimensions)
      const newTab = window.open(paymentUrl, '_blank');
      
      if (!newTab) {
        // Si le popup est bloqué, essayer une redirection directe
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de l\'URL de paiement:', error);
      // Fallback: redirection directe
      window.location.href = paymentUrl;
    }
  }

  /**
   * Récupère la notification CinetPay active
   */
  async getCinetPayNotification(): Promise<{ message: string | null }> {
    try {
      const response = await apiService.get('/cinetpay-notification');
      return {
        message: response.data.message || null
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la notification CinetPay:', error);
      return { message: null };
    }
  }

  /**
   * Test la connexion avec le serveur
   */
  async testConnection(): Promise<{ success: boolean; message?: string }> {
    try {
      await apiService.get('/health-check');
      return { success: true };
    } catch (error: any) {
      console.error('Test de connexion échoué:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Impossible de se connecter au serveur'
      };
    }
  }
}

export default new WalletService();