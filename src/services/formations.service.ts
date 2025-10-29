import apiService from './api.service';
import toast from 'react-hot-toast';

export interface FormationPack {
  id: number;
  name: string;
  title: string; // Alias pour name pour compatibilité
  slug: string;
  author: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  current_price?: number;
  promotional_price?: number;
  promotion_price?: number;
  is_on_promotion?: boolean;
  is_promoted?: boolean; // Alias pour is_on_promotion
  promotion_ends_at?: string;
  total_duration: number;
  total_duration_minutes: number; // Alias pour total_duration pour compatibilité
  rating: number;
  students_count: number;
  formations_count: number;
  formations?: Formation[]; // Formations incluses dans le pack
  level?: string; // 'beginner', 'intermediate', 'advanced'
  category?: string | { id: number; name: string; slug: string };
  instructor_name?: string; // Alias pour author pour compatibilité
  skills_acquired?: string[];
  requirements?: string[];
  is_featured: boolean;
  is_purchased?: boolean;
  purchase_date?: string;
  cashback_amount?: number;
  created_at: string;
  updated_at?: string;
}

export interface Formation {
  id: number;
  pack_id: number;
  title: string;
  description: string;
  position: number;
  duration_minutes: number;
  video_url?: string;
  thumbnail_url?: string;
  is_free_preview: boolean;
  modules_count: number;
  user_progress?: number;
  is_completed?: boolean;
  completed_at?: string;
  created_at: string;
}

export interface FormationModule {
  id: number;
  formation_id: number;
  title: string;
  description: string;
  position: number;
  video_url?: string;
  duration_minutes: number;
  is_completed?: boolean;
  completed_at?: string;
}

export interface FormationProgress {
  formation_id: number;
  user_id: number;
  progress_percentage: number;
  time_watched_minutes: number;
  current_module_id?: number;
  completed_modules: number[];
  last_watched_at: string;
  completed_at?: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  purchase_id?: number;
  payment_url?: string; // Pour redirection vers CinetPay si nécessaire
}

export interface MyFormation {
  id: number;
  pack_id: number;
  title: string;
  thumbnail_url?: string;
  progress_percentage: number;
  purchased_at: string;
  last_accessed_at?: string;
  is_completed: boolean;
  completed_at?: string;
  pack_title: string;
  total_formations: number;
  completed_formations: number;
}

class FormationsService {
  // Récupérer tous les packs de formations
  async getFormationPacks(): Promise<FormationPack[]> {
    console.log('📚 FormationsService.getFormationPacks called');
    try {
      const response = await apiService.get('/packs');
      console.log('✅ Formation packs response:', response.data);
      
      const packs = response.data.packs || response.data || [];
      
      // Transformer les données pour correspondre à notre interface
      return packs.map((pack: any) => ({
        ...pack,
        title: pack.name || pack.title, // Utiliser name comme title
        instructor_name: pack.author || pack.instructor_name, // Utiliser author comme instructor_name
        total_duration_minutes: pack.total_duration || pack.total_duration_minutes || 0,
        is_promoted: pack.is_on_promotion || pack.is_promoted || false,
        promotional_price: pack.promotion_price || pack.promotional_price,
        // Ajouter des valeurs par défaut pour les champs manquants
        level: pack.level || 'intermediate',
        category: pack.category || 'Formation',
        skills_acquired: pack.skills_acquired || [],
        requirements: pack.requirements || []
      }));
    } catch (error) {
      console.error('❌ Error fetching formation packs:', error);
      toast.error('Erreur lors du chargement des formations');
      throw error;
    }
  }

  // Récupérer un pack de formation spécifique
  async getFormationPack(packId: number): Promise<FormationPack> {
    console.log('📖 FormationsService.getFormationPack called with ID:', packId);
    try {
      const response = await apiService.get(`/packs/${packId}`);
      console.log('✅ Formation pack response:', response.data);
      
      const pack = response.data.pack || response.data;
      
      // Transformer les données pour correspondre à notre interface
      return {
        ...pack,
        title: pack.name || pack.title,
        instructor_name: pack.author || pack.instructor_name,
        total_duration_minutes: pack.total_duration || pack.total_duration_minutes || 0,
        is_promoted: pack.is_on_promotion || pack.is_promoted || false,
        promotional_price: pack.promotion_price || pack.promotional_price,
        level: pack.level || 'intermediate',
        category: pack.category || 'Formation',
        skills_acquired: pack.skills_acquired || [],
        requirements: pack.requirements || [],
        formations: pack.formations || [] // Conserver les formations incluses
      };
    } catch (error) {
      console.error('❌ Error fetching formation pack:', error);
      toast.error('Erreur lors du chargement de la formation');
      throw error;
    }
  }

  // Récupérer les formations d'un pack
  async getPackFormations(packId: number): Promise<Formation[]> {
    console.log('📋 FormationsService.getPackFormations called with ID:', packId);
    try {
      const response = await apiService.get(`/packs/${packId}/formations`);
      console.log('✅ Pack formations response:', response.data);
      return response.data.formations || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching pack formations:', error);
      throw error;
    }
  }

