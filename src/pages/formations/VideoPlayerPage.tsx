import React from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayerPage = () => {
  const { id, videoId } = useParams();

  return (
    <div>
      <h1>Video Player Page</h1>
      <p>Formation ID: {id}</p>
      <p>Video ID: {videoId}</p>
      <p>Page en cours de développement...</p>
    </div>
  );
};

export default VideoPlayerPage;