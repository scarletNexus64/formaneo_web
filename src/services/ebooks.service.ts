import apiService from './api.service';
import toast from 'react-hot-toast';
import axios from 'axios';

export interface Ebook {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image_url?: string;
  pdf_url?: string;
  author: string;
  price: number;
  pages: number;
  category: string;
  rating: number;
  downloads: number;
  is_active: boolean;
  is_free: boolean;
  is_purchased?: boolean;
  formatted_price?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface UserEbook {
  id: number;
  user_id: number;
  ebook_id: number;
  price_paid: number;
  purchased_at: string;
  downloaded_at?: string;
  ebook?: Ebook;
}

export interface PurchaseEbookResponse {
  success: boolean;
  message: string;
  download_url?: string;
  new_balance?: number;
}

export interface ViewEbookResponse {
  success: boolean;
  message?: string;
  view_url?: string;
}

export interface DownloadEbookResponse {
  success: boolean;
  message?: string;
  download_url?: string;
}

class EbooksService {
  // Récupérer tous les ebooks
  async getEbooks(): Promise<Ebook[]> {
    console.log('📚 EbooksService.getEbooks called');
    try {
      const response = await apiService.get('/ebooks');
      console.log('✅ Ebooks response:', response.data);
      
      const ebooks = response.data.ebooks || response.data || [];
      
      // Transformer les données pour correspondre à notre interface
      return ebooks.map((ebook: any) => ({
        ...ebook,
        // Ajouter des valeurs par défaut pour les champs manquants
        cover_image_url: ebook.cover_image_url || '/images/ebook-default-cover.png',
        is_free: ebook.price <= 0,
        formatted_price: ebook.price > 0 
          ? `${new Intl.NumberFormat('fr-FR').format(ebook.price)} FCFA`
          : 'Gratuit',
        is_purchased: ebook.is_purchased || false
      }));
    } catch (error) {
      console.error('❌ Error fetching ebooks:', error);
      toast.error('Erreur lors du chargement des e-books');
      throw error;
    }
  }

  // Récupérer un ebook spécifique
  async getEbook(ebookId: number): Promise<Ebook> {
    console.log('📖 EbooksService.getEbook called with ID:', ebookId);
    try {
      const response = await apiService.get(`/ebooks/${ebookId}`);
      console.log('✅ Ebook response:', response.data);
      
      const ebook = response.data.ebook || response.data;
      
      // Transformer les données pour correspondre à notre interface
      return {
        ...ebook,
        cover_image_url: ebook.cover_image_url || '/images/ebook-default-cover.png',
        is_free: ebook.price <= 0,
        formatted_price: ebook.price > 0 
          ? `${new Intl.NumberFormat('fr-FR').format(ebook.price)} FCFA`
          : 'Gratuit',
        is_purchased: ebook.is_purchased || false
      };
    } catch (error) {
      console.error('❌ Error fetching ebook:', error);
      toast.error('Erreur lors du chargement de l\'e-book');
      throw error;
    }
  }

