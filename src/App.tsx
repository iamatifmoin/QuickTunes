import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAppSelector } from "./hooks/useAppSelector";
import ThemeToggle from "./components/ThemeToggle";
import MoodGenreSelector from "./components/MoodGenreSelector";
import GenerateButton from "./components/GenerateButton";
import TrackPreview from "./components/TrackPreview";
import RecentTracks from "./components/RecentTracks";

const AppContent: React.FC = () => {
  const theme = useAppSelector((state) => state.music.theme);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <ThemeToggle />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Wubble QuickTune
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered music preview generator. Choose your mood and genre, then
            let the magic happen!
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          <MoodGenreSelector />
          <GenerateButton />
          <TrackPreview />
          <RecentTracks />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
