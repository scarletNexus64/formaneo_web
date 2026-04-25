import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Page de retour PayPal après paiement réussi
 * Cette page est affichée dans la popup PayPal après que l'utilisateur ait approuvé le paiement
 */
const PayPalReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const paymentId = searchParams.get('payment_id');
    const token = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');

    console.log('📝 PayPal return page loaded:', {
      paymentId,
      token,
      PayerID
    });

    // Fonction pour fermer la fenêtre de manière agressive
    const closeWindow = () => {
      console.log('📝 Tentative de fermeture de la fenêtre...');

      // Méthode 1: Fermeture standard
      try {
        window.close();
        console.log('✅ window.close() appelé');
      } catch (error) {
        console.error('❌ Erreur window.close():', error);
      }

      // Méthode 2: Fermeture via self.close()
      setTimeout(() => {
        try {
          self.close();
          console.log('✅ self.close() appelé');
        } catch (error) {
          console.error('❌ Erreur self.close():', error);
        }
      }, 100);

      // Méthode 3: Fermeture via window.open('', '_self').close()
      setTimeout(() => {
        try {
          window.open('', '_self', '');
          window.close();
          console.log('✅ Fermeture forcée appelée');
        } catch (error) {
          console.error('❌ Erreur fermeture forcée:', error);
        }
      }, 200);
    };

    // Fermer immédiatement (après un micro délai pour que la page s'affiche)
    const immediateCloseTimer = setTimeout(closeWindow, 500);

    // Essayer de fermer à nouveau après 1.5 secondes si toujours ouvert
    const retryCloseTimer = setTimeout(() => {
      console.log('🔄 Retry fermeture...');
      closeWindow();
    }, 1500);

    return () => {
      clearTimeout(immediateCloseTimer);
      clearTimeout(retryCloseTimer);
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement approuvé ! 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Votre paiement PayPal a été approuvé avec succès. Finalisation en cours...
        </p>

        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto"></div>

        <p className="text-sm text-gray-500 mt-4">
          Cette fenêtre va se fermer automatiquement...
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Si cette fenêtre ne se ferme pas dans quelques secondes,<br />
          <strong className="text-gray-600">vous pouvez la fermer manuellement</strong>
        </p>

        <button
          onClick={() => {
            console.log('🖱️ Bouton de fermeture cliqué');
            try {
              window.close();
            } catch (e) {
              window.open('', '_self', '');
              window.close();
            }
          }}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Fermer cette fenêtre
        </button>
      </motion.div>
    </div>
  );
};

export default PayPalReturnPage;
