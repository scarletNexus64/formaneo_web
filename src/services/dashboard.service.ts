import apiService from './api.service';
import toast from 'react-hot-toast';

export interface DashboardStats {
  wallet: {
    balance: number;
    available_for_withdrawal: number;
    pending_withdrawals: number;
    total_earned: number;
    total_commissions: number;
    total_quiz_and_bonus: number;
  };
  formations: {
    total_formations: number;
    completed_formations: number;
    in_progress: number;
    total_hours: number;
    certificates_earned: number;
    total_cashback: number;
  };
  affiliate: {
    total_registrations: number;
    monthly_registrations: number;
    total_commissions: number;
    current_month_commissions: number;
  };
  quiz: {
    free_quizzes_left: number;
    total_completed: number;
  };
}

export interface FormationProgress {
  id: number;
  title: string;
  progress: number;
  duration_minutes: number;
  completed_at: string | null;
  thumbnail_url: string | null;
  pack_name: string;
}

export interface RecentActivity {
  type: string;
  title: string;
  amount: string;
  time: string;
  icon: string;
}

class DashboardService {
  // Récupérer toutes les statistiques du dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    console.log('🎯 DashboardService.getDashboardStats called');

    // Utiliser Promise.allSettled pour que les erreurs d'une API n'empêchent pas les autres
    const [walletResult, formationsResult, affiliateResult] = await Promise.allSettled([
      this.getWalletInfo(),
      this.getFormationStats(),
      this.getAffiliateStats(),
    ]);

    // Traiter chaque résultat et utiliser fallback si nécessaire
    const walletResponse = walletResult.status === 'fulfilled' 
      ? walletResult.value 
      : this.getWalletFallback();

    const formationsResponse = formationsResult.status === 'fulfilled' 
      ? formationsResult.value 
      : this.getFormationsFallback();

    const affiliateResponse = affiliateResult.status === 'fulfilled' 
      ? affiliateResult.value 
      : this.getAffiliateFallback();

    // Log les erreurs mais ne pas alerter l'utilisateur avec des toasts gênants
    const failedApis = [];
    if (walletResult.status === 'rejected') {
      failedApis.push('Wallet');
      console.warn('⚠️ Wallet API not available, using fallback data');
    }
    if (formationsResult.status === 'rejected') {
      failedApis.push('Formations');
      console.warn('⚠️ Formations API not available, using fallback data');
    }
    if (affiliateResult.status === 'rejected') {
      failedApis.push('Affiliation');
      console.warn('⚠️ Affiliate API not available, using fallback data');
    }

    console.log('📊 Dashboard stats retrieved:', {
      wallet: walletResponse,
      formations: formationsResponse,
      affiliate: affiliateResponse,
    });

