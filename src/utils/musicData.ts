import { Track, Mood, Genre } from '../types/music';

// Create a simple audio context for generating tones
const createAudioBuffer = (frequency: number, duration: number = 3): string => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const numSamples = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate a simple melody based on frequency
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Create a more musical sound with harmonics
      const fundamental = Math.sin(2 * Math.PI * frequency * t);
      const harmonic1 = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.3;
      const harmonic2 = Math.sin(2 * Math.PI * frequency * 3 * t) * 0.1;
      
      // Add some envelope to make it sound more natural
      const envelope = Math.exp(-t * 0.5);
      
      channelData[i] = (fundamental + harmonic1 + harmonic2) * envelope * 0.3;
    }

    // Convert to WAV blob
    const wavBuffer = audioBufferToWav(buffer);
    return URL.createObjectURL(new Blob([wavBuffer], { type: 'audio/wav' }));
  } catch (error) {
    console.warn('AudioContext not supported, using fallback');
    // Fallback to a working online audio source
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
  }
};

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float samples to 16-bit PCM
  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return arrayBuffer;
}

// Frequency mappings for different moods and genres
const getFrequency = (mood: Mood, genre: Genre): number => {
  const baseFrequencies = {
    Happy: { Pop: 440, 'Lo-fi': 392, Cinematic: 523, EDM: 659 },
    Sad: { Pop: 294, 'Lo-fi': 261, Cinematic: 220, EDM: 247 },
    Energetic: { Pop: 659, 'Lo-fi': 587, Cinematic: 698, EDM: 784 },
    Chill: { Pop: 349, 'Lo-fi': 330, Cinematic: 293, EDM: 370 }
  };
  
  return baseFrequencies[mood][genre];
};

// Generate unique track titles based on mood and genre
const generateTrackTitle = (mood: Mood, genre: Genre): string => {
  const moodTitles = {
    Happy: ['Sunshine', 'Bright', 'Joyful', 'Cheerful', 'Upbeat', 'Golden', 'Radiant'],
    Sad: ['Melancholy', 'Blue', 'Rainy', 'Somber', 'Wistful', 'Twilight', 'Solitude'],
    Energetic: ['Electric', 'Power', 'Dynamic', 'Intense', 'Vibrant', 'Thunder', 'Blazing'],
    Chill: ['Calm', 'Peaceful', 'Serene', 'Relaxed', 'Dreamy', 'Floating', 'Zen']
  };

  const genreTitles = {
    Pop: ['Melody', 'Anthem', 'Hit', 'Tune', 'Song', 'Harmony', 'Rhythm'],
    'Lo-fi': ['Vibes', 'Beats', 'Dreams', 'Waves', 'Flow', 'Drift', 'Haze'],
    Cinematic: ['Score', 'Theme', 'Symphony', 'Epic', 'Journey', 'Saga', 'Quest'],
    EDM: ['Drop', 'Bass', 'Pulse', 'Beat', 'Rush', 'Surge', 'Blast']
  };

  const moodWord = moodTitles[mood][Math.floor(Math.random() * moodTitles[mood].length)];
  const genreWord = genreTitles[genre][Math.floor(Math.random() * genreTitles[genre].length)];
  
  return `${moodWord} ${genreWord}`;
};

export function generateRandomTrack(mood: Mood, genre: Genre): Track {
  const frequency = getFrequency(mood, genre);
  const duration = Math.floor(Math.random() * 60) + 120; // 2-3 minutes
  
  return {
    id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: generateTrackTitle(mood, genre),
    mood,
    genre,
    audioUrl: createAudioBuffer(frequency, Math.min(duration, 10)), // Limit generated audio to 10 seconds for demo
    duration,
    isLiked: false,
    createdAt: Date.now()
  };
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}