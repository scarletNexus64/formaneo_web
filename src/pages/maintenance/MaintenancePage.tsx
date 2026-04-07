import React, { useState, useEffect } from 'react';
import maintenanceService from '../../services/maintenanceService';

interface MaintenancePageProps {
  title?: string;
  message?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = () => {
  const [maintenanceInfo, setMaintenanceInfo] = useState({
    title: 'Site en maintenance',
    message: 'Nous effectuons actuellement des travaux de maintenance. Merci de revenir plus tard.'
  });

  useEffect(() => {
    // Get maintenance info from sessionStorage
    const storedInfo = sessionStorage.getItem('maintenanceInfo');
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo);
        setMaintenanceInfo({
          title: parsed.title || maintenanceInfo.title,
          message: parsed.message || maintenanceInfo.message
        });
      } catch (e) {
        console.error('Failed to parse maintenance info:', e);
      }
    }

    // Check maintenance status periodically (every 30 seconds)
    const checkMaintenanceInterval = setInterval(async () => {
      console.log('🔄 Checking if maintenance mode is still active...');
      try {
        const status = await maintenanceService.checkMaintenanceStatus();
        if (!status.inMaintenance) {
          console.log('✅ Maintenance mode is OFF, redirecting to home...');
          maintenanceService.clearMaintenanceInfo();
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      }
    }, 30000); // Check every 30 seconds

    // Initial check after 5 seconds
    const initialCheckTimeout = setTimeout(async () => {
      console.log('🔄 Initial maintenance check...');
      try {
        const status = await maintenanceService.checkMaintenanceStatus();
        if (!status.inMaintenance) {
          console.log('✅ Maintenance mode is OFF, redirecting to home...');
          maintenanceService.clearMaintenanceInfo();
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      }
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(checkMaintenanceInterval);
      clearTimeout(initialCheckTimeout);
    };
  }, []);

  const { title, message } = maintenanceInfo;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4">
      <div className="max-w-2xl w-full">
        {/* Animated maintenance icon */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative text-9xl animate-bounce">
              🛠️
            </div>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto mb-8 rounded-full"></div>

          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
            {message}
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="mt-4 text-blue-700 font-medium">
              Nous travaillons dur pour améliorer votre expérience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Mise à jour rapide</h3>
              <p className="text-sm text-gray-600">
                Nous serons de retour très bientôt
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Données sécurisées</h3>
              <p className="text-sm text-gray-600">
                Vos données sont en sécurité
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Améliorations</h3>
              <p className="text-sm text-gray-600">
                De nouvelles fonctionnalités arrivent
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                // Nettoyer le sessionStorage avant de recharger
                sessionStorage.removeItem('maintenanceInfo');
                window.location.href = '/';
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Réessayer
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">
            Merci de votre patience et de votre compréhension
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
