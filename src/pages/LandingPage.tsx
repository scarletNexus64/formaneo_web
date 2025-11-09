import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  PlayIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  FireIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Hook personnalisé pour l'animation des compteurs
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!shouldStart || hasAnimated) return;

    setHasAnimated(true);
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(startValue + (end - startValue) * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldStart, hasAnimated]);

  return count;
};

// Composant pour afficher les chiffres animés
const AnimatedCounter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parser la valeur pour extraire le nombre
  const parseValue = (val: string): { number: number; prefix: string; suffix: string } => {
    // Pour "8.5M" -> 8.5, "", "M"
    // Pour "98%" -> 98, "", "%"
    // Pour "12,547" -> 12547, "", ""

    if (val.includes('M')) {
      const num = parseFloat(val.replace('M', '').replace(',', '.'));
      return { number: num, prefix: '', suffix: 'M' };
    }

    if (val.includes('%')) {
      const num = parseFloat(val.replace('%', ''));
      return { number: num, prefix: '', suffix: '%' };
    }

    // Pour les nombres avec virgules
    const num = parseFloat(val.replace(/,/g, ''));
    return { number: num, prefix: '', suffix: '' };
  };

  const parsed = parseValue(value);
  const animatedValue = useCountUp(parsed.number, duration, isInView);

  // Formater le nombre selon le type
  const formatValue = (num: number): string => {
    if (parsed.suffix === 'M') {
      return num.toFixed(1);
    }

    if (parsed.suffix === '%') {
      return num.toString();
    }

    // Pour les nombres normaux, ajouter les virgules
    return num.toLocaleString('fr-FR');
  };

  return (
    <span ref={ref}>
      {formatValue(animatedValue)}
      {parsed.suffix}
    </span>
  );
};

