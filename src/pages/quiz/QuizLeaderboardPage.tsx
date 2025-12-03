import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrophyIcon,
  StarIcon,
  ChartBarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { quizService, LeaderboardEntry, QuizCategory } from '../../services/quiz.service';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';

const QuizLeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<LeaderboardEntry | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadLeaderboard(selectedCategory.slug);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await quizService.getCategories();
      setCategories(data.categories);
      // Sélectionner automatiquement la première catégorie
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0]);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  const loadLeaderboard = async (subject: string) => {
    try {
      setLoading(true);
      const data = await quizService.getLeaderboard(subject);
      setLeaderboard(data.leaderboard);
      setUserStats(data.user_stats);
      setTotalParticipants(data.total_participants);
    } catch (error) {
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900';
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const isCurrentUser = (userId: number) => {
    return userStats?.user_id === userId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <ActivationGuard action="accéder au classement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/quizz')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour aux quiz
            </button>

            <div className="flex items-center mb-6">
              <TrophyIcon className="h-12 w-12 text-yellow-500 mr-4" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Classement par Catégorie</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  Comparez vos performances dans chaque catégorie
                </p>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory?.id === category.id
                        ? 'text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    style={
                      selectedCategory?.id === category.id
                        ? { backgroundColor: category.color }
                        : {}
                    }
                  >
                    <span className="text-2xl mr-2">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Category Info */}
            {selectedCategory && (
              <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                    style={{ backgroundColor: selectedCategory.color + '20' }}
                  >
                    {selectedCategory.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Classement {selectedCategory.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCategory.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalParticipants}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">participant{totalParticipants > 1 ? 's' : ''}</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700" style={selectedCategory ? { borderLeftWidth: '4px', borderLeftColor: selectedCategory.color } : {}}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Top Joueurs - {selectedCategory?.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Classement basé sur le score moyen dans cette catégorie
                  </p>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Aucun résultat pour cette catégorie</p>
                    </div>
                  ) : (
                    leaderboard.map((entry) => (
                      <div
                        key={entry.user_id}
                        className={`p-4 transition-colors ${
                          isCurrentUser(entry.user_id)
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center">
                          {/* Rank */}
                          <div className="flex-shrink-0 w-16 text-center">
                            {entry.rank <= 3 ? (
                              <div className="flex flex-col items-center">
                                <span className="text-3xl">{getRankIcon(entry.rank)}</span>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                                  #{entry.rank}
                                </span>
                              </div>
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto ${getRankBadgeColor(
                                  entry.rank
                                )}`}
                              >
                                {entry.rank}
                              </div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {entry.user_name}
                                {isCurrentUser(entry.user_id) && (
                                  <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                                    Vous
                                  </span>
                                )}
                              </h3>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400 space-x-4">
                              <span>{entry.total_quizzes} quiz</span>
                              <span className="text-green-600 dark:text-green-400">
                                {entry.passed_quizzes} réussis
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center space-x-6 ml-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {entry.average_score}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Moy.</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {entry.best_score}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Max</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User Stats Card */}
            <div className="space-y-6">
              {/* Your Rank */}
              {userStats && (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center mb-4">
                    <UserIcon className="h-8 w-8 mr-3" />
                    <h3 className="text-xl font-bold">Votre Position</h3>
                  </div>

                  {userStats.rank ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-6xl font-bold mb-2">#{userStats.rank}</div>
                        <p className="text-indigo-100">sur {totalParticipants} participants</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                          <span className="text-indigo-100">Score moyen</span>
                          <span className="font-bold text-xl">{userStats.average_score}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                          <span className="text-indigo-100">Meilleur score</span>
                          <span className="font-bold text-xl">{userStats.best_score}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                          <span className="text-indigo-100">Quiz complétés</span>
                          <span className="font-bold">{userStats.total_quizzes}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                          <span className="text-indigo-100">Quiz réussis</span>
                          <span className="font-bold">{userStats.passed_quizzes}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <ChartBarIcon className="h-16 w-16 mx-auto mb-4 text-white/50" />
                      <p className="text-lg mb-2">Vous n'avez pas encore de classement</p>
                      <p className="text-indigo-100 text-sm mb-4">
                        Complétez votre premier quiz pour apparaître dans le classement !
                      </p>
                      <button
                        onClick={() => navigate('/quizz')}
                        className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Commencer un Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Comment progresser ?
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Complétez plus de quiz pour améliorer votre score moyen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Visez 60% ou plus pour gagner des récompenses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Essayez différentes catégories pour diversifier vos compétences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Pratiquez régulièrement pour rester au top !</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ActivationGuard>
    </div>
  );
};

export default QuizLeaderboardPage;
