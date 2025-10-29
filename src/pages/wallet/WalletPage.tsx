import React, { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import WalletBalance from '../../components/wallet/WalletBalance';
import WalletActions from '../../components/wallet/WalletActions';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import PendingWithdrawals from '../../components/wallet/PendingWithdrawals';
import Navigation from '../../components/Navigation';
import ActivationGuard from '../../components/ActivationGuard';
import walletService from '../../services/wallet.service';
import { WalletInfo, Transaction } from '../../types/wallet.types';
import toast from 'react-hot-toast';

const WalletPage: React.FC = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: 0,
    available_for_withdrawal: 0,
    pending_withdrawals: 0,
    total_earned: 0,
    total_commissions: 0,
    total_quiz_and_bonus: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsPagination, setTransactionsPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [triggerWithdrawal, setTriggerWithdrawal] = useState(false);

  const loadWalletData = async (showRefreshToast = false, resetPage = false) => {
    try {
      if (showRefreshToast) {
        setIsRefreshing(true);
      }
      
      const pageToLoad = resetPage ? 1 : currentPage;
      
      const [walletData, transactionsResponse] = await Promise.all([
        walletService.getWalletInfo(),
        walletService.getTransactions(pageToLoad, 4)
      ]);
      
      console.log('📊 Données wallet chargées:', walletData);
      
      setWalletInfo(walletData);
      setTransactions(transactionsResponse.transactions);
      setTransactionsPagination(transactionsResponse.pagination);
      
      if (resetPage) {
        setCurrentPage(1);
      }
      
      if (showRefreshToast) {
        toast.success('Données mises à jour');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des données du wallet:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoadingWallet(false);
      setIsLoadingTransactions(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  // Charger les transactions quand la page change
  useEffect(() => {
    if (currentPage > 1) {
      loadTransactions(currentPage);
    }
  }, [currentPage]);

  const loadTransactions = async (page: number) => {
    try {
      setIsLoadingTransactions(true);
      const transactionsResponse = await walletService.getTransactions(page, 4);
      setTransactions(transactionsResponse.transactions);
      setTransactionsPagination(transactionsResponse.pagination);
    } catch (error: any) {
      console.error('Erreur lors du chargement des transactions:', error);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleTransactionComplete = () => {
    // Recharger depuis la page 1 pour voir la nouvelle transaction
    loadWalletData(true, true);
  };

  const handleRefresh = () => {
    loadWalletData(true, true);
  };

  const handleWithdrawClick = () => {
    setTriggerWithdrawal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Portefeuille</h1>
              <p className="text-gray-600 mt-1">Gérez vos fonds et transactions</p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Balance Card */}
          <WalletBalance 
            walletInfo={walletInfo}
            isLoading={isLoadingWallet}
          />

          {/* Actions */}
          <ActivationGuard action="effectuer des opérations wallet">
            <WalletActions 
              walletInfo={walletInfo}
              onTransactionComplete={handleTransactionComplete}
              triggerWithdrawal={triggerWithdrawal}
              onWithdrawalTriggered={() => setTriggerWithdrawal(false)}
            />
          </ActivationGuard>

          {/* Retraits en attente - Commenté car on retire le bloc "Disponible pour retrait" */}
          {/* <ActivationGuard action="effectuer des retraits">
            <PendingWithdrawals 
              walletInfo={walletInfo}
              isLoading={isLoadingWallet}
              onWithdraw={handleWithdrawClick}
            />
          </ActivationGuard> */}

          {/* Transaction History */}
          <TransactionHistory 
            transactions={transactions}
            isLoading={isLoadingTransactions}
            pagination={transactionsPagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;