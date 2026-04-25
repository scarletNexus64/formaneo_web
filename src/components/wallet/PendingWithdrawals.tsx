import React from 'react';
import { 
  ClockIcon, 
  BanknotesIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { WalletInfo } from '../../types/wallet.types';

interface PendingWithdrawalsProps {
  walletInfo: WalletInfo;
  isLoading: boolean;
  onWithdraw?: () => void;
}

const PendingWithdrawals: React.FC<PendingWithdrawalsProps> = ({ walletInfo, isLoading, onWithdraw }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const minWithdrawalAmount = 500; // Montant minimum pour retrait (CinetPay)
  const canWithdraw = walletInfo.available_for_withdrawal >= minWithdrawalAmount;
  const hasPendingWithdrawals = walletInfo.pending_withdrawals > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-48 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="w-32 h-8 bg-gray-200 rounded mb-4"></div>
        <div className="w-full h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${canWithdraw ? 'bg-green-50' : 'bg-gray-50'}`}>
          <BanknotesIcon className={`w-5 h-5 ${canWithdraw ? 'text-green-600' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Disponible pour retrait
        </h3>
      </div>

      <div className="mb-6">
        <p className={`text-3xl font-bold ${canWithdraw ? 'text-green-600' : 'text-gray-400'}`}>
          {formatAmount(walletInfo.available_for_withdrawal)}
        </p>
        {!canWithdraw && (
          <p className="text-sm text-gray-500 mt-1">
            Minimum requis : {formatAmount(minWithdrawalAmount)}
          </p>
        )}
      </div>

      {/* Retraits en attente */}
      {hasPendingWithdrawals && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium text-orange-800">
              Retraits en cours de traitement
            </p>
          </div>
          <p className="text-lg font-semibold text-orange-800">
            {formatAmount(walletInfo.pending_withdrawals)}
          </p>
          <p className="text-xs text-orange-600 mt-1">
            Vos retraits sont traités en arrière-plan et seront crédités sous 24-48h
          </p>
        </div>
      )}

      {/* Avertissement si pas assez de fonds */}
      {!canWithdraw && walletInfo.available_for_withdrawal > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">
              Montant insuffisant
            </p>
          </div>
          <p className="text-xs text-yellow-600">
            Il vous manque {formatAmount(minWithdrawalAmount - walletInfo.available_for_withdrawal)} pour effectuer un retrait
          </p>
        </div>
      )}

      {/* Bouton de retrait */}
      <button
        disabled={!canWithdraw}
        onClick={onWithdraw}
        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
          canWithdraw
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <BanknotesIcon className="w-5 h-5" />
          <span>
            {canWithdraw ? 'Initier un retrait' : 'Retrait indisponible'}
          </span>
        </div>
      </button>

      {canWithdraw && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Les retraits sont traités automatiquement en arrière-plan
        </p>
      )}
    </div>
  );
};

export default PendingWithdrawals;