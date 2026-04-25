import React, { useState, useEffect } from 'react';
import SimpleModal from './SimpleModal';
import walletService, { PaymentProviderInfo } from '../../services/wallet.service';
import toast from 'react-hot-toast';
import { usePaymentContext } from '../../contexts/PaymentContext';
import PaymentMethodGrid, { PaymentMethod } from './PaymentMethodGrid';
import PayPalPaymentHandler from './PayPalPaymentHandler';
import CryptoPaymentHandler from './CryptoPaymentHandler';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addPendingPayment } = usePaymentContext();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<PaymentProviderInfo | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('orange');
  const [showPayPalHandler, setShowPayPalHandler] = useState(false);
  const [showCryptoHandler, setShowCryptoHandler] = useState(false);

  // Charger les informations du provider au montage du composant
  useEffect(() => {
    const loadProviderInfo = async () => {
      try {
        const info = await walletService.getPaymentProvider();
        setProviderInfo(info);
      } catch (error) {
        console.error('Erreur lors du chargement du provider:', error);
      }
    };

    if (isOpen) {
      loadProviderInfo();
    }
  }, [isOpen]);

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setAmount(formattedValue);
  };

  const getNumericAmount = () => {
    return parseFloat(amount.replace(/\s/g, '')) || 0;
  };

  const validateAmount = () => {
    const numericAmount = getNumericAmount();
    // Pour les dépôts : min = 100 FCFA, max = 10 000 000 FCFA
    return walletService.validateAmount(numericAmount, 100, 10000000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAmount();
    if (!validation.valid) {
      toast.error(validation.message || 'Montant invalide');
      return;
    }

    // Si PayPal/Visa/Mastercard sélectionné, afficher le gestionnaire PayPal
    if (['paypal', 'visa', 'mastercard'].includes(selectedPaymentMethod)) {
      setShowPayPalHandler(true);
      return;
    }

    // Si Crypto sélectionné, afficher le gestionnaire Crypto
    if (selectedPaymentMethod === 'crypto') {
      setShowCryptoHandler(true);
      return;
    }

    // Pour FreeMoPay/Mobile Money, le numéro de téléphone est obligatoire
    if (!phoneNumber.trim()) {
      toast.error('Le numéro de téléphone est obligatoire pour Mobile Money');
      return;
    }

    setIsLoading(true);

    try {
      const numericAmount = getNumericAmount();
      const formattedPhone = phoneNumber.trim()
        ? walletService.formatPhoneNumber(phoneNumber)
        : undefined;

      const result = await walletService.initiateDeposit(numericAmount, formattedPhone);

      if (result.success) {
        // Sauvegarder le provider pour la vérification du statut
        if (result.provider) {
          localStorage.setItem('deposit_provider', result.provider);
        }

        // Ajouter au context pour polling en arrière-plan
        addPendingPayment({
          transactionId: result.transaction_id!,
          type: 'deposit',
          provider: result.provider || 'cinetpay',
          amount: numericAmount,
          startedAt: new Date().toISOString(),
        });

        if (providerInfo?.ussd_mode) {
          // Mode USSD (FreeMoPay) - Code USSD envoyé
          toast.success('📱 ' + (result.message || 'Code USSD envoyé sur votre téléphone. Vous serez notifié dès confirmation.'), {
            duration: 6000
          });

          // Fermer le modal, le polling continue en arrière-plan via le banner
          setTimeout(() => {
            handleClose();
          }, 1500);

        } else if (result.payment_url) {
          // Mode Web Portal (CinetPay) - Ouvrir le portail
          toast.success('💳 Redirection vers le portail de paiement...');

          // Ouvrir l'URL de paiement
          await walletService.openPaymentUrl(result.payment_url);

          toast.success('Complétez le paiement sur la page ouverte. Vous serez notifié dès confirmation.', {
            duration: 6000
          });

          // Fermer le modal, le polling continue en arrière-plan via le banner
          setTimeout(() => {
            handleClose();
          }, 1500);

        } else {
          toast.error('Erreur: URL de paiement manquante');
        }
      } else {
        toast.error(result.message || 'Erreur lors de l\'initiation du dépôt');
      }
    } catch (error: any) {
      console.error('Erreur dépôt:', error);
      toast.error('Erreur lors de l\'initiation du dépôt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPhoneNumber('');
    setIsLoading(false);
    setShowPayPalHandler(false);
    setShowCryptoHandler(false);
    setSelectedPaymentMethod('orange');
    onClose();
  };

  const handlePayPalSuccess = (result: { amount: number; new_balance: number }) => {
    toast.success(`Wallet rechargé de ${result.amount} FCFA !`);
    handleClose();
    onSuccess();
  };

  const handleCryptoSuccess = (result: { amount: number; new_balance: number }) => {
    toast.success(`Wallet rechargé de ${result.amount} FCFA via crypto !`);
    handleClose();
    onSuccess();
  };

  const validation = validateAmount();
  const numericAmount = getNumericAmount();
  const isPayPalMethod = ['paypal', 'visa', 'mastercard'].includes(selectedPaymentMethod);
  const isCryptoMethod = selectedPaymentMethod === 'crypto';
  const isMobileMoneyMethod = ['orange', 'mtn'].includes(selectedPaymentMethod);

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Déposer des fonds"
      maxWidth="2xl"
    >
      {/* Si PayPal est activé et montant valide, afficher le gestionnaire */}
      {showPayPalHandler ? (
        <div className="mt-4">
          <button
            onClick={() => setShowPayPalHandler(false)}
            className="mb-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour à la sélection
          </button>
          <PayPalPaymentHandler
            amount={numericAmount}
            onSuccess={handlePayPalSuccess}
            onCancel={() => setShowPayPalHandler(false)}
            onError={(message) => {
              setShowPayPalHandler(false);
              toast.error(message);
            }}
            isActivation={false}
          />
        </div>
      ) : showCryptoHandler ? (
        <div className="mt-4">
          <button
            onClick={() => setShowCryptoHandler(false)}
            className="mb-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour à la sélection
          </button>
          <CryptoPaymentHandler
            amount={numericAmount}
            onSuccess={handleCryptoSuccess}
            onCancel={() => setShowCryptoHandler(false)}
            onError={(message) => {
              setShowCryptoHandler(false);
              toast.error(message);
            }}
            isActivation={false}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-6">
            {/* Montant */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant à déposer
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Ex: 1 000"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 ${
                    amount && !validation.valid
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
                <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 text-sm">FCFA</span>
              </div>
              {amount && !validation.valid && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{validation.message}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Montant minimum: 100 FCFA</p>
            </div>

            {/* Sélecteur de méthode de paiement */}
            <PaymentMethodGrid
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setSelectedPaymentMethod}
            />

            {/* Champ téléphone (visible uniquement pour Mobile Money) */}
            {isMobileMoneyMethod && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: 6XXXXXXXX ou 237XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  required
                />
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Format: 651826475 (9 chiffres) ou 237651826475 (12 chiffres)
                </p>
              </div>
            )}

            {/* Info paiement */}
            <div className={`${
              isPayPalMethod
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                : isCryptoMethod
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
            } border rounded-lg p-3`}>
              <p className={`${
                isPayPalMethod
                  ? 'text-blue-800 dark:text-blue-300'
                  : isCryptoMethod
                  ? 'text-orange-800 dark:text-orange-300'
                  : 'text-green-800 dark:text-green-300'
              } text-sm`}>
                {isPayPalMethod
                  ? 'Paiement sécurisé via PayPal. Accepte Visa, Mastercard, et comptes PayPal.'
                  : isCryptoMethod
                  ? 'Paiement sécurisé en crypto. Bitcoin, Ethereum, USDC, USDT, etc. 0% de frais.'
                  : 'Un code USSD sera envoyé sur votre téléphone.'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !validation.valid || !amount}
              className={`flex-1 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isPayPalMethod
                  ? 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700'
                  : isCryptoMethod
                  ? 'bg-orange-600 dark:bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-700'
                  : 'bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Traitement...' : 'Continuer'}
            </button>
          </div>
        </form>
      )}
    </SimpleModal>
  );
};

export default DepositModal;