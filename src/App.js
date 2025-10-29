import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import { Toaster } from 'react-hot-toast';
import AnimatedCounter from './components/AnimatedCounter';

// Import des vraies pages avec la logique API
import LoginPageAuth from './pages/auth/LoginPage';
import RegisterPageAuth from './pages/auth/RegisterPage';
import DashboardPageAuth from './pages/dashboard/DashboardPage';
import FormationsPageAuth from './pages/formations/FormationsPage';
import FormationDetailPageAuth from './pages/formations/FormationDetailPage';
import FormationLearnPageAuth from './pages/formations/FormationLearnPage';
import EbooksPageAuth from './pages/ebooks/EbooksPage';
import WalletPageAuth from './pages/wallet/WalletPage';
import QuizPage from './pages/quiz/QuizPage';
import QuizPlayPage from './pages/quiz/QuizPlayPage';
import QuizHistoryPage from './pages/quiz/QuizHistoryPage';
import ChallengesPage from './pages/challenges/ChallengesPage';
import AccountActivationPage from './pages/account/AccountActivationPage';
import ActivationReturnPage from './pages/account/ActivationReturnPage';
import AffiliatePageAuth from './pages/affiliate/AffiliatePage';
import ProtectedRoute from './components/ProtectedRoute';

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
                    placeholder="+237 6XX XXX XXX"
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

// Landing Page component with working navigation
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={logo} alt="Formaneo" className="h-20 w-20" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Fonctionnalités</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">À propos</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Tarifs</a>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Connexion
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-blue-600 font-medium text-sm">🚀 Plateforme n°1 en Afrique</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Apprenez, Progressez et<br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Gagnez de l'Argent
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              La première plateforme e-learning africaine qui vous récompense pour votre apprentissage. 
              Accédez à des milliers de formations et gagnez du cashback à chaque cours complété.
            </p>
            
            <div className="flex justify-center mb-12">
              <button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Commencer maintenant
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={50000} suffix="+" className="" />
                </div>
                <div className="text-gray-600">Étudiants actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={500} suffix="+" className="" />
                </div>
                <div className="text-gray-600">Formations disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={95} suffix="%" className="" />
                </div>
                <div className="text-gray-600">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ✨ Fonctionnalités innovantes
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Pourquoi choisir<br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                notre plateforme ?
              </span>
            </h2>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Une plateforme complète pour votre développement personnel et professionnel avec des fonctionnalités innovantes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Formations Complètes",
                description: "Accédez à des centaines de cours vidéo de qualité professionnelle dans tous les domaines",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: "💰",
                title: "Système de Cashback",
                description: "Gagnez de l'argent réel en complétant vos formations et quiz avec notre système unique",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: "🤝",
                title: "Programme d'Affiliation",
                description: "Parrainez vos amis et gagnez des commissions sur leurs achats et activités",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: "📚",
                title: "E-books Premium",
                description: "Bibliothèque complète de livres numériques pour approfondir vos connaissances",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                icon: "📱",
                title: "Paiement Mobile Money",
                description: "Payez facilement avec MTN, Orange, Moov ou Wave selon votre préférence",
                gradient: "from-teal-500 to-teal-600"
              },
              {
                icon: "🏆",
                title: "Certificats Reconnus",
                description: "Obtenez des certificats valides et reconnus à la fin de chaque formation",
                gradient: "from-yellow-500 to-yellow-600"
              }
            ].map((feature, index) => (
              <div key={index} className="relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border border-gray-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl filter drop-shadow-sm">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                💰 Revenus garantis
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Transformez votre<br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  apprentissage en revenus
                </span>
              </h2>
              <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
                Révolutionnez votre éducation en ligne avec un système unique qui récompense votre engagement et vos progrès.
              </p>
              <div className="space-y-8">
                {[
                  {
                    text: "Gagnez jusqu'à 2000 FCFA par formation complétée",
                    icon: "💵"
                  },
                  {
                    text: "Quiz gratuits avec récompenses quotidiennes",
                    icon: "🎯"
                  },
                  {
                    text: "Programme d'affiliation généreux jusqu'à 50%",
                    icon: "🤝"
                  },
                  {
                    text: "Cashback automatique sur tous vos achats",
                    icon: "🔄"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-xl">{benefit.icon}</span>
                    </div>
                    <span className="text-gray-800 font-semibold text-lg group-hover:text-green-600 transition-colors duration-300">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-[3rem] blur-3xl transform rotate-6"></div>
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-[3rem] p-10 text-white shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8">Bonus de bienvenue</h3>
                  <div className="text-8xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">2000</div>
                  <div className="text-2xl mb-8 font-semibold">FCFA offerts</div>
                  <div className="space-y-5">
                    {[
                      "5 quiz gratuits",
                      "Accès formation gratuite",
                      "Support prioritaire"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-4 h-4 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-lg font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à transformer votre vie ?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui apprennent et gagnent avec Formaneo. Votre succès commence aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Inscription gratuite
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200"
            >
              Se connecter
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
            <span>✓ Pas de carte bancaire requise</span>
            <span>✓ 5 quiz gratuits</span>
            <span>✓ Bonus de bienvenue 2000 FCFA</span>
            <span>✓ Support 24/7</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="Formaneo" className="h-10 w-auto filter brightness-0 invert" />
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme e-learning qui vous récompense pour votre apprentissage.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plateforme</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Formations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-books</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quiz</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certificats</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Communauté</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Formaneo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// App component with routes
const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPageAuth />} />
      <Route path="/register" element={<RegisterPageAuth />} />
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
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
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
  );
}

export default App;