export interface Notification {
  id: number;
  user_id: number | null;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  is_broadcast: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  unread_count: number;
}
