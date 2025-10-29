import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { quizService, Quiz, QuizQuestion } from '../../services/quiz.service';
import { challengeTracker } from '../../services/challengeTracker.service';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';

const QuizPlayPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subject = searchParams.get('subject') || '';

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
  }, [subject]);

  useEffect(() => {
    if (quiz && !showResult) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, showResult]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizService.getAvailableQuizzes();
      const availableQuizzes = response.quizzes;

      if (availableQuizzes.length === 0) {
        toast.error('Aucun quiz disponible');
        navigate('/quizz');
        return;
      }

      // Filtrer par sujet si possible, sinon prendre un quiz aléatoire
      let filteredQuizzes = availableQuizzes.filter(q => 
        q.subject?.toLowerCase().includes(subject.toLowerCase())
      );

      if (filteredQuizzes.length === 0) {
        filteredQuizzes = availableQuizzes;
      }

      // Sélectionner un quiz aléatoire
      const randomQuiz = filteredQuizzes[Math.floor(Math.random() * filteredQuizzes.length)];
      setQuiz(randomQuiz);
      setQuizStartTime(Date.now());
    } catch (error) {
      toast.error('Erreur lors du chargement du quiz');
      navigate('/quizz');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    toast.error('Temps écoulé !');
    finishQuiz();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    // Vérifier la réponse
    if (quiz && selectedAnswer === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex === quiz!.questions.length - 1) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const finishQuiz = async () => {
    if (!quiz) return;

    const finalScore = score + (selectedAnswer === quiz.questions[currentQuestionIndex]?.correctAnswer ? 1 : 0);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    const percentage = Math.round((finalScore / quiz.questions.length) * 100);

    try {
      const result = await quizService.saveQuizResult({
        quiz_id: quiz.id.toString(),
        score: percentage,
        total_questions: quiz.questions.length,
        correct_answers: finalScore,
        time_taken: timeTaken,
        subject: subject || quiz.subject
      });

      setQuizResult(result);
      setShowResult(true);

      if (result.passed) {
        toast.success(`Félicitations ! Vous avez gagné ${result.reward} FCFA !`);
        // Tracker le défi de quiz réussi
        await challengeTracker.trackQuizPassed(
          parseInt(quiz.id.toString()), 
          quiz.title || `Quiz ${subject}`, 
          percentage
        );
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du résultat');
    }
  };

  const handleExitQuiz = () => {
    const confirmExit = window.confirm('Êtes-vous sûr de vouloir quitter ? Votre progression sera perdue.');
    if (confirmExit) {
      navigate('/quizz');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const finalScore = score + (selectedAnswer === quiz?.questions[currentQuestionIndex]?.correctAnswer ? 1 : 0);
    return <QuizResultScreen 
      result={quizResult} 
      quiz={quiz} 
      onRestart={() => navigate('/quizz')} 
      finalScore={finalScore}
      totalQuestions={quiz?.questions.length || 0}
    />;
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Quiz non trouvé</p>
          <button 
            onClick={() => navigate('/quizz')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} sur {quiz.questions.length}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-600">
                Score: {score}/{currentQuestionIndex}
              </div>
              <button
                onClick={handleExitQuiz}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                selectedAnswer !== null
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer le Quiz' : 'Question Suivante'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher les résultats
const QuizResultScreen: React.FC<{
  result: any;
  quiz: Quiz | null;
  onRestart: () => void;
  finalScore: number;
  totalQuestions: number;
}> = ({ result, quiz, onRestart, finalScore, totalQuestions }) => {
  const navigate = useNavigate();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const percentage = Math.round((finalScore / totalQuestions) * 100);
  const isSuccess = result.passed;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
          isSuccess ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          <div className={`text-4xl ${isSuccess ? 'text-green-600' : 'text-orange-600'}`}>
            {isSuccess ? '🎉' : '👍'}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSuccess ? 'Félicitations !' : 'Bien joué !'}
        </h1>

        {/* Score */}
        <p className="text-xl text-gray-600 mb-6">
          Votre score : {finalScore}/{totalQuestions} ({percentage}%)
        </p>

        {/* Reward */}
        {isSuccess && result.reward > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-yellow-800 flex items-center justify-center">
              💰 Vous avez gagné {formatPrice(result.reward)} FCFA !
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Nouveau solde : {formatPrice(result.new_balance)} FCFA
            </p>
          </div>
        )}

        {/* Quiz info */}
        <div className="text-sm text-gray-500 mb-6">
          Quiz gratuits restants : {result.free_quizzes_left}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Nouveau Quiz
          </button>
          <button
            onClick={() => navigate('/quizz/history')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Voir l'historique
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayPage;