import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/outline';

/**
 * Page d'annulation PayPal
 * Cette page est affichée dans la popup PayPal lorsque l'utilisateur annule le paiement
 */
const PayPalCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const paymentId = searchParams.get('payment_id');
    const token = searchParams.get('token');

    console.log('❌ PayPal cancel page loaded:', {
      paymentId,
      token
    });

    // Fonction pour fermer la fenêtre de manière agressive
    const closeWindow = () => {
      console.log('❌ Tentative de fermeture de la fenêtre (annulation)...');

      // Méthode 1: Fermeture standard
      try {
        window.close();
        console.log('✅ window.close() appelé (annulation)');
      } catch (error) {
        console.error('❌ Erreur window.close() (annulation):', error);
      }

      // Méthode 2: Fermeture via self.close()
      setTimeout(() => {
        try {
          self.close();
          console.log('✅ self.close() appelé (annulation)');
        } catch (error) {
          console.error('❌ Erreur self.close() (annulation):', error);
        }
      }, 100);

      // Méthode 3: Fermeture via window.open('', '_self').close()
      setTimeout(() => {
        try {
          window.open('', '_self', '');
          window.close();
          console.log('✅ Fermeture forcée appelée (annulation)');
        } catch (error) {
          console.error('❌ Erreur fermeture forcée (annulation):', error);
        }
      }, 200);
    };

    // Fermer immédiatement (après un micro délai pour que la page s'affiche)
    const immediateCloseTimer = setTimeout(closeWindow, 500);

    // Essayer de fermer à nouveau après 1.5 secondes si toujours ouvert
    const retryCloseTimer = setTimeout(() => {
      console.log('🔄 Retry fermeture (annulation)...');
      closeWindow();
    }, 1500);

    return () => {
      clearTimeout(immediateCloseTimer);
      clearTimeout(retryCloseTimer);
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
        >
          <XCircleIcon className="w-12 h-12 text-red-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement annulé
        </h1>

        <p className="text-gray-600 mb-6">
          Vous avez annulé le paiement PayPal. Aucun montant n'a été débité.
        </p>

        <p className="text-sm text-gray-500 mb-2">
          Cette fenêtre va se fermer automatiquement...
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Si cette fenêtre ne se ferme pas dans quelques secondes,<br />
          <strong className="text-gray-600">vous pouvez la fermer manuellement</strong>
        </p>

        <button
          onClick={() => {
            console.log('🖱️ Bouton de fermeture cliqué (annulation)');
            try {
              window.close();
            } catch (e) {
              window.open('', '_self', '');
              window.close();
            }
          }}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Fermer cette fenêtre
        </button>
      </motion.div>
    </div>
  );
};

export default PayPalCancelPage;
