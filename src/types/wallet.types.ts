export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission' | 'bonus' | 'cashback' | 'quiz_reward' | 'transfer_in' | 'transfer_out' | 'purchase';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'queued' | 'processing';
  created_at: string;
  updated_at?: string;
  meta?: any;
}

export interface WalletInfo {
  balance: number;
  available_for_withdrawal: number;
  pending_withdrawals: number;
  total_earned: number;
  total_commissions: number;
  total_quiz_and_bonus: number;
}

export interface DepositResponse {
  success: boolean;
  transaction_id?: string;
  payment_url?: string;
  payment_token?: string;
  message?: string;
  provider?: 'freemopay' | 'cinetpay' | null;
  ussd_mode?: boolean;
}

export interface WithdrawalResponse {
  success: boolean;
  message?: string;
  transaction_id?: string;
  transfer_id?: string;
  new_balance?: number;
  processing_mode?: string;
  isTimeout?: boolean;
  provider?: 'freemopay' | 'cinetpay' | null;
  ussd_mode?: boolean;
}

export interface TransactionStatusResponse {
  success: boolean;
  status?: string;
  cinetpay_status?: string;
  payment_method?: string;
  amount?: number;
  created_at?: string;
  message?: string;
}

export interface WithdrawalSettings {
  min_amount: number;
  max_amount: number;
}