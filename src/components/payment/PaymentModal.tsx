import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import {
  XMarkIcon,
  WalletIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import paymentService from '../../services/payment.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    name: string;
    price: number;
    type: 'formation_pack' | 'ebook';
    cashback?: number;
  };
  onSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { balance, fetchWalletInfo } = useWalletStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWalletInfo();
    }
  }, [isOpen, fetchWalletInfo]);

  useEffect(() => {
    setHasEnoughBalance(balance >= item.price);
  }, [balance, item.price]);

  const handlePayment = async () => {
    if (!hasEnoughBalance) {
      toast.error('Solde insuffisant. Veuillez recharger votre wallet.');
      navigate('/wallet');
      onClose();
      return;
    }

    setIsProcessing(true);
    
    try {
      let result;
      if (item.type === 'formation_pack') {
        result = await paymentService.purchaseFormationPack(item.id);
      } else {
        result = await paymentService.purchaseEbook(item.id);
      }

      if (result.success) {
        await fetchWalletInfo();
        onSuccess?.();
        onClose();
        
        toast.success(
          <div>
            <p className="font-semibold">Achat réussi !</p>
            <p className="text-sm">Vous avez accès au contenu maintenant.</p>
            {result.cashback_received && result.cashback_received > 0 && (
              <p className="text-sm mt-1 text-green-600">
                +{result.cashback_received.toLocaleString('fr-FR')} FCFA de cashback !
              </p>
            )}
          </div>,
          { duration: 5000 }
        );

        // Rediriger vers la page d'apprentissage si c'est un pack de formation
        if (item.type === 'formation_pack') {
          setTimeout(() => {
            navigate(`/formations/${item.id}/learn`);
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
            Confirmer le paiement
          </Dialog.Title>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prix</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(item.price)} FCFA
                </span>
              </div>
              {item.cashback && item.cashback > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Cashback</span>
                  <span className="text-green-600 font-semibold">
                    +{formatPrice(item.cashback)} FCFA
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">Votre solde</span>
                </div>
                <span className={`font-bold text-lg ${hasEnoughBalance ? 'text-gray-900' : 'text-red-600'}`}>
                  {formatPrice(balance)} FCFA
                </span>
              </div>

              {!hasEnoughBalance && (
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold">Solde insuffisant</p>
                      <p className="text-red-700 text-sm mt-1">
                        Il vous manque {formatPrice(item.price - balance)} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {hasEnoughBalance && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-semibold">Solde suffisant</p>
                      <p className="text-green-700 text-sm mt-1">
                        Après l'achat: {formatPrice(balance - item.price)} FCFA
                        {item.cashback && item.cashback > 0 && (
                          <span className="text-green-600 font-semibold">
                            {' '}(+{formatPrice(item.cashback)} avec cashback)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {!hasEnoughBalance ? (
                <button
                  onClick={() => {
                    navigate('/wallet');
                    onClose();
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <WalletIcon className="h-5 w-5" />
                  Recharger mon wallet
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CurrencyDollarIcon className="h-5 w-5" />
                      Payer {formatPrice(item.price)} FCFA
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentModal;