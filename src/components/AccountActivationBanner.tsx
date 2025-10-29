import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

const AccountActivationBanner: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || user.account_status === 'active') {
    return null;
  }

  const isExpired = user.account_status === 'expired';

  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpired ? (
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-200" />
            ) : (
              <SparklesIcon className="h-6 w-6 text-yellow-200" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {isExpired 
                  ? 'Votre compte a expiré' 
                  : 'Activez votre compte pour débloquer toutes les fonctionnalités'
                }
              </p>
              <p className="text-xs text-orange-100">
                {isExpired 
                  ? 'Renouvelez votre abonnement pour continuer à profiter de Formaneo'
                  : 'Recevez 2000 FCFA de bonus de bienvenue en activant votre compte dès maintenant'
                }
              </p>
            </div>
          </div>
          <Link
            to="/account/activate"
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50 transition-colors"
          >
            {isExpired ? 'Renouveler' : 'Activer maintenant'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountActivationBanner;