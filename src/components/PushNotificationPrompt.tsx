import React, { useState, useEffect } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { notificationService } from '../services/notificationService';
import { isPushNotificationSupported, isIOSDevice } from '../utils/deviceDetection';

interface PushNotificationPromptProps {
  onClose?: () => void;
}

/**
 * Component to prompt users to enable push notifications
 * Shows a banner at the top of the page if notifications are not enabled
 */
export const PushNotificationPrompt: React.FC<PushNotificationPromptProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Don't show on iOS devices (push notifications not supported)
    if (!isPushNotificationSupported()) {
      console.log('❌ Push notifications not supported on this device, hiding prompt');
      return;
    }

    // Check if notifications are supported
    if (!('Notification' in window)) {
      return;
    }

    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('push_notification_prompt_dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Check if notifications are already enabled
    const isEnabled = notificationService.isPushNotificationsEnabled();
    if (isEnabled) {
      return;
    }

    // Show if permission is default (not asked yet) OR denied (to explain how to enable)
    if (Notification.permission === 'default' || Notification.permission === 'denied') {
      setIsVisible(true);
    }
  }, []);

  const handleEnable = async () => {
    // If permission is denied, show instructions
    if (Notification.permission === 'denied') {
      alert(
        '🔔 Notifications bloquées!\n\n' +
        'Pour activer les notifications:\n\n' +
        '1. Cliquez sur l\'icône 🔒 à gauche de l\'URL\n' +
        '2. Cliquez sur "Paramètres du site"\n' +
        '3. Dans "Notifications", changez à "Autoriser"\n' +
        '4. Rechargez la page'
      );
      return;
    }

    setIsLoading(true);
    try {
      const success = await notificationService.requestAndRegisterPushNotifications();

      if (success) {
        setIsVisible(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_notification_prompt_dismissed', 'true');
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  const isDenied = Notification.permission === 'denied';

  return (
    <div className={`${isDenied ? 'bg-red-600' : 'bg-indigo-600'} text-white px-4 py-3 shadow-lg`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <BellIcon className="h-6 w-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {isDenied ? '🔒 Notifications bloquées' : 'Activez les notifications push'}
            </p>
            <p className="text-xs text-indigo-100 mt-1">
              {isDenied
                ? 'Cliquez pour voir comment débloquer les notifications'
                : 'Recevez des notifications en temps réel pour ne rien manquer!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          <button
            onClick={handleEnable}
            disabled={isLoading}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Activation...' : isDenied ? 'Comment débloquer?' : 'Activer'}
          </button>

          <button
            onClick={handleDismiss}
            className="text-indigo-100 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
