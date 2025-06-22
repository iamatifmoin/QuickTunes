export interface Track {
  id: string;
  title: string;
  mood: Mood;
  genre: Genre;
  audioUrl: string;
  duration: number;
  isLiked: boolean;
  createdAt: number;
}

export type Mood = 'Happy' | 'Sad' | 'Energetic' | 'Chill';
export type Genre = 'Pop' | 'Lo-fi' | 'Cinematic' | 'EDM';

export interface MusicState {
  currentTrack: Track | null;
  isGenerating: boolean;
  isPlaying: boolean;
  selectedMood: Mood;
  selectedGenre: Genre;
  recentTracks: Track[];
  likedTracks: Track[];
  theme: 'light' | 'dark';
}