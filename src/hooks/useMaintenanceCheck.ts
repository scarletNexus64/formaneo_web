import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import maintenanceService from '../services/maintenanceService';

/**
 * Hook to check for maintenance mode on app load
 * Redirects to /maintenance if the app is in maintenance mode
 */
export const useMaintenanceCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [inMaintenance, setInMaintenance] = useState(false);

  useEffect(() => {
    // Skip check if already on maintenance page
    if (location.pathname === '/maintenance') {
      setIsChecking(false);
      setInMaintenance(true);
      return;
    }

    const checkMaintenance = async () => {
      try {
        const status = await maintenanceService.checkMaintenanceStatus();

        if (status.inMaintenance) {
          console.warn('🛠️ App is in maintenance mode, redirecting...');
          setInMaintenance(true);

          // Store maintenance info for the maintenance page
          if (status.title && status.message) {
            maintenanceService.storeMaintenanceInfo(status.title, status.message);
          }

          // Redirect to maintenance page
          navigate('/maintenance', { replace: true });
        } else {
          console.log('✅ App is not in maintenance mode');
          setInMaintenance(false);
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
        // If check fails, assume not in maintenance to avoid blocking users
        setInMaintenance(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenance();
  }, [navigate, location.pathname]);

  return { isChecking, inMaintenance };
};
