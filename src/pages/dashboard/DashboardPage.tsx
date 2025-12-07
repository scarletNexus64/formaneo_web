import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { dashboardService, DashboardStats, FormationProgress, RecentActivity } from '../../services/dashboard.service';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';
import apiService from '../../services/api.service';
import { ENDPOINTS } from '../../config/api.config';
import { generateAffiliateLink } from '../../utils/affiliateUtils';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [inProgressFormations, setInProgressFormations] = useState<FormationProgress[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPromoCode, setIsEditingPromoCode] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailability, setCodeAvailability] = useState<{ available: boolean; message: string; is_current?: boolean } | null>(null);
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      console.log('🎯 DashboardPage: Loading dashboard data...');
      setIsLoading(true);
      
      try {
        // Charger toutes les données en parallèle
        const [stats, formations, activities] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getInProgressFormations(),
          dashboardService.getRecentActivity(),
        ]);
        
        console.log('✅ Dashboard data loaded:', { stats, formations, activities });
        
        setDashboardStats(stats);
        setInProgressFormations(formations);
        setRecentActivities(activities);
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        // En cas d'erreur, garder les données par défaut
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Fonction pour calculer le pourcentage de changement du solde
  const getBalanceChange = () => {
    if (!dashboardStats?.wallet) return '+0%';
    const totalEarned = dashboardStats.wallet.total_earned;
    const balance = dashboardStats.wallet.balance;
    if (balance === 0) return '+0%';
    const changePercent = ((totalEarned / balance) * 100).toFixed(1);
    return `+${changePercent}%`;
  };

  // Fonction pour formater la durée restante
  const formatRemainingDuration = (totalMinutes: number, progress: number) => {
    const remainingMinutes = Math.round(totalMinutes * (100 - progress) / 100);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min restantes`;
    }
    return `${minutes}min restantes`;
  };

  // Fonction pour formater le temps de dernière vue
  const formatLastWatched = (completedAt: string | null) => {
    if (!completedAt) return 'Jamais vu';
    
    const date = new Date(completedAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    const days = Math.floor(diffInHours / 24);
    return `${days}j`;
  };

  // Fonction pour obtenir l'icône d'activité
  const getActivityIcon = (iconName: string) => {
    const iconClass = "w-5 h-5";
    const iconMap: { [key: string]: JSX.Element } = {
      'UserGroupIcon': <UserGroupIcon className={`${iconClass} text-orange-500`} />,
      'ChartBarIcon': <ChartBarIcon className={`${iconClass} text-purple-500`} />,
      'AcademicCapIcon': <AcademicCapIcon className={`${iconClass} text-blue-500`} />,
      'ArrowDownIcon': <ArrowDownIcon className={`${iconClass} text-green-500`} />,
      'ArrowUpIcon': <ArrowUpIcon className={`${iconClass} text-red-500`} />,
      'BookOpenIcon': <BookOpenIcon className={`${iconClass} text-indigo-500`} />,
      'CurrencyDollarIcon': <CurrencyDollarIcon className={`${iconClass} text-gray-500`} />,
    };
    
    return iconMap[iconName] || <CurrencyDollarIcon className={`${iconClass} text-gray-500`} />;
  };

  // Fonction pour copier dans le presse-papiers
  const copyToClipboard = async (text: string, type: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success(`${type} copié dans le presse-papiers !`);
      } else {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          toast.success(`${type} copié dans le presse-papiers !`);
        } catch (err) {
          toast.error('Erreur lors de la copie');
        }

        document.body.removeChild(textArea);
      }
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  // Fonction pour vérifier la disponibilité du code promo
  const checkPromoCode = async (code: string) => {
    if (!code || code.length < 3) {
      setCodeAvailability(null);
      return;
    }

    try {
      setIsCheckingCode(true);
      const response = await apiService.post(ENDPOINTS.AFFILIATE.CHECK_PROMO_CODE, {
        promo_code: code
      });
      setCodeAvailability(response.data);
    } catch (error: any) {
      setCodeAvailability({
        available: false,
        message: error.response?.data?.message || 'Erreur lors de la vérification'
      });
    } finally {
      setIsCheckingCode(false);
    }
  };

  // Fonction pour mettre à jour le code promo
  const handleUpdatePromoCode = async () => {
    if (!newPromoCode || newPromoCode.length < 3) {
      toast.error('Le code promo doit contenir au moins 3 caractères');
      return;
    }

    if (!codeAvailability?.available || codeAvailability?.is_current) {
      toast.error('Veuillez choisir un code promo disponible');
      return;
    }

    try {
      setIsUpdatingCode(true);
      const response = await apiService.put(ENDPOINTS.AFFILIATE.UPDATE_PROMO_CODE, {
        promo_code: newPromoCode
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Recharger les données de l'utilisateur
        window.location.reload(); // Recharger la page pour mettre à jour le code promo
        setIsEditingPromoCode(false);
        setNewPromoCode('');
        setCodeAvailability(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du code promo');
    } finally {
      setIsUpdatingCode(false);
    }
  };

  // Gérer le changement du code promo avec debounce
  useEffect(() => {
    if (isEditingPromoCode && newPromoCode) {
      const timer = setTimeout(() => {
        checkPromoCode(newPromoCode);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [newPromoCode, isEditingPromoCode]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bon matin';
    if (hour < 17) return 'Bon après-midi';
    return 'Bonsoir';
  };


  const stats = [
    {
      title: 'Solde disponible',
      value: showBalance 
        ? `${dashboardStats?.wallet?.balance?.toLocaleString('fr-FR') || user?.balance?.toLocaleString('fr-FR') || 0} FCFA` 
        : '••••••',
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      change: getBalanceChange(),
      changeType: 'increase',
      bgColor: 'bg-gradient-to-r from-green-400 to-green-600',
      iconColor: 'text-white'
    },
    {
      title: 'Formations en cours',
      value: dashboardStats?.formations?.in_progress?.toString() || '0',
      icon: <AcademicCapIcon className="w-6 h-6" />,
      change: `${dashboardStats?.formations?.completed_formations || 0} terminées`,
      changeType: 'neutral',
      bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
      iconColor: 'text-white'
    },
    {
      title: 'Quiz restants',
      value: user?.free_quizzes_left?.toString() || '5',
      icon: <ChartBarIcon className="w-6 h-6" />,
      change: 'Gratuits',
      changeType: 'neutral',
      bgColor: 'bg-gradient-to-r from-purple-400 to-purple-600',
      iconColor: 'text-white'
    },
    {
      title: 'Parrainages',
      value: dashboardStats?.affiliate?.total_registrations?.toString() || '0',
      icon: <UserGroupIcon className="w-6 h-6" />,
      change: `${dashboardStats?.affiliate?.monthly_registrations || 0} ce mois`,
      changeType: dashboardStats?.affiliate?.monthly_registrations ? 'increase' : 'neutral',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      iconColor: 'text-white'
    }
  ];

  const quickActions = [
    {
      title: 'Portefeuille',
      description: 'Gérez vos finances',
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      route: '/wallet'
    },
    {
      title: 'Formations',
      description: 'Accédez à vos cours',
      icon: <AcademicCapIcon className="w-8 h-8" />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      route: '/formations'
    },
    {
      title: 'Parrainer',
      description: 'Invitez et gagnez',
      icon: <UserGroupIcon className="w-8 h-8" />,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      route: '/affiliate'
    }
  ];

  const services = [
    {
      title: 'E-books',
      description: 'Bibliothèque numérique',
      icon: <BookOpenIcon className="w-8 h-8" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      route: '/ebooks'
    },
    {
      title: 'Quiz Récompensés',
      description: 'Testez vos connaissances',
      icon: <ChartBarIcon className="w-8 h-8" />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      route: '/quizz'
    }
  ];

  // Données par défaut temporaires si pas encore chargées
  const defaultCourses = [
    {
      id: 1,
      title: 'Dropshipping Mastery 2025',
      progress: 75,
      duration: '4h 30min restantes',
      thumbnail: '/api/placeholder/300/200',
      lastWatched: '2h'
    },
    {
      id: 2,
      title: 'Facebook Ads pour E-commerce',
      progress: 45,
      duration: '2h 15min restantes',
      thumbnail: '/api/placeholder/300/200',
      lastWatched: '1j'
    }
  ];

  const defaultActivities = [
    {
      type: 'quiz',
      title: 'Quiz Marketing Digital complété',
      amount: '+150 FCFA',
      time: 'Il y a 2h',
      icon: <ChartBarIcon className="w-5 h-5 text-purple-500" />
    },
    {
      type: 'affiliate',
      title: 'Nouveau membre via votre lien',
      amount: '+2500 FCFA',
      time: 'Il y a 5h',
      icon: <UserGroupIcon className="w-5 h-5 text-orange-500" />
    }
  ];

  // Computed values - these will be calculated in the render method

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700 rounded-xl p-8 text-white shadow-lg border border-primary-500 dark:border-primary-600">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'Apprenant'} ! 👋
                </h1>
                <p className="text-primary-100 dark:text-primary-200 mb-4">
                  Continuez votre parcours d'apprentissage
                </p>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/formations"
                    className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Continuer l'apprentissage
                  </Link>
                  <Link
                    to="/quizz"
                    className="border border-white dark:border-gray-300 text-white dark:text-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-white/10 dark:hover:bg-white/20 transition-colors"
                  >
                    Faire un quiz
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block text-right">
                <p className="text-sm text-primary-200 dark:text-primary-300 mb-1">
                  {currentTime.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xl font-semibold">
                  {currentTime.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <div className="mt-4 flex items-center space-x-2">
                  <FireIcon className="w-4 h-4 text-orange-300 dark:text-orange-400" />
                  <span className="text-sm text-primary-200 dark:text-primary-300">{dashboardStats?.formations?.in_progress || 0} formations en cours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.iconColor}>
                    {stat.icon}
                  </div>
                </div>
                {stat.title === 'Solde disponible' && (
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                  >
                    {showBalance ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'increase' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <ArrowUpIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">{stat.change}</span>
                    </div>
                  )}
                  {stat.changeType === 'decrease' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <ArrowDownIcon className="w-3 h-3 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">{stat.change}</span>
                    </div>
                  )}
                  {stat.changeType === 'neutral' && (
                    <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{stat.change}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actions Rapides</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Accès direct aux fonctions principales</p>
                </div>
                <SparklesIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {quickActions.map((action, index) => (
                  <div key={action.title} className="group cursor-pointer">
                    <Link to={action.route}>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover:shadow-sm text-center">
                        <div className={`inline-flex p-4 rounded-lg ${action.color} ${action.hoverColor} transition-colors mb-4`}>
                          <div className="text-white">
                            {action.icon}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Other Services */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Autres Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <div key={service.title} className="group cursor-pointer">
                      <Link to={service.route}>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors hover:shadow-sm">
                          <div className={`inline-flex p-3 rounded-lg ${service.color} ${service.hoverColor} transition-colors mb-3`}>
                            <div className="text-white">
                              {service.icon}
                            </div>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {service.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Learning Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continuer l'Apprentissage</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Reprenez là où vous vous êtes arrêté</p>
                </div>
                <Link to="/formations" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                  Voir toutes
                </Link>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-16 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : inProgressFormations.length > 0 ? (
                  inProgressFormations.map((formation, index) => (
                    <Link
                      key={formation.id || index}
                      to={`/formations/${formation.id}`}
                      className="block"
                    >
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <div className="flex-shrink-0 relative">
                          <div className="w-16 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <PlayIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="absolute inset-0 bg-primary-600 dark:bg-primary-700 bg-opacity-80 rounded-lg flex items-center justify-center">
                            <PlayIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">{formation.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-primary-500 dark:bg-primary-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.round(formation.progress)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(formation.progress)}%</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatRemainingDuration(formation.duration_minutes, formation.progress)}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Vu {formatLastWatched(formation.completed_at)}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  // État vide : l'utilisateur n'a pas de formations en cours
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AcademicCapIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucune formation en cours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Commencez votre parcours d'apprentissage dès aujourd'hui !
                    </p>
                    <Link
                      to="/formations"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                    >
                      <AcademicCapIcon className="w-5 h-5 mr-2" />
                      Découvrir les formations
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activité Récente</h3>
                <Link to="/wallet" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  // Skeleton loader pour les activités
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mt-1"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                    </div>
                  ))
                ) : recentActivities.length > 0 && user?.account_status === 'active' ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={`${activity.type}-${index}`}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">{activity.amount}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {user?.account_status !== 'active'
                        ? 'Activez votre compte pour voir votre activité'
                        : 'Aucune activité récente'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700 rounded-xl p-6 text-white shadow-lg border border-primary-500 dark:border-primary-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Votre Code Promo</h3>
                <div className="flex items-center space-x-2">
                  {user?.account_status === 'active' && !isEditingPromoCode && (
                    <button
                      onClick={() => {
                        setIsEditingPromoCode(true);
                        setNewPromoCode(user?.promo_code || '');
                      }}
                      className="text-white hover:text-primary-200 flex items-center text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                  )}
                  <StarIcon className="w-5 h-5" />
                </div>
              </div>

              {!isEditingPromoCode ? (
                <>
                  <div className="bg-white/20 dark:bg-white/10 rounded-lg p-3 mb-3 backdrop-blur-sm">
                    <p className="font-mono text-lg font-bold text-center">
                      {user?.account_status === 'active'
                        ? (user?.promo_code || 'LOADING...')
                        : '****'
                      }
                    </p>
                  </div>
                  {user?.account_status === 'active' && (
                    <button
                      onClick={() => copyToClipboard(user?.promo_code || '', 'Code promo')}
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center mb-3"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                      Copier le code
                    </button>
                  )}
                  <p className="text-primary-100 dark:text-primary-200 text-sm text-center">
                    {user?.account_status === 'active'
                      ? 'Partagez et gagnez des commissions !'
                      : 'Activez votre compte pour voir votre code'
                    }
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => {
                        // Convertir en majuscules et accepter uniquement alphanumérique
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (value.length <= 20) {
                          setNewPromoCode(value);
                        }
                      }}
                      placeholder="Entrez votre nouveau code"
                      className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white font-mono text-lg text-center placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                    {isCheckingCode && (
                      <p className="text-xs text-white/70 mt-1 text-center">
                        Vérification...
                      </p>
                    )}
                    {codeAvailability && !isCheckingCode && (
                      <p className={`text-xs mt-1 text-center ${
                        codeAvailability.available
                          ? codeAvailability.is_current
                            ? 'text-white/70'
                            : 'text-green-200'
                          : 'text-red-200'
                      }`}>
                        {codeAvailability.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdatePromoCode}
                      disabled={isUpdatingCode || !codeAvailability?.available || codeAvailability?.is_current || isCheckingCode}
                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      {isUpdatingCode ? 'Mise à jour...' : 'Enregistrer'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPromoCode(false);
                        setNewPromoCode('');
                        setCodeAvailability(null);
                      }}
                      disabled={isUpdatingCode}
                      className="flex-1 px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                    >
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Annuler
                    </button>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-lg p-2">
                    <p className="text-xs text-white/80">
                      <strong>Conseil :</strong> Utilisez 3 à 20 caractères alphanumériques uniquement.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Affiliate Link */}
            {user?.account_status === 'active' && user?.promo_code && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Lien d'Affiliation
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Partagez ce lien pour inviter vos amis. Ils seront automatiquement redirigés vers la page d'inscription avec votre code promo prérempli.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={generateAffiliateLink(user.promo_code)}
                    readOnly
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(generateAffiliateLink(user.promo_code), 'Lien d\'affiliation')}
                    className="px-4 py-2 sm:py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center justify-center whitespace-nowrap"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                  </button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Astuce :</strong> Partagez ce lien sur les réseaux sociaux, par email ou par message pour maximiser vos chances de parrainages !
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;