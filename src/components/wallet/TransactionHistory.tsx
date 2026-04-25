import React from 'react';
import { 
  PlusCircleIcon, 
  MinusCircleIcon, 
  GiftIcon, 
  StarIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { Transaction } from '../../types/wallet.types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, isLoading, pagination, currentPage, onPageChange }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    const iconClasses = "w-5 h-5";
    
    switch (type) {
      case 'deposit':
        return <PlusCircleIcon className={iconClasses} />;
      case 'withdrawal':
        return <MinusCircleIcon className={iconClasses} />;
      case 'bonus':
        return <GiftIcon className={iconClasses} />;
      case 'commission':
        return <StarIcon className={iconClasses} />;
      case 'quiz_reward':
        return <AcademicCapIcon className={iconClasses} />;
      case 'purchase':
        return <ShoppingCartIcon className={iconClasses} />;
      case 'transfer_in':
      case 'transfer_out':
        return <ArrowsRightLeftIcon className={iconClasses} />;
      default:
        return <PlusCircleIcon className={iconClasses} />;
    }
  };

  const getTransactionColor = (type: Transaction['type'], amount: number) => {
    if (amount >= 0) {
      switch (type) {
        case 'deposit':
          return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900';
        case 'bonus':
          return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900';
        case 'commission':
          return 'text-gray-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900';
        case 'quiz_reward':
          return 'text-red-600 dark:text-red-400 bg-indigo-50 dark:bg-indigo-900';
        case 'transfer_in':
          return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900';
        default:
          return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900';
      }
    } else {
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`;
      case 'processing':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`;
      case 'queued':
        return `${baseClasses} bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200`;
      case 'failed':
        return `${baseClasses} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`;
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'queued':
        return 'En file';
      case 'failed':
        return 'Échoué';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historique des transactions</h3>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-1/3 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="text-right">
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historique des transactions</h3>
          {transactions.length > 0 && (
            <button className="text-gray-900 dark:text-blue-400 hover:text-black dark:hover:text-blue-300 text-sm font-medium">
              Voir tout
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
              <ArrowsRightLeftIcon />
            </div>
            <p>Aucune transaction pour le moment</p>
          </div>
        ) : (
          transactions.map((transaction) => {
            const isCredit = transaction.amount >= 0;
            const colorClasses = getTransactionColor(transaction.type, transaction.amount);
            
            return (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isCredit ? '+' : '-'}{formatAmount(transaction.amount)}
                    </p>
                    <span className={getStatusBadge(transaction.status)}>
                      {getStatusText(transaction.status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Info sur mobile, caché sur desktop */}
          <div className="sm:hidden text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
            Page {pagination.current_page} sur {pagination.last_page} ({pagination.total} transactions)
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Info sur desktop, caché sur mobile */}
            <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.current_page} sur {pagination.last_page} ({pagination.total} transactions)
            </div>

            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onPageChange?.(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Précédent
              </button>

              <div className="flex items-center gap-1">
                {/* Pagination intelligente avec ellipses */}
                {(() => {
                  const currentPage = pagination.current_page;
                  const lastPage = pagination.last_page;
                  const pages: (number | string)[] = [];

                  // Logique pour afficher les numéros de page
                  if (lastPage <= 7) {
                    // Si 7 pages ou moins, afficher toutes les pages
                    for (let i = 1; i <= lastPage; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Toujours afficher la première page
                    pages.push(1);

                    if (currentPage > 3) {
                      pages.push('...');
                    }

                    // Pages autour de la page actuelle
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(lastPage - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (currentPage < lastPage - 2) {
                      pages.push('...');
                    }

                    // Toujours afficher la dernière page
                    pages.push(lastPage);
                  }

                  return pages.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-1 text-gray-500 dark:text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange?.(page as number)}
                        className={`min-w-[32px] sm:min-w-[36px] px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                          page === currentPage
                            ? 'bg-red-600 dark:bg-red-700 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}
              </div>

              <button
                onClick={() => onPageChange?.(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;