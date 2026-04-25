import React, { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import DepositModal from './DepositModal';
import WithdrawalModal from './WithdrawalModal';
import { WalletInfo } from '../../types/wallet.types';

interface WalletActionsProps {
  walletInfo: WalletInfo;
  onTransactionComplete: () => void;
  triggerWithdrawal?: boolean;
  onWithdrawalTriggered?: () => void;
}

const WalletActions: React.FC<WalletActionsProps> = ({
  walletInfo,
  onTransactionComplete,
  triggerWithdrawal = false,
  onWithdrawalTriggered
}) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // En web, on peut retirer tout le solde (gains + bonus)
  const canWithdraw = walletInfo.balance >= 500;

  // Effet pour déclencher le modal de retrait automatiquement
  useEffect(() => {
    if (triggerWithdrawal && canWithdraw) {
      setIsWithdrawalModalOpen(true);
      onWithdrawalTriggered?.();
    }
  }, [triggerWithdrawal, canWithdraw, onWithdrawalTriggered]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Bouton Déposer */}
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg border border-green-200 dark:border-green-700 transition-colors group"
          >
            <div className="p-2 bg-green-500 rounded-lg mb-2 group-hover:bg-green-600 transition-colors">
              <PlusIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-700 dark:text-green-300 font-medium">Déposer</span>
            <span className="text-green-600 dark:text-green-400 text-sm">Ajouter des fonds</span>
          </button>

          {/* Bouton Retirer */}
          <button
            onClick={() => setIsWithdrawalModalOpen(true)}
            disabled={!canWithdraw}
            className={`flex flex-col items-center p-4 rounded-lg border transition-colors group ${
              canWithdraw
                ? 'bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 border-orange-200 dark:border-orange-700'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
            }`}
          >
            <div className={`p-2 rounded-lg mb-2 transition-colors ${
              canWithdraw
                ? 'bg-orange-500 group-hover:bg-orange-600'
                : 'bg-gray-400'
            }`}>
              <MinusIcon className="w-6 h-6 text-white" />
            </div>
            <span className={`font-medium ${canWithdraw ? 'text-orange-700 dark:text-orange-300' : 'text-gray-500 dark:text-gray-400'}`}>
              Retirer
            </span>
            <span className={`text-sm ${canWithdraw ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {canWithdraw ? 'Retirer mes fonds' : 'Solde insuffisant'}
            </span>
          </button>

        </div>

        {!canWithdraw && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              💡 Montant minimum pour retrait: 500 FCFA
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={onTransactionComplete}
      />

      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onSuccess={onTransactionComplete}
        availableBalance={walletInfo.balance}
      />
    </>
  );
};

export default WalletActions;