import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface AffiliateStats {
  earnings: {
    today: number;
    yesterday: number;
    current_month: number;
    last_month: number;
  };
  stats: {
    registrations: {
      total: number;
      monthly: number;
    };
    conversions: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
      total: number;
    };
    level2_affiliates: {
      total: number;
      monthly: number;
    };
    active_affiliates: number;
    total_commissions: number;
  };
  affiliate_link: string;
  promo_code: string;
}

export interface DetailedStats {
  top_performers: Array<{
    name: string;
    total_commission: number;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

export interface PromotionalBanner {
  id: number;
  title: string;
  type: string;
  file_url: string | null;
  description: string;
  download_url: string;
}

class AffiliateService {
  async getDashboard(): Promise<AffiliateStats> {
    try {
      const response = await apiService.get(ENDPOINTS.AFFILIATE.DASHBOARD);
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate dashboard:', error);
      // Return mock data for now
      return {
        earnings: {
          today: 2500,
          yesterday: 1800,
          current_month: 15000,
          last_month: 12000,
        },
        stats: {
          registrations: {
            total: 25,
            monthly: 8,
          },
          conversions: {
            daily: 2,
            weekly: 8,
            monthly: 15,
            yearly: 45,
            total: 45,
          },
          level2_affiliates: {
            total: 12,
            monthly: 3,
          },
          active_affiliates: 15,
          total_commissions: 28500,
        },
        affiliate_link: 'https://formaneo.site/invite/ABC123',
        promo_code: 'ABC123',
      };
    }
  }

  async getDetailedStats(): Promise<DetailedStats> {
    try {
      const response = await apiService.get(ENDPOINTS.AFFILIATE.DETAILED_STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
      // Return mock data for now
      return {
        top_performers: [
          { name: 'Marie Dubois', total_commission: 3500 },
          { name: 'Jean Martin', total_commission: 2800 },
          { name: 'Alice Lambert', total_commission: 2200 },
        ],
        chart_data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [
            {
              label: 'Commissions',
              data: [1200, 1800, 2200, 1500, 2500, 3000, 1800],
            },
            {
              label: 'Inscriptions',
              data: [2, 3, 4, 2, 5, 6, 3],
            },
          ],
        },
      };
    }
  }

  async getBanners(): Promise<{ banners: PromotionalBanner[] }> {
    try {
      const response = await apiService.get(ENDPOINTS.AFFILIATE.BANNERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      return { banners: [] }; // Return empty array instead of throwing error
    }
  }

  async downloadBanner(bannerId: number): Promise<void> {
    try {
      const response = await apiService.get(`/affiliate/banner/${bannerId}/download`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `banner-${bannerId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading banner:', error);
      throw new Error('Erreur lors du téléchargement de la bannière');
    }
  }
}

export const affiliateService = new AffiliateService();