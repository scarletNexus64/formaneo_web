import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  Squares2X2Icon,
  CurrencyDollarIcon,
  PlayIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import casinoService from '../../services/casino.service';

interface CasinoGame {
  id: string;
  title: string;
  description: string;
  image: string;
  minBet: number;
  maxWin: string;
  isNew: boolean;
  isHot: boolean;
  comingSoon: boolean;
  category: string;
  path?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Tous les jeux', icon: Squares2X2Icon, count: 24 },
  { id: 'slots', name: 'Machines à sous', icon: SparklesIcon, count: 8 },
  { id: 'table', name: 'Jeux de table', icon: PlayIcon, count: 6 },
  { id: 'sports', name: 'Paris sportifs', icon: TrophyIcon, count: 5 },
  { id: 'live', name: 'Casino en direct', icon: FireIcon, count: 5 },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Bonus de bienvenue 200%',
    description: 'Doublez votre premier dépôt jusqu\'à 100 000 FCFA',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: '2',
    title: 'Tournoi hebdomadaire',
    description: 'Gagnez jusqu\'à 5M FCFA - Inscriptions ouvertes',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: '3',
    title: 'Cashback quotidien 10%',
    description: 'Récupérez une partie de vos mises chaque jour',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: '4',
    title: 'Happy Hours',
    description: 'Gains multipliés x2 de 18h à 22h',
    color: 'from-pink-500 to-red-600'
  },
];

const CASINO_GAMES: CasinoGame[] = [
  {
    id: 'roue-fortune',
    title: 'Roue de la Fortune',
    description: 'Tournez la roue et tentez de multiplier votre mise !',
    image: '/images/wheel-fortune-card.png',
    minBet: 500,
    maxWin: 'x4',
    isNew: true,
    isHot: true,
    comingSoon: false,
    category: 'slots',
    path: '/casino/roue-fortune'
  },
  // Machines à sous
  {
    id: 'mega-spin',
    title: 'Mega Spin Deluxe',
    description: 'Des jackpots progressifs qui explosent !',
    image: '🎰',
    minBet: 100,
    maxWin: 'x1000',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'slots'
  },
  {
    id: 'lucky-seven',
    title: 'Lucky Seven',
    description: 'Le 7 vous portera chance',
    image: '🍀',
    minBet: 200,
    maxWin: 'x500',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'slots'
  },
  {
    id: 'fruit-mania',
    title: 'Fruit Mania',
    description: 'Des fruits juteux et des gains savoureux',
    image: '🍒',
    minBet: 150,
    maxWin: 'x250',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'slots'
  },
  {
    id: 'diamond-rush',
    title: 'Diamond Rush',
    description: 'Collectez des diamants pour des gains étincelants',
    image: '💎',
    minBet: 300,
    maxWin: 'x800',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'slots'
  },
  {
    id: 'golden-pharaoh',
    title: 'Golden Pharaoh',
    description: 'Explorez les pyramides pour des trésors cachés',
    image: '🔱',
    minBet: 250,
    maxWin: 'x600',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'slots'
  },
  {
    id: 'wild-west',
    title: 'Wild West Gold',
    description: 'La ruée vers l\'or dans le Far West',
    image: '🤠',
    minBet: 200,
    maxWin: 'x450',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'slots'
  },
  {
    id: 'ocean-treasure',
    title: 'Ocean Treasure',
    description: 'Plongez dans les profondeurs pour des richesses',
    image: '🐚',
    minBet: 180,
    maxWin: 'x350',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'slots'
  },
  // Jeux de table
  {
    id: 'roulette-euro',
    title: 'Roulette Européenne',
    description: 'La roulette classique avec un seul zéro',
    image: '🎯',
    minBet: 500,
    maxWin: 'x36',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'table'
  },
  {
    id: 'blackjack-pro',
    title: 'Blackjack Pro',
    description: 'Battez le croupier et faites 21',
    image: '🃏',
    minBet: 300,
    maxWin: 'x3',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'table'
  },
  {
    id: 'poker-texas',
    title: 'Texas Hold\'em Poker',
    description: 'Le poker le plus populaire au monde',
    image: '♠️',
    minBet: 400,
    maxWin: 'x100',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'table'
  },
  {
    id: 'baccarat',
    title: 'Baccarat Premium',
    description: 'Le jeu préféré des high-rollers',
    image: '💰',
    minBet: 1000,
    maxWin: 'x2',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'table'
  },
  {
    id: 'craps',
    title: 'Craps Master',
    description: 'Lancez les dés et gagnez gros',
    image: '🎲',
    minBet: 250,
    maxWin: 'x30',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'table'
  },
  {
    id: 'sic-bo',
    title: 'Sic Bo',
    description: 'Jeu de dés asiatique excitant',
    image: '🀄',
    minBet: 200,
    maxWin: 'x50',
    isNew: true,
    isHot: false,
    comingSoon: true,
    category: 'table'
  },
  // Paris sportifs
  {
    id: 'football-bets',
    title: 'Paris Football',
    description: 'Pariez sur vos équipes favorites',
    image: '⚽',
    minBet: 100,
    maxWin: 'x50',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'sports'
  },
  {
    id: 'basketball-bets',
    title: 'Paris Basketball',
    description: 'NBA, Euroleague et plus encore',
    image: '🏀',
    minBet: 100,
    maxWin: 'x40',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'sports'
  },
  {
    id: 'tennis-bets',
    title: 'Paris Tennis',
    description: 'Tournois du Grand Chelem et ATP',
    image: '🎾',
    minBet: 100,
    maxWin: 'x30',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'sports'
  },
  {
    id: 'mma-bets',
    title: 'Paris MMA/Boxing',
    description: 'UFC, Bellator et combats de boxe',
    image: '🥊',
    minBet: 150,
    maxWin: 'x60',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'sports'
  },
  {
    id: 'esports-bets',
    title: 'Paris E-Sports',
    description: 'LOL, CS:GO, Dota 2 et plus',
    image: '🎮',
    minBet: 100,
    maxWin: 'x45',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'sports'
  },
  // Casino en direct
  {
    id: 'live-roulette',
    title: 'Roulette en Direct',
    description: 'Vrais croupiers, action en temps réel',
    image: '🎥',
    minBet: 500,
    maxWin: 'x36',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'live'
  },
  {
    id: 'live-blackjack',
    title: 'Blackjack en Direct',
    description: 'Tables avec croupiers professionnels',
    image: '📹',
    minBet: 300,
    maxWin: 'x3',
    isNew: false,
    isHot: true,
    comingSoon: true,
    category: 'live'
  },
  {
    id: 'live-baccarat',
    title: 'Baccarat en Direct',
    description: 'L\'expérience VIP ultime',
    image: '🎬',
    minBet: 1000,
    maxWin: 'x2',
    isNew: false,
    isHot: false,
    comingSoon: true,
    category: 'live'
  },
  {
    id: 'live-poker',
    title: 'Poker en Direct',
    description: 'Caribbean Stud avec vrais dealers',
    image: '🎪',
    minBet: 400,
    maxWin: 'x100',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'live'
  },
  {
    id: 'game-shows',
    title: 'Game Shows Live',
    description: 'Monopoly, Dream Catcher et plus',
    image: '🎭',
    minBet: 200,
    maxWin: 'x500',
    isNew: true,
    isHot: true,
    comingSoon: true,
    category: 'live'
  },
];

const CasinoPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [maxMultiplier, setMaxMultiplier] = useState(4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Charger le multiplicateur max depuis l'API
  useEffect(() => {
    const loadMaxMultiplier = async () => {
      try {
        const segments = await casinoService.getWheelConfig();
        const max = Math.max(...segments.map(s => s.multiplier));
        setMaxMultiplier(max);
      } catch (error) {
        console.error('Erreur chargement config roue:', error);
      }
    };

    loadMaxMultiplier();
  }, []);

  // Auto-rotate announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mettre à jour le jeu Roue de la Fortune avec le vrai max multiplier
  const gamesWithDynamicMax = CASINO_GAMES.map(game => {
    if (game.id === 'roue-fortune') {
      return { ...game, maxWin: `x${maxMultiplier}` };
    }
    return game;
  });

  // Filter games by category
  const filteredGames = selectedCategory === 'all'
    ? gamesWithDynamicMax
    : gamesWithDynamicMax.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <ActivationGuard action="accéder au casino">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center mb-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <FireIcon className="h-10 w-10 text-red-600 dark:text-red-400 mr-3" />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Casino Formaneo</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Des milliers de jeux, des gains incroyables
            </p>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black rounded-xl p-4 mb-6 text-white shadow-lg"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
            </div>
            <div className="relative grid grid-cols-3 gap-4">
              <div className="flex items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <TrophyIcon className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-xs opacity-90">Joueurs actifs</p>
                  <p className="text-xl font-bold">1,234</p>
                </div>
              </div>
              <div className="flex items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <SparklesIcon className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-xs opacity-90">Gain du jour</p>
                  <p className="text-xl font-bold">2.5M FCFA</p>
                </div>
              </div>
              <div className="flex items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <ChartBarIcon className="h-8 w-8 mr-3" />
                <div>
                  <p className="text-xs opacity-90">Parties jouées</p>
                  <p className="text-xl font-bold">15,678</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Layout with Sidebar */}
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Announcement Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 relative overflow-hidden rounded-xl shadow-lg h-32"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAnnouncementIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-r ${ANNOUNCEMENTS[currentAnnouncementIndex].color} p-6 flex flex-col justify-center text-white`}
                  >
                    <div className="flex items-center mb-2">
                      <RocketLaunchIcon className="h-6 w-6 mr-2" />
                      <h3 className="text-2xl font-bold">{ANNOUNCEMENTS[currentAnnouncementIndex].title}</h3>
                    </div>
                    <p className="text-lg opacity-90">{ANNOUNCEMENTS[currentAnnouncementIndex].description}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {ANNOUNCEMENTS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAnnouncementIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentAnnouncementIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedCategory === 'all' ? 'Tous les jeux' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h2>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => game.path && navigate(game.path)}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-red-300 dark:hover:border-red-600 group ${
                    game.comingSoon ? 'cursor-default opacity-75' : 'cursor-pointer'
                  }`}
                >
                  {/* Image/Icon Section */}
                  <div className="relative overflow-hidden h-40">
                    {game.image.startsWith('/') ? (
                      <img
                        src={game.image}
                        alt={game.title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          game.comingSoon ? 'grayscale opacity-50' : ''
                        }`}
                      />
                    ) : (
                      <div className={`bg-gradient-to-br from-red-500 to-gray-900 h-full flex items-center justify-center ${
                        game.comingSoon ? 'grayscale opacity-50' : ''
                      }`}>
                        <div className="text-6xl group-hover:scale-110 transition-transform">
                          {game.image}
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {game.comingSoon && (
                        <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">
                          COMING SOON
                        </span>
                      )}
                      {game.isNew && !game.comingSoon && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded animate-pulse">
                          DISPONIBLE
                        </span>
                      )}
                      {game.isHot && !game.comingSoon && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded flex items-center">
                          <FireIcon className="w-3 h-3 mr-1" />
                          HOT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {game.description}
                    </p>

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mise min.</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPrice(game.minBet)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max.</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {game.maxWin}
                        </p>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      disabled={game.comingSoon}
                      className={`w-full py-2 text-sm font-semibold rounded-lg transition-all ${
                        game.comingSoon
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-gray-900 text-white hover:shadow-lg'
                      }`}
                    >
                      {game.comingSoon ? 'Bientôt disponible' : 'Jouer'}
                    </button>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>

            {/* Right Sidebar - Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-80 flex-shrink-0 hidden lg:block"
            >
              <div className="sticky top-6">
                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Squares2X2Icon className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                            selectedCategory === category.id
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            selectedCategory === category.id
                              ? 'bg-white/20'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {category.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mini Announcements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Promotions
                  </h3>
                  <div className="space-y-3">
                    {ANNOUNCEMENTS.slice(0, 3).map((announcement) => (
                      <div
                        key={announcement.id}
                        className={`bg-gradient-to-r ${announcement.color} p-3 rounded-lg text-white`}
                      >
                        <h4 className="font-bold text-sm mb-1">{announcement.title}</h4>
                        <p className="text-xs opacity-90">{announcement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Powered by Formaneo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center my-6 sm:my-8 px-4"
          >
            <div className="relative inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 px-4 sm:px-6 py-4 sm:py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl sm:rounded-full shadow-lg w-auto">
              {/* Sparkle animation overlay */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-full overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
                     style={{
                       backgroundSize: '200% 100%',
                       animation: 'shimmer 2s infinite'
                     }}
                />
              </div>

              <span className="text-yellow-900 font-bold text-sm sm:text-base md:text-lg relative z-10 text-center whitespace-nowrap px-2 sm:px-3">
                Propulsé par Formaneo
              </span>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-4 border border-blue-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
              Comment ça marche ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold mr-2 flex-shrink-0">1</span>
                <span>Choisissez votre jeu</span>
              </div>
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold mr-2 flex-shrink-0">2</span>
                <span>Placez votre mise</span>
              </div>
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold mr-2 flex-shrink-0">3</span>
                <span>Tentez votre chance</span>
              </div>
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold mr-2 flex-shrink-0">4</span>
                <span>Gagnez gros !</span>
              </div>
            </div>
          </motion.div>
        </div>
      </ActivationGuard>
    </div>
  );
};

export default CasinoPage;
