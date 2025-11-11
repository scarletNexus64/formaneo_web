import React, { useState, useEffect } from 'react';
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
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { affiliateService, AffiliateStats, DetailedStats } from '../../services/affiliate.service';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// Chart will be added later when Chart.js is properly installed

const AffiliatePage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
            <h1 className="text-2xl font-bold text-brand-primary mb-4">Erreur de chargement</h1>
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-2">Programme d'Affiliation</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gagnez des commissions en parrainant de nouveaux utilisateurs</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
              {[
                { id: 'dashboard', label: 'Tableau de bord', icon: ChartBarIcon },
                { id: 'links', label: 'Mon Code Promo', icon: LinkIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-1 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Today's Earnings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Gains aujourd'hui</p>
                    <p className="text-lg sm:text-2xl font-bold text-brand-primary truncate">{formatPrice(stats.earnings.today)} <span className="text-sm sm:text-2xl">FCFA</span></p>
                    <div className="flex items-center mt-1">
                      {todayChange >= 0 ? (
                        <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${todayChange >= 0 ? 'text-green-500' : 'text-red-500'} truncate`}>
                        {Math.abs(todayChange).toFixed(1)}% vs hier
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Monthly Earnings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Gains ce mois</p>
                    <p className="text-lg sm:text-2xl font-bold text-brand-primary truncate">{formatPrice(stats.earnings.current_month)} <span className="text-sm sm:text-2xl">FCFA</span></p>
                    <div className="flex items-center mt-1">
                      {monthChange >= 0 ? (
                        <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${monthChange >= 0 ? 'text-green-500' : 'text-red-500'} truncate`}>
                        {Math.abs(monthChange).toFixed(1)}% vs mois dernier
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                  </div>
                </div>
              </div>

              {/* Total Affiliates */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total affiliés</p>
                    <p className="text-lg sm:text-2xl font-bold text-brand-primary">{stats.stats.registrations.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {stats.stats.registrations.monthly} ce mois
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Sous-affiliés Niveau 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Sous-affiliés (Niv. 2)</p>
                    <p className="text-lg sm:text-2xl font-bold text-brand-primary">{stats.stats.level2_affiliates?.total || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {stats.stats.level2_affiliates?.monthly || 0} ce mois
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-brand-primary mb-4">
                Évolution des commissions (7 derniers jours)
              </h3>
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
                        <div key={index} className="flex flex-col items-center flex-1 mx-1 group">
                          <div className="flex items-end space-x-1 mb-2 relative">
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              <div className="text-[10px] sm:text-xs">Commissions: {formatPrice(commissionValue)} FCFA</div>
                              <div className="text-[10px] sm:text-xs">Inscriptions: {signupValue}</div>
                            </div>

                            {/* Commission Bar */}
                            <div
                              className="bg-brand-primary rounded-t w-4 sm:w-5 transition-all duration-700 ease-out hover:bg-primary-700 cursor-pointer"
                              style={{
                                height: `${commissionHeight}px`,
                                animationDelay: `${index * 100}ms`
                              }}
                            ></div>
                            {/* Signup Bar */}
                            <div
                              className="bg-yellow-500 dark:bg-yellow-600 rounded-t w-4 sm:w-5 transition-all duration-700 ease-out hover:bg-yellow-600 dark:hover:bg-yellow-500 cursor-pointer"
                              style={{
                                height: `${signupHeight}px`,
                                animationDelay: `${index * 100 + 50}ms`
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center font-medium">{label}</span>
                        </div>
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
            </div>

            {/* Top Performers */}
            {detailedStats && detailedStats.top_performers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-brand-primary mb-4">
                  Top Performers de la semaine
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {detailedStats.top_performers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg gap-2">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="ml-2 sm:ml-3 font-medium text-brand-primary text-sm sm:text-base truncate">{performer.name}</span>
                      </div>
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold text-xs sm:text-sm whitespace-nowrap">
                        {formatPrice(performer.total_commission)} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Links & Codes Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            {/* Affiliate Link */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Votre lien d'affiliation
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={stats.affiliate_link}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                />
                <button
                  onClick={() => copyToClipboard(stats.affiliate_link, 'Lien d\'affiliation')}
                  className="px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                  Copier
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Partagez ce lien pour inviter de nouveaux utilisateurs et gagner des commissions
              </p>
            </div> */}

            {/* Promo Code - Only visible for active accounts */}
            {isAccountActive && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-brand-primary mb-4 flex items-center">
                  <GiftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Votre code promo
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={stats.promo_code}
                    readOnly
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-mono text-base sm:text-lg text-center sm:text-left"
                  />
                  <button
                    onClick={() => copyToClipboard(stats.promo_code, 'Code promo')}
                    className="px-4 py-2 sm:py-3 bg-yellow-500 dark:bg-yellow-600 text-brand-primary rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors flex items-center justify-center whitespace-nowrap"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                    Copier
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Les utilisateurs peuvent utiliser ce code lors de leur inscription
                </p>
              </div>
            )}

            {/* Commission Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-brand-primary mb-4">
                Comment ça marche ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-brand-primary text-sm sm:text-base">Niveau 1 - Commission directe</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                      Recevez <strong>2000 FCFA</strong> quand quelqu'un s'inscrit avec votre code et active son compte.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-sm mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-brand-primary text-sm sm:text-base">Niveau 2 - Commission indirecte</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                      Recevez <strong>1000 FCFA</strong> quand un de vos affiliés parraine quelqu'un qui a activé son compte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </ActivationGuard>
    </div>
  );
};

export default AffiliatePage;