    return {
      wallet: walletResponse,
      formations: formationsResponse,
      affiliate: affiliateResponse,
      quiz: {
        free_quizzes_left: 5, // Sera mis à jour avec l'API quiz
        total_completed: 0,
      },
    };
  }

  // Récupérer les informations du wallet
  async getWalletInfo() {
    console.log('💰 DashboardService.getWalletInfo called');

    try {
      const response = await apiService.get('/wallet/info');
      console.log('✅ Wallet info response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching wallet info:', error);
      // Fallback avec les données du user si disponible
      return {
        balance: 0,
        available_for_withdrawal: 0,
        pending_withdrawals: 0,
        total_earned: 0,
        total_commissions: 0,
        total_quiz_and_bonus: 0,
      };
    }
  }

  // Récupérer les statistiques des formations
  async getFormationStats() {
    console.log('📚 DashboardService.getFormationStats called');

    try {
      const response = await apiService.get('/formations/progress-stats');
      console.log('✅ Formation stats response:', response.data);
      
      // Calculer les formations en cours
      const inProgress = response.data.total_formations - response.data.completed_formations;
      
      return {
        ...response.data,
        in_progress: inProgress,
      };
    } catch (error) {
      console.error('❌ Error fetching formation stats:', error);
      // Fallback data
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

  // Récupérer les statistiques d'affiliation
  async getAffiliateStats() {
    console.log('🤝 DashboardService.getAffiliateStats called');

    try {
      const response = await apiService.get('/affiliate/dashboard');
      console.log('✅ Affiliate stats response:', response.data);
      
      return {
        total_registrations: response.data.stats.registrations.total,
        monthly_registrations: response.data.stats.registrations.monthly,
        total_commissions: response.data.stats.total_commissions,
        current_month_commissions: response.data.earnings.current_month,
      };
    } catch (error) {
      console.error('❌ Error fetching affiliate stats:', error);
      // Fallback data
      return {
        total_registrations: 0,
        monthly_registrations: 0,
        total_commissions: 0,
        current_month_commissions: 0,
      };
    }
  }

  // Récupérer les formations en cours
  async getInProgressFormations(): Promise<FormationProgress[]> {
    console.log('🎓 DashboardService.getInProgressFormations called');

    try {
      const response = await apiService.get('/formations/my-formations');
      console.log('✅ User formations response:', response.data);

      // Filtrer les formations en cours (progress < 100 et > 0)
      const inProgressFormations = response.data.formations
        ?.filter((formation: any) => formation.user_progress > 0 && formation.user_progress < 100)
        .slice(0, 3) // Prendre les 3 premières
        .map((formation: any) => ({
          id: formation.id,
          title: formation.title,
          progress: formation.user_progress,
          duration_minutes: formation.duration_minutes,
          completed_at: formation.completed_at,
          thumbnail_url: formation.thumbnail_url,
          pack_name: formation.pack_name,
        })) || [];

      console.log('📋 In-progress formations:', inProgressFormations);
      return inProgressFormations;
    } catch (error) {
      console.error('❌ Error fetching in-progress formations:', error);
      
      // Si l'API n'existe pas, retourner un tableau vide (pas de données fictives)
      return [];
    }
  }

  // Récupérer l'activité récente
  async getRecentActivity(): Promise<RecentActivity[]> {
    console.log('📈 DashboardService.getRecentActivity called');

    try {
      // Récupérer les dernières transactions de l'utilisateur
      const response = await apiService.get('/transactions?limit=5');
      console.log('✅ Recent transactions response:', response.data);

      // Mapper les transactions vers le format d'activité
      const activities = response.data.transactions?.map((transaction: any) => ({
        type: transaction.type,
        title: this.getActivityTitle(transaction),
        amount: this.formatAmount(transaction.amount, transaction.type),
        time: this.formatTime(transaction.created_at),
        icon: this.getActivityIcon(transaction.type),
      })) || [];

      console.log('📋 Recent activities:', activities);
      return activities;
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
      console.warn('⚠️ Transactions API not available, returning empty array for new accounts');
      
      // Pour les nouveaux comptes, toujours retourner un tableau vide
      return [];
    }
  }

  // Formater le titre de l'activité
  private getActivityTitle(transaction: any): string {
    const titles: { [key: string]: string } = {
      affiliate_commission: 'Commission d\'affiliation reçue',
      quiz_reward: 'Récompense quiz complété',
      cashback: 'Cashback formation complétée',
      deposit: 'Dépôt de fonds',
      withdrawal: 'Retrait de fonds',
      transfer_in: 'Transfert reçu',
      transfer_out: 'Transfert envoyé',
      pack_purchase: 'Achat pack de formation',
      ebook_purchase: 'Achat e-book',
    };

    return titles[transaction.type] || transaction.description || 'Transaction';
  }

  // Formater le montant
  private formatAmount(amount: number, type: string): string {
    const isPositive = ['affiliate_commission', 'quiz_reward', 'cashback', 'deposit', 'transfer_in'].includes(type);
    const prefix = isPositive ? '+' : '';
    return `${prefix}${Math.abs(amount).toLocaleString('fr-FR')} FCFA`;
  }

  // Formater le temps relatif
  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes}min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days}j`;
    }
  }

  // Obtenir l'icône de l'activité
  private getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      affiliate_commission: 'UserGroupIcon',
      quiz_reward: 'ChartBarIcon',
      cashback: 'AcademicCapIcon',
      deposit: 'ArrowDownIcon',
      withdrawal: 'ArrowUpIcon',
      transfer_in: 'ArrowDownIcon',
      transfer_out: 'ArrowUpIcon',
      pack_purchase: 'AcademicCapIcon',
      ebook_purchase: 'BookOpenIcon',
    };

    return icons[type] || 'CurrencyDollarIcon';
  }

  // ========== MÉTHODES DE FALLBACK ==========

  // Données de fallback pour le wallet
  private getWalletFallback() {
    return {
      balance: 0,
      available_for_withdrawal: 0,
      pending_withdrawals: 0,
      total_earned: 0,
      total_commissions: 0,
      total_quiz_and_bonus: 0,
    };
  }

  // Données de fallback pour les formations
  private getFormationsFallback() {
    return {
      total_formations: 0,
      completed_formations: 0,
      in_progress: 0,
      total_hours: 0,
      certificates_earned: 0,
      total_cashback: 0,
    };
  }

  // Données de fallback pour l'affiliation
  private getAffiliateFallback() {
    return {
      total_registrations: 0,
      monthly_registrations: 0,
      total_commissions: 0,
      current_month_commissions: 0,
    };
  }

  // Données de fallback pour les formations en cours
  private getInProgressFormationsFallback(): FormationProgress[] {
    // Pour les nouveaux comptes, retourner un tableau vide
    return [];
  }

  // Données de fallback pour l'activité récente
  private getRecentActivityFallback(): RecentActivity[] {
    // Pour les nouveaux comptes, retourner un tableau vide au lieu de données fictives
    return [];
  }
}

export const dashboardService = new DashboardService();