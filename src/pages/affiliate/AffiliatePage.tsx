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
      <div className="min-h-screen bg-formaneo-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-formaneo-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-primary mb-4">Erreur de chargement</h1>
            <p className="text-formaneo-gray-600">Impossible de charger les données d'affiliation</p>
          </div>
        </div>
      </div>
    );
  }

  // Chart data will be configured when Chart.js is installed

  const todayChange = calculatePercentageChange(stats.earnings.today, stats.earnings.yesterday);
  const monthChange = calculatePercentageChange(stats.earnings.current_month, stats.earnings.last_month);

  return (
    <div className="min-h-screen bg-formaneo-gray-50">
      <Navigation />
      
      <ActivationGuard action="accéder au programme d'affiliation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Programme d'Affiliation</h1>
          <p className="text-formaneo-gray-600">Gagnez des commissions en parrainant de nouveaux utilisateurs</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-formaneo-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Tableau de bord', icon: ChartBarIcon },
                { id: 'links', label: 'Liens & Codes', icon: LinkIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-formaneo-gray-500 hover:text-formaneo-gray-700 hover:border-formaneo-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Today's Earnings */}
              <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-formaneo-gray-600">Gains aujourd'hui</p>
                    <p className="text-2xl font-bold text-brand-primary">{formatPrice(stats.earnings.today)} FCFA</p>
                    <div className="flex items-center mt-1">
                      {todayChange >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${todayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(todayChange).toFixed(1)}% vs hier
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-formaneo-gold bg-opacity-10 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-formaneo-gold" />
                  </div>
                </div>
              </div>

              {/* Monthly Earnings */}
              <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-formaneo-gray-600">Gains ce mois</p>
                    <p className="text-2xl font-bold text-brand-primary">{formatPrice(stats.earnings.current_month)} FCFA</p>
                    <div className="flex items-center mt-1">
                      {monthChange >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${monthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(monthChange).toFixed(1)}% vs le mois dernier
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-brand-primary" />
                  </div>
                </div>
              </div>

              {/* Total Affiliates */}
              <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-formaneo-gray-600">Total affiliés</p>
                    <p className="text-2xl font-bold text-brand-primary">{stats.stats.registrations.total}</p>
                    <p className="text-xs text-formaneo-gray-500 mt-1">
                      {stats.stats.registrations.monthly} ce mois
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Sous-affiliés Niveau 2 */}
              <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-formaneo-gray-600">Sous-affiliés (Niveau 2)</p>
                    <p className="text-2xl font-bold text-brand-primary">{stats.stats.level2_affiliates?.total || 0}</p>
                    <p className="text-xs text-formaneo-gray-500 mt-1">
                      {stats.stats.level2_affiliates?.monthly || 0} ce mois
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-primary mb-4">
                Évolution des commissions (7 derniers jours)
              </h3>
              <div className="h-64 relative">
                {/* Grid Background */}
                <div className="absolute inset-0 ml-12">
                  <div className="h-full w-full relative">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-formaneo-gray-100" 
                        style={{ top: `${i * 25}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-xs text-formaneo-gray-500">
                  {detailedStats?.chart_data.datasets[0]?.data && (() => {
                    const maxValue = Math.max(...detailedStats.chart_data.datasets[0].data);
                    return [maxValue, Math.floor(maxValue * 0.75), Math.floor(maxValue * 0.5), Math.floor(maxValue * 0.25), 0].map((value, i) => (
                      <span key={i} className="text-right pr-2">{formatPrice(value)}</span>
                    ));
                  })()}
                </div>
                
                <div className="flex items-end justify-between h-full pt-4 ml-12">
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
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-formaneo-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            <div>Commissions: {formatPrice(commissionValue)} FCFA</div>
                            <div>Inscriptions: {signupValue}</div>
                          </div>
                          
                          {/* Commission Bar */}
                          <div 
                            className="bg-brand-primary rounded-t w-5 transition-all duration-700 ease-out hover:bg-primary-700 cursor-pointer"
                            style={{ 
                              height: `${commissionHeight}px`,
                              animationDelay: `${index * 100}ms`
                            }}
                          ></div>
                          {/* Signup Bar */}
                          <div 
                            className="bg-formaneo-gold rounded-t w-5 transition-all duration-700 ease-out hover:bg-secondary-600 cursor-pointer"
                            style={{ 
                              height: `${signupHeight}px`,
                              animationDelay: `${index * 100 + 50}ms`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-formaneo-gray-600 text-center font-medium">{label}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-brand-primary rounded mr-2"></div>
                    <span className="text-sm text-formaneo-gray-600">Commissions (FCFA)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-formaneo-gold rounded mr-2"></div>
                    <span className="text-sm text-formaneo-gray-600">Inscriptions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            {detailedStats && detailedStats.top_performers.length > 0 && (
              <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
                <h3 className="text-lg font-semibold text-brand-primary mb-4">
                  Top Performers de la semaine
                </h3>
                <div className="space-y-4">
                  {detailedStats.top_performers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-formaneo-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-formaneo-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="ml-3 font-medium text-brand-primary">{performer.name}</span>
                      </div>
                      <span className="text-formaneo-gold font-semibold">
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
            <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
              <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Votre lien d'affiliation
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={stats.affiliate_link}
                  readOnly
                  className="flex-1 px-4 py-3 border border-formaneo-gray-300 rounded-lg bg-formaneo-gray-50 text-formaneo-gray-700"
                />
                <button
                  onClick={() => copyToClipboard(stats.affiliate_link, 'Lien d\'affiliation')}
                  className="px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                  Copier
                </button>
              </div>
              <p className="text-sm text-formaneo-gray-600 mt-2">
                Partagez ce lien pour inviter de nouveaux utilisateurs et gagner des commissions
              </p>
            </div>

            {/* Promo Code - Only visible for active accounts */}
            {isAccountActive && (
              <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
                <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center">
                  <GiftIcon className="w-5 h-5 mr-2" />
                  Votre code promo
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={stats.promo_code}
                    readOnly
                    className="flex-1 px-4 py-3 border border-formaneo-gray-300 rounded-lg bg-formaneo-gray-50 text-formaneo-gray-700 font-mono text-lg"
                  />
                  <button
                    onClick={() => copyToClipboard(stats.promo_code, 'Code promo')}
                    className="px-4 py-3 bg-formaneo-gold text-brand-primary rounded-lg hover:bg-secondary-600 transition-colors flex items-center"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                    Copier
                  </button>
                </div>
                <p className="text-sm text-formaneo-gray-600 mt-2">
                  Les utilisateurs peuvent utiliser ce code lors de leur inscription
                </p>
              </div>
            )}

            {/* Commission Info */}
            <div className="bg-white rounded-xl border border-formaneo-gray-200 p-6">
              <h3 className="text-lg font-semibold text-brand-primary mb-4">
                Comment ça marche ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-primary">Niveau 1 - Commission directe</h4>
                    <p className="text-formaneo-gray-600">
                      Recevez <strong>2000 FCFA</strong> quand quelqu'un s'inscrit avec votre code et fait un achat
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-formaneo-gold bg-opacity-20 rounded-full flex items-center justify-center text-formaneo-gold font-bold text-sm mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-primary">Niveau 2 - Commission indirecte</h4>
                    <p className="text-formaneo-gray-600">
                      Recevez <strong>1000 FCFA</strong> quand un de vos affiliés parraine quelqu'un qui fait un achat
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