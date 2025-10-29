import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface ActivationGuardProps {
  children: React.ReactNode;
  action?: string;
  showLockIcon?: boolean;
  className?: string;
}

const ActivationGuard: React.FC<ActivationGuardProps> = ({ 
  children, 
  action = 'cette action',
  showLockIcon = true,
  className = ''
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAccountActive = user?.account_status === 'active';
  const isAccountExpired = user?.account_status === 'expired';

  const checkActivationAndBlock = (actionParam?: string) => {
    if (isAccountActive) {
      return true;
    }

    const actionText = actionParam || action;
    const message = isAccountExpired 
      ? `Renouvelez votre abonnement pour ${actionText}`
      : `Activez votre compte pour ${actionText}`;

    toast.error(message, {
      duration: 4000,
    });

    setTimeout(() => {
      if (window.confirm(`${message}\n\nVoulez-vous être redirigé vers la page d'activation ?`)) {
        navigate('/account/activate');
      }
    }, 1000);

    return false;
  };

  if (isAccountActive) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Contenu grisé */}
      <div className="filter grayscale opacity-50 pointer-events-none">
        {children}
      </div>
      
      {/* Overlay avec lock */}
      {showLockIcon && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20 rounded cursor-pointer"
          onClick={() => checkActivationAndBlock(action)}
        >
          <div className="bg-white rounded-full p-2 shadow-lg">
            <LockClosedIcon className="w-5 h-5 text-orange-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivationGuard;