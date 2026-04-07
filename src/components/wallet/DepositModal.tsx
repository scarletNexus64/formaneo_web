import React, { useState, useEffect } from 'react';
import SimpleModal from './SimpleModal';
import walletService, { PaymentProviderInfo } from '../../services/wallet.service';
import toast from 'react-hot-toast';
import { usePaymentContext } from '../../contexts/PaymentContext';

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

    // Pour FreeMoPay, le numéro de téléphone est obligatoire
    if (providerInfo?.ussd_mode && !phoneNumber.trim()) {
      toast.error('Le numéro de téléphone est obligatoire pour FreeMoPay');
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
    onClose();
  };

  const validation = validateAmount();

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Déposer des fonds"
    >
      <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    amount && !validation.valid 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
                <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 text-sm">FCFA</span>
              </div>
              {amount && !validation.valid && (
                <p className="text-red-500 text-sm mt-1">{validation.message}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Montant minimum: 100 FCFA</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro de téléphone {providerInfo?.ussd_mode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: 6XXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required={providerInfo?.ussd_mode}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {providerInfo?.ussd_mode
                  ? 'Numéro pour recevoir le code USSD'
                  : 'Pour le paiement par Mobile Money (optionnel)'}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                {providerInfo?.ussd_mode
                  ? '📱 Un code USSD sera envoyé sur votre téléphone. Composez le code pour compléter le paiement.'
                  : '💳 Vous serez redirigé vers une passerelle pour effectuer le paiement sécurisé'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !validation.valid || !amount}
              className="flex-1 bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Traitement...' : 'Continuer'}
            </button>
          </div>
        </form>
    </SimpleModal>
  );
};

export default DepositModal;