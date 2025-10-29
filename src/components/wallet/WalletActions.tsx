import React, { useState, useEffect } from 'react';
import { /*PlusIcon,*/ MinusIcon } from '@heroicons/react/24/outline';
// import DepositModal from './DepositModal';
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
  // const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Bouton Déposer - Commenté car non utilisé en web */}
          {/* <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
          >
            <div className="p-2 bg-green-500 rounded-lg mb-2 group-hover:bg-green-600 transition-colors">
              <PlusIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-700 font-medium">Déposer</span>
            <span className="text-green-600 text-sm">Ajouter des fonds</span>
          </button> */}

          {/* Bouton Retirer */}
          <button
            onClick={() => setIsWithdrawalModalOpen(true)}
            disabled={!canWithdraw}
            className={`flex flex-col items-center p-4 rounded-lg border transition-colors group ${
              canWithdraw
                ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
            }`}
          >
            <div className={`p-2 rounded-lg mb-2 transition-colors ${
              canWithdraw
                ? 'bg-orange-500 group-hover:bg-orange-600'
                : 'bg-gray-400'
            }`}>
              <MinusIcon className="w-6 h-6 text-white" />
            </div>
            <span className={`font-medium ${canWithdraw ? 'text-orange-700' : 'text-gray-500'}`}>
              Retirer
            </span>
            <span className={`text-sm ${canWithdraw ? 'text-orange-600' : 'text-gray-400'}`}>
              {canWithdraw ? 'Vers Mobile Money' : 'Solde insuffisant'}
            </span>
          </button>

        </div>

        {!canWithdraw && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              💡 Montant minimum pour retrait: 500 FCFA
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={onTransactionComplete}
      /> */}
      
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