import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VideoRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number;
  videoTitle: string;
  rewardAmount: number;
  onClaim: (videoId: number) => Promise<void>;
}

export const VideoRewardModal: React.FC<VideoRewardModalProps> = ({
  isOpen,
  onClose,
  videoId,
  videoTitle,
  rewardAmount,
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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-center align-middle shadow-xl transition-all">
                {/* Bouton fermer */}
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Icône de célébration */}
                <div className="mb-4 animate-bounce">
                  <div className="text-7xl">🎉</div>
                </div>

                {/* Titre */}
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold mb-2 text-gray-800 dark:text-white"
                >
                  Félicitations !
                </Dialog.Title>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Vous avez terminé la vidéo
                </p>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-6">
                  "{videoTitle}"
                </p>

                {/* Montant de la récompense */}
                <div className="bg-gradient-to-r from-red-50 to-secondary-50 dark:from-red-900/20 dark:to-secondary-900/20 rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Votre récompense
                  </p>
                  <div className="text-5xl font-bold text-red-600 dark:text-red-400">
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
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      loading
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
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
                      '💰 Accepter la récompense'
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="w-full py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                  >
                    Plus tard
                  </button>
                </div>

                {/* Note */}
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  💡 La récompense sera ajoutée directement à votre wallet
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
