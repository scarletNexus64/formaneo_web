import { useState, useEffect, useCallback, useRef } from 'react';
import activationService from '../services/activation.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface UseActivationStatusProps {
  transactionId: string | null;
  onSuccess?: () => void;
  onFailure?: () => void;
}

interface ActivationStatusState {
  status: 'checking' | 'completed' | 'failed' | 'pending' | 'claiming_bonus';
  isLoading: boolean;
  error: string | null;
  checkCount: number;
  bonusClaimed?: boolean;
  bonusAmount?: number;
  isRenewal?: boolean;
  commissionsDistributed?: {
    level_1: number;
    level_2: number;
    distributed: boolean;
  };
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

  // Ref pour éviter les appels multiples du claim bonus
  const bonusClaimAttempted = useRef(false);

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
          // Activation réussie - Appel automatique du claim bonus
          console.log('✅ Activation réussie, réclamation automatique du bonus...');

          // Marquer comme claiming_bonus
          setState(prev => ({
            ...prev,
            status: 'claiming_bonus',
            isLoading: true
          }));

          // Rafraîchir les données utilisateur
          await fetchUser();

          // Réclamer automatiquement le bonus (une seule fois)
          if (!bonusClaimAttempted.current) {
            bonusClaimAttempted.current = true;

            try {
              const bonusResponse = await activationService.claimWelcomeBonus();

              if (bonusResponse.success) {
                console.log('💰 Bonus réclamé avec succès:', bonusResponse);

                const isRenewal = bonusResponse.is_renewal || false;

                // Mettre à jour le state avec les infos du bonus
                setState(prev => ({
                  ...prev,
                  status: 'completed',
                  isLoading: false,
                  bonusClaimed: true,
                  bonusAmount: bonusResponse.bonus_awarded,
                  isRenewal: isRenewal,
                  commissionsDistributed: bonusResponse.commissions_distributed
                }));

                // Afficher le toast de succès adapté
                const successMessage = isRenewal
                  ? `🎉 Compte renouvelé ! ${bonusResponse.bonus_awarded} FCFA ajoutés à votre compte !`
                  : `🎉 Compte activé ! ${bonusResponse.bonus_awarded} FCFA ajoutés à votre compte !`;

                toast.success(successMessage, {
                  duration: 5000
                });

                // Afficher les commissions d'affiliation UNIQUEMENT si c'est une première activation
                if (!isRenewal && bonusResponse.commissions_distributed?.distributed) {
                  const { level_1, level_2 } = bonusResponse.commissions_distributed;
                  if (level_1 > 0 || level_2 > 0) {
                    setTimeout(() => {
                      toast.success(
                        `Votre parrain a reçu ${level_1} FCFA` +
                        (level_2 > 0 ? ` et son parrain ${level_2} FCFA !` : ' !'),
                        { icon: '🤝', duration: 4000 }
                      );
                    }, 1500);
                  }
                }

                // Rafraîchir les données utilisateur après l'ajout du bonus
                await fetchUser();

                // Redirection vers le dashboard après 3 secondes
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 3000);

                onSuccess?.();
              } else {
                // Le bonus a déjà été réclamé ou erreur
                console.warn('⚠️ Bonus déjà réclamé ou erreur:', bonusResponse);

                setState(prev => ({
                  ...prev,
                  status: 'completed',
                  isLoading: false,
                  bonusClaimed: bonusResponse.already_claimed || false
                }));

                if (bonusResponse.already_claimed) {
                  toast.success('🎉 Compte activé avec succès !');
                } else {
                  toast.error(bonusResponse.message || 'Erreur lors de la réclamation du bonus');
                }

                // Redirection vers le dashboard
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 2000);

                onSuccess?.();
              }
            } catch (error: any) {
              console.error('❌ Erreur lors de la réclamation automatique du bonus:', error);

              // En cas d'erreur, on redirige quand même vers le dashboard
              setState(prev => ({
                ...prev,
                status: 'completed',
                isLoading: false,
                error: 'Bonus non réclamé, veuillez contacter le support'
              }));

              toast.error('Compte activé mais erreur lors de la réclamation du bonus. Contactez le support.');

              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 3000);

              onSuccess?.();
            }
          }

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