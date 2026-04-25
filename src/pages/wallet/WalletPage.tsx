import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, WalletIcon, SparklesIcon } from '@heroicons/react/24/outline';
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

  // Auto-rafraîchir les données s'il y a des transactions en attente
  useEffect(() => {
    const hasPendingTransactions = transactions.some(t => t.status === 'pending');

    if (!hasPendingTransactions) {
      return;
    }

    // Rafraîchir toutes les 15 secondes s'il y a des transactions pending
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-rafraîchissement: transactions pending détectées');
      loadWalletData(false, false);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [transactions]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <Navigation />

      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-3"
              >
                <WalletIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Mon Portefeuille</h1>
                <p className="text-red-100 dark:text-red-200 mt-1 flex items-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mr-2"
                  >
                    <SparklesIcon className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                  Gérez vos fonds et transactions
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <WalletBalance
              walletInfo={walletInfo}
              isLoading={isLoadingWallet}
            />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ActivationGuard action="effectuer des opérations wallet">
              <WalletActions
                walletInfo={walletInfo}
                onTransactionComplete={handleTransactionComplete}
                triggerWithdrawal={triggerWithdrawal}
                onWithdrawalTriggered={() => setTriggerWithdrawal(false)}
              />
            </ActivationGuard>
          </motion.div>

          {/* Retraits en attente - Commenté car on retire le bloc "Disponible pour retrait" */}
          {/* <ActivationGuard action="effectuer des retraits">
            <PendingWithdrawals 
              walletInfo={walletInfo}
              isLoading={isLoadingWallet}
              onWithdraw={handleWithdrawClick}
            />
          </ActivationGuard> */}

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TransactionHistory
              transactions={transactions}
              isLoading={isLoadingTransactions}
              pagination={transactionsPagination}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;