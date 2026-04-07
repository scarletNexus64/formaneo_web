import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PendingPayment {
  transactionId: string;
  type: 'activation' | 'deposit' | 'withdrawal';
  provider: 'freemopay' | 'cinetpay';
  amount?: number;
  startedAt: string;
}

interface PaymentContextType {
  pendingPayments: PendingPayment[];
  addPendingPayment: (payment: PendingPayment) => void;
  removePendingPayment: (transactionId: string) => void;
  clearPendingPayments: () => void;
  hasPendingPayments: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const STORAGE_KEY = 'formaneo_pending_payments';

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

  // Charger les paiements en cours depuis localStorage au mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const payments: PendingPayment[] = JSON.parse(stored);

        // Filtrer les paiements trop anciens (plus de 15 minutes)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const validPayments = payments.filter(p => p.startedAt > fifteenMinutesAgo);

        if (validPayments.length !== payments.length) {
          // Si on a filtré des paiements, sauvegarder la liste mise à jour
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validPayments));
        }

        setPendingPayments(validPayments);

        if (validPayments.length > 0) {
          console.log('Paiements en cours récupérés depuis localStorage:', validPayments);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements en cours:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Sauvegarder dans localStorage quand la liste change
  useEffect(() => {
    if (pendingPayments.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingPayments));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [pendingPayments]);

  const addPendingPayment = (payment: PendingPayment) => {
    setPendingPayments(prev => {
      // Éviter les doublons
      const exists = prev.some(p => p.transactionId === payment.transactionId);
      if (exists) {
        console.log('Paiement déjà en cours:', payment.transactionId);
        return prev;
      }

      console.log('Ajout paiement en cours:', payment);
      return [...prev, payment];
    });
  };

  const removePendingPayment = (transactionId: string) => {
    setPendingPayments(prev => {
      const filtered = prev.filter(p => p.transactionId !== transactionId);
      console.log('Retrait paiement en cours:', transactionId);
      return filtered;
    });
  };

  const clearPendingPayments = () => {
    setPendingPayments([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('Tous les paiements en cours ont été effacés');
  };

  const value: PaymentContextType = {
    pendingPayments,
    addPendingPayment,
    removePendingPayment,
    clearPendingPayments,
    hasPendingPayments: pendingPayments.length > 0,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext doit être utilisé dans un PaymentProvider');
  }
  return context;
};
