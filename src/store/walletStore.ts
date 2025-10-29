import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiService from '../services/api.service';

interface WalletState {
  balance: number;
  availableForWithdrawal: number;
  pendingWithdrawals: number;
  totalEarned: number;
  totalCommissions: number;
  totalQuizAndBonus: number;
  isLoading: boolean;
  error: string | null;
  fetchWalletInfo: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
  balance: 0,
  availableForWithdrawal: 0,
  pendingWithdrawals: 0,
  totalEarned: 0,
  totalCommissions: 0,
  totalQuizAndBonus: 0,
  isLoading: false,
  error: null,

  fetchWalletInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get('/wallet/info');
      const data = response.data;
      
      set({
        balance: data.balance || 0,
        availableForWithdrawal: data.available_for_withdrawal || 0,
        pendingWithdrawals: data.pending_withdrawals || 0,
        totalEarned: data.total_earned || 0,
        totalCommissions: data.total_commissions || 0,
        totalQuizAndBonus: data.total_quiz_and_bonus || 0,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching wallet info:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Erreur lors du chargement du wallet' 
      });
    }
  },

  updateBalance: (newBalance: number) => {
    set({ balance: newBalance });
  }
}),
{
  name: 'wallet-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    balance: state.balance,
    availableForWithdrawal: state.availableForWithdrawal,
    pendingWithdrawals: state.pendingWithdrawals,
    totalEarned: state.totalEarned,
    totalCommissions: state.totalCommissions,
    totalQuizAndBonus: state.totalQuizAndBonus
  }),
}
)
);