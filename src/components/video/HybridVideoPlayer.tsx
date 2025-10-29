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
  const [youtubeId, setYoutubeId] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fonction pour extraire l'ID YouTube
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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

  useEffect(() => {
    const ytId = extractYouTubeId(src);
    if (ytId) {
      setIsYouTube(true);
      setYoutubeId(ytId);
      // Simuler une durée pour YouTube (on ne peut pas la récupérer facilement)
      setDuration(600); // 10 minutes par défaut
    } else {
      setIsYouTube(false);
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
    if (!playerRef.current && videoRef.current && !isYouTube) {
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

  // Simuler la progression pour YouTube
  useEffect(() => {
    if (isYouTube) {
      const interval = setInterval(() => {
        // Simulation simple de progression
        const newTime = currentTime + 1;
        setCurrentTime(newTime);
        
        if (duration > 0) {
          const percent = (newTime / duration) * 100;
          onTimeUpdate?.(newTime, duration);
          onProgress?.(percent);
          
          if (percent >= 100) {
            onEnded?.();
            clearInterval(interval);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isYouTube, currentTime, duration, onTimeUpdate, onProgress, onEnded]);

  if (isYouTube) {
    return (
      <div className={`youtube-player-wrapper ${className}`}>
        <iframe
          ref={iframeRef}
          src={getYouTubeEmbedUrl(youtubeId, startTime)}
          title="Formation Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '400px'
          }}
        />
        
        {/* Contrôles personnalisés pour YouTube */}
        <div className="youtube-custom-controls absolute bottom-4 left-4 right-4 bg-black/50 text-white p-2 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Vidéo YouTube</span>
            <span>{Math.round((currentTime / duration) * 100)}% terminé</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-player-wrapper ${className}`}>
      <div
        ref={videoRef}
        className="video-js-wrapper"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default HybridVideoPlayer;