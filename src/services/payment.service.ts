import apiService from './api.service';
import toast from 'react-hot-toast';

export interface PaymentResponse {
  success: boolean;
  message: string;
  new_balance?: number;
  cashback_received?: number;
  pack?: {
    id: number;
    name: string;
    price_paid: number;
  };
  ebook?: {
    id: number;
    title: string;
    price_paid: number;
  };
  error?: string;
}

export interface PurchaseItem {
  formation_packs: Array<{
    id: number;
    name: string;
    description: string;
    thumbnail_url: string;
    price_paid: number;
    purchased_at: string;
    formations_count: number;
  }>;
  ebooks: Array<{
    id: number;
    title: string;
    description: string;
    cover_image_url: string;
    pdf_url: string;
    author: string;
    price_paid: number;
    purchased_at: string;
    downloaded_at: string | null;
  }>;
}

export interface AccessCheckResponse {
  has_access: boolean;
}

class PaymentService {
  async purchaseFormationPack(packId: number): Promise<PaymentResponse> {
    try {
      const response = await apiService.post('/payment/formation-pack', {
        pack_id: packId
      });
      
      if (response.data.success) {
        toast.success(response.data.message || 'Formation achetée avec succès !');
        if (response.data.cashback_received > 0) {
          toast.success(`Cashback reçu: ${response.data.cashback_received} FCFA`, {
            duration: 5000
          });
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error purchasing formation pack:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'achat de la formation';
      
      if (error.response?.status === 400 && error.response?.data?.current_balance !== undefined) {
        const balance = error.response.data.current_balance;
        const required = error.response.data.required_amount;
        const deficit = required - balance;
        
        toast.error(
          `Solde insuffisant. Il vous manque ${deficit.toLocaleString('fr-FR')} FCFA pour effectuer cet achat.`,
          { duration: 6000 }
        );
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }

  async purchaseEbook(ebookId: number): Promise<PaymentResponse> {
    try {
      const response = await apiService.post('/payment/ebook', {
        ebook_id: ebookId
      });
      
      if (response.data.success) {
        toast.success(response.data.message || 'Ebook acheté avec succès !');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error purchasing ebook:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'achat de l\'ebook';
      
      if (error.response?.status === 400 && error.response?.data?.current_balance !== undefined) {
        const balance = error.response.data.current_balance;
        const required = error.response.data.required_amount;
        const deficit = required - balance;
        
        toast.error(
          `Solde insuffisant. Il vous manque ${deficit.toLocaleString('fr-FR')} FCFA pour effectuer cet achat.`,
          { duration: 6000 }
        );
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }

  async getUserPurchases(): Promise<PurchaseItem> {
    try {
      const response = await apiService.get('/payment/purchases');
      return response.data;
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      toast.error('Erreur lors du chargement des achats');
      throw error;
    }
  }

  async checkAccess(type: 'formation_pack' | 'ebook', id: number): Promise<boolean> {
    try {
      const response = await apiService.post('/payment/check-access', {
        type,
        id
      });
      return response.data.has_access;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  }
}

export default new PaymentService();