import { API_CONFIG } from '../config/api.config';

/**
 * Construit l'URL complète pour une image
 * @param thumbnailUrl URL relative ou absolue de l'image
 * @returns URL complète de l'image ou null si pas d'URL
 */
export const getFullImageUrl = (thumbnailUrl?: string | null): string | null => {
  if (!thumbnailUrl || thumbnailUrl.trim() === '') {
    return null;
  }

  // Si l'URL est déjà absolue, la retourner telle quelle
  if (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://')) {
    return thumbnailUrl;
  }

  // Construire l'URL complète avec le domaine de base
  // Nettoyer l'URL de base pour éviter les doubles slashes
  const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '');
  const cleanThumbnailUrl = thumbnailUrl.startsWith('/') ? thumbnailUrl : `/${thumbnailUrl}`;
  
  return `${baseUrl}${cleanThumbnailUrl}`;
};

/**
 * Vérifie si une URL d'image est valide
 * @param url URL à vérifier
 * @returns true si l'URL semble valide
 */
export const isValidImageUrl = (url?: string | null): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};