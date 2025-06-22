import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { startGenerating, setCurrentTrack } from '../store/musicSlice';
import { generateRandomTrack } from '../utils/musicData';

const GenerateButton: React.FC = () => {
  const { selectedMood, selectedGenre, isGenerating } = useAppSelector(state => state.music);
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    dispatch(startGenerating());
    setProgress(0);

    // Simulate AI generation with progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const newTrack = generateRandomTrack(selectedMood, selectedGenre);
          dispatch(setCurrentTrack(newTrack));
          return 0;
        }
        return prev + 2;
      });
    }, 40); // 2000ms total (50 steps * 40ms)
  };

  return (
    <div className="text-center space-y-6">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`group px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-2xl'
        } text-white shadow-lg`}
      >
        <div className="flex items-center space-x-3">
          <Wand2 className={`w-6 h-6 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform duration-300`} />
          <span>
            {isGenerating ? 'Generating Magic...' : 'Generate Track'}
          </span>
        </div>
      </button>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Creating your {selectedMood.toLowerCase()} {selectedGenre.toLowerCase()} track...
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerateButton;