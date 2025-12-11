import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';

class MaintenanceService {
  /**
   * Check if the application is in maintenance mode
   * @returns Promise<{ inMaintenance: boolean, title?: string, message?: string }>
   */
  async checkMaintenanceStatus(): Promise<{
    inMaintenance: boolean;
    title?: string;
    message?: string;
  }> {
    try {
      const response = await apiService.get(ENDPOINTS.MAINTENANCE.STATUS);

      // Simple approach: API always returns 200 OK with maintenance flag
      const data = response.data;

      if (data.maintenance === true) {
        console.log('🔧 Maintenance mode is ACTIVE', {
          title: data.title,
          message: data.message,
        });

        return {
          inMaintenance: true,
          title: data.title,
          message: data.message,
        };
      }

      console.log('✅ Maintenance mode is NOT active');
      return {
        inMaintenance: false,
      };

    } catch (error: any) {
      // For any error, assume not in maintenance mode to avoid blocking users
      console.warn('⚠️ Failed to check maintenance status:', error);
      return {
        inMaintenance: false,
      };
    }
  }

  /**
   * Store maintenance info in sessionStorage for the maintenance page
   */
  storeMaintenanceInfo(title: string, message: string): void {
    sessionStorage.setItem('maintenanceInfo', JSON.stringify({ title, message }));
  }

  /**
   * Get maintenance info from sessionStorage
   */
  getMaintenanceInfo(): { title: string; message: string } | null {
    const storedInfo = sessionStorage.getItem('maintenanceInfo');
    if (storedInfo) {
      try {
        return JSON.parse(storedInfo);
      } catch (e) {
        console.error('Failed to parse maintenance info:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Clear maintenance info from sessionStorage
   */
  clearMaintenanceInfo(): void {
    sessionStorage.removeItem('maintenanceInfo');
  }
}

const maintenanceService = new MaintenanceService();
export default maintenanceService;
