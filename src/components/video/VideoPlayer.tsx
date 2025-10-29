import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onProgress?: (percent: number) => void;
  startTime?: number;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  onTimeUpdate,
  onEnded,
  onProgress,
  startTime = 0,
  className = ""
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
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
          type: 'video/mp4'
        }],
        html5: {
          vhs: {
            overrideNative: true
          }
        }
      });

      player.ready(() => {
        setIsReady(true);
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

      // Sauvegarder la progression toutes les 5 secondes
      let lastSaveTime = 0;
      player.on('timeupdate', () => {
        const currentTime = player.currentTime() || 0;
        if (currentTime - lastSaveTime > 5) {
          lastSaveTime = currentTime;
          // Auto-save sera géré par le composant parent
        }
      });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Mise à jour de la source vidéo
  useEffect(() => {
    if (playerRef.current && isReady) {
      playerRef.current.src({
        src: src,
        type: 'video/mp4'
      });
      
      if (poster) {
        playerRef.current.poster(poster);
      }

      if (startTime > 0) {
        playerRef.current.ready(() => {
          playerRef.current.currentTime(startTime);
        });
      }
    }
  }, [src, poster, startTime, isReady]);

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

export default VideoPlayer;