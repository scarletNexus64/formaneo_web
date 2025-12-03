import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { quizService, Quiz, QuizCategory } from '../../services/quiz.service';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';

const QuizCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<QuizCategory | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryQuizzes();
  }, [slug]);

  const loadCategoryQuizzes = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await quizService.getCategoryQuizzes(slug);
      setCategory(data.category);
      setQuizzes(data.quizzes);
    } catch (error) {
      toast.error('Erreur lors du chargement des quiz');
      navigate('/quizz');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    if (quiz.user_has_attempted) {
      toast.error('Vous avez déjà participé à ce quiz');
      return;
    }

    if (quiz.status !== 'published') {
      toast.error('Ce quiz n\'est pas encore disponible');
      return;
    }

    if (quiz.max_participants && quiz.current_participants >= quiz.max_participants) {
      toast.error('Ce quiz a atteint le nombre maximum de participants');
      return;
    }

    // Naviguer vers le quiz spécifique
    navigate(`/quizz/play?id=${quiz.id}&subject=${slug}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'facile':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'medium':
      case 'moyen':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'hard':
      case 'difficile':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Catégorie non trouvée</p>
          <button
            onClick={() => navigate('/quizz')}
            className="mt-4 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg"
          >
            Retour aux catégories
          </button>
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
          <div className="mb-8">
            <button
              onClick={() => navigate('/quizz')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour aux catégories
            </button>

            <div className="flex items-center mb-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl mr-4"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
                {category.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{category.description}</p>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              {quizzes.length} quiz disponible{quizzes.length > 1 ? 's' : ''} dans cette catégorie
            </p>
          </div>

          {/* Quiz List */}
          {quizzes.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Aucun quiz disponible dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 p-6 transition-all duration-200 ${
                    quiz.user_has_attempted
                      ? 'border-gray-300 dark:border-gray-700 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg cursor-pointer'
                  }`}
                  onClick={() => !quiz.user_has_attempted && startQuiz(quiz)}
                >
                  {/* Overlay pour les quiz déjà joués */}
                  {quiz.user_has_attempted && (
                    <>
                      {/* Fond semi-transparent */}
                      <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/80 rounded-lg z-10"></div>

                      {/* Badge "DÉJÀ JOUÉ" en diagonale */}
                      <div className="absolute top-0 right-0 z-20">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-2 transform rotate-12 translate-x-4 -translate-y-2 shadow-lg">
                          <span className="font-bold text-sm uppercase tracking-wider">Déjà joué</span>
                        </div>
                      </div>

                      {/* Message central */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <div className="bg-red-500 rounded-full p-4 mb-3 shadow-xl">
                          <CheckCircleIcon className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white mb-1">DÉJÀ COMPLÉTÉ</p>
                          <p className="text-sm text-gray-200">Vous avez déjà participé à ce quiz</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Contenu de la carte (légèrement opaque si déjà joué) */}
                  <div className={quiz.user_has_attempted ? 'opacity-40' : ''}>
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {quiz.title}
                    </h3>

                    {/* Description */}
                    {quiz.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{quiz.questions_count} questions</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <StarIcon className="h-4 w-4 mr-2" />
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{formatPrice(quiz.reward_amount)} FCFA</span>
                      </div>
                    </div>

                    {/* Participants */}
                    {quiz.max_participants && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {quiz.current_participants} / {quiz.max_participants} participants
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${(quiz.current_participants / quiz.max_participants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {!quiz.user_has_attempted && (
                      <button
                        className="w-full bg-primary-600 dark:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          startQuiz(quiz);
                        }}
                      >
                        Commencer le Quiz
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ActivationGuard>
    </div>
  );
};

export default QuizCategoryPage;
