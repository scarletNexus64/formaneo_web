import React, { useState, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface ChallengeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const ChallengeImage: React.FC<ChallengeImageProps> = ({
  src,
  alt,
  className = "h-12 w-12 rounded-lg",
  fallbackIcon,
  objectFit = 'cover'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Mettre à jour l'image source quand la prop change
  useEffect(() => {
    if (src) {
      setImageSrc(src);
      setLoading(true);
      setError(false);
    }
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    console.warn(`Erreur de chargement de l'image: ${imageSrc}`);
    setLoading(false);
    setError(true);
  };

  // Déterminer la classe object-fit
  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  // Si pas d'URL ou erreur, afficher le fallback
  if (!src || error) {
    return (
      <div className={`${className} bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0`}>
        {fallbackIcon || <TrophyIcon className="h-6 w-6 text-white" />}
      </div>
    );
  }

  return (
    <div className={`${className} relative flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800`}>
      {/* Loader pendant le chargement */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-500 border-t-transparent"></div>
        </div>
      )}

      {/* Image */}
      <img
        src={imageSrc || ''}
        alt={alt}
        className={`w-full h-full ${objectFitClass} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default ChallengeImage;
