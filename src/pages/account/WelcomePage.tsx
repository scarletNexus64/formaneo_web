import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  GiftIcon,
  RocketLaunchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { activationService } from '../../services/activation.service';
import { useAuthStore } from '../../store/authStore';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // Vérifier que l'utilisateur est bien activé
    if (!user) {
      navigate('/login');
      return;
    }

    // Si le compte n'est pas actif, rediriger vers la page d'activation
    if (user.account_status !== 'active') {
      toast.error('Votre compte n\'est pas encore activé');
      navigate('/account/activate');
      return;
    }

    // Si le bonus est déjà réclamé, rediriger vers le dashboard
    if (user.welcome_bonus_claimed) {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  const handleClaimBonus = async () => {
    setIsClaiming(true);

    try {
      const response = await activationService.claimWelcomeBonus();

      if (response.success) {
        setClaimed(true);

        // Afficher un toast de succès
        toast.success(`${response.bonus_awarded} FCFA ajoutés à votre compte !`, {
          icon: '🎉',
          duration: 4000
        });

        // Afficher les commissions d'affiliation si distribuées
        if (response.commissions_distributed?.distributed) {
          const { level_1, level_2 } = response.commissions_distributed;
          if (level_1 > 0 || level_2 > 0) {
            setTimeout(() => {
              toast.success(
                `Votre parrain a reçu ${level_1} FCFA` +
                (level_2 > 0 ? ` et son parrain ${level_2} FCFA !` : ' !'),
                { icon: '🤝', duration: 4000 }
              );
            }, 1000);
          }
        }

        // Rafraîchir les données utilisateur
        await fetchUser();

        // Rediriger vers le dashboard après 3 secondes
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        toast.error(response.message || 'Erreur lors de la réclamation du bonus');
        setIsClaiming(false);
      }
    } catch (error: any) {
      console.error('Erreur lors de la réclamation du bonus:', error);
      toast.error(
        error.response?.data?.message ||
        'Une erreur est survenue. Veuillez réessayer.'
      );
      setIsClaiming(false);
    }
  };

  if (!user || user.account_status !== 'active' || user.welcome_bonus_claimed) {
    return null; // Redirection en cours via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        {!claimed ? (
          <>
            {/* Icon de bienvenue */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <RocketLaunchIcon className="w-14 h-14 text-white" />
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Bienvenue sur Formaneo ! 🎉
            </motion.h1>

            {/* Message de félicitations */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 mb-8 max-w-xl mx-auto"
            >
              Félicitations <span className="font-semibold text-orange-600">{user.name}</span> !
              Votre compte a été activé avec succès. Vous êtes maintenant prêt à commencer votre aventure d'apprentissage.
            </motion.p>

            {/* Carte du bonus */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <GiftIcon className="w-10 h-10 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Cadeau de bienvenue</h2>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <SparklesIcon className="w-8 h-8 text-orange-500" />
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                    2000
                  </span>
                  <span className="text-2xl font-semibold text-gray-700">FCFA</span>
                </div>
                <p className="text-gray-600 text-sm">
                  seront ajoutés à votre compte pour commencer
                </p>
              </div>

              <ul className="text-left space-y-3 text-gray-700 mb-6">
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Accédez à des milliers de formations de qualité</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Gagnez des commissions en parrainant vos amis</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Profitez d'un mois complet d'accès illimité</span>
                </li>
              </ul>

              {/* Bouton principal */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClaimBonus}
                disabled={isClaiming}
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-lg rounded-xl hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isClaiming ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Réclamation en cours...</span>
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-6 h-6" />
                    <span>Commencer l'aventure</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Note informative */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500"
            >
              En cliquant sur le bouton, vous recevrez votre bonus de bienvenue
            </motion.p>
          </>
        ) : (
          <>
            {/* État après réclamation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircleIcon className="w-14 h-14 text-green-600" />
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bonus réclamé ! 🎊
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              Votre bonus a été ajouté à votre compte avec succès.
              Redirection vers le tableau de bord...
            </p>

            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomePage;
