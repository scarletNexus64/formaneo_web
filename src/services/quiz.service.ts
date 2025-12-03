import apiService from './api.service';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number | string;
  explanation?: string;
}

export interface QuizCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  quizzes_count: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: string;
  subject: string;
  questions_count: number;
  is_active: boolean;
  passing_score: number;
  reward_amount: number;
  status: 'draft' | 'scheduled' | 'published' | 'closed';
  max_participants?: number;
  current_participants: number;
  published_at?: string;
  user_has_attempted?: boolean;
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

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  user_name: string;
  total_quizzes: number;
  passed_quizzes: number;
  average_score: number;
  best_score: number;
  total_correct_answers: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  user_stats: LeaderboardEntry;
  total_participants: number;
  filter: { subject?: string } | null;
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
   * Obtenir toutes les catégories de quiz
   */
  async getCategories(): Promise<{ categories: QuizCategory[] }> {
    try {
      const response = await apiService.get<{ categories: QuizCategory[] }>('/quiz-categories');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      throw error;
    }
  }

  /**
   * Obtenir une catégorie et ses quiz
   */
  async getCategoryQuizzes(slug: string): Promise<{ category: QuizCategory; quizzes: Quiz[] }> {
    try {
      const response = await apiService.get<{ category: QuizCategory; quizzes: Quiz[] }>(`/quiz-categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des quiz de la catégorie:', error);
      throw error;
    }
  }

  /**
   * Obtenir les quiz disponibles
   */
  async getAvailableQuizzes(subject?: string): Promise<{ quizzes: Quiz[] }> {
    try {
      const params = subject ? `?subject=${encodeURIComponent(subject)}` : '';
      const response = await apiService.get<{ quizzes: Quiz[] }>(`/quiz/available${params}`);
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

  /**
   * Obtenir le classement des quiz
   */
  async getLeaderboard(subject?: string, limit?: number): Promise<LeaderboardResponse> {
    try {
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (limit) params.append('limit', limit.toString());

      const queryString = params.toString();
      const url = `/quiz/leaderboard${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<LeaderboardResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error);
      throw error;
    }
  }
}

export const quizService = new QuizService();