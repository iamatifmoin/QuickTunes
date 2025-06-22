import React from 'react';
import { Music, Heart, Clock } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCurrentTrack, toggleLike } from '../store/musicSlice';
import { formatDuration } from '../utils/musicData';

const RecentTracks: React.FC = () => {
  const { recentTracks } = useAppSelector(state => state.music);
  const dispatch = useAppDispatch();

  if (recentTracks.length === 0) return null;

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/20">
      <div className="flex items-center space-x-3 mb-6">
        <Music className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Tracks
        </h2>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {recentTracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-200 cursor-pointer group border border-gray-200 dark:border-gray-600"
            onClick={() => dispatch(setCurrentTrack(track))}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {track.title}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                  {track.mood}
                </span>
                <span className="text-xs px-2 py-1 bg-pink-200 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full">
                  {track.genre}
                </span>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(track.duration)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleLike(track.id));
              }}
              className={`p-2 rounded-full hover:scale-110 transition-all duration-200 ${
                track.isLiked
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTracks;