import React from 'react';

export type PaymentMethod = 'orange' | 'mtn' | 'paypal' | 'visa' | 'mastercard' | 'crypto';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const paymentMethods = [
    {
      value: 'orange' as PaymentMethod,
      label: 'Orange Money',
      description: 'Mobile Money Cameroun',
    },
    {
      value: 'mtn' as PaymentMethod,
      label: 'MTN Mobile Money',
      description: 'Mobile Money Cameroun',
    },
    {
      value: 'visa' as PaymentMethod,
      label: 'Visa',
      description: 'Carte bancaire via PayPal',
    },
    {
      value: 'mastercard' as PaymentMethod,
      label: 'Mastercard',
      description: 'Carte bancaire via PayPal',
    },
    {
      value: 'paypal' as PaymentMethod,
      label: 'PayPal',
      description: 'Compte PayPal',
    },
    {
      value: 'crypto' as PaymentMethod,
      label: 'Bitcoin / Crypto',
      description: 'BTC, ETH, USDC, etc.',
    },
  ];

  const selectedMethodInfo = paymentMethods.find(m => m.value === selectedMethod);

  return (
    <div className="mb-4">
      <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Méthode de paiement
      </label>
      <select
        id="payment-method"
        value={selectedMethod}
        onChange={(e) => onSelectMethod(e.target.value as PaymentMethod)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        {paymentMethods.map((method) => (
          <option key={method.value} value={method.value}>
            {method.label} - {method.description}
          </option>
        ))}
      </select>

      {/* Information banner - visible uniquement pour PayPal */}
      {['paypal', 'visa', 'mastercard'].includes(selectedMethod) && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>PayPal :</strong> Vous pouvez payer avec Visa, Mastercard, American Express ou votre compte PayPal. Pas besoin de compte PayPal pour payer par carte bancaire.
            </div>
          </div>
        </div>
      )}

      {/* Information banner - visible uniquement pour Crypto */}
      {selectedMethod === 'crypto' && (
        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Crypto :</strong> Payez avec Bitcoin, Ethereum, Litecoin, USDC, USDT, DAI ou autres cryptomonnaies. 0% de frais. Confirmation en 2-30 minutes selon la crypto.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
