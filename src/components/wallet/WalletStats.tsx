import React from 'react';
import { 
  TrophyIcon, 
  CurrencyDollarIcon, 
  GiftIcon, 
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import { WalletInfo } from '../../types/wallet.types';

interface WalletStatsProps {
  walletInfo: WalletInfo;
  isLoading: boolean;
}

const WalletStats: React.FC<WalletStatsProps> = ({ walletInfo, isLoading }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      name: 'Gains totaux',
      value: walletInfo.total_earned,
      icon: TrophyIcon,
      color: 'text-green-600 bg-green-50',
      description: 'Tous vos revenus cumulés'
    },
    {
      name: 'Commissions',
      value: walletInfo.total_commissions,
      icon: CurrencyDollarIcon,
      color: 'text-blue-600 bg-blue-50',
      description: 'Revenus d\'affiliation'
    },
    {
      name: 'Bonus & Récompenses',
      value: walletInfo.total_quiz_and_bonus,
      icon: GiftIcon,
      color: 'text-purple-600 bg-purple-50',
      description: 'Quiz et bonus divers'
    },
    {
      name: 'Retraits en attente',
      value: walletInfo.pending_withdrawals,
      icon: AcademicCapIcon,
      color: 'text-orange-600 bg-orange-50',
      description: 'En cours de traitement'
    }
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div 
              key={index}
              className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {stat.name}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {formatAmount(stat.value)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Résumé rapide */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Performance ce mois</p>
            <p className="text-lg font-semibold text-green-600">+15% 📈</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Objectif mensuel</p>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min((walletInfo.total_earned / 10000) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((walletInfo.total_earned / 10000) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletStats;