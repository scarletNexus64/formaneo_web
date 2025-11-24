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
import { quizService, Quiz } from '../../services/quiz.service';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [freeQuizzesLeft, setFreeQuizzesLeft] = useState(5);
  const [stats, setStats] = useState({
    total_quizzes: 0,
    passed_quizzes: 0,
    average_score: 0,
    total_rewards: 0
  });
  const [loading, setLoading] = useState(true);

  const subjects = [
    { name: 'Informatique', icon: '💻', color: 'bg-blue-500', key: 'informatique' },
    { name: 'Sciences', icon: '🔬', color: 'bg-green-500', key: 'sciences' },
    { name: 'Histoire', icon: '📜', color: 'bg-purple-500', key: 'histoire' },
    { name: 'Géographie', icon: '🌍', color: 'bg-indigo-500', key: 'geographie' },
    { name: 'Mathématiques', icon: '🔢', color: 'bg-yellow-500', key: 'mathematiques' },
    { name: 'Littérature', icon: '📚', color: 'bg-teal-500', key: 'litterature' },
    { name: 'Arts', icon: '🎨', color: 'bg-pink-500', key: 'arts' },
    { name: 'Sport', icon: '⚽', color: 'bg-red-500', key: 'sport' },
    { name: 'Cinéma', icon: '🎬', color: 'bg-orange-500', key: 'cinema' },
    { name: 'Musique', icon: '🎵', color: 'bg-cyan-500', key: 'musique' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quizzesData, freeCountData, statsData] = await Promise.all([
        quizService.getAvailableQuizzes(),
        quizService.getFreeQuizzesCount(),
        quizService.getQuizStats()
      ]);

      setQuizzes(quizzesData.quizzes);
      setFreeQuizzesLeft(freeCountData.free_quizzes_left);
      setStats(statsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (subjectKey: string) => {
    if (freeQuizzesLeft <= 0) {
      toast.error('Vous n\'avez plus de quiz gratuits disponibles');
      return;
    }
    navigate(`/quizz/play?subject=${encodeURIComponent(subjectKey)}`);
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
            Testez vos connaissances générales dans 10 domaines différents et gagnez des FCFA à chaque quiz réussi !
          </p>
        </div>

        {/* Quiz gratuits disponibles */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quiz Gratuits Disponibles</h2>
              <p className="text-indigo-100 mb-4">
                Il vous reste <span className="font-bold text-2xl">{freeQuizzesLeft}</span> quiz gratuits
              </p>
              <div className="w-64 bg-white/20 rounded-full h-3">
                <div 
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(freeQuizzesLeft / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <CurrencyDollarIcon className="h-16 w-16 mx-auto mb-2 text-yellow-400" />
              <p className="text-lg font-semibold">Gagnez des FCFA</p>
              <p className="text-indigo-100">à chaque quiz réussi !</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sélection des sujets */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choisissez votre domaine</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Nos quiz couvrent de nombreux domaines : informatique, sciences, histoire, géographie, mathématiques, littérature, arts, sport, cinéma et musique !
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.key}
                  onClick={() => startQuiz(subject.key)}
                  className={`bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 ${
                    freeQuizzesLeft > 0
                      ? 'hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-2xl mr-4`}>
                      {subject.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">3 niveaux de difficulté disponibles</p>
                    </div>
                    {freeQuizzesLeft === 0 && (
                      <div className="text-gray-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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