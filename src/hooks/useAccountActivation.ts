import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAccountActivation = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAccountActive = user?.account_status === 'active';
  const isAccountInactive = user?.account_status === 'inactive';
  const isAccountExpired = user?.account_status === 'expired';

  const checkActivationAndBlock = (action: string = 'cette action'): boolean => {
    if (isAccountActive) {
      return true; // Autorisé
    }

    const message = isAccountExpired 
      ? `Renouvelez votre abonnement pour ${action}`
      : `Activez votre compte pour ${action}`;

    toast.error(message, {
      duration: 4000,
    });

    // Optionnellement naviguer vers l'activation après un délai
    setTimeout(() => {
      if (window.confirm(`${message}\n\nVoulez-vous être redirigé vers la page d'activation ?`)) {
        navigate('/account/activate');
      }
    }, 1000);

    return false; // Bloqué
  };

  const withActivationCheck = (callback: () => void, action?: string) => {
    return () => {
      if (checkActivationAndBlock(action)) {
        callback();
      }
    };
  };

  return {
    isAccountActive,
    isAccountInactive,
    isAccountExpired,
    checkActivationAndBlock,
    withActivationCheck
  };
};