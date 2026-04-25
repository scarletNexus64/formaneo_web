import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import walletService from '../../services/wallet.service';

interface PayPalPaymentHandlerProps {
  amount: number;
  onSuccess: (result: { amount: number; new_balance: number }) => void;
  onCancel: () => void;
  onError: (message: string) => void;
  isActivation?: boolean; // true si c'est pour l'activation de compte
}

const PayPalPaymentHandler: React.FC<PayPalPaymentHandlerProps> = ({
  amount,
  onSuccess,
  onCancel,
  onError,
  isActivation = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

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
          toast.error('Paiement PayPal annulé');
          onCancel();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [popupWindow, onCancel, checkingStatus]);

  const pollPaymentStatus = async (orderId: string, attempts = 0) => {
    const maxAttempts = 120; // 120 attempts = 6 minutes (avec 3 secondes d'intervalle)

    if (attempts >= maxAttempts) {
      toast.error('Délai dépassé. Veuillez vérifier votre wallet.');
      setCheckingStatus(false);
      setIsProcessing(false);
      onCancel();
      return;
    }

    try {
      const response = await walletService.checkPayPalOrderStatus(orderId);

      if (response.success && response.data) {
        const paypalStatus = response.data.paypal_status;

        if (paypalStatus === 'COMPLETED' || paypalStatus === 'completed') {
          // Paiement complété avec succès
          setCheckingStatus(false);
          setIsProcessing(false);

          // Fermer la popup si elle est encore ouverte
          console.log('💳 Tentative de fermeture de la popup PayPal...');
          if (popupWindow && !popupWindow.closed) {
            try {
              popupWindow.close();
              console.log('✅ Popup fermée avec succès');
            } catch (error) {
              console.error('❌ Erreur lors de la fermeture de la popup:', error);
              // Essayer de forcer la fermeture
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

          toast.success('Paiement effectué avec succès !');

          // Appeler le callback onSuccess qui rafraîchira les données
          onSuccess({
            amount: response.data.payment?.amount || amount,
            new_balance: response.data.new_balance || 0,
          });
        } else if (paypalStatus === 'FAILED' || paypalStatus === 'failed') {
          // Paiement échoué
          setCheckingStatus(false);
          setIsProcessing(false);

          // Fermer la popup
          if (popupWindow && !popupWindow.closed) {
            try {
              popupWindow.close();
              console.log('✅ Popup fermée (paiement échoué)');
            } catch (error) {
              console.error('❌ Erreur fermeture popup (échec):', error);
            }
          }

          toast.error('Le paiement a échoué. Veuillez réessayer.');
          onCancel();
        } else if (paypalStatus === 'CANCELLED' || paypalStatus === 'cancelled' || paypalStatus === 'VOIDED') {
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
          // Toujours en attente, continuer le polling
          setTimeout(() => pollPaymentStatus(orderId, attempts + 1), 3000);
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
        setTimeout(() => pollPaymentStatus(orderId, attempts + 1), 5000);
      }
    } catch (err) {
      console.error('Error checking PayPal payment status:', err);

      // Si trop d'erreurs, arrêter le polling
      if (attempts >= 15) {
        toast.error('Erreur de connexion. Veuillez vérifier votre wallet.');
        setCheckingStatus(false);
        setIsProcessing(false);
        onCancel();
        return;
      }

      // Continuer le polling même en cas d'erreur
      setTimeout(() => pollPaymentStatus(orderId, attempts + 1), 5000);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);

    try {
      // Étape 1: Créer l'ordre PayPal
      const createResult = isActivation
        ? await walletService.createPayPalAccountActivationOrder(amount)
        : await walletService.createPayPalOrder(amount);

      if (!createResult.success || !createResult.approval_url) {
        throw new Error(createResult.message || 'Impossible de créer l\'ordre PayPal');
      }

      const { payment_id, order_id, approval_url, amount_usd } = createResult;

      console.log('📝 Ordre PayPal créé:', {
        payment_id,
        order_id,
        amount,
        amount_usd,
      });

      // Étape 2: Ouvrir la popup PayPal
      const popup = window.open(
        approval_url,
        'PayPal Payment',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Impossible d\'ouvrir la fenêtre PayPal. Veuillez autoriser les popups.');
      }

      setPopupWindow(popup);

      // Étape 3: Démarrer le polling du statut après un court délai
      setTimeout(() => {
        setCheckingStatus(true);
        if (order_id) {
          pollPaymentStatus(order_id, 0);
        }
      }, 2000); // Attendre 2 secondes avant de commencer le polling

    } catch (error: any) {
      console.error('Erreur paiement PayPal:', error);
      toast.error(error.message || 'Erreur lors du paiement PayPal');
      onError(error.message || 'Erreur lors du paiement PayPal');
      setIsProcessing(false);
      setCheckingStatus(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.146a.804.804 0 01-.794.68H7.175a.567.567 0 01-.562-.65l.194-1.23 1.058-6.706.04-.227a.804.804 0 01.794-.68h.5c2.615 0 4.66-1.062 5.26-4.135.023-.12.044-.239.062-.358.48-2.56-.59-3.797-2.36-4.307a5.807 5.807 0 00-1.644-.195H6.177a.807.807 0 00-.795.68l-2.173 13.75a.567.567 0 00.563.65h3.667c.39 0 .723-.282.793-.68l.637-4.04.04-.226a.806.806 0 01.794-.68h.5c2.615 0 4.66-1.062 5.26-4.135.062-.318.088-.617.082-.905 1.494.178 2.653.89 3.355 2.085z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Paiement PayPal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sécurisé et rapide</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {amount.toLocaleString('fr-FR')} FCFA
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Accepte Visa, Mastercard, American Express</span>
          </div>
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Pas besoin de compte PayPal pour payer par carte</span>
          </div>
          <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Transaction sécurisée SSL</span>
          </div>
        </div>

        <button
          onClick={handlePayPalPayment}
          disabled={isProcessing || checkingStatus}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isProcessing || checkingStatus ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{checkingStatus ? 'Vérification en cours...' : 'Traitement en cours...'}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.146a.804.804 0 01-.794.68H7.175a.567.567 0 01-.562-.65l.194-1.23 1.058-6.706.04-.227a.804.804 0 01.794-.68h.5c2.615 0 4.66-1.062 5.26-4.135.023-.12.044-.239.062-.358.48-2.56-.59-3.797-2.36-4.307a5.807 5.807 0 00-1.644-.195H6.177a.807.807 0 00-.795.68l-2.173 13.75a.567.567 0 00.563.65h3.667c.39 0 .723-.282.793-.68l.637-4.04.04-.226a.806.806 0 01.794-.68h.5c2.615 0 4.66-1.062 5.26-4.135.062-.318.088-.617.082-.905 1.494.178 2.653.89 3.355 2.085z"/>
              </svg>
              <span>Payer avec PayPal</span>
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
              <strong>En attente de la confirmation du paiement...</strong>
              <p className="mt-1">Veuillez compléter votre paiement dans la fenêtre PayPal. Le statut sera vérifié automatiquement.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPalPaymentHandler;
