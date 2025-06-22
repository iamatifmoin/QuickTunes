import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toggleTheme } from '../store/musicSlice';

const ThemeToggle: React.FC = () => {
  const theme = useAppSelector(state => state.music.theme);
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 hover:scale-110 hover:rotate-12"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;