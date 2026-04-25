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
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';

interface PublicNavigationProps {
  showFullMenu?: boolean;
}

const PublicNavigation: React.FC<PublicNavigationProps> = ({ showFullMenu = true }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/images/formaneo-logo.png?v=3"
                alt="Formaneo Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          {showFullMenu && (
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/#features" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm">Fonctionnalités</a>
              <a href="/#affiliations" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm">Affiliation</a>
              <a href="/#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm">Témoignages</a>
              <a href="/#faq" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm">FAQ</a>
              <a href="/#about" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm">À propos</a>
              <a href="/#contact" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm">Contact</a>
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

            <button
              onClick={() => setLoginModalOpen(true)}
              className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium text-sm"
            >
              Connexion
            </button>

            <button
              onClick={() => setRegisterModalOpen(true)}
              className="hidden sm:block bg-gradient-to-r from-red-600 to-gray-900 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm"
            >
              Commencer
            </button>

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
                <a href="/#features" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium">Fonctionnalités</a>
                <a href="/#affiliations" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium">Affiliation</a>
                <a href="/#testimonials" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium">Témoignages</a>
                <a href="/#faq" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium">FAQ</a>
                <a href="/#about" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium">À propos</a>
                <a href="/#contact" onClick={handleNavClick} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium">Contact</a>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button
                    onClick={() => {
                      handleNavClick();
                      setLoginModalOpen(true);
                    }}
                    className="block w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition font-medium"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick();
                      setRegisterModalOpen(true);
                    }}
                    className="block w-full text-center bg-gradient-to-r from-red-600 to-gray-900 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    Commencer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </motion.nav>
  );
};

export default PublicNavigation;
