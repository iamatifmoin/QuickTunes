import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Download, Heart, Clock } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { togglePlayback, toggleLike } from '../store/musicSlice';
import { formatDuration } from '../utils/musicData';

const TrackPreview: React.FC = () => {
  const { currentTrack, isPlaying } = useAppSelector(state => state.music);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      setIsLoading(true);
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        console.warn('Audio failed to load');
        setIsLoading(false);
      };
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', () => dispatch(togglePlayback()));
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', () => dispatch(togglePlayback()));
      };
    }
  }, [currentTrack, dispatch]);

  useEffect(() => {
    if (audioRef.current && !isLoading) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log('Playback failed:', error);
            dispatch(togglePlayback());
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, dispatch, isLoading]);

  const handleDownload = async () => {
    if (currentTrack) {
      try {
        const response = await fetch(currentTrack.audioUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentTrack.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to direct link
        const link = document.createElement('a');
        link.href = currentTrack.audioUrl;
        link.download = `${currentTrack.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/20 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl}
        preload="metadata"
      />
      
      {/* Track Info */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {currentTrack.title}
        </h3>
        <div className="flex justify-center space-x-4">
          <span className="px-4 py-2 bg-purple-200 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
            {currentTrack.mood}
          </span>
          <span className="px-4 py-2 bg-pink-200 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm font-medium">
            {currentTrack.genre}
          </span>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="flex justify-center items-end space-x-1 mb-8 h-16">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className={`bg-gradient-to-t from-purple-600 to-pink-600 rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{
              width: '3px',
              height: `${Math.random() * 60 + 10}px`,
              animationDelay: `${i * 50}ms`
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(duration || currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center space-x-6 mb-6">
        <button
          onClick={() => dispatch(togglePlayback())}
          disabled={isLoading}
          className={`p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:scale-110 hover:shadow-lg transition-all duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>
        
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatDuration(duration || currentTrack.duration)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => dispatch(toggleLike(currentTrack.id))}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-300 hover:scale-105 ${
            currentTrack.isLiked
              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
              : 'bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:border-red-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${currentTrack.isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">
            {currentTrack.isLiked ? 'Liked' : 'Like'}
          </span>
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 hover:scale-105 transition-all duration-300 border-2 border-green-500"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Download</span>
        </button>
      </div>
    </div>
  );
};

export default TrackPreview;