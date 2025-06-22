# Travel Studio

## Installation

### Steps to Install

1. Clone the repository:

   ```bash
   git clone https://github.com/iamatifmoin/QuickTunes.git
   cd QuickTunes
   ```

2. Install the dependencies:
   Using npm:
   ```bash
   npm install
   ```
   Or using Yarn:
   ```bash
   yarn install
   ```

### Running the Development Server

To run the application locally:

1. Run the development server:

   ```bash
   npm run dev
   ```

   Or with Yarn:

   ```bash
   yarn dev
   ```

2. Visit `http://localhost:5173` in your browser to access the application.

## Deployed Link

[QuickTunes (Vercel)](https://quick-tunes-drab.vercel.app/)

## Music Generation

Instead of getting music from a third-party source, I used a ChatGPT prompt to create a custom file that generates music based on the tags selected.

Prompt Used:

```
I'm building a music generation app and need a TypeScript utility that can do the following:

1. Import Track, Mood, and Genre types from a local ../types/music module.

2. Implement a function createAudioBuffer(frequency: number, duration?: number) that:

3. Uses the Web Audio API to generate a sine wave audio tone with harmonics.

4. Applies a natural-sounding envelope to the sound.

5. Converts the generated AudioBuffer to a WAV format and returns a blob URL.

6. Falls back to a sample online audio URL if AudioContext isn't supported.

7. Include a helper function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer that converts an AudioBuffer into WAV format with a proper header.

8. Define a function getFrequency(mood: Mood, genre: Genre): number that maps combinations of mood and genre to base frequencies.

9. Create a generateTrackTitle(mood: Mood, genre: Genre) function that:

10. Randomly combines mood-specific and genre-specific title fragments to form a unique track name.

11. Implement a generateRandomTrack(mood: Mood, genre: Genre): Track function that:
-Uses the above helpers to create a unique track object.
-Limits the generated audio buffer to a max of 10 seconds for demo purposes.
-Includes random duration (between 2–3 minutes) and creation timestamp.
```
