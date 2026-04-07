import { useState, useEffect, useRef, useCallback } from 'react';
import activationService from '../services/activation.service';
import walletService from '../services/wallet.service';

interface UsePaymentPollingOptions {
  transactionId: string | null;
  paymentType: 'activation' | 'deposit';
  provider?: 'freemopay' | 'cinetpay';
  onStatusChange?: (status: string) => void;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
}

interface PaymentPollingResult {
  status: string;
  isPolling: boolean;
  error: string | null;
  attemptCount: number;
  stopPolling: () => void;
  startPolling: () => void;
}

const POLLING_INTERVAL = 5000; // 5 secondes
const MAX_ATTEMPTS = 180; // 180 × 5s = 15 minutes

export const usePaymentPolling = ({
  transactionId,
  paymentType,
  provider,
  onStatusChange,
  onSuccess,
  onError,
  enabled = true,
}: UsePaymentPollingOptions): PaymentPollingResult => {
  const [status, setStatus] = useState<string>('pending');
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<string>('pending');

  // Fonction pour arrêter le polling
  const stopPolling = useCallback(() => {
    console.log('Stopping payment polling');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Fonction pour vérifier le statut
  const checkStatus = useCallback(async () => {
    if (!transactionId) {
      console.log('No transaction ID, skipping status check');
      return;
    }

    try {
      console.log(`[Polling ${attemptCount + 1}/${MAX_ATTEMPTS}] Checking payment status:`, {
        transactionId,
        paymentType,
        provider,
      });

      let response;

      // Appeler le bon service selon le type de paiement
      if (paymentType === 'activation') {
        response = await activationService.checkActivationStatus(transactionId);
      } else if (paymentType === 'deposit') {
        response = await walletService.checkDepositStatus(transactionId);
      } else {
        throw new Error(`Type de paiement non supporté: ${paymentType}`);
      }

      // Normaliser le statut (ActivationStatusResponse a 'current_status', TransactionStatusResponse a 'status')
      const currentStatus = (
        ('current_status' in response ? response.current_status : null) ||
        response.status?.toLowerCase() ||
        'pending'
      );

      console.log(`[Polling ${attemptCount + 1}] Status received:`, {
        currentStatus,
        previousStatus: previousStatusRef.current,
        response,
      });

      // Mettre à jour le statut
      setStatus(currentStatus);

      // Détecter si le statut a changé
      if (currentStatus !== previousStatusRef.current) {
        console.log('Status changed:', {
          from: previousStatusRef.current,
          to: currentStatus,
        });
        previousStatusRef.current = currentStatus;
        onStatusChange?.(currentStatus);
      }

      // Gérer les statuts finaux
      if (currentStatus === 'completed') {
        console.log('Payment completed! Stopping polling.');
        stopPolling();
        onSuccess?.(response);
      } else if (currentStatus === 'failed' || currentStatus === 'cancelled') {
        console.log(`Payment ${currentStatus}! Stopping polling.`);
        stopPolling();
        onError?.(`Le paiement a échoué ou été annulé`);
      }

      // Incrémenter le compteur
      setAttemptCount(prev => prev + 1);
    } catch (err: any) {
      console.error('Error checking payment status:', err);
      setError(err.message || 'Erreur lors de la vérification');

      // Incrémenter quand même le compteur
      setAttemptCount(prev => prev + 1);
    }
  }, [transactionId, paymentType, provider, attemptCount, onStatusChange, onSuccess, onError, stopPolling]);

  // Fonction pour démarrer le polling
  const startPolling = useCallback(() => {
    console.log('Starting payment polling:', {
      transactionId,
      paymentType,
      provider,
    });

    // Arrêter le polling existant si existant
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Réinitialiser les états
    setAttemptCount(0);
    setError(null);
    setIsPolling(true);

    // Vérifier immédiatement
    checkStatus();

    // Démarrer le polling
    intervalRef.current = setInterval(() => {
      checkStatus();
    }, POLLING_INTERVAL);
  }, [transactionId, paymentType, provider, checkStatus]);

  // Effect pour gérer le timeout
  useEffect(() => {
    if (attemptCount >= MAX_ATTEMPTS && isPolling) {
      console.log('Max attempts reached, stopping polling');
      stopPolling();
      setError('Le délai de vérification a expiré');
      onError?.('Le délai de vérification a expiré (15 minutes)');
    }
  }, [attemptCount, isPolling, stopPolling, onError]);

  // Effect pour démarrer/arrêter le polling selon enabled
  useEffect(() => {
    if (enabled && transactionId && !isPolling) {
      startPolling();
    } else if (!enabled && isPolling) {
      stopPolling();
    }

    // Cleanup à la fin
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, transactionId]);

  return {
    status,
    isPolling,
    error,
    attemptCount,
    stopPolling,
    startPolling,
  };
};