  // Acheter un pack de formation
  async purchaseFormationPack(packId: number, paymentMethod?: string): Promise<PurchaseResponse> {
    console.log('💳 FormationsService.purchaseFormationPack called with ID:', packId);
    try {
      const response = await apiService.post(`/packs/${packId}/purchase`, {
        payment_method: paymentMethod || 'wallet'
      });
      console.log('✅ Purchase response:', response.data);
      
      if (response.data.success) {
        toast.success('Formation achetée avec succès !');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error purchasing formation pack:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'achat de la formation';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Récupérer les formations de l'utilisateur
  async getMyFormations(): Promise<MyFormation[]> {
    console.log('👤 FormationsService.getMyFormations called');
    try {
      const response = await apiService.get('/formations/my-formations');
      console.log('✅ My formations response:', response.data);
      return response.data.formations || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching my formations:', error);
      // Ne pas afficher d'erreur ici car c'est appelé depuis le dashboard
      return [];
    }
  }


  // Mettre à jour le progrès d'une formation
  async updateFormationProgress(
    formationId: number, 
    moduleId: number, 
    progressData: {
      progress_percentage: number;
      time_watched_minutes: number;
      completed?: boolean;
    }
  ): Promise<FormationProgress> {
    console.log('📊 FormationsService.updateFormationProgress called');
    try {
      const response = await apiService.put(`/formations/${formationId}/progress`, {
        module_id: moduleId,
        ...progressData
      });
      console.log('✅ Progress update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating formation progress:', error);
      throw error;
    }
  }

  // Marquer un module comme terminé
  async completeModule(formationId: number, moduleId: number): Promise<void> {
    console.log('✅ FormationsService.completeModule called');
    try {
      await apiService.post(`/formations/${formationId}/modules/${moduleId}/complete`);
      console.log('✅ Module completed successfully');
      toast.success('Module terminé !');
    } catch (error) {
      console.error('❌ Error completing module:', error);
      toast.error('Erreur lors de la validation du module');
      throw error;
    }
  }

  // Télécharger le certificat
  async downloadCertificate(formationId: number): Promise<Blob> {
    console.log('🏆 FormationsService.downloadCertificate called');
    try {
      const response = await apiService.get(`/formations/${formationId}/certificate`, {
        responseType: 'blob'
      });
      console.log('✅ Certificate downloaded successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      toast.error('Erreur lors du téléchargement du certificat');
      throw error;
    }
  }

  // Rechercher des formations
  async searchFormations(query: string, category?: string, level?: string): Promise<FormationPack[]> {
    console.log('🔍 FormationsService.searchFormations called with query:', query);
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category) params.append('category', category);
      if (level) params.append('level', level);

      const response = await apiService.get(`/packs/search?${params.toString()}`);
      console.log('✅ Search results:', response.data);
      return response.data.packs || response.data || [];
    } catch (error) {
      console.error('❌ Error searching formations:', error);
      toast.error('Erreur lors de la recherche');
      throw error;
    }
  }

  // Récupérer une formation spécifique avec ses vidéos pour l'apprentissage
  async getFormationForLearning(formationId: number): Promise<any> {
    console.log('📖 FormationsService.getFormationForLearning called with ID:', formationId);
    try {
      const response = await apiService.get(`/formations/${formationId}`);
      console.log('✅ Formation response:', response.data);
      return response.data.formation || response.data;
    } catch (error) {
      console.error('❌ Error fetching formation:', error);
      toast.error('Erreur lors du chargement de la formation');
      throw error;
    }
  }

  // Récupérer une formation spécifique avec modules (pour les détails)
  async getFormation(formationId: number): Promise<any> {
    console.log('📖 FormationsService.getFormation called with ID:', formationId);
    try {
      const response = await apiService.get(`/formations/${formationId}`);
      console.log('✅ Formation response:', response.data);
      return response.data.formation || response.data;
    } catch (error) {
      console.error('❌ Error fetching formation:', error);
      toast.error('Erreur lors du chargement de la formation');
      throw error;
    }
  }

  // Mettre à jour la progression d'une vidéo
  async updateVideoProgress(videoId: number, progressPercent: number): Promise<void> {
    console.log('📊 FormationsService.updateVideoProgress called:', { videoId, progressPercent });
    try {
      const response = await apiService.put(`/formations/videos/${videoId}/progress`, {
        progress: progressPercent
      });
      console.log('✅ Video progress updated:', response.data);
    } catch (error) {
      console.error('❌ Error updating video progress:', error);
      throw error;
    }
  }

  // Récupérer les catégories de formations
  async getFormationCategories(): Promise<string[]> {
    console.log('📂 FormationsService.getFormationCategories called');
    try {
      const response = await apiService.get('/packs/categories');
      console.log('✅ Categories response:', response.data);
      return response.data.categories || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      // Retourner des catégories par défaut en cas d'erreur
      return [
        'Marketing Digital',
        'E-commerce',
        'Développement Web',
        'Business & Entrepreneuriat',
        'Finance & Investissement',
        'Design & Créativité'
      ];
    }
  }

  // Vérifier si l'utilisateur a accès à une formation
  async checkFormationAccess(packId: number): Promise<{ hasAccess: boolean; purchaseDate?: string }> {
    console.log('🔐 FormationsService.checkFormationAccess called');
    try {
      const response = await apiService.get(`/packs/${packId}/access`);
      console.log('✅ Access check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking formation access:', error);
      return { hasAccess: false };
    }
  }

  // Récupérer les statistiques de formation
  async getFormationStats(): Promise<{
    total_formations: number;
    completed_formations: number;
    in_progress: number;
    total_hours: number;
    certificates_earned: number;
    total_cashback: number;
  }> {
    console.log('📊 FormationsService.getFormationStats called');
    try {
      const response = await apiService.get('/formations/stats');
      console.log('✅ Formation stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching formation stats:', error);
      // Retourner des stats par défaut
      return {
        total_formations: 0,
        completed_formations: 0,
        in_progress: 0,
        total_hours: 0,
        certificates_earned: 0,
        total_cashback: 0,
      };
    }
  }
}

export const formationsService = new FormationsService();