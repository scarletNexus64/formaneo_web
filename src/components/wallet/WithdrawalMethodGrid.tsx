import React from 'react';
import { motion } from 'framer-motion';

export type WithdrawalMethod = 'orange' | 'mtn' | 'paypal' | 'visa' | 'mastercard' | 'crypto';

interface WithdrawalMethodGridProps {
  selectedMethod: WithdrawalMethod;
  onSelectMethod: (method: WithdrawalMethod) => void;
}

const WithdrawalMethodGrid: React.FC<WithdrawalMethodGridProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const paymentMethods = [
    {
      value: 'mtn' as WithdrawalMethod,
      label: 'MTN Mobile Money',
      disabled: false,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 mx-auto">
          <img
            src="/images/mtn-money.png"
            alt="MTN Mobile Money"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ),
    },
    {
      value: 'orange' as WithdrawalMethod,
      label: 'Orange Money',
      disabled: false,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 mx-auto">
          <img
            src="/images/orange-money.png"
            alt="Orange Money"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ),
    },
    {
      value: 'crypto' as WithdrawalMethod,
      label: 'Bitcoin / Crypto',
      disabled: false,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto">
          <img
            src="/images/bitcoin.png"
            alt="Bitcoin"
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      value: 'paypal' as WithdrawalMethod,
      label: 'PayPal (Bientôt disponible)',
      disabled: true,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto opacity-40">
          <img
            src="/images/paypal.png"
            alt="PayPal"
            className="w-full h-full object-contain grayscale"
          />
        </div>
      ),
    },
    {
      value: 'visa' as WithdrawalMethod,
      label: 'Visa (Bientôt disponible)',
      disabled: true,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto opacity-40">
          <img
            src="/images/visa.png"
            alt="Visa"
            className="w-full h-full object-contain grayscale"
          />
        </div>
      ),
    },
    {
      value: 'mastercard' as WithdrawalMethod,
      label: 'Mastercard (Bientôt disponible)',
      disabled: true,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto opacity-40">
          <img
            src="/images/mastercard.png"
            alt="Mastercard"
            className="w-full h-full object-contain grayscale"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Choisissez votre méthode de retrait
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.value;
          const isDisabled = method.disabled;

          return (
            <motion.button
              key={method.value}
              type="button"
              onClick={() => !isDisabled && onSelectMethod(method.value)}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              title={method.label}
              disabled={isDisabled}
              className={`relative p-2 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                isDisabled
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed opacity-60'
                  : isSelected
                  ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              {/* Badge "Bientôt" pour les cartes désactivées */}
              {isDisabled && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-400 text-white text-[9px] font-semibold rounded-full whitespace-nowrap z-10">
                  Bientôt
                </div>
              )}

              {/* Checkmark pour la sélection */}
              {isSelected && !isDisabled && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Logo dans un cercle blanc */}
              {method.icon}
            </motion.button>
          );
        })}
      </div>

      {/* Information banner selon la méthode sélectionnée */}
      {(selectedMethod === 'mtn' || selectedMethod === 'orange') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg border ${
            selectedMethod === 'mtn'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
          }`}
        >
          <div className="flex items-start">
            <svg className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 ${
              selectedMethod === 'mtn'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-orange-600 dark:text-orange-400'
            }`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className={`text-sm ${
              selectedMethod === 'mtn'
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-orange-800 dark:text-orange-200'
            }`}>
              <strong>Mobile Money :</strong> L'argent sera envoyé directement sur votre compte Mobile Money.
            </div>
          </div>
        </motion.div>
      )}

      {selectedMethod === 'crypto' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Crypto :</strong> Retrait en Bitcoin, Ethereum, USDC ou USDT. Le transfert sera effectué vers votre wallet crypto.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WithdrawalMethodGrid;
