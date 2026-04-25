import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import InactiveAccountOverlay from './InactiveAccountOverlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          {/* Loader principal avec effet de pulse */}
          <div className="relative mb-8">
            {/* Cercle extérieur animé */}
            <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ping opacity-20"></div>

            {/* Cercle du milieu */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-red-400 border-l-red-400 animate-spin-slow"></div>

              {/* Point central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Texte avec animation */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 animate-fade-in">
              Formaneo
            </h3>
            <p className="text-sm text-gray-600 animate-fade-in-delayed">
              Vérification de votre session...
            </p>
          </div>

          {/* Barre de progression subtile */}
          <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full animate-progress"></div>
          </div>
        </div>

        <style>{`
          @keyframes spin-slow {
            to {
              transform: rotate(-360deg);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-delayed {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            50% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes progress {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }

          .animate-fade-in-delayed {
            animation: fade-in-delayed 1.2s ease-out forwards;
          }

          .animate-progress {
            animation: progress 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Rediriger vers login si pas authentifié
  if (!isAuthenticated || !user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <InactiveAccountOverlay>
      {children}
    </InactiveAccountOverlay>
  );
};

export default ProtectedRoute;