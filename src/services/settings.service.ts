import apiService from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface Settings {
  whatsapp_number?: string;
  support_email?: string;
  support_phone?: string;
  [key: string]: any;
}

class SettingsService {
  async getSettings(): Promise<Settings> {
    try {
      const response = await apiService.get<{ settings: Settings }>(ENDPOINTS.SETTINGS.GET);
      return response.data.settings || {};
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  }

  async getWhatsAppNumber(): Promise<string> {
    try {
      const settings = await this.getSettings();
      return settings.whatsapp_number || '+237692573597'; // Numéro par défaut
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
      return '+237692573597'; // Numéro par défaut en cas d'erreur
    }
  }

  async getSupportEmail(): Promise<string> {
    try {
      const settings = await this.getSettings();
      return settings.support_email || 'support@formaneo.com';
    } catch (error) {
      console.error('Error fetching support email:', error);
      return 'support@formaneo.com';
    }
  }

  async getSupportPhone(): Promise<string> {
    try {
      const settings = await this.getSettings();
      return settings.support_phone || '+237691592882';
    } catch (error) {
      console.error('Error fetching support phone:', error);
      return '+237691592882';
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;
export { settingsService };
