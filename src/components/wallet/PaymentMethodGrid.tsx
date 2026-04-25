import React from 'react';
import { motion } from 'framer-motion';

export type PaymentMethod = 'orange' | 'mtn' | 'paypal' | 'visa' | 'mastercard' | 'crypto';

interface PaymentMethodGridProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodGrid: React.FC<PaymentMethodGridProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const paymentMethods = [
    {
      value: 'mtn' as PaymentMethod,
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
      value: 'orange' as PaymentMethod,
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
      value: 'paypal' as PaymentMethod,
      label: 'PayPal',
      disabled: false,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto">
          <img
            src="/images/paypal.png"
            alt="PayPal"
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      value: 'visa' as PaymentMethod,
      label: 'Visa',
      disabled: false,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto">
          <img
            src="/images/visa.png"
            alt="Visa"
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      value: 'mastercard' as PaymentMethod,
      label: 'Mastercard',
      disabled: false,
      icon: (
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center p-2 mx-auto">
          <img
            src="/images/mastercard.png"
            alt="Mastercard"
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      value: 'crypto' as PaymentMethod,
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
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Choisissez votre méthode de paiement
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.value;

          return (
            <motion.button
              key={method.value}
              type="button"
              onClick={() => onSelectMethod(method.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={method.label}
              className={`relative p-2 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              {/* Checkmark pour la sélection */}
              {isSelected && (
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
      {selectedMethod === 'paypal' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>PayPal :</strong> Vous pouvez payer avec Visa, Mastercard, American Express ou votre compte PayPal. Pas besoin de compte PayPal pour payer par carte.
            </div>
          </div>
        </motion.div>
      )}

      {(selectedMethod === 'visa' || selectedMethod === 'mastercard') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-indigo-800 dark:text-indigo-200">
              <strong>Carte bancaire :</strong> Paiement sécurisé via PayPal. Accepte Visa, Mastercard et American Express.
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
              <strong>Crypto :</strong> Payez avec Bitcoin, Ethereum, Litecoin, USDC, USDT, DAI ou autres cryptomonnaies. 0% de frais. Confirmation en 2-30 minutes.
            </div>
          </div>
        </motion.div>
      )}

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
              <strong>Mobile Money :</strong> Un code USSD sera envoyé sur votre téléphone.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethodGrid;
