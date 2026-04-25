import React from 'react';
import { WalletIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { WalletInfo } from '../../types/wallet.types';

interface WalletBalanceProps {
  walletInfo: WalletInfo;
  isLoading: boolean;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ walletInfo, isLoading }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-gray-900 rounded-xl p-6 text-white animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
            <div className="w-24 h-4 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="w-32 h-8 bg-white/20 rounded mb-4"></div>
        <div className="w-20 h-4 bg-white/20 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-gray-900 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <WalletIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold">Mon Portefeuille</h3>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-white/80 text-sm mb-1">Solde actuel</p>
        <p className="text-3xl font-bold">{formatAmount(walletInfo.balance)}</p>
      </div>
      
      {walletInfo.pending_withdrawals > 0 && (
        <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-200 text-sm">
            Retraits en attente: {formatAmount(walletInfo.pending_withdrawals)}
          </p>
        </div>
      )}
      
      <div className="flex items-center mt-4 text-green-300">
        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
        <span className="text-sm">+15% ce mois</span>
      </div>
    </div>
  );
};

export default WalletBalance;