import apiService from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface WheelSegment {
  id: number;
  label: string;
  multiplier: number;
  color: string;
  probability: number;
  order?: number; // Ordre du segment sur la roue
}

export interface SpinResult {
  segment: WheelSegment;
  win_amount: number;
  net_gain: number;
  new_balance: number;
}

export interface CasinoHistoryItem {
  id: number;
  type: 'casino_bet' | 'casino_win';
  amount: number;
  multiplier: number;
  timestamp: string;
}

export interface CasinoStats {
  total_bets: number;
  total_wagered: number;
  total_won: number;
  net_profit: number;
}

class CasinoService {
  /**
   * Récupérer la configuration de la roue de fortune
   */
  async getWheelConfig(): Promise<WheelSegment[]> {
    try {
      const response = await apiService.get('/casino/wheel/config');
      return response.data.segments;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la config de la roue:', error);
      throw error;
    }
  }

  /**
   * Faire tourner la roue (jouer)
   */
  async spin(betAmount: number): Promise<SpinResult> {
    try {
      const response = await apiService.post('/casino/wheel/spin', {
        bet_amount: betAmount
      });
      return response.data.result;
    } catch (error: any) {
      console.error('Erreur lors du spin:', error);

      // Extraire le message d'erreur de la réponse
      const errorMessage = error.response?.data?.message || 'Erreur lors du jeu';
      throw new Error(errorMessage);
    }
  }

  /**
   * Récupérer l'historique des parties
   */
  async getHistory(limit: number = 20): Promise<CasinoHistoryItem[]> {
    try {
      const response = await apiService.get('/casino/wheel/history', {
        params: { limit }
      });
      return response.data.history;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques du joueur
   */
  async getStats(): Promise<CasinoStats> {
    try {
      const response = await apiService.get('/casino/wheel/stats');
      return response.data.stats;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }
  }
}

export default new CasinoService();
