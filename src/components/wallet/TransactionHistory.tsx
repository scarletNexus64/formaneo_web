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
          return 'text-green-600 bg-green-50';
        case 'bonus':
          return 'text-purple-600 bg-purple-50';
        case 'commission':
          return 'text-blue-600 bg-blue-50';
        case 'quiz_reward':
          return 'text-indigo-600 bg-indigo-50';
        case 'transfer_in':
          return 'text-green-600 bg-green-50';
        default:
          return 'text-green-600 bg-green-50';
      }
    } else {
      return 'text-red-600 bg-red-50';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'queued':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des transactions</h3>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/3 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="text-right">
                <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Historique des transactions</h3>
          {transactions.length > 0 && (
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
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
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      isCredit ? 'text-green-600' : 'text-red-600'
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
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.current_page} sur {pagination.last_page} ({pagination.total} transactions)
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <div className="flex items-center space-x-1">
              {/* Afficher toutes les pages avec un style plus compact */}
              {[...Array(pagination.last_page)].map((_, index) => {
                const pageNumber = index + 1;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange?.(pageNumber)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                      pageNumber === pagination.current_page
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange?.(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;