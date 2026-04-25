import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface WithdrawalData {
  paymentMethod: 'paypal' | 'visa' | 'mastercard';
  amount: number;
  email?: string;
  cardNumber?: string;
  cardName?: string;
  cardCvv?: string;
  cardExpiry?: string;
  cardType?: string;
}

const WithdrawalPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Récupérer les données du localStorage
    const data = localStorage.getItem('pendingWithdrawalRequest');
    if (data) {
      setWithdrawalData(JSON.parse(data));
    } else {
      // Si pas de données, rediriger vers le wallet
      toast.error('Aucune demande de retrait en cours');
      navigate('/wallet');
    }
  }, [navigate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  const generateEmailContent = () => {
    if (!withdrawalData || !user) return { subject: '', body: '' };

    let subject = '';
    let body = '';

    if (withdrawalData.paymentMethod === 'paypal') {
      subject = `Demande de retrait PayPal - ${user.name}`;
      body = `Bonjour,

Je souhaite effectuer un retrait vers mon compte PayPal.

Informations de la demande :
- Nom : ${user.name}
- Email utilisateur : ${user.email}
- Montant : ${formatCurrency(withdrawalData.amount)}
- Moyen de paiement : PayPal
- Email PayPal : ${withdrawalData.email}

Merci de traiter ma demande dans les meilleurs délais.

Cordialement,
${user.name}`;
    } else {
      subject = `Demande de retrait ${withdrawalData.paymentMethod?.toUpperCase()} - ${user.name}`;
      body = `Bonjour,

Je souhaite effectuer un retrait vers ma carte bancaire.

Informations de la demande :
- Nom : ${user.name}
- Email utilisateur : ${user.email}
- Montant : ${formatCurrency(withdrawalData.amount)}
- Type de carte : ${withdrawalData.cardType?.toUpperCase()}
- Numéro de carte : ${maskCardNumber(withdrawalData.cardNumber || '')}
- Nom du titulaire : ${withdrawalData.cardName}
- Date d'expiration : ${withdrawalData.cardExpiry}

Merci de traiter ma demande dans les meilleurs délais.

Cordialement,
${user.name}`;
    }

    return { subject, body };
  };

  const handleSubmit = async () => {
    if (!withdrawalData) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/api/v1/withdrawal-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          payment_method: withdrawalData.paymentMethod,
          amount: withdrawalData.amount,
          payment_details: withdrawalData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.removeItem('pendingWithdrawalRequest');
        toast.success('Demande de retrait envoyée avec succès !');
        navigate('/messages');
      } else {
        toast.error(data.message || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('pendingWithdrawalRequest');
    navigate('/wallet');
  };

  if (!withdrawalData) {
    return null;
  }

  const emailContent = generateEmailContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-gray-900 dark:from-red-700 dark:to-black border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <button
              onClick={handleCancel}
              className="mr-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-3"
              >
                <EnvelopeIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Prévisualisation de la demande</h1>
                <p className="text-red-100 dark:text-red-200 mt-1">
                  Vérifiez les informations avant d'envoyer
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Email Preview Header */}
          <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <EnvelopeIcon className="w-5 h-5" />
              <span className="font-medium">Aperçu du message</span>
            </div>
          </div>

          {/* Email Content */}
          <div className="p-6 space-y-4">
            {/* Subject */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Objet :</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {emailContent.subject}
              </p>
            </div>

            {/* Body */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {emailContent.body}
              </pre>
            </div>

            {/* Payment Details Card */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {withdrawalData.paymentMethod === 'paypal' ? (
                  <EnvelopeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                ) : (
                  <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Informations de paiement
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <p>Type : {withdrawalData.paymentMethod?.toUpperCase()}</p>
                    <p>Montant : {formatCurrency(withdrawalData.amount)}</p>
                    {withdrawalData.paymentMethod === 'paypal' && (
                      <p>Email : {withdrawalData.email}</p>
                    )}
                    {(withdrawalData.paymentMethod === 'visa' || withdrawalData.paymentMethod === 'mastercard') && (
                      <>
                        <p>Carte : {maskCardNumber(withdrawalData.cardNumber || '')}</p>
                        <p>Titulaire : {withdrawalData.cardName}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                ⚠️ <strong>Important :</strong> Assurez-vous que toutes les informations sont correctes avant d'envoyer.
                Cette demande sera traitée par nos administrateurs.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Envoi en cours...</span>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Envoyer la demande</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
        >
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Que se passe-t-il ensuite ?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Votre demande sera envoyée à nos administrateurs</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Vous recevrez un message de confirmation dans votre boîte de messagerie</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Les administrateurs traiteront votre demande dans les meilleurs délais</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Vous serez notifié lorsque le retrait sera effectué</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default WithdrawalPreviewPage;
