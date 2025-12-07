import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { API_CONFIG } from '../../config/api.config';

interface HybridVideoPlayerProps {
  src: string;
  poster?: string;
  directVideoUrl?: string | null;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onProgress?: (percent: number) => void;
  startTime?: number;
  className?: string;
}

interface OnProgressProps {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

const HybridVideoPlayer: React.FC<HybridVideoPlayerProps> = ({
  src,
  poster,
  directVideoUrl: propDirectVideoUrl,
  onTimeUpdate,
  onEnded,
  onProgress,
  startTime = 0,
  className = ""
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const reactPlayerRef = useRef<any>(null);

  const [playerType, setPlayerType] = useState<'react-player' | 'mega' | 'tiktok' | 'direct' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string>(src);
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);
  const [directVideoUrl, setDirectVideoUrl] = useState<string | null>(null);

  // Résoudre les URLs TikTok et extraire l'URL vidéo directe
  useEffect(() => {
    const processTikTokUrl = async () => {
      const url = src.toLowerCase();

      // Vérifier si c'est une URL TikTok (shortlink ou non)
      if (url.includes('tiktok.com')) {
        // Si on a déjà l'URL directe depuis la base de données, l'utiliser directement
        if (propDirectVideoUrl) {
          console.log('✅ Using pre-extracted TikTok video URL from database:', propDirectVideoUrl);
          setDirectVideoUrl(propDirectVideoUrl);
          setResolvedUrl(propDirectVideoUrl);
          setIsResolvingUrl(false);
          return;
        }

        // Sinon, appeler l'API pour extraire l'URL
        setIsResolvingUrl(true);
        setIsLoading(true);

        try {
          // Utiliser l'API backend pour extraire l'URL vidéo directe
          const response = await fetch(`${API_CONFIG.BASE_URL}/tiktok/video-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: src })
          });

          const data = await response.json();

          if (data.success && data.video_url) {
            console.log('✅ TikTok video URL extracted:', data.video_url);
            setDirectVideoUrl(data.video_url);
            setResolvedUrl(data.video_url);
          } else {
            console.error('❌ Failed to extract TikTok video URL, using iframe fallback');
            setResolvedUrl(src);
          }
        } catch (error) {
          console.error('❌ Error extracting TikTok video URL:', error);
          // En cas d'erreur, utiliser l'URL originale (fallback iframe)
          setResolvedUrl(src);
        } finally {
          setIsResolvingUrl(false);
        }
      } else {
        setResolvedUrl(src);
        setIsResolvingUrl(false);
      }
    };

    processTikTokUrl();
  }, [src, propDirectVideoUrl]);

  // Déterminer le type de player à utiliser
  useEffect(() => {
    // Ne pas déterminer le type de player si on est encore en train de résoudre l'URL
    if (isResolvingUrl) {
      return;
    }

    const url = resolvedUrl.toLowerCase();

    // Si on a extrait l'URL vidéo directe de TikTok, utiliser le lecteur direct
    if (directVideoUrl) {
      console.log('🎵 TikTok direct video URL detected, using Video.js player');
      setPlayerType('direct');
      setIsLoading(false);
    }
    // Vérifier si c'est une URL TikTok sans extraction réussie (fallback iframe)
    else if (url.includes('tiktok.com')) {
      console.log('🎵 TikTok URL detected but no direct URL, using iframe fallback');
      setPlayerType('tiktok');
      setIsLoading(false);
    } else if (url.includes('mega.nz') || url.includes('mega.co.nz')) {
      setPlayerType('mega');
    } else {
      // Vérifier si react-player peut lire cette URL
      const canPlayWithReactPlayer = ReactPlayer.canPlay && ReactPlayer.canPlay(resolvedUrl);

      if (canPlayWithReactPlayer) {
        // react-player supporte YouTube, Vimeo, Facebook, etc.
        setPlayerType('react-player');
      } else {
        setPlayerType('direct');
      }
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed?.()) {
        playerRef.current.dispose?.();
        playerRef.current = null;
      }
    };
  }, [resolvedUrl, isResolvingUrl, directVideoUrl]);

  // Timeout pour forcer la fin du loading si onReady ne se déclenche pas (pour TikTok notamment)
  useEffect(() => {
    if (playerType === 'react-player' && isLoading && !isResolvingUrl) {
      const timeout = setTimeout(() => {
        console.log('Loading timeout - forcing loading to end');
        setIsLoading(false);
      }, 3000); // 3 secondes max pour le chargement du player après résolution URL

      return () => clearTimeout(timeout);
    }
  }, [playerType, isLoading, isResolvingUrl]);

  // Initialiser Video.js pour les vidéos directes
  useEffect(() => {
    if (playerType === 'direct' && videoRef.current && !playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      // Utiliser directVideoUrl pour TikTok, sinon src
      const videoSrc = directVideoUrl || src;

      const player = playerRef.current = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        fill: false,
        aspectRatio: '16:9',
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        poster: poster,
        sources: [{
          src: videoSrc,
          type: getVideoType(videoSrc)
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
  }, [playerType, src, directVideoUrl]);

  const getVideoType = (url: string): string => {
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    if (url.includes('.ogg')) return 'video/ogg';
    if (url.includes('.m3u8')) return 'application/x-mpegURL';
    return 'video/mp4';
  };

  const getMegaEmbedUrl = (url: string): string => {
    if (url.includes('/file/')) {
      return url.replace('/file/', '/embed/');
    }
    return url;
  };

  const getTikTokEmbedUrl = (url: string): string => {
    try {
      // Extraire le video ID de l'URL TikTok
      // Format: https://www.tiktok.com/@username/video/7574909013578485010
      const videoIdMatch = url.match(/\/video\/(\d+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://www.tiktok.com/embed/v2/${videoId}`;
      }
      // Si on ne peut pas extraire l'ID, retourner l'URL originale
      return url;
    } catch (error) {
      console.error('Error extracting TikTok video ID:', error);
      return url;
    }
  };

  // Gestion de la progression pour react-player
  const handleReactPlayerProgress = (state: OnProgressProps) => {
    const percent = state.played * 100;
    onProgress?.(percent);

    // Mettre à jour aussi onTimeUpdate si fourni
    if (onTimeUpdate && state.playedSeconds > 0 && state.played > 0) {
      const duration = state.playedSeconds / state.played;
      onTimeUpdate(state.playedSeconds, duration);
    }
  };

  const handleReactPlayerDuration = (duration: number) => {
    // Démarrer à la position spécifiée si nécessaire
    if (!hasStarted && startTime > 0 && reactPlayerRef.current) {
      reactPlayerRef.current.seekTo(startTime, 'seconds');
      setHasStarted(true);
    }
  };

  const handleReactPlayerReady = () => {
    console.log('React Player Ready');
    setIsLoading(false);
  };

  const handleReactPlayerError = (error: any) => {
    console.error('React Player Error:', error);
    setIsLoading(false);
  };

  const handleReactPlayerStart = () => {
    console.log('React Player Started');
    // Désactiver le loading quand la lecture commence (utile pour TikTok)
    setIsLoading(false);
  };

  // Loading state commun
  const LoadingState = () => (
    <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
        <p className="text-white text-sm">
          {isResolvingUrl ? 'Résolution de l\'URL TikTok...' : 'Chargement de la vidéo...'}
        </p>
      </div>
    </div>
  );

  // Afficher le loading si on est encore en train de résoudre l'URL ou si le player n'est pas encore déterminé
  if (isResolvingUrl || !playerType) {
    return (
      <div className={`video-player-wrapper relative ${className}`} style={{ minHeight: '400px' }}>
        <LoadingState />
      </div>
    );
  }

  // Rendu selon le type de player
  if (playerType === 'react-player') {
    return (
      <div className={`react-player-wrapper relative ${className}`} style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isLoading && <LoadingState />}
        <ReactPlayer
          ref={reactPlayerRef}
          src={resolvedUrl}
          controls
          playing={false}
          width="100%"
          height="100%"
          onReady={handleReactPlayerReady}
          onStart={handleReactPlayerStart}
          onError={handleReactPlayerError}
          onProgress={handleReactPlayerProgress as any}
          onEnded={onEnded}
          onDurationChange={handleReactPlayerDuration as any}
          style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    );
  }

  if (playerType === 'tiktok') {
    console.log('🎵 TikTok video detected:', resolvedUrl);
    const embedUrl = getTikTokEmbedUrl(resolvedUrl);
    console.log('🎵 TikTok embed URL:', embedUrl);

    return (
      <div className={`tiktok-player-wrapper relative ${className}`} style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {isLoading && <LoadingState />}
        <iframe
          src={embedUrl}
          title="Formation Video - TikTok"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
          onLoad={() => {
            console.log('✅ TikTok embed loaded');
            setIsLoading(false);
          }}
          style={{
            width: '325px',
            height: '580px',
            border: '0',
            borderRadius: '8px'
          }}
        />
      </div>
    );
  }

  if (playerType === 'mega') {
    return (
      <div className={`mega-player-wrapper relative ${className}`} style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#000'
      }}>
        {isLoading && <LoadingState />}
        <iframe
          src={getMegaEmbedUrl(src)}
          title="Formation Video - Mega"
          allow="fullscreen"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          style={{
            width: '100%',
            height: '100%',
            border: '0'
          }}
        />
      </div>
    );
  }

  if (playerType === 'direct') {
    return (
      <div className={`video-player-wrapper relative ${className}`} style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isLoading && <LoadingState />}
        <div
          ref={videoRef}
          className="video-js-wrapper"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`video-player-wrapper relative ${className}`}>
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">Format de vidéo non supporté</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ouvrir dans un nouvel onglet
          </a>
        </div>
      </div>
    </div>
  );
};

export default HybridVideoPlayer;
