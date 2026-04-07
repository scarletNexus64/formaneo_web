import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import { Toaster } from 'react-hot-toast';
import AnimatedCounter from './components/AnimatedCounter';
import { ThemeProvider } from './contexts/ThemeContext';
import { PaymentProvider } from './contexts/PaymentContext';

// Import des vraies pages avec la logique API
import LoginPageAuth from './pages/auth/LoginPage';
import RegisterPageAuth from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPageAuth from './pages/dashboard/DashboardPage';
import FormationsPageAuth from './pages/formations/FormationsPage';
import FormationDetailPageAuth from './pages/formations/FormationDetailPage';
import FormationLearnPageAuth from './pages/formations/FormationLearnPage';
import EbooksPageAuth from './pages/ebooks/EbooksPage';
import WalletPageAuth from './pages/wallet/WalletPage';
import QuizPage from './pages/quiz/QuizPage';
import QuizCategoryPage from './pages/quiz/QuizCategoryPage';
import QuizPlayPage from './pages/quiz/QuizPlayPage';
import QuizHistoryPage from './pages/quiz/QuizHistoryPage';
import QuizLeaderboardPage from './pages/quiz/QuizLeaderboardPage';
import ChallengesPage from './pages/challenges/ChallengesPage';
import AccountActivationPage from './pages/account/AccountActivationPage';
import ActivationReturnPage from './pages/account/ActivationReturnPage';
import AffiliatePageAuth from './pages/affiliate/AffiliatePage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import LegalNotice from './pages/legal/LegalNotice';
import MaintenancePage from './pages/maintenance/MaintenancePage';

// Push Notifications
import { usePushNotifications } from './hooks/usePushNotifications';
import { PushNotificationPrompt } from './components/PushNotificationPrompt';
import { NotificationPermissionModal } from './components/NotificationPermissionModal';
import { notificationService } from './services/notificationService';
import { useAuthStore } from './store/authStore';

// Payment Status Banner
import { PaymentStatusBanner } from './components/PaymentStatusBanner';

// Maintenance Check
import { useMaintenanceCheck } from './hooks/useMaintenanceCheck';

