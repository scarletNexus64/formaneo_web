/**
 * Utility functions for affiliate link generation
 */

/**
 * Get the base URL dynamically based on environment
 * @returns The base URL for the application
 */
export const getBaseUrl = (): string => {
  // Check if we're in development or production
  if (process.env.NODE_ENV === 'development') {
    // In development, use window.location to get the current host
    if (typeof window !== 'undefined') {
      const { protocol, hostname, port } = window.location;
      return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }
    // Fallback for SSR or non-browser environments
    return 'http://10.193.76.109:3000';
  }

  // In production, use the actual domain
  // You can also use an environment variable here
  return process.env.REACT_APP_BASE_URL || window.location.origin;
};

/**
 * Generate an affiliate registration link with promo code
 * @param promoCode The user's promo code
 * @returns The full affiliate link URL
 */
export const generateAffiliateLink = (promoCode: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/register?ref=${promoCode}`;
};

/**
 * Generate a shareable text message for social media
 * @param promoCode The user's promo code
 * @param userName Optional user name for personalization
 * @returns A shareable message with the affiliate link
 */
export const generateShareMessage = (promoCode: string, userName?: string): string => {
  const link = generateAffiliateLink(promoCode);
  const greeting = userName ? `Salut ! ${userName} vous invite` : 'Rejoignez Formaneo';

  return `${greeting} sur Formaneo - La plateforme d'apprentissage en ligne !

Inscrivez-vous avec mon code promo : ${promoCode}

${link}

Profitez de formations de qualité et gagnez en compétences ! 🚀`;
};

/**
 * Copy text to clipboard with fallback
 * @param text Text to copy
 * @returns Promise that resolves when copy is complete
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (error) {
    return false;
  }
};
