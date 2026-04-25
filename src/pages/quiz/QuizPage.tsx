import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PuzzlePieceIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-400 mx-auto"></div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <PuzzlePieceIcon className="h-12 w-12 text-red-600 dark:text-red-400 mr-3" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Quiz Éducatifs</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Testez vos connaissances dans <span className="font-semibold text-red-600 dark:text-red-400">{categories.length} catégories</span> différentes et gagnez des FCFA à chaque quiz réussi !
          </p>
        </motion.div>

        {/* Bannière de bienvenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-purple-600 dark:from-red-700 dark:to-purple-700 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-xl"
        >
          {/* Subtle animated background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start mb-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SparklesIcon className="h-8 w-8 mr-2 text-yellow-300" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold">Testez vos connaissances</h2>
              </div>
              <p className="text-red-100 dark:text-red-200 text-base sm:text-lg">
                Participez aux quiz et gagnez des récompenses en FCFA !
              </p>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CurrencyDollarIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 text-yellow-300" />
              </motion.div>
              <p className="text-lg sm:text-xl font-bold">Gagnez des FCFA</p>
              <p className="text-sm text-red-100 dark:text-red-200">à chaque quiz réussi !</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sélection des catégories */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FireIcon className="h-6 w-6 mr-2 text-orange-500 dark:text-orange-400" />
                Choisissez votre catégorie
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Nos quiz couvrent de nombreux domaines variés. Chaque catégorie contient plusieurs quiz avec différents niveaux de difficulté !
              </p>
            </motion.div>

            {categories.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">Aucune catégorie disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => startQuiz(category.slug)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:border-red-300 dark:hover:border-red-600 hover:shadow-xl"
                    style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 shadow-md"
                        style={{ backgroundColor: category.color + '30' }}
                      >
                        {category.icon}
                      </motion.div>
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ChartBarIcon className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                </motion.div>
                Vos Statistiques
              </h3>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-gray-600 dark:text-gray-400">Quiz complétés</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg">{stats.total_quizzes}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <span className="text-gray-600 dark:text-gray-400">Quiz réussis</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 flex items-center text-lg">
                    <CheckIcon className="h-5 w-5 mr-1" />
                    {stats.passed_quizzes}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <span className="text-gray-600 dark:text-gray-400">Score moyen</span>
                  <span className="font-semibold text-gray-900 dark:text-blue-400 flex items-center text-lg">
                    <StarIcon className="h-5 w-5 mr-1" />
                    {stats.average_score}%
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <span className="text-gray-600 dark:text-gray-400">FCFA gagnés</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400 flex items-center text-lg">
                    <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                    {formatPrice(stats.total_rewards)}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                Actions rapides
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/quizz/history')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-600/50 rounded-xl transition-all border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                    Voir l'historique
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-6">Consultez vos résultats passés</p>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/quizz/leaderboard')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30 hover:from-yellow-100 hover:to-yellow-200 dark:hover:from-yellow-900/30 dark:hover:to-yellow-900/40 rounded-xl transition-all border border-yellow-200 dark:border-yellow-800"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                    Classement
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-6">Comparez vos scores</p>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </ActivationGuard>
    </div>
  );
};

export default QuizPage;