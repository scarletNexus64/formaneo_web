import { useState, useEffect, useCallback } from 'react';
import activationService from '../services/activation.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface UseActivationStatusProps {
  transactionId: string | null;
  onSuccess?: () => void;
  onFailure?: () => void;
}

interface ActivationStatusState {
  status: 'checking' | 'completed' | 'failed' | 'pending';
  isLoading: boolean;
  error: string | null;
  checkCount: number;
}

export const useActivationStatus = ({ 
  transactionId, 
  onSuccess, 
  onFailure 
}: UseActivationStatusProps) => {
  const { fetchUser } = useAuthStore();
  const [state, setState] = useState<ActivationStatusState>({
    status: 'checking',
    isLoading: true,
    error: null,
    checkCount: 0
  });

  const checkStatus = useCallback(async () => {
    if (!transactionId) {
      setState(prev => ({ 
        ...prev, 
        status: 'failed', 
        isLoading: false, 
        error: 'Transaction ID manquant' 
      }));
      return;
    }

    try {
      console.log(`🔍 Vérification du statut d'activation (tentative ${state.checkCount + 1})`, { transactionId });
      
      const response = await activationService.checkActivationStatus(transactionId);
      
      setState(prev => ({ 
        ...prev, 
        checkCount: prev.checkCount + 1,
        error: null 
      }));

      console.log('📊 Réponse du statut d\'activation:', response);

      if (response.success) {
        if (response.status === 'completed') {
          // Activation réussie
          setState(prev => ({ 
            ...prev, 
            status: 'completed', 
            isLoading: false 
          }));
          
          // Rafraîchir les données utilisateur
          await fetchUser();

          toast.success('🎉 Compte activé avec succès ! Préparation de votre bienvenue...');

          // Redirection vers la page de bienvenue après 2 secondes
          setTimeout(() => {
            window.location.href = '/account/welcome';
          }, 2000);
          
          onSuccess?.();
          return;
        } else if (response.status === 'failed' || response.status === 'cancelled') {
          // Activation échouée
          setState(prev => ({ 
            ...prev, 
            status: 'failed', 
            isLoading: false,
            error: response.message || 'Le paiement a échoué'
          }));
          
          toast.error('❌ Le paiement a échoué');
          onFailure?.();
          return;
        }
      }

      // Si toujours en attente, continuer à vérifier
      setState(prev => ({ 
        ...prev, 
        status: 'pending'
      }));

    } catch (error: any) {
      console.error('Erreur lors de la vérification du statut:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur de vérification',
        checkCount: prev.checkCount + 1
      }));
    }
  }, [transactionId, state.checkCount, fetchUser, onSuccess, onFailure]);

  useEffect(() => {
    if (!transactionId) return;

    // Première vérification immédiate
    checkStatus();

    // Vérifications périodiques toutes les 3 secondes
    const interval = setInterval(checkStatus, 3000);

    // Arrêter après 10 minutes maximum (200 tentatives)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (state.status === 'pending' || state.status === 'checking') {
        setState(prev => ({ 
          ...prev, 
          status: 'failed', 
          isLoading: false,
          error: 'Délai d\'attente dépassé' 
        }));
        toast.error('⏰ Délai d\'attente dépassé. Veuillez vérifier votre compte.');
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [transactionId, checkStatus]);

  // Arrêter les vérifications si le statut est final
  useEffect(() => {
    if (state.status === 'completed' || state.status === 'failed') {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.status]);

  return state;
};