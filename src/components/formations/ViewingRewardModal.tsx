import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ViewingRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number;
  videoTitle: string;
  rewardAmount: number;
  progressPercentage: number;
  onClaim: (videoId: number) => Promise<void>;
}

export const ViewingRewardModal: React.FC<ViewingRewardModalProps> = ({
  isOpen,
  onClose,
  videoId,
  videoTitle,
  rewardAmount,
  progressPercentage,
  onClaim
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setLoading(true);
    setError(null);

    try {
      await onClaim(videoId);
      // Le modal sera fermé par le parent après succès
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-6 text-center align-middle shadow-2xl transition-all border-2 border-yellow-400 dark:border-yellow-600">
                {/* Animation de pièces */}
                <div className="absolute top-0 left-0 right-0 flex justify-around">
                  <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💰</div>
                  <div className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎁</div>
                  <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>💰</div>
                </div>

                {/* Icône de célébration */}
                <div className="mt-8 mb-4">
                  <div className="text-7xl animate-pulse">🎉</div>
                </div>

                {/* Titre */}
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold mb-2 text-gray-800 dark:text-white"
                >
                  Bonus de visionnage !
                </Dialog.Title>

                {/* Message */}
                <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Vous avez regardé <span className="text-orange-600 dark:text-orange-400 font-bold">{Math.round(progressPercentage)}%</span> de la vidéo
                </p>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-6">
                  "{videoTitle}"
                </p>

                {/* Montant de la récompense */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-6 mb-6 shadow-inner border border-yellow-300 dark:border-yellow-700">
                  <p className="text-sm text-gray-700 dark:text-gray-400 mb-2 font-medium">
                    Cliquez pour recevoir
                  </p>
                  <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {rewardAmount.toLocaleString()} <span className="text-2xl">FCFA</span>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Boutons */}
                <div className="space-y-3">
                  <button
                    onClick={handleClaim}
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
                      loading
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-2xl hover:scale-105'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Réclamation en cours...
                      </span>
                    ) : (
                      <>💰 Récupérer {rewardAmount.toLocaleString()} FCFA</>
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="w-full py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 text-sm"
                  >
                    Continuer sans réclamer
                  </button>
                </div>

                {/* Note */}
                <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
                  💡 Le bonus sera ajouté immédiatement à votre wallet
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
