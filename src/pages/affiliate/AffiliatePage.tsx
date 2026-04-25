import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  GiftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon,
  CreditCardIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { affiliateService, AffiliateStats, DetailedStats } from '../../services/affiliate.service';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import apiService from '../../services/api.service';
import { ENDPOINTS } from '../../config/api.config';
import { generateAffiliateLink } from '../../utils/affiliateUtils';

// Chart will be added later when Chart.js is properly installed

const AffiliatePage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingPromoCode, setIsEditingPromoCode] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailability, setCodeAvailability] = useState<{ available: boolean; message: string; is_current?: boolean } | null>(null);
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  const isAccountActive = user?.account_status === 'active';

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      setIsLoading(true);
      const [dashboardData, detailedData] = await Promise.all([
        affiliateService.getDashboard(),
        affiliateService.getDetailedStats()
      ]);
      
      setStats(dashboardData);
      setDetailedStats(detailedData);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast.error('Erreur lors du chargement des données d\'affiliation');
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
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
        // Recharger les données d'affiliation
        await loadAffiliateData();
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

  // Chart options will be added when Chart.js is installed

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur de chargement</h1>
            <p className="text-gray-600 dark:text-gray-400">Impossible de charger les données d'affiliation</p>
          </div>
        </div>
      </div>
    );
  }

  // Chart data will be configured when Chart.js is installed

  const todayChange = calculatePercentageChange(stats.earnings.today, stats.earnings.yesterday);
  const monthChange = calculatePercentageChange(stats.earnings.current_month, stats.earnings.last_month);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <ActivationGuard action="accéder au programme d'affiliation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-xl"
        >
          {/* Subtle animated background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <FireIcon className="h-8 w-8 sm:h-10 sm:w-10 mr-3 text-orange-300 dark:text-orange-400" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold">Programme d'Affiliation</h1>
              </div>
              <p className="text-sm sm:text-base text-red-100 dark:text-red-200 mb-4">
                Gagnez des commissions en parrainant de nouveaux utilisateurs
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">2000 FCFA / parrainage direct</span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <UserGroupIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">1000 FCFA / sous-parrainage</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
              {[
                { id: 'dashboard', label: 'Tableau de bord', icon: ChartBarIcon },
                { id: 'links', label: 'Mon Code Promo', icon: LinkIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center px-1 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Today's Earnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Gains aujourd'hui</p>
                    <motion.p
                      key={stats.earnings.today}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"
                    >
                      {formatPrice(stats.earnings.today)} <span className="text-sm sm:text-2xl">FCFA</span>
                    </motion.p>
                    <div className="flex items-center mt-1">
                      {todayChange >= 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full"
                        >
                          <ArrowUpIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 truncate">
                            {Math.abs(todayChange).toFixed(1)}% vs hier
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full"
                        >
                          <ArrowDownIcon className="w-3 h-3 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-medium text-red-600 dark:text-red-400 truncate">
                            {Math.abs(todayChange).toFixed(1)}% vs hier
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  >
                    <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Monthly Earnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Gains ce mois</p>
                    <motion.p
                      key={stats.earnings.current_month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate"
                    >
                      {formatPrice(stats.earnings.current_month)} <span className="text-sm sm:text-2xl">FCFA</span>
                    </motion.p>
                    <div className="flex items-center mt-1">
                      {monthChange >= 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full"
                        >
                          <ArrowUpIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 truncate">
                            {Math.abs(monthChange).toFixed(1)}% vs mois dernier
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full"
                        >
                          <ArrowDownIcon className="w-3 h-3 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-medium text-red-600 dark:text-red-400 truncate">
                            {Math.abs(monthChange).toFixed(1)}% vs mois dernier
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  >
                    <ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Total Affiliates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total affiliés</p>
                    <motion.p
                      key={stats.stats.registrations.total}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {stats.stats.registrations.total}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="inline-block px-2 py-1 mt-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                        {stats.stats.registrations.monthly} ce mois
                      </span>
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  >
                    <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Sous-affiliés Niveau 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Sous-affiliés (Niv. 2)</p>
                    <motion.p
                      key={stats.stats.level2_affiliates?.total || 0}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {stats.stats.level2_affiliates?.total || 0}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="inline-block px-2 py-1 mt-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                        {stats.stats.level2_affiliates?.monthly || 0} ce mois
                      </span>
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  >
                    <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <ChartBarIcon className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                  </motion.div>
                  Évolution des commissions (7 derniers jours)
                </h3>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="h-64 relative min-w-[500px] sm:min-w-0">
                  {/* Grid Background */}
                  <div className="absolute inset-0 ml-8 sm:ml-12">
                    <div className="h-full w-full relative">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="absolute w-full border-t border-gray-100 dark:border-gray-700"
                          style={{ top: `${i * 25}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full w-8 sm:w-12 flex flex-col justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    {detailedStats?.chart_data.datasets[0]?.data && (() => {
                      const maxValue = Math.max(...detailedStats.chart_data.datasets[0].data);
                      return [maxValue, Math.floor(maxValue * 0.75), Math.floor(maxValue * 0.5), Math.floor(maxValue * 0.25), 0].map((value, i) => (
                        <span key={i} className="text-right pr-1 sm:pr-2 truncate">{formatPrice(value)}</span>
                      ));
                    })()}
                  </div>

                  <div className="flex items-end justify-between h-full pt-4 ml-8 sm:ml-12">
                    {detailedStats?.chart_data.labels.map((label, index) => {
                      const commissionValue = detailedStats.chart_data.datasets[0]?.data[index] || 0;
                      const signupValue = detailedStats.chart_data.datasets[1]?.data[index] || 0;
                      const maxValue = Math.max(...(detailedStats.chart_data.datasets[0]?.data || [0]));
                      const commissionHeight = maxValue > 0 ? (commissionValue / maxValue) * 180 : 0;
                      const signupHeight = Math.max(signupValue * 15, 3); // Base height for visibility

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                          className="flex flex-col items-center flex-1 mx-1 group"
                        >
                          <div className="flex items-end space-x-1 mb-2 relative">
                            {/* Hover tooltip */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl"
                            >
                              <div className="text-[10px] sm:text-xs font-medium">Commissions: {formatPrice(commissionValue)} FCFA</div>
                              <div className="text-[10px] sm:text-xs">Inscriptions: {signupValue}</div>
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                              </div>
                            </motion.div>

                            {/* Commission Bar */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${commissionHeight}px` }}
                              transition={{ delay: 0.9 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                              whileHover={{ scale: 1.05 }}
                              className="bg-gradient-to-t from-brand-primary to-red-400 rounded-t w-4 sm:w-5 hover:from-red-700 hover:to-red-500 cursor-pointer shadow-sm"
                            ></motion.div>
                            {/* Signup Bar */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${signupHeight}px` }}
                              transition={{ delay: 0.95 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                              whileHover={{ scale: 1.05 }}
                              className="bg-gradient-to-t from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 rounded-t w-4 sm:w-5 hover:from-yellow-600 hover:to-yellow-500 dark:hover:from-yellow-500 dark:hover:to-yellow-400 cursor-pointer shadow-sm"
                            ></motion.div>
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center font-medium">{label}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-brand-primary rounded mr-2 flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Commissions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 rounded mr-2 flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Inscriptions</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Performers */}
            {detailedStats && detailedStats.top_performers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <SparklesIcon className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Top Performers de la semaine
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {detailedStats.top_performers.map((performer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + index * 0.1, duration: 0.3 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900/50 rounded-xl gap-2 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 shadow-md ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            'bg-gradient-to-br from-blue-400 to-gray-900'
                          }`}
                        >
                          {index + 1}
                        </motion.div>
                        <span className="ml-2 sm:ml-3 font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{performer.name}</span>
                      </div>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.7 + index * 0.1, type: "spring", stiffness: 200 }}
                        className="text-yellow-600 dark:text-yellow-400 font-semibold text-xs sm:text-sm whitespace-nowrap"
                      >
                        {formatPrice(performer.total_commission)} FCFA
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Links & Codes Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            {/* Affiliate Link - Only visible for active accounts */}
            {isAccountActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600 dark:text-red-400" />
                  </motion.div>
                  Votre lien d'affiliation
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={generateAffiliateLink(stats.promo_code)}
                    readOnly
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => copyToClipboard(generateAffiliateLink(stats.promo_code), 'Lien d\'affiliation')}
                    className="relative px-4 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-gray-800 text-white rounded-lg transition-all flex items-center justify-center whitespace-nowrap overflow-hidden group shadow-md hover:shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    <DocumentDuplicateIcon className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">Copier</span>
                  </motion.button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Partagez ce lien pour inviter de nouveaux utilisateurs. Ils seront automatiquement redirigés vers l'inscription avec votre code promo prérempli.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Astuce :</strong> Partagez ce lien sur les réseaux sociaux, par email ou par message pour maximiser vos parrainages et gagner des commissions !
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Promo Code - Only visible for active accounts */}
            {isAccountActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <GiftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                    </motion.div>
                    Votre code promo
                  </h3>
                  {!isEditingPromoCode && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditingPromoCode(true);
                        setNewPromoCode(stats.promo_code);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Modifier
                    </motion.button>
                  )}
                </div>

                {!isEditingPromoCode ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={stats.promo_code}
                        readOnly
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-mono text-base sm:text-lg text-center sm:text-left focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => copyToClipboard(stats.promo_code, 'Code promo')}
                        className="relative px-4 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white rounded-lg transition-all flex items-center justify-center whitespace-nowrap overflow-hidden group shadow-md hover:shadow-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        <DocumentDuplicateIcon className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10">Copier</span>
                      </motion.button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Les utilisateurs peuvent utiliser ce code lors de leur inscription
                    </p>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1">
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
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-mono text-base sm:text-lg text-center sm:text-left focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                          />
                          {isCheckingCode && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Vérification...
                            </p>
                          )}
                          {codeAvailability && !isCheckingCode && (
                            <p className={`text-xs mt-1 ${
                              codeAvailability.available
                                ? codeAvailability.is_current
                                  ? 'text-gray-500 dark:text-gray-400'
                                  : 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {codeAvailability.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdatePromoCode}
                            disabled={isUpdatingCode || !codeAvailability?.available || codeAvailability?.is_current || isCheckingCode}
                            className="px-4 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="px-4 py-2 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center whitespace-nowrap"
                          >
                            <XMarkIcon className="w-4 h-4 mr-1" />
                            Annuler
                          </button>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                          <strong>Conseils :</strong> Utilisez 3 à 20 caractères alphanumériques uniquement. Le code sera converti en majuscules automatiquement.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Commission Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl shadow-sm border border-blue-200 dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <SparklesIcon className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                </motion.div>
                Comment ça marche ?
              </h3>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="flex items-start p-3 rounded-xl bg-white/50 dark:bg-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 sm:mr-4 mt-1 flex-shrink-0 shadow-md"
                  >
                    1
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Niveau 1 - Commission directe</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                      Recevez <strong className="text-green-600 dark:text-green-400">2000 FCFA</strong> quand quelqu'un s'inscrit avec votre code et active son compte.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="flex items-start p-3 rounded-xl bg-white/50 dark:bg-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 sm:mr-4 mt-1 flex-shrink-0 shadow-md"
                  >
                    2
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Niveau 2 - Commission indirecte</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                      Recevez <strong className="text-yellow-600 dark:text-yellow-400">1000 FCFA</strong> quand un de vos affiliés parraine quelqu'un qui a activé son compte.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
        </div>
      </ActivationGuard>
    </div>
  );
};

export default AffiliatePage;