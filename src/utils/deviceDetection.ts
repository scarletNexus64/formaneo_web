/**
 * Utility functions for device detection
 */

/**
 * Check if the current device is iOS (iPhone, iPad, iPod)
 */
export const isIOS = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

/**
 * Check if the current browser is Safari
 */
export const isSafari = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /safari/.test(userAgent) && !/chrome/.test(userAgent);
};

/**
 * Check if the current device is an iOS device
 * This is a comprehensive check that includes both user agent and platform checks
 */
export const isIOSDevice = (): boolean => {
  // Check for iOS devices via user agent
  if (isIOS()) {
    return true;
  }

  // Check for iPadOS 13+ which reports as Mac
  // iPadOS 13+ identifies as Mac, so we check for touch support + Mac platform
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }

  return false;
};

/**
 * Check if push notifications are supported on this device/browser
 * Note: iOS/Safari does not support Web Push Notifications
 */
export const isPushNotificationSupported = (): boolean => {
  // Check if Notification API is available
  if (!('Notification' in window)) {
    return false;
  }

  // Check if Service Workers are supported
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  // iOS doesn't support web push notifications (as of iOS 17)
  // Safari on iOS doesn't support the Push API
  if (isIOSDevice()) {
    console.warn('❌ Push notifications are not supported on iOS/Safari');
    return false;
  }

  return true;
};

/**
 * Get a user-friendly message explaining why push notifications are not available
 */
export const getPushNotificationUnavailableMessage = (): string => {
  if (isIOSDevice()) {
    return 'Les notifications push web ne sont pas disponibles sur iOS/Safari. Veuillez installer notre application mobile pour recevoir des notifications.';
  }

  if (!('Notification' in window)) {
    return 'Votre navigateur ne supporte pas les notifications push.';
  }

  if (!('serviceWorker' in navigator)) {
    return 'Votre navigateur ne supporte pas les Service Workers nécessaires pour les notifications.';
  }

  return 'Les notifications push ne sont pas disponibles sur ce navigateur.';
};

/**
 * Check if the device is a mobile device
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get device type
 */
export const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
  if (isIOSDevice()) {
    return 'ios';
  }

  if (/android/i.test(navigator.userAgent)) {
    return 'android';
  }

  return 'desktop';
};
