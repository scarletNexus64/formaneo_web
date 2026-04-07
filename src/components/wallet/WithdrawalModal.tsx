import React, { useState, useEffect } from 'react';
import SimpleModal from './SimpleModal';
import walletService from '../../services/wallet.service';
import toast from 'react-hot-toast';
import { WithdrawalSettings } from '../../types/wallet.types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBalance: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableBalance
}) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalSettings, setWithdrawalSettings] = useState<WithdrawalSettings>({
    min_amount: 1000,
    max_amount: 1000000
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [cinetpayNotification, setCinetpayNotification] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'freemopay' | 'cinetpay' | null>(null);

  // Récupérer les paramètres de retrait et la notification au chargement du composant
  useEffect(() => {
    const fetchWithdrawalSettings = async () => {
      try {
        setSettingsLoading(true);
        const settings = await walletService.getWithdrawalSettings();
        setWithdrawalSettings(settings);
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres de retrait:', error);
        // Les valeurs par défaut sont déjà définies dans le state
      } finally {
        setSettingsLoading(false);
      }
    };

    const fetchCinetPayNotification = async () => {
      try {
        const { message } = await walletService.getCinetPayNotification();
        setCinetpayNotification(message);
      } catch (error) {
        console.error('Erreur lors de la récupération de la notification CinetPay:', error);
      }
    };

    const fetchPaymentProvider = async () => {
      try {
        const providerInfo = await walletService.getPaymentProvider();
        setPaymentProvider(providerInfo.provider);
      } catch (error) {
        console.error('Erreur lors de la récupération du provider:', error);
      }
    };

    if (isOpen) {
      fetchWithdrawalSettings();
      fetchCinetPayNotification();
      fetchPaymentProvider();
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

  const validateForm = () => {
    const numericAmount = getNumericAmount();

    if (!numericAmount || numericAmount <= 0) {
      return { valid: false, message: 'Veuillez entrer un montant valide' };
    }

    if (numericAmount < withdrawalSettings.min_amount) {
      return {
        valid: false,
        message: `Le montant minimum est de ${withdrawalSettings.min_amount.toLocaleString('fr-FR')} FCFA`
      };
    }

    if (numericAmount > withdrawalSettings.max_amount) {
      return {
        valid: false,
        message: `Le montant maximum est de ${withdrawalSettings.max_amount.toLocaleString('fr-FR')} FCFA`
      };
    }

    if (numericAmount % 5 !== 0) {
      return { valid: false, message: 'Le montant doit être un multiple de 5' };
    }

    if (numericAmount > availableBalance) {
      return { valid: false, message: 'Montant supérieur au solde disponible' };
    }

    if (!phoneNumber.trim()) {
      return { valid: false, message: 'Veuillez entrer un numéro de téléphone' };
    }

    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      toast.error(validation.message || 'Erreur de validation');
      return;
    }

    setIsLoading(true);
    
    try {
      const numericAmount = getNumericAmount();
      const formattedPhone = walletService.formatPhoneNumber(phoneNumber);

      const result = await walletService.initiateWithdrawal(
        numericAmount,
        formattedPhone,
        null // Pas d'opérateur - Détection automatique (CinetPay et FreeMoPay)
      );

      if (result.success) {
        if (result.ussd_mode) {
          // Mode USSD (FreeMoPay) - Message différent
          toast.success(
            'Retrait initié ! 📱\n\nVous allez recevoir un code USSD sur votre téléphone. Composez ce code pour finaliser le retrait.\n\nL\'argent sera envoyé sur votre compte Mobile Money dans quelques instants après validation.',
            { duration: 8000 }
          );
        } else if (result.isTimeout) {
          // Cas spécial pour les timeouts
          toast.success(
            'Retrait initié avec succès ! \n\nLe traitement se fait en arrière-plan. Consultez l\'historique des transactions pour suivre l\'avancement.',
            { duration: 6000 }
          );
        } else {
          // Mode portail web (CinetPay) ou autre
          toast.success(result.message || 'Retrait initié avec succès !');
        }
        onSuccess();
        handleClose();
      } else {
        toast.error(result.message || 'Erreur lors du retrait');
      }
    } catch (error: any) {
      console.error('Erreur retrait:', error);
      toast.error('Erreur lors de l\'initiation du retrait');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPhoneNumber('');
    setIsLoading(false);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const validation = validateForm();
  const numericAmount = getNumericAmount();

  return (
    <SimpleModal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Retirer des fonds"
    >
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="space-y-4">
          {/* Notification CinetPay */}
          {cinetpayNotification && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-red-800 dark:text-red-200 text-sm flex items-start">
                <span className="mr-2">⚠️</span>
                <span className="font-medium">{cinetpayNotification}</span>
              </p>
            </div>
          )}

          {/* Solde disponible */}
          <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-3">
            <p className="text-orange-800 dark:text-orange-200 text-sm">
              💰 Solde disponible pour retrait: <strong>{formatCurrency(availableBalance)}</strong>
            </p>
          </div>

          {/* Montant */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant à retirer
            </label>
            <div className="relative">
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Ex: 1 000"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  amount && !validation.valid
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'
                }`}
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 text-sm">FCFA</span>
            </div>
            {amount && numericAmount > availableBalance && (
              <p className="text-red-500 text-sm mt-1">
                Montant supérieur au solde disponible
              </p>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              {settingsLoading
                ? 'Chargement des limites...'
                : `Min: ${withdrawalSettings.min_amount.toLocaleString('fr-FR')} FCFA - Max: ${withdrawalSettings.max_amount.toLocaleString('fr-FR')} FCFA (multiple de 5) - Cameroun uniquement`
              }
            </p>
          </div>

          {/* Numéro de téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ex: 6XXXXXXXX (Cameroun)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Numéro camerounais MTN, Orange ou Moov pour recevoir l'argent (détection automatique de l'opérateur)
            </p>
          </div>

          {/* Information sur le traitement selon le provider */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {paymentProvider === 'freemopay' ? (
                <>
                  📱 <strong>Retrait via USSD (FreeMoPay)</strong><br />
                  Vous recevrez un code USSD sur votre téléphone à composer pour finaliser le retrait.
                </>
              ) : (
                <>
                  ⏰ <strong>Votre demande de retrait sera traitée sous 24 heures maximum.</strong>
                </>
              )}
            </p>
          </div>

          {/* Frais (si applicable) */}
          {numericAmount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Montant à retirer:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Frais:</span>
                <span className="font-medium text-green-600 dark:text-green-400">Gratuit</span>
              </div>
              <hr className="my-2 border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>Vous recevrez:</span>
                <span>{formatCurrency(numericAmount)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || !validation.valid}
            className="flex-1 bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Traitement...' : 'Retirer'}
          </button>
        </div>
      </form>
    </SimpleModal>
  );
};

export default WithdrawalModal;