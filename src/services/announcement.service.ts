import api from './api.service';
import { ENDPOINTS } from '../config/api.config';
import { Announcement, PaginatedResponse } from '../types';

export interface AnnouncementFilters {
  type?: 'info' | 'warning' | 'success' | 'danger';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  per_page?: number;
  page?: number;
}

class AnnouncementService {
  /**
   * Get list of active announcements with optional filters
   */
  async getAnnouncements(filters?: AnnouncementFilters): Promise<PaginatedResponse<Announcement>> {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.ANNOUNCEMENTS.LIST}?${queryString}` : ENDPOINTS.ANNOUNCEMENTS.LIST;

    const response = await api.get<{
      success: boolean;
      data: Announcement[];
      pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(url);

    return {
      data: response.data.data,
      current_page: response.data.pagination.current_page,
      last_page: response.data.pagination.last_page,
      per_page: response.data.pagination.per_page,
      total: response.data.pagination.total,
    };
  }

  /**
   * Get a single announcement by ID
   */
  async getAnnouncement(id: string): Promise<Announcement> {
    const response = await api.get<{
      success: boolean;
      data: Announcement;
    }>(ENDPOINTS.ANNOUNCEMENTS.DETAIL(id));

    return response.data.data;
  }

  /**
   * Get urgent announcements (priority = urgent)
   */
  async getUrgentAnnouncements(): Promise<Announcement[]> {
    const response = await this.getAnnouncements({ priority: 'urgent', per_page: 5 });
    return response.data;
  }

  /**
   * Get announcements by type
   */
  async getAnnouncementsByType(type: 'info' | 'warning' | 'success' | 'danger'): Promise<Announcement[]> {
    const response = await this.getAnnouncements({ type, per_page: 10 });
    return response.data;
  }
}

export default new AnnouncementService();