  // Acheter un ebook
  async purchaseEbook(ebookId: number): Promise<PurchaseEbookResponse> {
    console.log('💳 EbooksService.purchaseEbook called with ID:', ebookId);
    try {
      const response = await apiService.post(`/ebooks/${ebookId}/purchase`);
      console.log('✅ Purchase response:', response.data);
      
      if (response.data.success) {
        toast.success('E-book acheté avec succès !');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error purchasing ebook:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'achat de l\'e-book';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Consulter un ebook en ligne
  async viewEbook(ebookId: number): Promise<ViewEbookResponse> {
    console.log('👁️ EbooksService.viewEbook called with ID:', ebookId);
    try {
      const response = await apiService.get(`/ebooks/${ebookId}/view`);
      console.log('✅ View response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error viewing ebook:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ouverture de l\'e-book';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Télécharger le PDF comme blob via l'API backend
  async getPdfBlob(ebookId: number): Promise<string> {
    console.log('📥 EbooksService.getPdfBlob called with ebook ID:', ebookId);
    try {
      // D'abord, récupérer l'URL de téléchargement
      const viewResponse = await apiService.get(`/ebooks/${ebookId}/view`);

      if (!viewResponse.data.success || !viewResponse.data.view_url) {
        throw new Error('Impossible de récupérer l\'URL du PDF');
      }

      const pdfUrl = viewResponse.data.view_url;
      console.log('📥 Downloading PDF from:', pdfUrl);

      // Récupérer le token pour l'authentification
      let token = localStorage.getItem('authToken');
      if (!token) {
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

      // Télécharger le PDF avec axios et le token
      const pdfResponse = await axios.get(pdfUrl, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      // Créer une URL blob à partir des données du PDF
      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      console.log('✅ PDF blob created:', blobUrl);
      return blobUrl;
    } catch (error: any) {
      console.error('❌ Error downloading PDF blob:', error);
      toast.error('Impossible de charger le PDF. Vérifiez votre connexion.');
      throw error;
    }
  }

  // Télécharger un ebook
  async downloadEbook(ebookId: number): Promise<DownloadEbookResponse> {
    console.log('⬇️ EbooksService.downloadEbook called with ID:', ebookId);
    try {
      const response = await apiService.get(`/ebooks/${ebookId}/download`);
      console.log('✅ Download response:', response.data);
      
      if (response.data.success && response.data.download_url) {
        // Déclencher le téléchargement
        const link = document.createElement('a');
        link.href = response.data.download_url;
        link.download = `ebook-${ebookId}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Téléchargement démarré !');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error downloading ebook:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors du téléchargement de l\'e-book';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Rechercher des ebooks
  async searchEbooks(query: string, category?: string): Promise<Ebook[]> {
    console.log('🔍 EbooksService.searchEbooks called with query:', query);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);

      const response = await apiService.get(`/ebooks/search?${params.toString()}`);
      console.log('✅ Search results:', response.data);
      
      const ebooks = response.data.ebooks || response.data || [];
      
      return ebooks.map((ebook: any) => ({
        ...ebook,
        cover_image_url: ebook.cover_image_url || '/images/ebook-default-cover.png',
        is_free: ebook.price <= 0,
        formatted_price: ebook.price > 0 
          ? `${new Intl.NumberFormat('fr-FR').format(ebook.price)} FCFA`
          : 'Gratuit',
        is_purchased: ebook.is_purchased || false
      }));
    } catch (error) {
      console.error('❌ Error searching ebooks:', error);
      toast.error('Erreur lors de la recherche');
      throw error;
    }
  }

  // Récupérer les catégories d'ebooks
  async getEbookCategories(): Promise<string[]> {
    console.log('📂 EbooksService.getEbookCategories called');
    try {
      const response = await apiService.get('/ebooks/categories');
      console.log('✅ Categories response:', response.data);
      return response.data.categories || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching ebook categories:', error);
      // Retourner des catégories par défaut en cas d'erreur
      return [
        'Marketing Digital',
        'E-commerce',
        'Développement Web',
        'Business & Entrepreneuriat',
        'Finance & Investissement',
        'Design & Créativité',
        'Développement Personnel',
        'Formation Professionnelle'
      ];
    }
  }

  // Récupérer les ebooks de l'utilisateur (ebooks achetés)
  async getMyEbooks(): Promise<UserEbook[]> {
    console.log('👤 EbooksService.getMyEbooks called');
    try {
      const response = await apiService.get('/user/ebooks');
      console.log('✅ My ebooks response:', response.data);
      return response.data.ebooks || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching my ebooks:', error);
      // Ne pas afficher d'erreur ici car c'est appelé depuis le dashboard
      return [];
    }
  }

  // Vérifier si l'utilisateur a accès à un ebook
  async checkEbookAccess(ebookId: number): Promise<{ hasAccess: boolean; purchaseDate?: string }> {
    console.log('🔐 EbooksService.checkEbookAccess called');
    try {
      const response = await apiService.get(`/ebooks/${ebookId}/access`);
      console.log('✅ Access check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking ebook access:', error);
      return { hasAccess: false };
    }
  }

  // Récupérer les statistiques d'ebooks
  async getEbookStats(): Promise<{
    total_ebooks: number;
    purchased_ebooks: number;
    downloads: number;
    total_spent: number;
    favorite_category: string;
  }> {
    console.log('📊 EbooksService.getEbookStats called');
    try {
      const response = await apiService.get('/ebooks/stats');
      console.log('✅ Ebook stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching ebook stats:', error);
      // Retourner des stats par défaut
      return {
        total_ebooks: 0,
        purchased_ebooks: 0,
        downloads: 0,
        total_spent: 0,
        favorite_category: 'N/A',
      };
    }
  }

  // Obtenir les ebooks recommandés
  async getRecommendedEbooks(limit: number = 6): Promise<Ebook[]> {
    console.log('🎯 EbooksService.getRecommendedEbooks called');
    try {
      const response = await apiService.get(`/ebooks/recommended?limit=${limit}`);
      console.log('✅ Recommended ebooks response:', response.data);
      
      const ebooks = response.data.ebooks || response.data || [];
      
      return ebooks.map((ebook: any) => ({
        ...ebook,
        cover_image_url: ebook.cover_image_url || '/images/ebook-default-cover.png',
        is_free: ebook.price <= 0,
        formatted_price: ebook.price > 0 
          ? `${new Intl.NumberFormat('fr-FR').format(ebook.price)} FCFA`
          : 'Gratuit',
        is_purchased: ebook.is_purchased || false
      }));
    } catch (error) {
      console.error('❌ Error fetching recommended ebooks:', error);
      // En cas d'erreur, retourner les premiers ebooks disponibles
      return this.getEbooks().then(ebooks => ebooks.slice(0, limit));
    }
  }

  // Filtrer les ebooks par prix
  async getEbooksByPriceRange(minPrice: number = 0, maxPrice?: number): Promise<Ebook[]> {
    console.log('💰 EbooksService.getEbooksByPriceRange called');
    try {
      const params = new URLSearchParams();
      params.append('min_price', minPrice.toString());
      if (maxPrice) params.append('max_price', maxPrice.toString());

      const response = await apiService.get(`/ebooks/filter?${params.toString()}`);
      console.log('✅ Filtered ebooks response:', response.data);
      
      const ebooks = response.data.ebooks || response.data || [];
      
      return ebooks.map((ebook: any) => ({
        ...ebook,
        cover_image_url: ebook.cover_image_url || '/images/ebook-default-cover.png',
        is_free: ebook.price <= 0,
        formatted_price: ebook.price > 0 
          ? `${new Intl.NumberFormat('fr-FR').format(ebook.price)} FCFA`
          : 'Gratuit',
        is_purchased: ebook.is_purchased || false
      }));
    } catch (error) {
      console.error('❌ Error filtering ebooks by price:', error);
      // En cas d'erreur, filtrer côté client
      const allEbooks = await this.getEbooks();
      return allEbooks.filter(ebook => {
        if (maxPrice) {
          return ebook.price >= minPrice && ebook.price <= maxPrice;
        }
        return ebook.price >= minPrice;
      });
    }
  }
}

export const ebooksService = new EbooksService();