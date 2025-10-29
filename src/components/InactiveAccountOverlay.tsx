import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

interface InactiveAccountOverlayProps {
  children: React.ReactNode;
}

const InactiveAccountOverlay: React.FC<InactiveAccountOverlayProps> = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Pages où l'overlay ne doit PAS apparaître (pages d'activation)
  const excludedPaths = ['/account/activate', '/account/activation/return'];
  const isExcludedPage = excludedPaths.some(path => location.pathname.startsWith(path));

  if (!user || user.account_status === 'active' || isExcludedPage) {
    return <>{children}</>;
  }

  const isExpired = user.account_status === 'expired';

  return (
    <div className="relative">
      {/* Activation Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-3 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LockClosedIcon className="w-6 h-6" />
            <div>
              <p className="font-medium">
                {isExpired ? 'Compte expiré' : 'Compte non activé'}
              </p>
              <p className="text-sm text-orange-100">
                {isExpired 
                  ? 'Renouvelez votre abonnement pour continuer'
                  : 'Activez votre compte pour débloquer toutes les fonctionnalités'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!user.welcome_bonus_claimed && (
              <div className="hidden sm:flex items-center space-x-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full">
                <SparklesIcon className="w-4 h-4" />
                <span className="text-sm font-medium">+2000 FCFA de bonus</span>
              </div>
            )}
            <Link
              to="/account/activate"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
            >
              {isExpired ? 'Renouveler' : 'Activer maintenant'}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Content with limited interactions */}
      <div className="filter grayscale-50 opacity-80">
        {children}
      </div>
    </div>
  );
};

export default InactiveAccountOverlay;