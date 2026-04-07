import { useEffect, useState, useRef } from 'react';
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
  const hasChecked = useRef(false); // Prevent multiple checks

  useEffect(() => {
    // Only run once on mount
    if (hasChecked.current) {
      console.log('🔍 Maintenance check already done, skipping...');
      return;
    }

    hasChecked.current = true;

    const checkMaintenance = async () => {
      try {
        console.log('🔍 useMaintenanceCheck: Starting check from path:', location.pathname);
        const status = await maintenanceService.checkMaintenanceStatus();

        console.log('🔍 useMaintenanceCheck: Status received:', status);

        if (status.inMaintenance) {
          console.warn('🛠️ App is in maintenance mode, redirecting...');
          setInMaintenance(true);

          // Store maintenance info for the maintenance page
          if (status.title && status.message) {
            maintenanceService.storeMaintenanceInfo(status.title, status.message);
          }

          // Redirect to maintenance page only if not already there
          if (location.pathname !== '/maintenance') {
            navigate('/maintenance', { replace: true });
          }
        } else {
          console.log('✅ App is not in maintenance mode');
          setInMaintenance(false);

          // If we're on the maintenance page but maintenance is OFF, redirect to home
          if (location.pathname === '/maintenance') {
            console.log('🏠 Redirecting from maintenance page to home');
            maintenanceService.clearMaintenanceInfo();
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('❌ Error checking maintenance status:', error);
        // If check fails, assume not in maintenance to avoid blocking users
        setInMaintenance(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Empty array - only run once on mount

  return { isChecking, inMaintenance };
};
