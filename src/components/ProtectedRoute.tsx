import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import InactiveAccountOverlay from './InactiveAccountOverlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
      setIsInitialized(true);
    };

    initialize();
  }, [initializeAuth]);

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si pas authentifié
  if (!isAuthenticated || !user) {
    window.location.href = '/login';
    return null;
  }

  // IMPORTANT: Rediriger vers la page de bienvenue si le bonus n'est pas réclamé
  // Pages exclues de cette redirection (pages liées à l'activation)
  const excludedFromWelcomeRedirect = [
    '/account/welcome',
    '/account/activate',
    '/account/activation/return',
    '/login',
    '/register'
  ];

  const shouldRedirectToWelcome =
    user.account_status === 'active' &&
    !user.welcome_bonus_claimed &&
    !excludedFromWelcomeRedirect.some(path => location.pathname.startsWith(path));

  if (shouldRedirectToWelcome) {
    window.location.href = '/account/welcome';
    return null;
  }

  return (
    <InactiveAccountOverlay>
      {children}
    </InactiveAccountOverlay>
  );
};

export default ProtectedRoute;