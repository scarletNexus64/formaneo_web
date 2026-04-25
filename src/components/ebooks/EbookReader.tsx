import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';

interface EbookReaderProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const EbookReader: React.FC<EbookReaderProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen, pdfUrl]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Bloquer le clic droit pour empêcher "Enregistrer sous..."
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  if (!isOpen) return null;

  // Utiliser Google PDF Viewer pour contourner CORS
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col ${
          isFullscreen ? 'w-full h-full' : 'w-11/12 h-5/6 max-w-6xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate flex-1">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="w-6 h-6" />
              ) : (
                <ArrowsPointingOutIcon className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Fermer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF Viewer using Google Docs Viewer */}
        <div
          className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 relative"
          onContextMenu={handleContextMenu}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Chargement du PDF...</p>
              </div>
            </div>
          )}
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0"
            title={title}
            onLoad={() => setIsLoading(false)}
            style={{
              pointerEvents: 'auto',
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lecture en ligne uniquement - Le téléchargement est désactivé
          </p>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;
