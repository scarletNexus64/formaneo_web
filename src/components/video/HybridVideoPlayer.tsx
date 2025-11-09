import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface HybridVideoPlayerProps {
  src: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onProgress?: (percent: number) => void;
  startTime?: number;
  className?: string;
}

const HybridVideoPlayer: React.FC<HybridVideoPlayerProps> = ({
  src,
  poster,
  onTimeUpdate,
  onEnded,
  onProgress,
  startTime = 0,
  className = ""
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [isYouTube, setIsYouTube] = useState(false);
  const [isMega, setIsMega] = useState(false);
  const [youtubeId, setYoutubeId] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour extraire l'ID YouTube
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fonction pour détecter si c'est un lien Mega
  const isMegaLink = (url: string): boolean => {
    return url.includes('mega.nz') || url.includes('mega.co.nz');
  };

  // Fonction pour convertir l'URL YouTube en URL d'embed
  const getYouTubeEmbedUrl = (videoId: string, startTime: number = 0): string => {
    const params = new URLSearchParams({
      autoplay: '0',
      controls: '1',
      modestbranding: '1',
      rel: '0',
      enablejsapi: '1',
      origin: window.location.origin
    });

    if (startTime > 0) {
      params.set('start', Math.floor(startTime).toString());
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Fonction pour convertir un lien Mega en URL d'embed
  const getMegaEmbedUrl = (url: string): string => {
    // Mega supporte les liens d'embed en ajoutant /embed/ avant file
    if (url.includes('/file/')) {
      return url.replace('/file/', '/embed/');
    }
    return url;
  };

  useEffect(() => {
    setIsLoading(true);
    const ytId = extractYouTubeId(src);
    const isMegaUrl = isMegaLink(src);

    if (ytId) {
      setIsYouTube(true);
      setIsMega(false);
      setYoutubeId(ytId);
      setDuration(600); // 10 minutes par défaut
    } else if (isMegaUrl) {
      setIsMega(true);
      setIsYouTube(false);
      setDuration(600); // 10 minutes par défaut
    } else {
      setIsYouTube(false);
      setIsMega(false);
      initializeVideoJS();
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  const initializeVideoJS = () => {
    if (!playerRef.current && videoRef.current && !isYouTube && !isMega) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        poster: poster,
        sources: [{
          src: src,
          type: getVideoType(src)
        }],
        html5: {
          vhs: {
            overrideNative: true
          }
        }
      });

      player.ready(() => {
        if (startTime > 0) {
          player.currentTime(startTime);
        }
        setIsLoading(false);
      });

      // Événements de progression
      player.on('timeupdate', () => {
        const currentTime = player.currentTime() || 0;
        const duration = player.duration() || 0;
        
        if (duration > 0) {
          const percent = (currentTime / duration) * 100;
          onTimeUpdate?.(currentTime, duration);
          onProgress?.(percent);
        }
      });

      player.on('ended', () => {
        onEnded?.();
      });
    }
  };

  const getVideoType = (url: string): string => {
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    if (url.includes('.ogg')) return 'video/ogg';
    if (url.includes('.m3u8')) return 'application/x-mpegURL';
    return 'video/mp4'; // défaut
  };

  // Gérer le chargement de l'iframe
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (isMega) {
    return (
      <div className={`mega-player-wrapper relative ${className}`}>
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
              <p className="text-white text-sm">Chargement de la vidéo...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={getMegaEmbedUrl(src)}
          title="Formation Video - Mega"
          frameBorder="0"
          allow="fullscreen"
          allowFullScreen
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px'
          }}
        />
      </div>
    );
  }

  if (isYouTube) {
    return (
      <div className={`youtube-player-wrapper relative ${className}`}>
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
              <p className="text-white text-sm">Chargement de la vidéo...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={getYouTubeEmbedUrl(youtubeId, startTime)}
          title="Formation Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`video-player-wrapper relative ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-white text-sm">Chargement de la vidéo...</p>
          </div>
        </div>
      )}

      <div
        ref={videoRef}
        className="video-js-wrapper"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default HybridVideoPlayer;