// Simple Login Page component
const LoginPage = () => {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <img src={logo} alt="Formaneo" className="h-16 w-16 filter brightness-0 invert mb-6" />
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Bon retour sur<br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                Formaneo
              </span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Continuez votre apprentissage et gagnez des récompenses à chaque formation complétée.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-lg">Accès à toutes vos formations</span>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-lg">Système de cashback unique</span>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-lg">Certificats reconnus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="lg:hidden mb-6">
                <img src={logo} alt="Formaneo" className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
              <p className="text-gray-600">Accédez à votre espace d'apprentissage</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Adresse email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Se souvenir de moi</span>
                </label>
                <a href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Se connecter
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Pas encore de compte ?
              </p>
              <Link 
                to="/register" 
                className="inline-block w-full py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Créer un compte gratuitement
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Page component
const RegisterPage = () => {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="lg:hidden mb-6">
                <img src={logo} alt="Formaneo" className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
              <p className="text-gray-600">Rejoignez la communauté d'apprenants</p>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="+237 678 613 653"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmer
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Code parrain (optionnel)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Code de votre parrain"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Créer mon compte
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                Déjà un compte ?
              </p>
              <Link 
                to="/login" 
                className="inline-block w-full py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Se connecter
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <img src={logo} alt="Formaneo" className="h-16 w-16 filter brightness-0 invert mb-6" />
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Commencez votre<br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                aventure
              </span>
            </h1>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              Rejoignez des milliers d'apprenants et commencez à gagner dès aujourd'hui.
            </p>
          </div>
          
          {/* Benefits Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-center">🎁 Bonus de bienvenue</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl text-green-800 font-bold">2K</span>
                </div>
                <div>
                  <p className="font-semibold">2000 FCFA offerts</p>
                  <p className="text-green-100 text-sm">Crédit immédiat sur votre compte</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🧩</span>
                </div>
                <div>
                  <p className="font-semibold">5 quiz gratuits</p>
                  <p className="text-green-100 text-sm">Pour tester vos connaissances</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <p className="font-semibold">Cashback garanti</p>
                  <p className="text-green-100 text-sm">Sur chaque formation complétée</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <p className="font-semibold">Programme d'affiliation</p>
                  <p className="text-green-100 text-sm">Gagnez en parrainant vos amis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page component
const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Formaneo Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">Solde</p>
                <p className="text-sm font-semibold text-blue-900">15,000 FCFA</p>
              </div>
              <Link to="/" className="text-gray-600 hover:text-gray-800">
                Déconnexion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Bienvenue sur votre dashboard ! 👋</h2>
          <p className="text-gray-600 mt-2">Continuez votre apprentissage et gagnez des récompenses</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Formations en cours', value: '3', color: 'blue' },
            { title: 'Quiz complétés', value: '12', color: 'green' },
            { title: 'Certificats obtenus', value: '5', color: 'purple' },
            { title: 'Revenus totaux', value: '25,000 FCFA', color: 'yellow' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center">
            <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-2"></div>
            <p className="font-medium">Nouvelles formations</p>
          </button>
          <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center">
            <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-2"></div>
            <p className="font-medium">Mon portefeuille</p>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center">
            <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-2"></div>
            <p className="font-medium">Programme d'affiliation</p>
          </button>
          <button className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition text-center">
            <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-2"></div>
            <p className="font-medium">E-books</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// App component with routes
const AppContent = () => {
  // Initialize auth on app load
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    console.log('🚀 App mounted - Initializing auth...');
    initializeAuth();
  }, [initializeAuth]);

  // Check maintenance mode on app load
  const { isChecking, inMaintenance } = useMaintenanceCheck();

  // Show loading screen while checking maintenance status
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative text-6xl animate-spin">
              ⚙️
            </div>
          </div>
          <p className="mt-4 text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPageAuth />} />
      <Route path="/register" element={<RegisterPageAuth />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPageAuth />
        </ProtectedRoute>
      } />
      <Route path="/formations" element={
        <ProtectedRoute>
          <FormationsPageAuth />
        </ProtectedRoute>
      } />
      <Route path="/formations/:id" element={
        <ProtectedRoute>
          <FormationDetailPageAuth />
        </ProtectedRoute>
      } />
      <Route path="/formations/:id/learn" element={
        <ProtectedRoute>
          <FormationLearnPageAuth />
        </ProtectedRoute>
      } />
      <Route path="/ebooks" element={
        <ProtectedRoute>
          <EbooksPageAuth />
        </ProtectedRoute>
      } />
      <Route path="/quizz" element={
        <ProtectedRoute>
          <QuizPage />
        </ProtectedRoute>
      } />
      <Route path="/quizz/category/:slug" element={
        <ProtectedRoute>
          <QuizCategoryPage />
        </ProtectedRoute>
      } />
      <Route path="/quizz/play" element={
        <ProtectedRoute>
          <QuizPlayPage />
        </ProtectedRoute>
      } />
      <Route path="/quizz/history" element={
        <ProtectedRoute>
          <QuizHistoryPage />
        </ProtectedRoute>
      } />
      <Route path="/quizz/leaderboard" element={
        <ProtectedRoute>
          <QuizLeaderboardPage />
        </ProtectedRoute>
      } />
      <Route path="/challenges" element={
        <ProtectedRoute>
          <ChallengesPage />
        </ProtectedRoute>
      } />
      <Route path="/wallet" element={
        <ProtectedRoute>
          <WalletPageAuth />
        </ProtectedRoute>
      } />
      <Route path="/affiliate" element={
        <ProtectedRoute>
          <AffiliatePageAuth />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/account/activate" element={
        <ProtectedRoute>
          <AccountActivationPage />
        </ProtectedRoute>
      } />
      <Route path="/account/activation/return" element={
        <ProtectedRoute>
          <ActivationReturnPage />
        </ProtectedRoute>
      } />
      <Route path="/legal/terms-of-service" element={<TermsOfService />} />
      <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/legal/legal-notice" element={<LegalNotice />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

// Push Notification Manager Component
const PushNotificationManager = () => {
  const [showModal, setShowModal] = React.useState(false);

  // Check if user is authenticated using Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Initialize push notifications
  usePushNotifications(isAuthenticated);

  // Check if we should show the modal
  React.useEffect(() => {
    if (!isAuthenticated) return;

    // Import isPushNotificationSupported dynamically to avoid issues
    import('./utils/deviceDetection').then(({ isPushNotificationSupported }) => {
      // Don't show modal on unsupported devices (iOS/Safari)
      if (!isPushNotificationSupported()) {
        console.log('❌ Push notifications not supported on this device, not showing modal');
        return;
      }

      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('Notifications not supported, not showing modal');
        return;
      }

      const permission = Notification.permission;

      // Don't show if notifications are already enabled
      const isEnabled = notificationService.isPushNotificationsEnabled();
      if (isEnabled) {
        console.log('✅ Push notifications already enabled, not showing modal');
        return;
      }

      // Don't show if permission is already granted (auto-register will handle it)
      if (permission === 'granted') {
        console.log('✅ Permission already granted, auto-register will handle it');
        return;
      }

      // Don't show if permission is denied
      if (permission === 'denied') {
        console.log('❌ Push notifications denied, not showing modal');
        return;
      }

      // Only show if permission is 'default' (not asked yet)
      if (permission !== 'default') {
        console.log('⚠️ Unknown permission state:', permission);
        return;
      }

      // Don't show if already dismissed recently (within 24 hours)
      const dismissedAt = localStorage.getItem('notification_modal_dismissed_at');
      if (dismissedAt) {
        const hoursSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
        if (hoursSinceDismissed < 24) {
          console.log('⏳ Modal dismissed recently, not showing modal');
          return;
        }
      }

      // Show modal after 3 seconds (give time for user to settle in)
      console.log('⏳ Scheduling modal to show in 3 seconds...');
      const timer = setTimeout(() => {
        console.log('📱 Showing notification permission modal');
        setShowModal(true);
      }, 3000);

      return () => clearTimeout(timer);
    });
  }, [isAuthenticated]);

  // Show prompt only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <PushNotificationPrompt />
      <NotificationPermissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <PaymentProvider>
        <div className="App">
          <Router>
            <PaymentStatusBanner />
            <PushNotificationManager />
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Router>
        </div>
      </PaymentProvider>
    </ThemeProvider>
  );
}

export default App;