import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  ClockIcon,
  CheckIcon,
  GiftIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { challengesService } from '../../services/challenges.service';
import settingsService from '../../services/settings.service';
import { Challenge } from '../../types';
import toast from 'react-hot-toast';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import ChallengeImage from '../../components/ChallengeImage';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingReward, setClaimingReward] = useState<number | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');

  useEffect(() => {
    loadChallenges();
    loadWhatsAppNumber();
  }, []);

  const loadWhatsAppNumber = async () => {
    try {
      const number = await settingsService.getWhatsAppNumber();
      setWhatsappNumber(number);
    } catch (error) {
      console.error('Error loading WhatsApp number:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const challengesData = await challengesService.getUserChallenges();
      setChallenges(challengesData);
    } catch (error) {
      toast.error('Erreur lors du chargement des défis');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (challengeId: number) => {
    setClaimingReward(challengeId);
    try {
      const result = await challengesService.claimReward(challengeId);
      if (result.success) {
        toast.success(result.message);
        // Mettre à jour le défi dans la liste
        setChallenges(challenges.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, reward_claimed: true }
            : challenge
        ));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erreur lors de la réclamation de la récompense');
    } finally {
      setClaimingReward(null);
    }
  };

  const handleContactWhatsApp = (challenge: Challenge) => {
    if (!whatsappNumber) {
      toast.error('Numéro WhatsApp non disponible');
      return;
    }

    // Nettoyer le numéro (enlever les espaces, tirets, etc.)
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');

    // Créer le message pré-rempli
    const message = `Bonjour, j'ai terminé le défi "${challenge.title}". Pourriez-vous vérifier et valider mon accomplissement ? Merci !`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);

    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Ouvrir dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getProgressPercentage = (challenge: Challenge) => {
    if (!challenge.target) return challenge.is_completed ? 100 : 0;
    return Math.min((challenge.progress || 0) / challenge.target * 100, 100);
  };

  const getRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des défis...</p>
        </div>
      </div>
    );
  }

  return (
    <ActivationGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                <TrophyIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Défis & Bonus</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Participez aux défis et gagnez des récompenses !
            </p>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenges.filter(c => c.is_completed).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Défis Complétés</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(challenges.reduce((sum, c) => c.reward_claimed ? sum + c.reward : sum, 0))} FCFA
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Récompenses Gagnées</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenges.filter(c => c.is_completed && !c.reward_claimed).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">À Réclamer</p>
            </div>
          </div>

          {/* Liste des défis */}
          <div className="space-y-6">
            {challenges.length === 0 ? (
              <div className="text-center py-12">
                <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun défi disponible</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Les défis seront bientôt disponibles !
                </p>
              </div>
            ) : (
              challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border-l-4 ${
                    challenge.is_completed
                      ? 'border-green-500 dark:border-green-400'
                      : challenge.expires_at && new Date(challenge.expires_at) < new Date()
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-yellow-500 dark:border-yellow-400'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <ChallengeImage
                            src={challengesService.getImageUrl(challenge.image_url)}
                            alt={challenge.title}
                            className="h-12 w-12 rounded-lg"
                            fallbackIcon={<TrophyIcon className="h-6 w-6 text-white" />}
                          />
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {challenge.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {challenge.description}
                            </p>
                          </div>
                        </div>

                        {/* Barre de progression */}
                        {challenge.target && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Progression</span>
                              <span>{challenge.progress || 0} / {challenge.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgressPercentage(challenge)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatPrice(challenge.reward)} FCFA</span>
                            </div>
                            
                            {challenge.expires_at && (
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                <span className="text-sm">{getRemainingTime(challenge.expires_at)}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {challenge.is_completed && (
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <CheckCircleIcon className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Complété</span>
                              </div>
                            )}

                            {/* Bouton WhatsApp - Toujours visible */}
                            <button
                              onClick={() => handleContactWhatsApp(challenge)}
                              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                              title="Contacter via WhatsApp pour vérification"
                            >
                              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                              Contacter WhatsApp
                            </button>

                            {challenge.is_completed && !challenge.reward_claimed && (
                              <button
                                onClick={() => handleClaimReward(challenge.id)}
                                disabled={claimingReward === challenge.id}
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-orange-600 dark:hover:from-yellow-600 dark:hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {claimingReward === challenge.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                  <GiftIcon className="h-4 w-4 mr-2" />
                                )}
                                Réclamer
                              </button>
                            )}

                            {challenge.reward_claimed && (
                              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Réclamé
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ActivationGuard>
  );
};

export default ChallengesPage;