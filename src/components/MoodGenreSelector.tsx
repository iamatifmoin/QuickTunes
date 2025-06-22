import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setMood, setGenre } from '../store/musicSlice';
import { Mood, Genre } from '../types/music';

const MOODS: { value: Mood; emoji: string; color: string }[] = [
  { value: 'Happy', emoji: '😊', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { value: 'Sad', emoji: '😢', color: 'bg-blue-500 hover:bg-blue-600' },
  { value: 'Energetic', emoji: '⚡', color: 'bg-red-500 hover:bg-red-600' },
  { value: 'Chill', emoji: '😌', color: 'bg-green-500 hover:bg-green-600' }
];

const GENRES: { value: Genre; icon: string; color: string }[] = [
  { value: 'Pop', icon: '🎵', color: 'bg-pink-500 hover:bg-pink-600' },
  { value: 'Lo-fi', icon: '🌙', color: 'bg-purple-500 hover:bg-purple-600' },
  { value: 'Cinematic', icon: '🎬', color: 'bg-indigo-500 hover:bg-indigo-600' },
  { value: 'EDM', icon: '🔊', color: 'bg-orange-500 hover:bg-orange-600' }
];

const MoodGenreSelector: React.FC = () => {
  const { selectedMood, selectedGenre } = useAppSelector(state => state.music);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-8">
      {/* Mood Selection */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          What's your mood?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOODS.map(({ value, emoji, color }) => (
            <button
              key={value}
              onClick={() => dispatch(setMood(value))}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedMood === value
                  ? `${color} border-white text-white shadow-lg transform scale-105`
                  : 'bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-semibold">{value}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Pick your genre
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map(({ value, icon, color }) => (
            <button
              key={value}
              onClick={() => dispatch(setGenre(value))}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedGenre === value
                  ? `${color} border-white text-white shadow-lg transform scale-105`
                  : 'bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-semibold">{value}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodGenreSelector;