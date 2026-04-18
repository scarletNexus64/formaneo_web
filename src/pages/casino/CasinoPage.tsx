import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';

interface CasinoGame {
  id: string;
  title: string;
  description: string;
  image: string;
  minBet: number;
  maxWin: string;
  isNew: boolean;
  isHot: boolean;
  path: string;
}

const CASINO_GAMES: CasinoGame[] = [
  {
    id: 'roue-fortune',
    title: 'Roue de la Fortune',
    description: 'Tournez la roue et tentez de multiplier votre mise !',
    image: '/images/apple-fortune-card.png',
    minBet: 500,
    maxWin: 'x4',
    isNew: true,
    isHot: true,
    path: '/casino/roue-fortune'
  },
  // Autres jeux à venir...
];

const CasinoPage = () => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <ActivationGuard action="accéder au casino">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <FireIcon className="h-8 w-8 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mr-2 sm:mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Casino</h1>
            </div>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Tentez votre chance et multipliez vos gains !
            </p>
          </div>

          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center justify-center sm:justify-start">
                <TrophyIcon className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4 opacity-80" />
                <div>
                  <p className="text-xs sm:text-sm opacity-90">Joueurs actifs</p>
                  <p className="text-xl sm:text-2xl font-bold">1,234</p>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <SparklesIcon className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4 opacity-80" />
                <div>
                  <p className="text-xs sm:text-sm opacity-90">Gain du jour</p>
                  <p className="text-xl sm:text-2xl font-bold">2.5M FCFA</p>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <ChartBarIcon className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4 opacity-80" />
                <div>
                  <p className="text-xs sm:text-sm opacity-90">Parties jouées</p>
                  <p className="text-xl sm:text-2xl font-bold">15,678</p>
                </div>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Jeux disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {CASINO_GAMES.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(game.path)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all border border-gray-200 dark:border-gray-700 hover:shadow-2xl group"
                >
                  {/* Image/Icon Section */}
                  <div className="relative overflow-hidden h-56 sm:h-64">
                    {game.image.startsWith('/') ? (
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-primary-500 to-blue-600 p-8 flex items-center justify-center h-full w-full">
                        <div className="text-6xl sm:text-8xl group-hover:scale-110 transition-transform">
                          {game.image}
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {game.isNew && (
                        <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                          NOUVEAU
                        </span>
                      )}
                      {game.isHot && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center">
                          <FireIcon className="w-3 h-3 mr-1" />
                          HOT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {game.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                      {game.description}
                    </p>

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mise min.</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPrice(game.minBet)} FCFA
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gain max.</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {game.maxWin}
                        </p>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                      Jouer maintenant
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Coming Soon Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: CASINO_GAMES.length * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 opacity-60"
              >
                <div className="relative bg-gradient-to-br from-gray-400 to-gray-600 p-8 flex items-center justify-center h-48">
                  <div className="text-8xl opacity-50">🎰</div>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Bientôt disponible</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Nouveaux jeux
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    D'autres jeux passionnants arrivent très bientôt !
                  </p>
                  <button
                    disabled
                    className="w-full py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                  >
                    Bientôt disponible
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
              Comment ça marche ?
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                Choisissez votre jeu favori
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                Placez votre mise (le montant sera déduit de votre portefeuille)
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                Tentez votre chance et gagnez jusqu'à 4x votre mise !
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                Les gains sont automatiquement crédités sur votre portefeuille
              </li>
            </ul>
          </div>
        </div>
      </ActivationGuard>
    </div>
  );
};

export default CasinoPage;
