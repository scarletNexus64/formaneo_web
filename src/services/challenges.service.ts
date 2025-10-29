import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';
import { Challenge } from '../types';

class ChallengesService {
  // Obtenir tous les défis disponibles
  async getChallenges(): Promise<Challenge[]> {
    try {
      const response = await apiService.get<{ challenges: Challenge[] }>(
        ENDPOINTS.CHALLENGES.LIST
      );
      return response.data.challenges || [];
    } catch (error) {
      console.error('Erreur lors du chargement des défis:', error);
      throw error;
    }
  }

  // Obtenir les défis de l'utilisateur avec leur progression
  async getUserChallenges(): Promise<Challenge[]> {
    try {
      const response = await apiService.get<{ challenges: Challenge[] }>(
        ENDPOINTS.CHALLENGES.USER_CHALLENGES
      );
      return response.data.challenges || [];
    } catch (error) {
      console.error('Erreur lors du chargement des défis de l\'utilisateur:', error);
      throw error;
    }
  }

  // Compléter un défi
  async completeChallenge(challengeId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        ENDPOINTS.CHALLENGES.COMPLETE(challengeId.toString()),
        {}
      );
      return {
        success: response.data.success || true,
        message: response.data.message || 'Défi complété avec succès'
      };
    } catch (error: any) {
      console.error('Erreur lors de la complétion du défi:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la complétion du défi'
      };
    }
  }

  // Récupérer la récompense d'un défi
  async claimReward(challengeId: number): Promise<{ success: boolean; message: string; new_balance?: number }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string; new_balance?: number }>(
        ENDPOINTS.CHALLENGES.CLAIM_REWARD(challengeId.toString()),
        {}
      );
      return {
        success: response.data.success || true,
        message: response.data.message || 'Récompense réclamée avec succès',
        new_balance: response.data.new_balance
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la récompense:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la récupération de la récompense'
      };
    }
  }

  // Mettre à jour la progression d'un défi
  async updateProgress(challengeId: number, progress: number): Promise<{ success: boolean; message: string; is_completed: boolean }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string; is_completed: boolean }>(
        ENDPOINTS.CHALLENGES.UPDATE_PROGRESS(challengeId.toString()),
        { progress }
      );
      return {
        success: response.data.success || true,
        message: response.data.message || 'Progression mise à jour',
        is_completed: response.data.is_completed || false
      };
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de la progression',
        is_completed: false
      };
    }
  }

  // Obtenir l'URL complète de l'image d'un défi
  getImageUrl(imageUrl?: string): string | null {
    if (!imageUrl) return null;
    
    // Si l'URL est déjà absolue
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Sinon, ajouter le domaine de base
    return `${window.location.protocol}//${window.location.hostname}:8000${imageUrl}`;
  }
}

export const challengesService = new ChallengesService();
export default challengesService;