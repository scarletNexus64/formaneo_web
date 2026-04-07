import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useActivationStatus } from '../../hooks/useActivationStatus';
import toast from 'react-hot-toast';

const ActivationReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Récupérer l'ID de transaction depuis l'URL ou localStorage
  const transactionIdFromUrl = searchParams.get('transaction_id');
  const transactionIdFromStorage = localStorage.getItem('activation_transaction_id');
  const transactionId = transactionIdFromUrl || transactionIdFromStorage;

  const activationStatus = useActivationStatus({
    transactionId,
    navigate, // Pass navigate function to prevent page reload
    onSuccess: () => {
      // Nettoyage du localStorage
      localStorage.removeItem('activation_transaction_id');
      localStorage.removeItem('activation_provider');
    },
    onFailure: () => {
      // Nettoyage du localStorage
      localStorage.removeItem('activation_transaction_id');
      localStorage.removeItem('activation_provider');
    }
  });

  useEffect(() => {
    // Si pas d'ID de transaction, rediriger vers la page d'activation
    if (!transactionId) {
      // toast.error('Transaction introuvable');
      navigate('/account/activate');
      return;
    }

    console.log('🔄 Page de retour d\'activation chargée', { 
      transactionId,
      fromUrl: transactionIdFromUrl,
      fromStorage: transactionIdFromStorage 
    });
  }, [transactionId, navigate, transactionIdFromUrl, transactionIdFromStorage]);

  // État de chargement/vérification
  if (activationStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>

          {activationStatus.status === 'claiming_bonus' ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Réclamation de votre bonus...
              </h2>
              <p className="text-gray-600 mb-4">
                Votre compte est activé ! Attribution de votre bonus de bienvenue en cours...
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Vérification de votre paiement...
              </h2>
              <p className="text-gray-600 mb-4">
                Veuillez patienter pendant que nous vérifions votre transaction
              </p>
            </>
          )}

          {/* Informations de transaction */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Transaction: {transactionId?.slice(-8)}</span>
            </div>
            {activationStatus.status !== 'claiming_bonus' && (
              <div className="text-xs text-gray-500 mt-2">
                Tentative {activationStatus.checkCount}/200
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center p-8"
      >
        {activationStatus.status === 'completed' ? (
          <>
            {/* Success State */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Félicitations ! 🎉
            </h1>

            <p className="text-gray-600 mb-6">
              {activationStatus.isRenewal
                ? `Votre compte a été renouvelé avec succès ${activationStatus.bonusClaimed ? 'et votre bonus de renouvellement a été ajouté' : ''} ! Vous pouvez continuer à profiter de toutes les fonctionnalités de Formaneo.`
                : `Votre compte a été activé avec succès ${activationStatus.bonusClaimed ? 'et votre bonus de bienvenue a été ajouté' : ''} ! Vous pouvez maintenant profiter de toutes les fonctionnalités de Formaneo.`
              }
            </p>

            {/* Affichage du bonus si réclamé avec succès */}
            {activationStatus.bonusClaimed && activationStatus.bonusAmount && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-orange-700">
                  <SparklesIcon className="w-5 h-5" />
                  <span className="font-medium">
                    {activationStatus.isRenewal
                      ? `Bonus de renouvellement de ${activationStatus.bonusAmount} FCFA ajouté !`
                      : `Bonus de bienvenue de ${activationStatus.bonusAmount} FCFA ajouté !`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Affichage des commissions d'affiliation si distribuées */}
            {activationStatus.commissionsDistributed?.distributed && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="text-green-700 text-center">
                  <span className="font-medium text-sm">
                    🤝 Votre parrain a reçu {activationStatus.commissionsDistributed.level_1} FCFA
                    {activationStatus.commissionsDistributed.level_2 > 0 &&
                      ` et son parrain ${activationStatus.commissionsDistributed.level_2} FCFA`} !
                  </span>
                </div>
              </div>
            )}

            {/* Redirection automatique message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <ClockIcon className="w-5 h-5" />
                <span className="font-medium">
                  Redirection automatique vers le dashboard dans quelques secondes...
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-lg"
            >
              Accéder au tableau de bord maintenant
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </motion.button>
          </>
        ) : (
          <>
            {/* Error State */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
            >
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {activationStatus.status === 'failed' ? 'Paiement échoué' : 'Problème de vérification'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {activationStatus.error || 'Une erreur s\'est produite lors du traitement de votre paiement. Votre compte n\'a pas été activé.'}
            </p>
            
            {transactionId && (
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Transaction:</strong> {transactionId}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/account/activate')}
                className="block w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-lg"
              >
                Réessayer l'activation
              </motion.button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ActivationReturnPage;