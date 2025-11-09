import React, { useState } from 'react';
import SimpleModal from './SimpleModal';
import walletService from '../../services/wallet.service';
import toast from 'react-hot-toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);

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
    return walletService.validateAmount(numericAmount, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateAmount();
    if (!validation.valid) {
      toast.error(validation.message || 'Montant invalide');
      return;
    }

    setIsLoading(true);
    
    try {
      const numericAmount = getNumericAmount();
      const formattedPhone = phoneNumber.trim() 
        ? walletService.formatPhoneNumber(phoneNumber)
        : undefined;

      const result = await walletService.initiateDeposit(numericAmount, formattedPhone);
      
      if (result.success && result.payment_url) {
        setPendingTransactionId(result.transaction_id || null);
        setIsWaitingForPayment(true);
        
        toast.success('Redirection vers CinetPay...');
        
        // Ouvrir l'URL de paiement
        await walletService.openPaymentUrl(result.payment_url);
        
        // Commencer la vérification du statut
        startStatusCheck(result.transaction_id!);
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

  const startStatusCheck = (transactionId: string) => {
    const checkStatus = async () => {
      try {
        const result = await walletService.checkDepositStatus(transactionId);
        
        if (result.success) {
          if (result.status === 'completed') {
            toast.success('Dépôt effectué avec succès !');
            setIsWaitingForPayment(false);
            setPendingTransactionId(null);
            onSuccess();
            handleClose();
            return true;
          } else if (result.status === 'failed' || result.status === 'cancelled') {
            toast.error('Le paiement a échoué ou été annulé');
            setIsWaitingForPayment(false);
            setPendingTransactionId(null);
            return true;
          }
        }
        // Ne pas afficher d'erreur pour les vérifications automatiques
        return false;
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        // Ne pas afficher de toast d'erreur pour les vérifications automatiques
        return false;
      }
    };

    const intervalId = setInterval(async () => {
      const shouldStop = await checkStatus();
      if (shouldStop) {
        clearInterval(intervalId);
      }
    }, 10000);

    setTimeout(() => {
      clearInterval(intervalId);
      if (isWaitingForPayment) {
        setIsWaitingForPayment(false);
        setPendingTransactionId(null);
        toast('Vérification du paiement arrêtée. Vous pouvez vérifier manuellement dans l\'historique.', {
          duration: 5000,
        });
      }
    }, 300000);
  };

  const handleManualCheck = async () => {
    if (!pendingTransactionId) return;
    
    try {
      const result = await walletService.checkDepositStatus(pendingTransactionId);
      
      if (result.success) {
        if (result.status === 'completed') {
          toast.success('Dépôt confirmé !');
          setIsWaitingForPayment(false);
          setPendingTransactionId(null);
          onSuccess();
          handleClose();
        } else if (result.status === 'failed' || result.status === 'cancelled') {
          toast.error('Le paiement a échoué ou été annulé');
          setIsWaitingForPayment(false);
          setPendingTransactionId(null);
        } else {
          toast('Paiement toujours en attente...', { icon: '⏳' });
        }
      } else {
        toast.error('Erreur lors de la vérification');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    }
  };

  const handleClose = () => {
    if (!isWaitingForPayment) {
      setAmount('');
      setPhoneNumber('');
      setIsLoading(false);
      setPendingTransactionId(null);
      onClose();
    }
  };

  const validation = validateAmount();

  return (
    <SimpleModal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Déposer des fonds"
    >
      {isWaitingForPayment ? (
        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <div>
                <p className="text-blue-800 font-medium">Paiement en cours...</p>
                <p className="text-blue-600 text-sm">Avez-vous terminé votre paiement ?</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleManualCheck}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Vérifier le paiement
            </button>
            
            <button
              onClick={() => {
                setIsWaitingForPayment(false);
                setPendingTransactionId(null);
              }}
              className="w-full bg-gray-300 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
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
                Numéro de téléphone (optionnel)
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: 6XXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Pour le paiement par Mobile Money</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                💳 Vous serez redirigé vers une passerelle pour effectuer le paiement sécurisé
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
      )}
    </SimpleModal>
  );
};

export default DepositModal;