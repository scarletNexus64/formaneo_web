import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import toast from 'react-hot-toast';
import casinoService, { WheelSegment } from '../../services/casino.service';
import walletService from '../../services/wallet.service';

const DEFAULT_BET = 500;

const RoueDeLaFortuneGame = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<WheelSegment | null>(null);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET);
  const [userBalance, setUserBalance] = useState(0);
  const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
  const [spinHistory, setSpinHistory] = useState<{ multiplier: number; bet: number; timestamp: Date }[]>([]);

  // Charger la config et le solde au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger la configuration de la roue
        const segments = await casinoService.getWheelConfig();

        // Log pour vérifier l'ordre des segments
        console.log('📊 Segments chargés:', segments.map((s, i) => ({
          index: i,
          id: s.id,
          multiplier: s.multiplier,
          color: s.color,
          probability: s.probability
        })));

        setWheelSegments(segments);

        // Charger le solde du wallet
        const walletInfo = await walletService.getWalletInfo();
        setUserBalance(walletInfo.balance);

        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Erreur lors du chargement du jeu');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const canSpin = userBalance >= betAmount && !isSpinning && wheelSegments.length > 0;

  const spinWheel = async () => {
    if (!canSpin) {
      if (userBalance < betAmount) {
        toast.error(`Solde insuffisant ! Vous avez besoin de ${formatPrice(betAmount)} FCFA.`);
      }
      return;
    }

    setIsSpinning(true);
    setShowResult(false);

    try {
      // Appel API pour jouer
      const result = await casinoService.spin(betAmount);

      // Trouver le segment gagnant dans la liste
      const winningSegment = wheelSegments.find(s => s.id === result.segment.id);

      if (!winningSegment) {
        throw new Error('Segment gagnant introuvable');
      }

      // ========================================
      // CALCUL DE ROTATION CORRIGÉ
      // ========================================

      const segmentAngle = 360 / wheelSegments.length;
      const winningIndex = wheelSegments.findIndex(s => s.id === winningSegment.id);

      console.log('🎯 Segment gagnant:', {
        id: winningSegment.id,
        order: winningSegment.order,
        indexInArray: winningIndex,
        multiplier: winningSegment.multiplier,
        color: winningSegment.color,
        label: winningSegment.label
      });

      // GÉOMÉTRIE DE LA ROUE :
      // - L'aiguille est positionnée en haut (top-0) et pointe vers le bas (vers la roue)
      // - Les segments sont dessinés avec : startAngle = (index * segmentAngle) - 90°
      // - En coordonnées SVG : 0°=droite (3h), 90°=bas (6h), 180°=gauche (9h), 270°=haut (12h)
      // - Donc segment 0 commence à -90° (position 12h en haut)

      // CONSTANTE CALIBRÉE : Position angulaire exacte de l'aiguille
      // L'aiguille est en haut (top-0) et pointe vers le bas = -90° en coordonnées cercle
      // -90° = 270° normalisé = position 12h (en haut du cercle)
      const NEEDLE_ANGLE = -90; // Position de l'aiguille : -90° = 12h (haut)

      // Calculer le centre du segment gagnant (position quand rotation = 0)
      const segmentStartAngle = (segmentAngle * winningIndex) - 90;
      const segmentCenterAngle = segmentStartAngle + (segmentAngle / 2);

      // Pour aligner le centre du segment avec l'aiguille :
      // segmentCenterAngle + rotation = NEEDLE_ANGLE
      // => rotation = NEEDLE_ANGLE - segmentCenterAngle
      let targetRotation = NEEDLE_ANGLE - segmentCenterAngle;

      // Normaliser entre 0 et 360
      while (targetRotation < 0) targetRotation += 360;
      while (targetRotation >= 360) targetRotation -= 360;

      console.log('📐 Calculs:', {
        segmentAngle,
        winningIndex,
        order: winningSegment.order,
        segmentStartAngle,
        segmentCenterAngle,
        needleAngle: NEEDLE_ANGLE,
        targetRotation,
        verification: `Segment sera à ${((segmentCenterAngle + targetRotation) % 360).toFixed(1)}° (aiguille à ${NEEDLE_ANGLE}°)`
      });

      // Ajouter des tours complets pour l'animation (5-8 tours)
      // IMPORTANT : fullRotations DOIT être un multiple exact de 360 pour que
      // la roue s'arrête exactement à targetRotation
      const minSpins = 5;
      const maxSpins = 8;
      const randomSpins = Math.floor(minSpins + Math.random() * (maxSpins - minSpins + 1));
      const fullRotations = 360 * randomSpins; // Maintenant c'est un multiple exact de 360

      // Normaliser la rotation actuelle
      const currentRotationNormalized = rotation % 360;

      // Calculer la rotation finale
      const finalRotation = rotation - currentRotationNormalized + fullRotations + targetRotation;

      console.log('🔄 Rotation:', {
        current: rotation,
        currentNormalized: currentRotationNormalized,
        fullRotations,
        targetRotation,
        final: finalRotation,
        finalNormalized: finalRotation % 360
      });

      setRotation(finalRotation);

      // Animation de 6 secondes
      setTimeout(() => {
        setIsSpinning(false);
        setLastResult(winningSegment);
        setShowResult(true);

        // Mettre à jour le solde avec la valeur du backend
        setUserBalance(result.new_balance);

        // Afficher le résultat
        // Convertir le multiplier en nombre pour la comparaison
        const multiplierValue = typeof winningSegment.multiplier === 'string'
          ? parseFloat(winningSegment.multiplier)
          : winningSegment.multiplier;

        console.log('💰 Résultat:', {
          multiplier: winningSegment.multiplier,
          multiplierValue,
          isWin: multiplierValue > 0,
          winAmount: result.win_amount
        });

        if (multiplierValue > 0) {
          toast.success(
            `Vous avez gagné x${formatMultiplier(winningSegment.multiplier)} ! +${formatPrice(result.win_amount)} FCFA`,
            { duration: 5000 }
          );
        } else {
          toast.error('Perdu ! Retentez votre chance !', { duration: 3000 });
        }

        // Ajouter à l'historique local
        setSpinHistory(prev => [
          {
            multiplier: multiplierValue, // Utiliser la valeur numérique
            bet: betAmount,
            timestamp: new Date()
          },
          ...prev.slice(0, 9)
        ]);
      }, 6000);

    } catch (error: any) {
      setIsSpinning(false);

      // Recharger le solde en cas d'erreur
      try {
        const walletInfo = await walletService.getWalletInfo();
        setUserBalance(walletInfo.balance);
      } catch (e) {
        console.error('Erreur rechargement solde:', e);
      }

      toast.error(error.message || 'Erreur lors du jeu');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const formatMultiplier = (multiplier: number | string) => {
    // Convertir en nombre si c'est une chaîne
    const num = typeof multiplier === 'string' ? parseFloat(multiplier) : multiplier;
    // Formater le multiplicateur pour enlever les zéros inutiles
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Roue de la Fortune
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Chargement du jeu...</p>
          <div className="w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-gray-900"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Navigation />
      <ActivationGuard action="jouer au casino">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => navigate('/casino')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
            >
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Retour aux jeux
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Roue de la Fortune
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Tournez la roue et multipliez votre mise
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Votre solde</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(userBalance)} FCFA
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Game Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
                {/* Wheel Container */}
                <div className="relative mx-auto mb-6 sm:mb-8" style={{ width: '100%', maxWidth: '500px', aspectRatio: '1' }}>
                  {/* Pointer/Arrow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                    <div className="relative flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-amber-500 drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
                        }}
                      />
                    </div>
                  </div>

                  {/* Wheel */}
                  <motion.div
                    className="relative w-full h-full rounded-full"
                    animate={{
                      rotate: rotation,
                    }}
                    transition={{
                      duration: isSpinning ? 6 : 0,
                      ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear",
                    }}
                  >
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl" />

                    {/* Middle Ring */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-300 to-amber-500" />

                    {/* Inner Ring Border */}
                    <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 shadow-inner" />

                    {/* Segments Container */}
                    <div className="absolute inset-6 rounded-full overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 200 200">
                        {wheelSegments.map((segment, index) => {
                          const angle = 360 / wheelSegments.length;
                          const startAngle = angle * index - 90;
                          const endAngle = startAngle + angle;

                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;

                          const x1 = 100 + 94 * Math.cos(startRad);
                          const y1 = 100 + 94 * Math.sin(startRad);
                          const x2 = 100 + 94 * Math.cos(endRad);
                          const y2 = 100 + 94 * Math.sin(endRad);

                          const largeArcFlag = angle > 180 ? 1 : 0;

                          const path = `M 100 100 L ${x1} ${y1} A 94 94 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                          return (
                            <path
                              key={segment.id}
                              d={path}
                              fill={segment.color}
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </svg>

                      {/* Text Labels */}
                      {wheelSegments.map((segment, index) => {
                        if (!segment.label) return null;

                        const angle = 360 / wheelSegments.length;
                        const rotation = angle * index;
                        const radius = 55;

                        const angleRad = ((rotation + angle / 2) * Math.PI) / 180;
                        const x = 50 + radius * Math.cos(angleRad - Math.PI / 2);
                        const y = 50 + radius * Math.sin(angleRad - Math.PI / 2);

                        return (
                          <div
                            key={`text-${segment.id}`}
                            className="absolute font-black text-white text-3xl"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)',
                              textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                            }}
                          >
                            {segment.label}
                          </div>
                        );
                      })}
                    </div>

                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-700">
                      <div className="text-white font-bold text-sm">SPIN</div>
                    </div>
                  </motion.div>
                </div>

                {/* Bet Controls */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                    Montant de la mise
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setBetAmount(Math.max(100, betAmount - 100))}
                      disabled={isSpinning}
                      className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                    >
                      -100
                    </button>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(100, parseInt(e.target.value) || 100))}
                      disabled={isSpinning}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold text-center text-base sm:text-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 transition-all"
                    />
                    <span className="hidden sm:inline text-gray-600 dark:text-gray-400 font-medium text-sm">FCFA</span>
                    <button
                      onClick={() => setBetAmount(betAmount + 100)}
                      disabled={isSpinning}
                      className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
                    >
                      +100
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        disabled={isSpinning}
                        className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50 transition-all"
                      >
                        {formatPrice(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spin Button */}
                <motion.button
                  whileHover={{ scale: canSpin ? 1.02 : 1 }}
                  whileTap={{ scale: canSpin ? 0.98 : 1 }}
                  onClick={spinWheel}
                  disabled={!canSpin}
                  className={`w-full py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-lg transition-all ${
                    canSpin
                      ? 'bg-gradient-to-r from-red-600 to-gray-900 hover:from-red-700 hover:to-black text-white shadow-red-500/50'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSpinning ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Rotation en cours...</span>
                      <span className="sm:hidden">Rotation...</span>
                    </span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Tourner la roue ({formatPrice(betAmount)} FCFA)</span>
                      <span className="sm:hidden">Tourner ({formatPrice(betAmount)} F)</span>
                    </>
                  )}
                </motion.button>

                {!canSpin && userBalance < betAmount && (
                  <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                    Solde insuffisant
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Result */}
              <AnimatePresence>
                {showResult && lastResult && (() => {
                  const multiplierValue = typeof lastResult.multiplier === 'string'
                    ? parseFloat(lastResult.multiplier)
                    : lastResult.multiplier;
                  const isWin = multiplierValue > 0;

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className={`rounded-2xl p-4 sm:p-6 shadow-xl border-2 ${
                        isWin
                          ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800'
                          : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="text-center">
                        {isWin ? (
                        <>
                          <CheckCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3 text-emerald-600 dark:text-emerald-400" />
                          <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-emerald-900 dark:text-emerald-100">Gagné !</h3>
                          <p className="text-3xl sm:text-4xl font-black mb-1 sm:mb-2 text-emerald-700 dark:text-emerald-300">x{formatMultiplier(lastResult.multiplier)}</p>
                          <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                            +{formatPrice(betAmount * multiplierValue)} FCFA
                          </p>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3 text-gray-400 dark:text-gray-500" />
                          <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">Perdu</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Retentez votre chance</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* History */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-3 sm:mb-4">
                  <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 mr-2" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Historique</h3>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {spinHistory.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                      Aucune partie jouée
                    </p>
                  ) : (
                    spinHistory.map((spin, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          spin.multiplier > 0
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            spin.multiplier > 0 ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          <span className={`font-semibold ${
                            spin.multiplier > 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {spin.multiplier > 0 ? `x${formatMultiplier(spin.multiplier)}` : 'Perdu'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            spin.multiplier > 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {spin.multiplier > 0 ? '+' : '-'}{formatPrice(spin.multiplier > 0 ? spin.bet * spin.multiplier : spin.bet)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {spin.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Probabilities */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Multiplicateurs
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {wheelSegments
                    .filter((segment) => {
                      const mult = typeof segment.multiplier === 'string'
                        ? parseFloat(segment.multiplier)
                        : segment.multiplier;
                      return mult > 0;
                    })
                    .filter((segment, index, self) =>
                      index === self.findIndex((s) => s.multiplier === segment.multiplier)
                    )
                    .sort((a, b) => {
                      const multA = typeof a.multiplier === 'string' ? parseFloat(a.multiplier) : a.multiplier;
                      const multB = typeof b.multiplier === 'string' ? parseFloat(b.multiplier) : b.multiplier;
                      return multB - multA;
                    })
                    .map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg mr-2 sm:mr-3 shadow-sm"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            x{formatMultiplier(segment.multiplier)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ActivationGuard>
    </div>
  );
};

export default RoueDeLaFortuneGame;