// Composant de graphique d'affiliation avec courbes animées
const AffiliationChart = () => {
  const [activePoint, setActivePoint] = useState(5);

  const data = [
    { month: 'Jan', earnings: 45000, affiliates: 120 },
    { month: 'Fev', earnings: 78000, affiliates: 240 },
    { month: 'Mar', earnings: 125000, affiliates: 380 },
    { month: 'Avr', earnings: 195000, affiliates: 520 },
    { month: 'Mai', earnings: 285000, affiliates: 680 },
    { month: 'Jun', earnings: 380000, affiliates: 850 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePoint((prev) => (prev + 1) % data.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxEarnings = Math.max(...data.map(d => d.earnings));
  const chartHeight = 200;
  const chartWidth = 600;

  // Calculer les points pour la courbe
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - (item.earnings / maxEarnings) * chartHeight;
    return { x, y, ...item };
  });

  // Créer le path pour la courbe
  const linePath = points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[index - 1];
    const cpX = (prevPoint.x + point.x) / 2;
    return `Q ${cpX} ${prevPoint.y}, ${point.x} ${point.y}`;
  }).join(' ');

  // Créer le path pour le dégradé sous la courbe
  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Croissance des Affiliations</h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Gains mensuels (FCFA)</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full"
        >
          <ArrowTrendingUpIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">+127%</span>
        </motion.div>
      </div>

      <div className="relative" style={{ height: chartHeight + 40 }}>
        <svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} preserveAspectRatio="none">
          {/* Grille de fond */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = (chartHeight * percent) / 100;
            return (
              <line
                key={percent}
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
                opacity="0.3"
              />
            );
          })}

          {/* Zone sous la courbe avec dégradé */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* La courbe principale */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" />
            </linearGradient>
          </defs>

          {/* Points sur la courbe */}
          {points.map((point, index) => (
            <g key={index}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={index === activePoint ? 8 : 5}
                fill="white"
                stroke={index === activePoint ? "rgb(59, 130, 246)" : "rgb(147, 197, 253)"}
                strokeWidth={index === activePoint ? 3 : 2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(index)}
              />
              {index === activePoint && (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <rect
                    x={point.x - 60}
                    y={point.y - 45}
                    width="120"
                    height="35"
                    rx="8"
                    fill="rgb(17, 24, 39)"
                    className="dark:fill-white"
                  />
                  <text
                    x={point.x}
                    y={point.y - 28}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white dark:fill-gray-900"
                  >
                    {point.earnings.toLocaleString()} FCFA
                  </text>
                </motion.g>
              )}
            </g>
          ))}
        </svg>

        {/* Étiquettes des mois */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span
              key={index}
              className={`text-xs font-medium transition-colors cursor-pointer ${
                index === activePoint
                  ? 'text-primary-600 dark:text-primary-400 font-bold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onMouseEnter={() => setActivePoint(index)}
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <p className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">850+</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Affiliés actifs</p>
        </div>
        <div className="text-right">
          <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">380K</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gains ce mois</p>
        </div>
      </div>
    </div>
  );
};

// Composant de graphique circulaire pour les statistiques
const CircularProgress = ({ percentage, label, color = "primary" }: { percentage: number; label: string; color?: string }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: "stroke-primary-600 dark:stroke-primary-400",
    green: "stroke-green-600 dark:stroke-green-400",
    yellow: "stroke-yellow-600 dark:stroke-yellow-400",
    blue: "stroke-blue-600 dark:stroke-blue-400"
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg className="transform -rotate-90 w-24 h-24 sm:w-32 sm:h-32">
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className={colors[color as keyof typeof colors]}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
        </div>
      </div>
      <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  // Fermer le menu mobile quand on clique sur un lien
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <AcademicCapIcon className="w-7 h-7" />,
      title: "Formations Complètes",
      description: "500+ cours vidéo de qualité professionnelle",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <CurrencyDollarIcon className="w-7 h-7" />,
      title: "Revenus Garantis",
      description: "Gagnez jusqu'à 50% de commission sur vos ventes",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <UserGroupIcon className="w-7 h-7" />,
      title: "Programme d'Affiliation",
      description: "Gagnez 30% de commission sur vos parrainages",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BookOpenIcon className="w-7 h-7" />,
      title: "E-books Premium",
      description: "Bibliothèque complète incluse gratuitement",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <GlobeAltIcon className="w-7 h-7" />,
      title: "Paiement Flexible",
      description: "Mobile Money, carte bancaire - Partout dans le monde",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <ShieldCheckIcon className="w-7 h-7" />,
      title: "Certifications Reconnues",
      description: "Certificats valides internationalement",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Jean-Paul K.",
      role: "Développeur Web Full-Stack",
      content: "Les formations sont exceptionnelles. J'ai pu changer de carrière en 6 mois grâce à Formaneo !",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Jean-Paul+K&background=1e40af&color=fff"
    },
    {
      name: "Marie T.",
      role: "Entrepreneure Digital",
      content: "Le programme d'affiliation m'a permis de générer un revenu passif tout en aidant d'autres personnes.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Marie+T&background=10b981&color=fff"
    },
    {
      name: "Ahmed B.",
      role: "Étudiant en Ingénierie",
      content: "Plateforme accessible, formations de qualité. J'ai déjà recommandé à tous mes amis !",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Ahmed+B&background=f59e0b&color=fff"
    }
  ];

  const stats = [
    { value: "12,547", label: "Étudiants actifs", icon: <UserGroupIcon className="w-5 h-5 md:w-6 md:h-6" /> },
    { value: "523", label: "Formations", icon: <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6" /> },
    { value: "98%", label: "Satisfaction", icon: <StarIcon className="w-5 h-5 md:w-6 md:h-6" /> },
    { value: "8.5M", label: "FCFA distribués", icon: <CurrencyDollarIcon className="w-5 h-5 md:w-6 md:h-6" /> }
  ];

  const faqs = [
    {
      question: "Comment fonctionne le programme d'affiliation ?",
      answer: "Notre programme d'affiliation fonctionne sur deux niveaux. Lorsque quelqu’un s’inscrit en utilisant votre code de parrainage, vous recevez une commission de 2 000 FCFA (niveau 1). Si une personne s’inscrit avec le code de votre filleul, vous gagnez également une commission de 1 000 FCFA (niveau 2). En plus, chaque nouvel utilisateur reçoit un bonus de bienvenue de 2 000 FCFA lors de son inscription."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les paiements par Mobile Money (MTN Mobile Money et Orange Money). Ces moyens sont sécurisés et cryptés."
    },
    {
      question: "Puis-je accéder aux formations à vie ?",
      answer: "L’accès aux formations reste disponible tant que votre forfait est actif. Une fois que vous renouvelez votre forfait, votre accès est automatiquement réactivé, vous permettant de continuer à apprendre à votre rythme."
    },
    {
      question: "Y a-t-il un support technique ?",
      answer: "Oui, notre équipe de support est disponible 7j/7 pour vous aider. Vous pouvez nous contacter par email, téléphone ou chat en direct."
    },
    {
      question: "Comment puis-je retirer mes gains d'affiliation ?",
      answer: "Vous pouvez demander un retrait dès que votre solde atteint 5,000 FCFA. Les retraits sont traités sous 24-48h via Mobile Money."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Navigation */}
      <motion.nav
        style={{ opacity: navOpacity }}
        className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                Formaneo
              </h1>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Fonctionnalités</a>
              <a href="#affiliations" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Affiliation</a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Témoignages</a>
              <a href="#faq" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">FAQ</a>
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">À propos</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Contact</a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </motion.button>

              <Link to="/login" className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">
                Connexion
              </Link>

              <Link to="/register" className="hidden sm:block bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm">
                Commencer
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Fonctionnalités</a>
                <a href="#affiliations" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Affiliation</a>
                <a href="#testimonials" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Témoignages</a>
                <a href="#faq" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">FAQ</a>
                <a href="#about" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">À propos</a>
                <a href="#contact" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Contact</a>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link to="/login" onClick={handleNavClick} className="block w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">
                    Connexion
                  </Link>
                  <Link to="/register" onClick={handleNavClick} className="block w-full text-center bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold">
                    Commencer
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Responsive */}
      <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-900/20 opacity-40" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 text-primary-700 dark:text-primary-300 px-3 sm:px-4 py-2 rounded-full mb-4 border border-primary-200 dark:border-primary-800"
              >
                <FireIcon className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-semibold">Plateforme accessible mondialement</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Apprenez et{' '}
                <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 dark:from-primary-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Développez Votre Carrière
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 text-justify">
                Plateforme e-learning professionnelle accessible partout dans le monde. Formations certifiées + programme d'affiliation généreux.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                >
                  <BoltIcon className="w-5 h-5" />
                  Commencer gratuitement
                </motion.button>
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 px-5 sm:px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <PlayIcon className="w-5 h-5" />
                  Voir la démo
                </motion.button> */}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex -space-x-3">
                  {['1e40af', '10b981', 'f59e0b', '8b5cf6'].map((color, i) => (
                    <motion.img
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      src={`https://ui-avatars.com/api/?name=User${i}&background=${color}&color=fff`}
                      alt={`User ${i}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">12,547</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">étudiants actifs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&w=800"
                  alt="Students learning"
                  className="rounded-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-blue-600/20" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Certificat vérifié</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Reconnu internationalement</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">30% Commission</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sur affiliation</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Responsive */}
      <section className="py-6 bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3"
              >
                <div className="flex justify-center mb-1 text-white opacity-80">
                  {stat.icon}
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  <AnimatedCounter value={stat.value} duration={2500} />
                </p>
                <p className="text-primary-100 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Responsive */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Pourquoi choisir Formaneo ?
            </motion.h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Une plateforme complète accessible partout dans le monde
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-justify">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliation Graph Section - Responsive */}
      <section id="affiliations" className="py-12 bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Programme d'Affiliation Puissant
            </motion.h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Suivi en temps réel de vos gains et performances
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <AffiliationChart />
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <CircularProgress percentage={98} label="Taux de réussite" color="green" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <CircularProgress percentage={85} label="Paiement à temps" color="blue" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <CircularProgress percentage={92} label="Satisfaction client" color="primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <CircularProgress percentage={76} label="Taux de conversion" color="yellow" />
              </motion.div>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6" />, value: "30%", label: "Commission par vente", color: "from-purple-500 to-pink-500" },
              { icon: <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6" />, value: "Illimité", label: "Potentiel de gains", color: "from-green-500 to-emerald-500" },
              { icon: <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />, value: "∞", label: "Nombre de filleuls", color: "from-yellow-500 to-orange-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mx-auto mb-2`}>
                  {item.icon}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Responsive */}
      <section id="testimonials" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Témoignages de Réussite
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Rejoignez des milliers de personnes qui ont transformé leur carrière
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm italic text-justify">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Responsive */}
      <section id="faq" className="py-12 bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Questions Fréquentes
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Tout ce que vous devez savoir sur Formaneo
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 sm:px-6 pb-4"
                  >
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-justify">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Responsive */}
      <section id="about" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                À propos de Formaneo
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 text-justify">
                Formaneo est une plateforme d'apprentissage en ligne accessible mondialement, créée pour démocratiser l'éducation de qualité. Notre mission est de permettre à chacun, où qu'il soit dans le monde, d'accéder à des formations professionnelles certifiées.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 text-justify">
                Avec plus de 500 formations dans des domaines variés, nous accompagnons déjà plus de 12,000 étudiants dans leur développement professionnel. Notre programme d'affiliation unique permet également à nos membres de générer des revenus en partageant leurs connaissances.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">2025</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Année de création</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">50+</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pays couverts</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mt-8 lg:mt-0"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&w=800"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Responsive */}
      <section id="contact" className="py-12 bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Contactez-nous
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Notre équipe est là pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                <EnvelopeIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Email</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">formaneosarl@gmail.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                <PhoneIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Téléphone</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">+237 678 613 653</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center sm:col-span-2 md:col-span-1"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                <MapPinIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Localisation</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Cameroun</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 dark:from-primary-700 dark:via-blue-700 dark:to-purple-700 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
          >
            Prêt à transformer votre carrière ?
          </motion.h2>
          <p className="text-base sm:text-xl text-white/90 mb-6">
            Rejoignez 12,547 étudiants qui développent leurs compétences avec Formaneo
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl text-sm sm:text-base"
            >
              Inscription gratuite
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition text-sm sm:text-base"
            >
              Voir la démo
            </motion.button> */}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/90 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Inscription gratuite</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>500+ formations</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-gray-900 dark:bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">Formaneo</h3>
              </div>
              <p className="text-gray-400 text-sm text-justify">
                Plateforme e-learning accessible mondialement. Développez vos compétences, où que vous soyez.
              </p>
            </div>

            {[
              {
                title: "Formations",
                links: ["Développement Web", "Marketing Digital", "Business & Finance", "Design Graphique"]
              },
              {
                title: "Entreprise",
                links: ["À propos", "Devenir formateur", "Affiliation", "Contact"]
              },
              {
                title: "Support",
                links: ["Centre d'aide", "FAQ", "Conditions d'utilisation", "Confidentialité"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold mb-3 text-sm">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition text-xs sm:text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">&copy; 2024 Formaneo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
