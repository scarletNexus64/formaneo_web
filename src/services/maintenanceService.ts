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
      return {
        inMaintenance: false,
        ...response.data,
      };
    } catch (error: any) {
      // If we get a 503 response with maintenance data, the app is in maintenance mode
      if (error.response?.status === 503 && error.response?.data?.maintenance) {
        return {
          inMaintenance: true,
          title: error.response.data.title,
          message: error.response.data.message,
        };
      }

      // For any other error, assume not in maintenance mode
      console.warn('Failed to check maintenance status:', error);
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
