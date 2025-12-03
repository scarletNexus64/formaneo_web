import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PuzzlePieceIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { quizService, Quiz, QuizCategory } from '../../services/quiz.service';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';

const QuizPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState({
    total_quizzes: 0,
    passed_quizzes: 0,
    average_score: 0,
    total_rewards: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, quizzesData, statsData] = await Promise.all([
        quizService.getCategories(),
        quizService.getAvailableQuizzes(),
        quizService.getQuizStats()
      ]);

      setCategories(categoriesData.categories);
      setQuizzes(quizzesData.quizzes);
      setStats(statsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (categorySlug: string) => {
    navigate(`/quizz/category/${categorySlug}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <ActivationGuard action="accéder aux quiz">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <PuzzlePieceIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Quiz Éducatifs</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Testez vos connaissances dans {categories.length} catégories différentes et gagnez des FCFA à chaque quiz réussi !
          </p>
        </div>

        {/* Bannière de bienvenue */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Testez vos connaissances</h2>
              <p className="text-indigo-100">
                Participez aux quiz et gagnez des récompenses en FCFA !
              </p>
            </div>
            <div className="text-center">
              <CurrencyDollarIcon className="h-16 w-16 mx-auto mb-2 text-yellow-400" />
              <p className="text-lg font-semibold">Gagnez des FCFA</p>
              <p className="text-indigo-100">à chaque quiz réussi !</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sélection des catégories */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choisissez votre catégorie</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Nos quiz couvrent de nombreux domaines variés. Chaque catégorie contient plusieurs quiz avec différents niveaux de difficulté !
            </p>

            {categories.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">Aucune catégorie disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => startQuiz(category.slug)}
                    className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg"
                    style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.quizzes_count} quiz disponible{category.quizzes_count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {category.description && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Vos Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quiz complétés</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.total_quizzes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quiz réussis</span>
                  <span className="font-semibold text-green-600 flex items-center">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    {stats.passed_quizzes}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Score moyen</span>
                  <span className="font-semibold text-blue-600 flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    {stats.average_score}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-gray-600 dark:text-gray-400">FCFA gagnés</span>
                  <span className="font-bold text-yellow-600 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {formatPrice(stats.total_rewards)}
                  </span>
                </div>
              </div>
            </div>

            {/* Historique */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/quizz/history')}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Voir l'historique</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Consultez vos résultats passés</p>
                </button>
                <button
                  onClick={() => navigate('/quizz/leaderboard')}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Classement</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Comparez vos scores</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </ActivationGuard>
    </div>
  );
};

export default QuizPage;