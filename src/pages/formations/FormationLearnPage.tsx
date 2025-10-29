import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlayIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  VideoCameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import HybridVideoPlayer from '../../components/video/HybridVideoPlayer';
import { formationsService } from '../../services/formations.service';
import { challengeTracker } from '../../services/challengeTracker.service';
import toast from 'react-hot-toast';

interface FormationVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order: number;
  user_progress: number;
  completed_at: string | null;
  type?: 'video' | 'module'; // Pour différencier vidéos et modules
}

interface FormationModule {
  id: number;
  title: string;
  content?: string;
  description?: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  user_progress: number;
  completed_at: string | null;
  type: 'module';
}

interface Formation {
  id: number;
  pack_id: number;
  title: string;
  description: string;
  video_url?: string;
  duration_minutes: number;
  videos?: (FormationVideo | FormationModule)[]; // Maintenant contient vidéos ET modules
  user_progress: number;
  completed_at: string | null;
  modules?: FormationModule[];
}

const FormationLearnPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [currentVideo, setCurrentVideo] = useState<FormationVideo | FormationModule | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastProgressSave, setLastProgressSave] = useState(0);

  useEffect(() => {
    if (id) {
      loadFormation();
    }
  }, [id]);

  const loadFormation = async () => {
    try {
      setIsLoading(true);
      const response = await formationsService.getFormationForLearning(Number(id));
      setFormation({
        ...response,
        user_progress: response.user_progress || 0,
        completed_at: response.completed_at || null
      });
      
      // Déterminer la première vidéo à lire
      const videos = response.videos || [];
      // Filtrer les items qui ont des URLs vidéo
      const playableItems = videos.filter((item: any) => item.video_url);
      
      if (playableItems.length > 0) {
        // Chercher le premier item non terminé, sinon prendre le premier
        const incompleteItem = playableItems.find((v: any) => v.user_progress < 100);
        const itemToPlay = incompleteItem || playableItems[0];
        const itemIndex = videos.findIndex((v: any) => v.id === itemToPlay.id && v.type === itemToPlay.type);
        
        setCurrentVideo(itemToPlay);
        setCurrentVideoIndex(itemIndex);
      } else if (response.video_url) {
        // Si pas de vidéos séparées, utiliser la vidéo principale de la formation
        const mainVideo: FormationVideo = {
          id: response.id,
          title: response.title,
          description: response.description,
          video_url: response.video_url,
          duration_minutes: response.duration_minutes,
          order: 1,
          user_progress: response.user_progress || 0,
          completed_at: response.completed_at || null
        };
        setCurrentVideo(mainVideo);
        setCurrentVideoIndex(0);
      }
    } catch (error) {
      console.error('Error loading formation:', error);
      toast.error('Erreur lors du chargement de la formation');
      navigate('/formations');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVideoProgress = async (itemId: number, progressPercent: number, itemType: 'video' | 'module' = 'video') => {
    try {
      // Pour l'instant, on ne gère la progression que pour les vidéos
      // TODO: Implémenter la progression des modules
      if (itemType === 'video') {
        await formationsService.updateVideoProgress(itemId, progressPercent);
      }
      
      // Mettre à jour localement
      if (formation && formation.videos) {
        const updatedVideos = formation.videos.map(item => 
          item.id === itemId 
            ? { ...item, user_progress: progressPercent, completed_at: progressPercent >= 100 ? new Date().toISOString() : null }
            : item
        );
        setFormation({ ...formation, videos: updatedVideos });
      }
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  const handleVideoProgress = (percent: number) => {
    if (!currentVideo) return;
    
    // Sauvegarder la progression toutes les 10%
    if (Math.floor(percent / 10) > Math.floor(lastProgressSave / 10)) {
      setLastProgressSave(percent);
      updateVideoProgress(currentVideo.id, percent, currentVideo.type || 'video');
    }
  };

  const handleVideoEnd = async () => {
    if (!currentVideo) return;
    
    // Marquer comme terminé
    updateVideoProgress(currentVideo.id, 100, currentVideo.type || 'video');
    
    // Passer à l'item suivant automatiquement
    if (formation && formation.videos && currentVideoIndex < formation.videos.length - 1) {
      setTimeout(() => {
        playNextVideo();
      }, 2000);
    } else {
      toast.success('Formation terminée ! Félicitations ! 🎉');
      // Tracker la completion de la formation
      if (formation) {
        await challengeTracker.trackFormationCompleted(formation.id, formation.title);
      }
    }
  };

  const playVideo = (item: FormationVideo | FormationModule, index: number) => {
    setCurrentVideo(item);
    setCurrentVideoIndex(index);
  };

  const playNextVideo = () => {
    if (!formation || !formation.videos || currentVideoIndex >= formation.videos.length - 1) return;
    
    const nextIndex = currentVideoIndex + 1;
    const nextItem = formation.videos[nextIndex];
    playVideo(nextItem, nextIndex);
  };

  const playPreviousVideo = () => {
    if (!formation || !formation.videos || currentVideoIndex <= 0) return;
    
    const prevIndex = currentVideoIndex - 1;
    const prevItem = formation.videos[prevIndex];
    playVideo(prevItem, prevIndex);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}min`;
    }
    return `${remainingMinutes}min`;
  };

  const calculateFormationProgress = () => {
    if (!formation || !formation.videos || formation.videos.length === 0) return 0;
    
    const totalProgress = formation.videos.reduce((sum, video) => sum + video.user_progress, 0);
    return Math.round(totalProgress / formation.videos.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!formation || !currentVideo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Formation non trouvée</h3>
          <p className="text-gray-400 mb-6">Cette formation n'existe pas ou vous n'y avez pas accès.</p>
          <button
            onClick={() => navigate('/formations')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            Retour aux formations
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = calculateFormationProgress();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/formations/${formation.pack_id}`)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-white font-semibold truncate max-w-md">{formation.title}</h1>
                <p className="text-gray-400 text-sm">
                  {currentVideoIndex + 1} / {formation.videos?.length || 1} • {progressPercent}% terminé
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Bouton pour toggle playlist supprimé - elle est toujours visible */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player - Taille réduite */}
          <div className="relative bg-black" style={{ height: '60vh' }}>
            {currentVideo.video_url ? (
              <HybridVideoPlayer
                src={currentVideo.video_url}
                onProgress={handleVideoProgress}
                onEnded={handleVideoEnd}
                startTime={currentVideo.user_progress > 0 ? (currentVideo.user_progress / 100) * (currentVideo.duration_minutes * 60) : 0}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                  <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">Module de formation</h3>
                  <p className="text-gray-400">Ce module ne contient pas de vidéo</p>
                </div>
              </div>
            )}
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={playPreviousVideo}
                disabled={currentVideoIndex === 0}
                className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              
              <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-md truncate">
                {currentVideo.title}
              </div>
              
              <button
                onClick={playNextVideo}
                disabled={!formation.videos || currentVideoIndex >= formation.videos.length - 1}
                className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Info - Plus compact */}
          <div className="bg-gray-800 p-4 text-white flex-1 overflow-y-auto">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-lg font-semibold">{currentVideo.title}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentVideo.type === 'module' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {currentVideo.type === 'module' ? 'Module' : 'Vidéo'}
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formatDuration(currentVideo.duration_minutes)}
              </div>
              <div className="flex items-center">
                <BookOpenIcon className="w-4 h-4 mr-1" />
                {Math.round(currentVideo.user_progress)}%
              </div>
              {currentVideo.completed_at && (
                <div className="flex items-center text-green-400">
                  <CheckCircleIconSolid className="w-4 h-4 mr-1" />
                  Terminé
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentVideo.type === 'module' ? 'bg-blue-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${currentVideo.user_progress}%` }}
                />
              </div>
            </div>

            {(currentVideo.description || (currentVideo as FormationModule).content) && (
              <div className="text-gray-300 text-sm">
                <p>{currentVideo.description || (currentVideo as FormationModule).content}</p>
              </div>
            )}
          </div>
        </div>

        {/* Playlist Sidebar - Toujours visible */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Header de la playlist */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold flex items-center">
              <ListBulletIcon className="w-5 h-5 mr-2" />
              Playlist ({formation.videos?.length || 1})
            </h3>
          </div>
          
          {/* Liste des vidéos/modules */}
          <div className="flex-1 overflow-y-auto p-2">
            {formation.videos && formation.videos.length > 0 ? (
              formation.videos.map((item, index) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => playVideo(item, index)}
                  className={`w-full p-3 rounded-lg mb-2 text-left transition-all duration-200 ${
                    currentVideo?.id === item.id && currentVideo?.type === item.type
                      ? 'bg-indigo-600 text-white shadow-lg scale-[1.02]'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.user_progress >= 100 ? (
                        <CheckCircleIconSolid className="w-5 h-5 text-green-400" />
                      ) : currentVideo?.id === item.id && currentVideo?.type === item.type ? (
                        <PlayIcon className="w-5 h-5" />
                      ) : item.type === 'module' ? (
                        <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                      ) : (
                        <VideoCameraIcon className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium truncate text-sm">{item.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          item.type === 'module' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {item.type === 'module' ? 'Module' : 'Vidéo'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs opacity-75 mb-2">
                        <span className="flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {formatDuration(item.duration_minutes)}
                        </span>
                        <span className="font-medium">{Math.round(item.user_progress)}%</span>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            item.type === 'module' ? 'bg-blue-400' : 'bg-indigo-400'
                          }`}
                          style={{ width: `${item.user_progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              // Afficher la vidéo principale s'il n'y a pas de vidéos séparées
              currentVideo && (
                <button className="w-full p-3 rounded-lg mb-2 text-left bg-indigo-600 text-white">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <PlayIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate text-sm">{currentVideo.title}</h4>
                      <div className="flex items-center justify-between mt-1 text-xs opacity-75">
                        <span>{formatDuration(currentVideo.duration_minutes)}</span>
                        <span>{Math.round(currentVideo.user_progress)}%</span>
                      </div>
                      
                      {currentVideo.user_progress > 0 && (
                        <div className="mt-2 w-full bg-indigo-400/30 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-400 h-1.5 rounded-full" 
                            style={{ width: `${currentVideo.user_progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationLearnPage;