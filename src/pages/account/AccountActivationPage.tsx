import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import activationService from '../../services/activation.service';
import walletService from '../../services/wallet.service';
import { AccountActivationInfo } from '../../types';
import toast from 'react-hot-toast';
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { usePaymentContext } from '../../contexts/PaymentContext';

const AccountActivationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const { addPendingPayment, pendingPayments } = usePaymentContext();
  const [activationInfo, setActivationInfo] = useState<AccountActivationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [useProfilePhone, setUseProfilePhone] = useState(true);

  // Vérifier si un paiement d'activation est en cours
  const hasPendingActivation = pendingPayments.some(p => p.type === 'activation');

  useEffect(() => {
    loadActivationInfo();
  }, []);

  const loadActivationInfo = async () => {
    try {
      const info = await activationService.getActivationInfo();
      setActivationInfo(info);

      // If account is already active, redirect to dashboard
      if (info.account_status === 'active') {
        toast.success('Votre compte est déjà activé !');
        navigate('/dashboard');
      }

      // If account is suspended, show error and redirect
      if (info.account_status === 'suspended') {
        toast.error('Votre compte a été suspendu. Veuillez contacter le support.');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des informations d\'activation:', error);

      // Check if error is due to suspended account
      if (error.response?.data?.account_status === 'suspended') {
        toast.error('Votre compte a été suspendu. Veuillez contacter le support.');
        navigate('/dashboard');
      } else {
        toast.error('Erreur lors du chargement des informations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivation = async () => {
    if (!activationInfo) return;

    // Vérifier le provider actif
    const providerInfo = await activationService.getPaymentProvider();

    // Si FreeMoPay (USSD), demander le numéro de téléphone d'abord
    if (providerInfo.provider === 'freemopay' || providerInfo.ussd_mode) {
      // Pré-remplir avec le numéro du profil s'il existe
      if (user?.phone) {
        setPhoneNumber(user.phone);
      }
      setShowPhoneModal(true);
      return;
    }

    // Si CinetPay, continuer directement
    await processActivation();
  };

  const processActivation = async (customPhone?: string) => {
    setIsProcessing(true);
    setShowPhoneModal(false);

    try {
      const response = await activationService.initiateActivation(customPhone);

      // Sauvegarder l'ID de transaction ET le provider pour la vérification
      localStorage.setItem('activation_transaction_id', response.transaction_id);
      localStorage.setItem('activation_provider', response.provider || 'cinetpay');

      console.log('💳 Transaction d\'activation créée:', {
        transaction_id: response.transaction_id,
        payment_url: response.payment_url,
        provider: response.provider,
        ussd_mode: response.ussd_mode
      });

      // Ajouter le paiement au context pour polling en arrière-plan
      addPendingPayment({
        transactionId: response.transaction_id,
        type: 'activation',
        provider: response.provider || 'cinetpay',
        amount: activationInfo?.activation_cost,
        startedAt: new Date().toISOString(),
      });

      // Si FreeMoPay (USSD) : afficher les instructions
      if (response.ussd_mode || response.provider === 'freemopay') {
        toast.success('📱 Demande de paiement envoyée ! Vérifiez votre téléphone Mobile Money et validez le paiement. Vous serez notifié dès confirmation.', {
          duration: 8000
        });

        // NE PAS naviguer, rester sur la page
        setIsProcessing(false);

      } else {
        // Si CinetPay (portail web) : ouvrir l'URL de paiement
        if (response.payment_url) {
          await activationService.openPaymentUrl(response.payment_url);

          toast.success('💳 Page de paiement ouverte. Complétez le paiement sur la page CinetPay. Vous serez notifié dès confirmation.', {
            duration: 8000
          });

          // NE PAS naviguer, rester sur la page
          setIsProcessing(false);
        } else {
          toast.error('URL de paiement manquante');
          setIsProcessing(false);
        }
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'activation:', error);

      // Messages d'erreur plus explicites
      let errorMessage = 'Erreur lors de l\'activation';

      if (error.code === 'ERR_BAD_REQUEST') {
        errorMessage = error.response?.data?.message || 'Requête invalide. Vérifiez vos informations.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Le service de paiement ne répond pas. Réessayez dans quelques instants.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur. Contactez le support si le problème persiste.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, { duration: 6000 });
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!activationInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-400">Impossible de charger les informations d'activation</p>
        </div>
      </div>
    );
  }

  const isExpired = activationInfo.account_status === 'expired';
  const isPendingPayment = activationInfo.account_status === 'pending_payment';

  // Calculer la durée dynamiquement
  const durationMonths = activationInfo.activation_duration_months || 1;
  const durationDays = durationMonths * 30;
  const durationText = durationMonths > 1 ? `Valide ${durationMonths} mois` : 'Valide 1 mois';

  const features = [
    {
      icon: SparklesIcon,
      title: 'Bonus de bienvenue',
      description: `Recevez ${activationInfo.welcome_bonus_amount || 2000} FCFA immédiatement après activation`
    },
    {
      icon: ShieldCheckIcon,
      title: 'Accès complet',
      description: 'Débloquez toutes les formations, e-books et fonctionnalités'
    },
    {
      icon: ClockIcon,
      title: durationText,
      description: `Profitez de tous les avantages pendant ${durationDays} jours`
    },
    {
      icon: CreditCardIcon,
      title: 'Paiement sécurisé',
      description: 'Transaction protégée via Mobile Money'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isExpired ? 'Renouvelez votre compte' : 'Activez votre compte'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {isExpired
              ? 'Votre abonnement a expiré. Renouvelez-le pour continuer à profiter de Formaneo.'
              : isPendingPayment
                ? 'Débloquez toutes les fonctionnalités et recevez votre bonus de bienvenue'
                : 'Activez votre compte pour accéder à toutes les fonctionnalités'
            }
          </p>
          
          {/* Price */}
          <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {activationInfo.activation_cost.toLocaleString('fr-FR')} FCFA
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              / {durationMonths > 1 ? `${durationMonths} mois` : 'mois'}
            </span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statut actuel de votre compte</h3>
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${
              activationInfo.account_status === 'active' ? 'bg-green-500' :
              activationInfo.account_status === 'expired' ? 'bg-yellow-500' :
              activationInfo.account_status === 'suspended' ? 'bg-red-600' : 'bg-orange-500'
            }`}></div>
            <span className="font-medium">
              {activationInfo.account_status === 'active' && 'Actif'}
              {activationInfo.account_status === 'expired' && 'Expiré'}
              {activationInfo.account_status === 'pending_payment' && 'En attente'}
              {activationInfo.account_status === 'suspended' && 'Suspendu'}
            </span>
            {activationInfo.account_expires_at && (
              <span className="text-gray-600 dark:text-gray-400">
                {activationInfo.account_status === 'active' 
                  ? `Expire le ${new Date(activationInfo.account_expires_at).toLocaleDateString('fr-FR')}`
                  : `Expiré le ${new Date(activationInfo.account_expires_at).toLocaleDateString('fr-FR')}`
                }
              </span>
            )}
          </div>
          
          {!activationInfo.welcome_bonus_claimed && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-300 font-medium">
                  Bonus de bienvenue non réclamé : {activationInfo.welcome_bonus_amount} FCFA
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-8"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Information importante
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                Après validation de votre paiement et réception de votre bonus, vous serez automatiquement redirigé vers votre tableau de bord pour profiter de toutes les fonctionnalités.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          <button
            onClick={hasPendingActivation ? () => {
              // Scroller vers le banner en haut
              window.scrollTo({ top: 0, behavior: 'smooth' });
              toast('💳 Votre paiement est en cours de traitement. Vérifiez le banner en haut de la page.', {
                icon: 'ℹ️',
                duration: 5000
              });
            } : handleActivation}
            disabled={isProcessing}
            className={`inline-flex items-center px-8 py-4 ${
              hasPendingActivation
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700'
                : 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600'
            } text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Traitement en cours...
              </>
            ) : hasPendingActivation ? (
              <>
                <ClockIcon className="w-5 h-5 mr-3" />
                Vérifier le statut du paiement
              </>
            ) : (
              <>
                <CreditCardIcon className="w-5 h-5 mr-3" />
                {isExpired ? 'Renouveler maintenant' : 'Activer maintenant'}
              </>
            )}
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Paiement sécurisé via Mobile Money</p>
            <p>MTN • Orange • Wave • Moov</p>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="block mx-auto text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm underline"
          >
            Retour au tableau de bord
          </button>
        </motion.div>
      </div>

      {/* Modal pour choisir le numéro de téléphone (FreeMoPay USSD) */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <DevicePhoneMobileIcon className="w-6 h-6 mr-2 text-orange-500" />
                Numéro de téléphone
              </h3>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Le code USSD sera envoyé sur ce numéro. Assurez-vous qu'il est actif et que vous pouvez le recevoir.
            </p>

            <div className="space-y-4">
              {/* Option : Utiliser le numéro du profil */}
              {user?.phone && (
                <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-colors">
                  <input
                    type="radio"
                    checked={useProfilePhone}
                    onChange={() => {
                      setUseProfilePhone(true);
                      setPhoneNumber(user.phone || '');
                    }}
                    className="w-4 h-4 text-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Mon numéro de profil
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {user.phone}
                    </div>
                  </div>
                </label>
              )}

              {/* Option : Utiliser un autre numéro */}
              <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-colors">
                <input
                  type="radio"
                  checked={!useProfilePhone}
                  onChange={() => setUseProfilePhone(false)}
                  className="w-4 h-4 text-orange-500 mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">
                    Autre numéro
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setUseProfilePhone(false);
                    }}
                    placeholder="Ex: 651826475"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: 9 chiffres sans préfixe (ex: 651826475)
                  </p>
                </div>
              </label>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => processActivation(phoneNumber)}
                disabled={!phoneNumber || phoneNumber.length < 9}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-orange-500 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccountActivationPage;