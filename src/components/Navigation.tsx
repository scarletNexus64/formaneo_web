import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FireIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/formations', label: 'Formations', icon: AcademicCapIcon },
    { path: '/quizz', label: 'Quizz', icon: PuzzlePieceIcon },
    { path: '/casino', label: 'Casino', icon: FireIcon, badge: 'Nouveau', badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { path: '/challenges', label: 'Défis', icon: TrophyIcon },
    { path: '/ebooks', label: 'Ebooks', icon: BookOpenIcon },
    { path: '/wallet', label: 'Portefeuille', icon: CurrencyDollarIcon },
    { path: '/affiliate', label: 'Affiliation', icon: UserGroupIcon },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Formaneo
                </h1>
              </motion.div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive(item.path)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
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

          {/* User Info and Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications - Hidden on mobile, shown on md+ */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/notifications')}
              className="hidden md:flex relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </motion.button>

            {/* Profile - Hidden on mobile, shown on md+ */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className="hidden md:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Mon profil"
            >
              <UserCircleIcon className="w-5 h-5" />
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 overflow-x-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors relative ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {item.label}
                  {item.badge && (
                    <span className={`ml-1 px-1.5 py-0.5 text-[8px] font-bold text-white rounded-full ${item.badgeColor} animate-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-1 pl-2">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <BellIcon className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <UserCircleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
