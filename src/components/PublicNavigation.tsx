import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

interface PublicNavigationProps {
  showFullMenu?: boolean;
}

const PublicNavigation: React.FC<PublicNavigationProps> = ({ showFullMenu = true }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0.95 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
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
          </Link>

          {/* Desktop Menu */}
          {showFullMenu && (
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Fonctionnalités</a>
              <a href="/#affiliations" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Affiliation</a>
              <a href="/#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Témoignages</a>
              <a href="/#faq" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">FAQ</a>
              <a href="/#about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">À propos</a>
              <a href="/#contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium text-sm">Contact</a>
            </div>
          )}

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
            {showFullMenu && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showFullMenu && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="/#features" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Fonctionnalités</a>
                <a href="/#affiliations" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Affiliation</a>
                <a href="/#testimonials" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Témoignages</a>
                <a href="/#faq" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">FAQ</a>
                <a href="/#about" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">À propos</a>
                <a href="/#contact" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Contact</a>

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
      )}
    </motion.nav>
  );
};

export default PublicNavigation;
