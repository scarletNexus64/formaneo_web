// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  promo_code: string;
  affiliate_link: string;
  balance: number;
  withdrawal_balance?: number;
  free_quizzes_left: number;
  referred_by?: number;
  fcm_token?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  // Account activation fields
  account_status: 'pending_payment' | 'active' | 'expired' | 'suspended';
  deactivation_reason?: 'none' | 'requires_payment' | 'admin_action' | 'violation' | 'expired' | 'other';
  account_activated_at?: string;
  account_expires_at?: string;
  welcome_bonus_claimed: boolean;
}

// Formation Types
export interface FormationPack {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  promotion_percentage?: number;
  promotion_ends_at?: string;
  thumbnail_url?: string;
  formations_count: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
  formations?: Formation[];
}

export interface Formation {
  id: number;
  pack_id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  duration: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  modules?: Module[];
  progress?: FormationProgress;
}

export interface Module {
  id: number;
  formation_id: number;
  title: string;
  description: string;
  order_index: number;
  duration: number;
  is_completed?: boolean;
  videos?: Video[];
}

export interface Video {
  id: number;
  module_id: number;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  order_index: number;
  is_completed?: boolean;
  progress_percentage?: number;
}

export interface FormationProgress {
  id: number;
  user_id: number;
  formation_id: number;
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  is_completed: boolean;
  completed_at?: string;
  certificate_url?: string;
}

// Product Types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  file_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

// E-book Types
export interface Ebook {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  pdf_url: string;
  cover_url?: string;
  pages: number;
  language: string;
  created_at: string;
  updated_at: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'commission' | 'bonus' | 'transfer';
  amount: number;
  balance_after: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  created_at: string;
  updated_at: string;
}

// Quiz Types
export interface Quiz {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions_count: number;
  passing_score: number;
  attempts_left?: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface QuizResult {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  total_questions: number;
  is_passed: boolean;
  completed_at: string;
}

// Affiliate Types
export interface AffiliateStats {
  total_referrals: number;
  active_referrals: number;
  total_commissions: number;
  pending_commissions: number;
  conversion_rate: number;
  clicks: number;
}

export interface Commission {
  id: number;
  user_id: number;
  referral_id: number;
  amount: number;
  type: string;
  status: 'pending' | 'paid';
  created_at: string;
}

// Cart Types
export interface CartItem {
  id: number;
  product_id?: number;
  pack_id?: number;
  ebook_id?: number;
  type: 'product' | 'pack' | 'ebook';
  title: string;
  price: number;
  thumbnail_url?: string;
  quantity: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  promo_code?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Account Activation Types
export interface AccountActivationInfo {
  account_status: 'pending_payment' | 'active' | 'expired' | 'suspended';
  deactivation_reason?: 'none' | 'requires_payment' | 'admin_action' | 'violation' | 'expired' | 'other';
  account_activated_at?: string;
  account_expires_at?: string;
  welcome_bonus_claimed: boolean;
  activation_cost: number;
  welcome_bonus_amount: number;
}

export interface ActivationPaymentResponse {
  transaction_id: string;
  payment_url: string;
  payment_token: string;
}

// Challenge Types
export interface Challenge {
  id: number;
  title: string;
  description: string;
  reward: number;
  image_url?: string;
  icon_name?: string;
  target?: number;
  expires_at?: string;
  is_active: boolean;
  order: number;
  progress?: number;
  is_completed: boolean;
  reward_claimed?: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeProgress {
  progress: number;
  is_completed: boolean;
  completed_at?: string;
  reward_claimed: boolean;
}