import apiService from './api.service';
import { AccountActivationInfo, ActivationPaymentResponse } from '../types';

interface ActivationStatusResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  current_status?: string;
  debug?: any;
}

interface ClaimWelcomeBonusResponse {
  success: boolean;
  message: string;
  bonus_awarded: number;
  old_balance: number;
  new_balance: number;
  commissions_distributed: {
    level_1: number;
    level_2: number;
    distributed: boolean;
  };
  already_claimed?: boolean;
  is_renewal?: boolean;
}

class ActivationService {
  async getActivationInfo(): Promise<AccountActivationInfo> {
    const response = await apiService.get<AccountActivationInfo>('/account/activation/info');
    return response.data;
  }

  async initiateActivation(phoneNumber?: string): Promise<ActivationPaymentResponse> {
    const payload: any = {};
    if (phoneNumber && phoneNumber.trim()) {
      payload.phone_number = phoneNumber;
    }
    
    const response = await apiService.post<ActivationPaymentResponse>('/account/activation/initiate', payload);
    return response.data;
  }

  /**
   * Vérifie le statut d'une transaction d'activation
   */
  async checkActivationStatus(transactionId: string): Promise<ActivationStatusResponse> {
    try {
      const response = await apiService.post('/cinetpay/check-status', {
        transaction_id: transactionId
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la vérification du statut d\'activation:', error);
      return {
        success: false,
        status: 'pending',
        message: 'Vérification en cours...'
      };
    }
  }

  /**
   * Ouvre l'URL de paiement CinetPay pour l'activation
   */
  async openPaymentUrl(paymentUrl: string): Promise<void> {
    try {
      // Ouvrir dans un nouvel onglet
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
   * Réclamer le bonus de bienvenue après activation du compte
   * Cette méthode est appelée depuis la page de bienvenue après paiement réussi
   */
  async claimWelcomeBonus(): Promise<ClaimWelcomeBonusResponse> {
    const response = await apiService.post<ClaimWelcomeBonusResponse>(
      '/account/activation/claim-welcome-bonus'
    );
    return response.data;
  }
}

export const activationService = new ActivationService();
export default activationService;