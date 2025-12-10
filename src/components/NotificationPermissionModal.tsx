import React, { useState, useEffect } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { notificationService } from '../services/notificationService';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEnable = async () => {
    console.log('🔔 [Modal] handleEnable clicked');
    setIsLoading(true);
    try {
      console.log('🔔 [Modal] Calling requestAndRegisterPushNotifications...');
      const success = await notificationService.requestAndRegisterPushNotifications();
      console.log('🔔 [Modal] Result:', success);

      if (success) {
        console.log('✅ [Modal] Success! Closing modal...');
        alert('✅ Notifications activées avec succès!');
        onClose();
      } else {
        console.warn('⚠️ [Modal] Failed to enable notifications');
        alert('⚠️ Une erreur est survenue lors de l\'activation des notifications. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('❌ [Modal] Error enabling notifications:', error);
      const errorMessage = (error as Error).message;

      // Show user-friendly error message
      if (errorMessage.includes('Permission refusée')) {
        alert(
          '🔒 Permission refusée\n\n' +
          'Pour activer les notifications:\n\n' +
          '1. Cliquez sur l\'icône 🔒 à gauche de l\'URL\n' +
          '2. Allez dans "Paramètres du site"\n' +
          '3. Dans "Notifications", changez à "Autoriser"\n' +
          '4. Rechargez la page'
        );
      } else {
        alert('❌ Erreur: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLater = () => {
    // Remember that user clicked "Later"
    localStorage.setItem('notification_modal_dismissed_at', Date.now().toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleLater}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Close button */}
          <button
            onClick={handleLater}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 rounded-full p-4">
              <BellIcon className="h-12 w-12 text-indigo-600" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            Activez les notifications push
          </h3>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            Recevez des notifications en temps réel pour:
          </p>

          {/* Benefits */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Nouvelles formations publiées</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Nouveaux quiz disponibles</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Annonces importantes</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Messages et mises à jour</span>
            </li>
          </ul>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleEnable}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Activation...' : '🔔 Activer les notifications'}
            </button>

            <button
              onClick={handleLater}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Plus tard
            </button>
          </div>

          {/* Small note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Vous pouvez modifier ce paramètre à tout moment dans les réglages
          </p>
        </div>
      </div>
    </div>
  );
};
