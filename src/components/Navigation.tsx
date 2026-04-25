import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  HomeIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  BellIcon,
  UserCircleIcon,
  FireIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const isDark = theme === 'dark';
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const desktopMenuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fermer le menu utilisateur quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le drawer mobile avec la touche Escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };

    if (isMobileDrawerOpen) {
      document.addEventListener('keydown', handleEscape);
      // Bloquer le scroll du body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileDrawerOpen]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/formations', label: 'Formations', icon: AcademicCapIcon },
    { path: '/quizz', label: 'Quizz', icon: PuzzlePieceIcon },
    { path: '/casino', label: 'Casino', icon: FireIcon, badge: 'Nouveau', badgeColor: 'bg-gradient-to-r from-blue-400 to-green-500' },
    { path: '/challenges', label: 'Défis', icon: TrophyIcon },
    { path: '/ebooks', label: 'Ebooks', icon: BookOpenIcon },
    // { path: '/messages', label: 'Courriels', icon: EnvelopeIcon },
    { path: '/affiliate', label: 'Affiliation', icon: UserGroupIcon },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Composant dropdown réutilisable
  const UserDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
    >
      {/* Wallet */}
      <button
        onClick={() => {
          navigate('/wallet');
          setIsUserMenuOpen(false);
        }}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <CurrencyDollarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Portefeuille</span>
      </button>

      {/* Notifications */}
      <button
        onClick={() => {
          navigate('/notifications');
          setIsUserMenuOpen(false);
        }}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Notifications</span>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Profile */}
      <button
        onClick={() => {
          navigate('/profile');
          setIsUserMenuOpen(false);
        }}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Mon profil</span>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        {isDark ? (
          <>
            <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Mode clair</span>
          </>
        ) : (
          <>
            <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Mode sombre</span>
          </>
        )}
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

      {/* Logout */}
      <button
        onClick={() => {
          handleLogout();
          setIsUserMenuOpen(false);
        }}
        className="w-full flex items-center px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
        <span className="font-medium">Déconnexion</span>
      </button>
    </motion.div>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Nav */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <img
                  src="/images/formaneo-logo.png?v=3"
                  alt="Formaneo Logo"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 object-contain"
                />
              </motion.div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive(item.path)
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${item.badgeColor} animate-pulse`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu Dropdown - Desktop only */}
          <div className="relative hidden lg:block" ref={desktopMenuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Menu utilisateur"
            >
              <UserCircleIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isUserMenuOpen && <UserDropdown />}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileDrawerOpen(true)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Bars3Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-[70] overflow-y-auto lg:hidden"
            >
            {/* Header du drawer avec infos utilisateur */}
            <div className="bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black p-4">
              <div className="flex items-center justify-between mb-3">
                <img
                  src="/images/formaneo-logo.png?v=3"
                  alt="Formaneo"
                  className="w-10 h-10 object-contain"
                />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <UserCircleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user?.name || 'Utilisateur'}</p>
                  <p className="text-red-100 text-sm truncate">{user?.email || ''}</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4">
              {/* Section Navigation */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Navigation
                </p>
                <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${item.badgeColor} animate-pulse`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* Section Compte */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Compte
                </p>
                <div className="space-y-1">
                {/* Wallet */}
                <button
                  onClick={() => {
                    navigate('/wallet');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Portefeuille</span>
                </button>

                {/* Notifications */}
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <BellIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <UserCircleIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Mon profil</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  {isDark ? (
                    <>
                      <SunIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Mode clair</span>
                    </>
                  ) : (
                    <>
                      <MoonIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Mode sombre</span>
                    </>
                  )}
                </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
