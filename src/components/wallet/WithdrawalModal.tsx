import React, { useState } from 'react';
import SimpleModal from './SimpleModal';
import walletService from '../../services/wallet.service';
import toast from 'react-hot-toast';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBalance: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  availableBalance 
}) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const operators = walletService.getSupportedOperators();

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setAmount(formattedValue);
  };

  const getNumericAmount = () => {
    return parseFloat(amount.replace(/\s/g, '')) || 0;
  };

  const validateForm = () => {
    const numericAmount = getNumericAmount();
    
    if (!numericAmount || numericAmount <= 0) {
      return { valid: false, message: 'Veuillez entrer un montant valide' };
    }
    
    if (numericAmount < 500) {
      return { valid: false, message: 'Le montant minimum est de 500 FCFA' };
    }
    
    if (numericAmount % 5 !== 0) {
      return { valid: false, message: 'Le montant doit être un multiple de 5' };
    }
    
    if (numericAmount > availableBalance) {
      return { valid: false, message: 'Montant supérieur au solde disponible' };
    }
    
    if (!phoneNumber.trim()) {
      return { valid: false, message: 'Veuillez entrer un numéro de téléphone' };
    }
    
    if (!operator) {
      return { valid: false, message: 'Veuillez sélectionner un opérateur' };
    }
    
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      toast.error(validation.message || 'Erreur de validation');
      return;
    }

    setIsLoading(true);
    
    try {
      const numericAmount = getNumericAmount();
      const formattedPhone = walletService.formatPhoneNumber(phoneNumber);

      const result = await walletService.initiateWithdrawal(
        numericAmount,
        formattedPhone,
        operator
      );
      
      if (result.success) {
        if (result.isTimeout) {
          // Cas spécial pour les timeouts - message plus informatif
          toast.success(
            'Retrait initié avec succès ! \n\nLe traitement se fait en arrière-plan. Consultez l\'historique des transactions pour suivre l\'avancement.',
            { duration: 6000 }
          );
        } else {
          toast.success(result.message || 'Retrait initié avec succès !');
        }
        onSuccess();
        handleClose();
      } else {
        toast.error(result.message || 'Erreur lors du retrait');
      }
    } catch (error: any) {
      console.error('Erreur retrait:', error);
      toast.error('Erreur lors de l\'initiation du retrait');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPhoneNumber('');
    setOperator('');
    setIsLoading(false);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const validation = validateForm();
  const numericAmount = getNumericAmount();

  return (
    <SimpleModal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Retirer des fonds"
    >
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="space-y-4">
          {/* Solde disponible */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-800 text-sm">
              💰 Solde disponible pour retrait: <strong>{formatCurrency(availableBalance)}</strong>
            </p>
          </div>

          {/* Montant */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant à retirer
            </label>
            <div className="relative">
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Ex: 1 000"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  amount && !validation.valid 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-orange-500'
                }`}
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 text-sm">FCFA</span>
            </div>
            {amount && numericAmount > availableBalance && (
              <p className="text-red-500 text-sm mt-1">
                Montant supérieur au solde disponible
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Montant minimum: 500 FCFA (multiple de 5) - Cameroun uniquement
            </p>
          </div>

          {/* Opérateur */}
          <div>
            <label htmlFor="operator" className="block text-sm font-medium text-gray-700 mb-1">
              Opérateur Mobile Money (Cameroun)
            </label>
            <select
              id="operator"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Sélectionner un opérateur</option>
              {operators.map((op) => (
                <option key={op.code} value={op.code}>
                  {op.name} {op.description && `- ${op.description}`}
                </option>
              ))}
            </select>
          </div>

          {/* Numéro de téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ex: 6XXXXXXXX (Cameroun)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <p className="text-gray-500 text-xs mt-1">
              Numéro camerounais pour recevoir l'argent
            </p>
          </div>

          {/* Information sur le traitement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              ⏰ <strong>Traitement en arrière-plan:</strong> Votre retrait sera traité automatiquement. 
              Vous recevrez une notification une fois terminé.
            </p>
          </div>

          {/* Frais (si applicable) */}
          {numericAmount > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant à retirer:</span>
                <span className="font-medium">{formatCurrency(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Frais:</span>
                <span className="font-medium text-green-600">Gratuit</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-sm font-semibold">
                <span>Vous recevrez:</span>
                <span>{formatCurrency(numericAmount)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || !validation.valid}
            className="flex-1 bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Traitement...' : 'Retirer'}
          </button>
        </div>
      </form>
    </SimpleModal>
  );
};

export default WithdrawalModal;