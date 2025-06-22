import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MusicState, Track, Mood, Genre } from '../types/music';

const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Handle localStorage errors silently
  }
};

const initialState: MusicState = {
  currentTrack: null,
  isGenerating: false,
  isPlaying: false,
  selectedMood: 'Happy',
  selectedGenre: 'Pop',
  recentTracks: loadFromLocalStorage('wubble-recent-tracks', []),
  likedTracks: loadFromLocalStorage('wubble-liked-tracks', []),
  theme: loadFromLocalStorage('wubble-theme', 'light')
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setMood: (state, action: PayloadAction<Mood>) => {
      state.selectedMood = action.payload;
    },
    setGenre: (state, action: PayloadAction<Genre>) => {
      state.selectedGenre = action.payload;
    },
    startGenerating: (state) => {
      state.isGenerating = true;
    },
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isGenerating = false;
      state.isPlaying = false;
      
      // Add to recent tracks
      const newRecentTracks = [action.payload, ...state.recentTracks.filter(t => t.id !== action.payload.id)].slice(0, 10);
      state.recentTracks = newRecentTracks;
      saveToLocalStorage('wubble-recent-tracks', newRecentTracks);
    },
    togglePlayback: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      
      // Update current track if it matches
      if (state.currentTrack?.id === trackId) {
        state.currentTrack.isLiked = !state.currentTrack.isLiked;
      }
      
      // Update recent tracks
      state.recentTracks = state.recentTracks.map(track => 
        track.id === trackId ? { ...track, isLiked: !track.isLiked } : track
      );
      
      // Update liked tracks
      const track = state.recentTracks.find(t => t.id === trackId) || state.currentTrack;
      if (track) {
        if (track.isLiked) {
          state.likedTracks = [...state.likedTracks.filter(t => t.id !== trackId), track];
        } else {
          state.likedTracks = state.likedTracks.filter(t => t.id !== trackId);
        }
        saveToLocalStorage('wubble-liked-tracks', state.likedTracks);
        saveToLocalStorage('wubble-recent-tracks', state.recentTracks);
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveToLocalStorage('wubble-theme', state.theme);
    }
  }
});

export const {
  setMood,
  setGenre,
  startGenerating,
  setCurrentTrack,
  togglePlayback,
  toggleLike,
  toggleTheme
} = musicSlice.actions;

export default musicSlice.reducer;