import React, { useState } from 'react';
import { usePaymentContext } from '../contexts/PaymentContext';
import { usePaymentPolling } from '../hooks/usePaymentPolling';
import toast from 'react-hot-toast';
import activationService from '../services/activation.service';
import { useAuthStore } from '../store/authStore';

interface PaymentBannerItemProps {
  transactionId: string;
  type: 'activation' | 'deposit' | 'withdrawal';
  provider: 'freemopay' | 'cinetpay';
  amount?: number;
  onRemove: () => void;
}

const PaymentBannerItem: React.FC<PaymentBannerItemProps> = ({
  transactionId,
  type,
  provider,
  amount,
  onRemove,
}) => {
  const { fetchUser } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const getPaymentTypeLabel = () => {
    switch (type) {
      case 'activation':
        return 'Activation de compte';
      case 'deposit':
        return 'Dépôt';
      case 'withdrawal':
        return 'Retrait';
      default:
        return 'Paiement';
    }
  };

  const handleSuccess = async (data: any) => {
    console.log('Payment succeeded:', data);

    // Si c'est une activation, claim le bonus automatiquement
    if (type === 'activation') {
      try {
        toast.success('Compte activé ! Réclamation du bonus en cours...');

        // Attendre 2 secondes pour s'assurer que le backend a bien activé le compte
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Rafraîchir l'utilisateur AVANT de claim pour avoir le statut à jour
        await fetchUser();

        // Tenter de claim le bonus (avec retry si échec)
        let bonusResult;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            bonusResult = await activationService.claimWelcomeBonus();

            if (bonusResult.success) {
              // Rafraîchir l'utilisateur après le claim pour obtenir le nouveau solde
              await fetchUser();

              toast.success(
                `🎉 Compte activé ! ${bonusResult.bonus_awarded} FCFA de bonus ajoutés à votre compte !`,
                { duration: 5000 }
              );

              // Retirer le paiement et actualiser la page après 2 secondes
              setTimeout(() => {
                onRemove();
                window.location.reload(); // Actualiser pour voir les changements
              }, 2000);

              return; // Succès, sortir de la fonction
            } else {
              // Bonus déjà réclamé ou autre erreur
              console.log('Bonus claim response:', bonusResult);
              break; // Sortir de la boucle retry
            }
          } catch (error: any) {
            console.error(`Tentative ${retryCount + 1} échouée:`, error);

            if (error.response?.status === 403) {
              // Compte pas encore actif, attendre et retry
              retryCount++;
              if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2s avant retry
                await fetchUser(); // Rafraîchir à nouveau
              }
            } else {
              // Autre erreur, ne pas retry
              break;
            }
          }
        }

        // Si on arrive ici, le claim a échoué après les retries
        toast.error('❌ Erreur lors du claim du bonus. Veuillez réessayer depuis votre profil.');

        // Actualiser quand même pour voir le nouveau statut
        setTimeout(() => {
          onRemove();
          window.location.reload();
        }, 3000);

      } catch (error) {
        console.error('Erreur lors du claim du bonus:', error);
        toast.error('❌ Erreur lors du claim du bonus. Veuillez réessayer depuis votre profil.');

        // Actualiser quand même pour voir le nouveau statut
        setTimeout(() => {
          onRemove();
          window.location.reload();
        }, 3000);
      }
    } else if (type === 'deposit') {
      toast.success(`✅ Dépôt de ${amount} FCFA confirmé !`);

      // Rafraîchir l'utilisateur pour obtenir le nouveau solde
      await fetchUser();

      // Retirer le paiement puis actualiser
      setTimeout(() => {
        onRemove();
        window.location.reload();
      }, 2000);
    }
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
    toast.error(`❌ Paiement échoué : ${error}`);

    // Retirer le paiement et actualiser la page pour voir le statut à jour
    setTimeout(() => {
      onRemove();
      window.location.reload();
    }, 5000);
  };

  const { status, attemptCount } = usePaymentPolling({
    transactionId,
    paymentType: type === 'withdrawal' ? 'deposit' : type, // utilise deposit service pour withdrawal aussi
    provider,
    onSuccess: handleSuccess,
    onError: handleError,
    enabled: true,
  });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Icon + Message */}
          <div className="flex items-center space-x-3">
            {/* Spinning loader */}
            <div className="animate-spin">
              <svg
                className="w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold">
                💳 {getPaymentTypeLabel()} en cours...
              </p>
              <p className="text-xs text-blue-100">
                Tentative {attemptCount}/{180} • Statut : {status}
              </p>
            </div>
          </div>

          {/* Right: Details button + Close button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
            >
              {isExpanded ? 'Masquer' : 'Détails'}
            </button>
            <button
              onClick={onRemove}
              className="text-white hover:text-blue-100 transition"
              aria-label="Fermer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-blue-400/30">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-blue-200">ID Transaction</p>
                <p className="font-mono">{String(transactionId).slice(-12)}</p>
              </div>
              <div>
                <p className="text-blue-200">Provider</p>
                <p className="uppercase">{provider}</p>
              </div>
              {amount && (
                <div>
                  <p className="text-blue-200">Montant</p>
                  <p className="font-semibold">{amount} FCFA</p>
                </div>
              )}
              <div>
                <p className="text-blue-200">Statut</p>
                <p className="capitalize">{status}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-blue-100">
              ℹ️ Vous pouvez continuer à naviguer pendant que nous vérifions votre
              paiement. Vous serez notifié dès confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const PaymentStatusBanner: React.FC = () => {
  const { pendingPayments, removePendingPayment, hasPendingPayments } =
    usePaymentContext();

  if (!hasPendingPayments) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {pendingPayments.map((payment) => (
        <PaymentBannerItem
          key={payment.transactionId}
          transactionId={payment.transactionId}
          type={payment.type}
          provider={payment.provider}
          amount={payment.amount}
          onRemove={() => removePendingPayment(payment.transactionId)}
        />
      ))}
    </div>
  );
};
