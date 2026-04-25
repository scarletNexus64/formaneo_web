import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import walletService from '../../services/wallet.service';

interface CryptoPaymentHandlerProps {
  amount: number;
  onSuccess: (result: { amount: number; new_balance: number }) => void;
  onCancel: () => void;
  onError: (message: string) => void;
  isActivation?: boolean; // true si c'est pour l'activation de compte
}

const CryptoPaymentHandler: React.FC<CryptoPaymentHandlerProps> = ({
  amount,
  onSuccess,
  onCancel,
  onError,
  isActivation = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const [chargeId, setChargeId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  // Surveiller la fermeture de la popup
  useEffect(() => {
    if (!popupWindow) return;

    const interval = setInterval(() => {
      if (popupWindow.closed) {
        clearInterval(interval);
        setPopupWindow(null);

        // Ne pas annuler si on est en train de vérifier le statut
        if (!checkingStatus) {
          setIsProcessing(false);
          toast.error('Paiement crypto annulé');
          onCancel();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [popupWindow, onCancel, checkingStatus]);

  // Écouter les messages de la popup de paiement
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Vérifier que le message vient d'une source fiable
      if (event.origin !== window.location.origin && !event.origin.includes('localhost')) {
        return;
      }

      console.log('📨 Message reçu de la popup:', event.data);

      if (event.data.type === 'CRYPTO_PAYMENT_SUCCESS') {
        console.log('✅ Paiement crypto réussi, démarrage du polling immédiat...');

        // Démarrer un polling immédiat pour vérifier le statut
        if (chargeId) {
          pollPaymentStatus(chargeId, 0);
        }
      } else if (event.data.type === 'CRYPTO_PAYMENT_CANCELLED') {
        console.log('❌ Paiement crypto annulé par l\'utilisateur');

        setCheckingStatus(false);
        setIsProcessing(false);
        toast.error('Paiement annulé');
        onCancel();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [chargeId, onCancel]);

  const pollPaymentStatus = async (paymentIdToCheck: string, attempts = 0) => {
    const maxAttempts = 120; // 120 attempts = 6 minutes (avec 3 secondes d'intervalle)

    if (attempts >= maxAttempts) {
      toast.error('Délai dépassé. Veuillez vérifier votre wallet. Le paiement crypto peut prendre jusqu\'à 30 minutes.');
      setCheckingStatus(false);
      setIsProcessing(false);
      onCancel();
      return;
    }

    try {
      const response = await walletService.checkCryptoPaymentStatus(paymentIdToCheck);

      if (response.success && response.data) {
        const paymentStatus = response.data.mapped_status || response.data.payment_status;

        if (paymentStatus === 'COMPLETED') {
          // Paiement complété avec succès
          setCheckingStatus(false);
          setIsProcessing(false);

          // Fermer la popup si elle est encore ouverte
          console.log('₿ Tentative de fermeture de la popup crypto...');
          if (popupWindow && !popupWindow.closed) {
            try {
              popupWindow.close();
              console.log('✅ Popup fermée avec succès');
            } catch (error) {
              console.error('❌ Erreur lors de la fermeture de la popup:', error);
              setTimeout(() => {
                try {
                  if (popupWindow && !popupWindow.closed) {
                    popupWindow.close();
                  }
                } catch (e) {
                  console.error('❌ Impossible de fermer la popup après retry:', e);
                }
              }, 500);
            }
          } else {
            console.log('ℹ️ Popup déjà fermée ou non trouvée');
          }

          const cryptoCurrency = response.data.crypto_currency || 'Crypto';
          toast.success(`Paiement ${cryptoCurrency} confirmé avec succès !`);

          // Appeler le callback onSuccess qui rafraîchira les données
          onSuccess({
            amount: response.data.payment?.amount || amount,
            new_balance: response.data.new_balance || 0,
          });
        } else if (paymentStatus === 'EXPIRED') {
          // Paiement expiré
          setCheckingStatus(false);
          setIsProcessing(false);

          // Fermer la popup
          if (popupWindow && !popupWindow.closed) {
            try {
              popupWindow.close();
              console.log('✅ Popup fermée (paiement expiré)');
            } catch (error) {
              console.error('❌ Erreur fermeture popup (expiré):', error);
            }
          }

          toast.error('Le paiement a expiré. Veuillez réessayer.');
          onCancel();
        } else if (paymentStatus === 'CANCELED') {
          // Paiement annulé
          setCheckingStatus(false);
          setIsProcessing(false);

          // Fermer la popup
          if (popupWindow && !popupWindow.closed) {
            try {
              popupWindow.close();
              console.log('✅ Popup fermée (paiement annulé)');
            } catch (error) {
              console.error('❌ Erreur fermeture popup (annulé):', error);
            }
          }

          toast.error('Paiement annulé');
          onCancel();
        } else {
          // Toujours en attente (NEW ou PENDING), continuer le polling
          setTimeout(() => pollPaymentStatus(paymentIdToCheck, attempts + 1), 3000);
        }
      } else {
        // Erreur lors de la vérification, réessayer
        if (attempts >= 15) {
          toast.error('Impossible de vérifier le statut du paiement. Veuillez vérifier votre wallet.');
          setCheckingStatus(false);
          setIsProcessing(false);
          onCancel();
          return;
        }

        // Continuer le polling même en cas d'erreur (avec un délai plus long)
        setTimeout(() => pollPaymentStatus(paymentIdToCheck, attempts + 1), 5000);
      }
    } catch (err) {
      console.error('Error checking crypto payment status:', err);

      // Si trop d'erreurs, arrêter le polling
      if (attempts >= 15) {
        toast.error('Erreur de connexion. Veuillez vérifier votre wallet.');
        setCheckingStatus(false);
        setIsProcessing(false);
        onCancel();
        return;
      }

      // Continuer le polling même en cas d'erreur
      setTimeout(() => pollPaymentStatus(paymentIdToCheck, attempts + 1), 5000);
    }
  };

  const handleCryptoPayment = async () => {
    setIsProcessing(true);

    try {
      // Étape 1: Créer le paiement crypto (NOWPayments)
      const createResult = await walletService.createCryptoPayment(amount);

      if (!createResult.success || !createResult.payment_url) {
        throw new Error(createResult.message || 'Impossible de créer le paiement crypto');
      }

      const { payment_id, nowpayments_payment_id, payment_url, amount_usd } = createResult;

      console.log('₿ Paiement crypto créé (NOWPayments):', {
        payment_id,
        nowpayments_payment_id,
        amount,
        amount_usd,
      });

      setChargeId(nowpayments_payment_id!);
      setPaymentId(payment_id!);

      // Étape 2: Ouvrir la popup NOWPayments
      const popup = window.open(
        payment_url,
        'Crypto Payment (NOWPayments)',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Impossible d\'ouvrir la fenêtre de paiement. Veuillez autoriser les popups.');
      }

      setPopupWindow(popup);

      // Étape 3: Démarrer le polling du statut après un court délai
      setTimeout(() => {
        setCheckingStatus(true);
        if (nowpayments_payment_id) {
          pollPaymentStatus(nowpayments_payment_id, 0);
        }
      }, 5000); // Attendre 5 secondes avant de commencer le polling (le temps que l'utilisateur voie la page)

    } catch (error: any) {
      console.error('Erreur paiement crypto:', error);
      toast.error(error.message || 'Erreur lors du paiement crypto');
      onError(error.message || 'Erreur lors du paiement crypto');
      setIsProcessing(false);
      setCheckingStatus(false);
    }
  };

  const handleCancel = async () => {
    if (paymentId && !checkingStatus) {
      try {
        await walletService.cancelCryptoPayment(paymentId);
        toast.success('Paiement annulé');
      } catch (error) {
        console.error('Erreur annulation:', error);
      }
    }
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 9.75a.439.439 0 01-.445.43h-1.488v1.417h1.488a.445.445 0 010 .89h-1.488v2.578a.445.445 0 01-.89 0v-2.578h-1.864v2.578a.445.445 0 01-.89 0v-2.578H9.89a.439.439 0 01-.445-.43v-.117a.439.439 0 01.445-.43h1.488v-1.417H9.445a.445.445 0 010-.89h1.934V6.625a.445.445 0 01.89 0v2.578h1.863V6.625a.445.445 0 01.89 0v2.578h1.095a.439.439 0 01.445.43v.117z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Paiement Crypto</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bitcoin, Ethereum, USDC...</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {amount.toLocaleString('fr-FR')} FCFA
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC)</span>
          </div>
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>USDC, USDT, DAI (Stablecoins)</span>
          </div>
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>0% de frais de transaction</span>
          </div>
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Transaction sécurisée par blockchain</span>
          </div>
        </div>

        <button
          onClick={handleCryptoPayment}
          disabled={isProcessing || checkingStatus}
          className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isProcessing || checkingStatus ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{checkingStatus ? 'En attente de confirmation blockchain...' : 'Traitement en cours...'}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 9.75a.439.439 0 01-.445.43h-1.488v1.417h1.488a.445.445 0 010 .89h-1.488v2.578a.445.445 0 01-.89 0v-2.578h-1.864v2.578a.445.445 0 01-.89 0v-2.578H9.89a.439.439 0 01-.445-.43v-.117a.439.439 0 01.445-.43h1.488v-1.417H9.445a.445.445 0 010-.89h1.934V6.625a.445.445 0 01.89 0v2.578h1.863V6.625a.445.445 0 01.89 0v2.578h1.095a.439.439 0 01.445.43v.117z"/>
              </svg>
              <span>Payer en Crypto</span>
            </div>
          )}
        </button>
      </div>

      {checkingStatus && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <svg className="animate-spin h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>En attente de la confirmation blockchain...</strong>
              <p className="mt-1">Veuillez compléter votre paiement dans la fenêtre ouverte. La confirmation peut prendre de 2 à 30 minutes selon la crypto utilisée.</p>
              <p className="mt-2 text-xs">
                ⚡ BTC/ETH/LTC : 10-30 min • USDC/USDT/DAI : 2-5 min
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoPaymentHandler;
