import apiService from './api.service';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: string;
  subject: string;
  questions_count: number;
  is_active: boolean;
}

export interface QuizResult {
  id: number;
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken: number;
  subject: string;
  created_at: string;
}

export interface QuizStats {
  total_quizzes: number;
  passed_quizzes: number;
  average_score: number;
  total_rewards: number;
}

export interface QuizResultResponse {
  success: boolean;
  result_id: number;
  passed: boolean;
  reward: number;
  new_balance: number;
  free_quizzes_left: number;
}

class QuizService {
  /**
   * Obtenir les quiz disponibles
   */
  async getAvailableQuizzes(): Promise<{ quizzes: Quiz[] }> {
    try {
      const response = await apiService.get<{ quizzes: Quiz[] }>('/quiz/available');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des quiz:', error);
      throw error;
    }
  }

  /**
   * Obtenir le nombre de quiz gratuits restants
   */
  async getFreeQuizzesCount(): Promise<{ free_quizzes_left: number }> {
    try {
      const response = await apiService.get<{ free_quizzes_left: number }>('/quiz/free-count');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des quiz gratuits:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder le résultat d'un quiz
   */
  async saveQuizResult(data: {
    quiz_id: string;
    score: number;
    total_questions: number;
    correct_answers: number;
    time_taken: number;
    subject: string;
  }): Promise<QuizResultResponse> {
    try {
      const response = await apiService.post<QuizResultResponse>('/quiz/results', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du résultat:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'historique des quiz
   */
  async getQuizHistory(page: number = 1, limit: number = 20): Promise<{
    results: QuizResult[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    try {
      const response = await apiService.get<{
        results: QuizResult[];
        pagination: {
          current_page: number;
          last_page: number;
          per_page: number;
          total: number;
        };
      }>(`/quiz/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des quiz
   */
  async getQuizStats(): Promise<QuizStats> {
    try {
      const response = await apiService.get<QuizStats>('/quiz/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      throw error;
    }
  }
}

export const quizService = new QuizService();