import React, { useState } from 'react';
import { Moon, Sun, ScrollText, Hash, Stars, Scroll, Dice3, BookHeart, Settings } from 'lucide-react';
import ReadingSelector from './components/ReadingSelector';
import ReadingForm from './components/ReadingForm';
import ReadingOutput from './components/ReadingOutput';
import ApiKeyModal from './components/ApiKeyModal';
import Advertisement from './components/Advertisement';
import { ReadingType } from './types';
import { OPENAI_CONFIG } from './config/openai';

function App() {
  const [selectedReading, setSelectedReading] = useState<ReadingType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(!OPENAI_CONFIG.apiKey);
  const [currentReading, setCurrentReading] = useState<string | undefined>();

  const readingTypes = [
    { id: 'tarot', name: 'Tarot', icon: ScrollText, description: 'Discover insights through the ancient wisdom of tarot cards' },
    { id: 'numerology', name: 'Numerology', icon: Hash, description: 'Unlock the meaning behind your personal numbers' },
    { id: 'astrology', name: 'Astrology', icon: Stars, description: 'Explore your celestial connections and cosmic path' },
    { id: 'oracle', name: 'Oracle Cards', icon: BookHeart, description: 'Receive guidance through mystical oracle messages' },
    { id: 'runes', name: 'Runes', icon: Scroll, description: 'Ancient Norse wisdom for modern guidance' },
    { id: 'iching', name: 'I-Ching', icon: Dice3, description: 'Connect with ancient Chinese divination wisdom' },
  ];

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleReadingComplete = (reading: string) => {
    setCurrentReading(reading);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'
    }`}>
      {/* Mystical background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} relative`}>
            <span className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur"></span>
            <span className="relative">Mystic Insights</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-gray-800'
              } hover:opacity-80 transition-opacity`}
            >
              <Settings size={24} />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-gray-800'
              } hover:opacity-80 transition-opacity`}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>

        {/* Advertisement Banner */}
        <div className="mb-8">
          <Advertisement isDarkMode={isDarkMode} />
        </div>

        <main className="max-w-4xl mx-auto relative">
          {!selectedReading ? (
            <ReadingSelector
              readingTypes={readingTypes}
              onSelect={setSelectedReading}
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setSelectedReading(null);
                  setCurrentReading(undefined);
                }}
                className={`mb-6 px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-gray-800'
                } hover:opacity-80 transition-opacity`}
              >
                ← Back to Reading Types
              </button>
              <ReadingForm
                readingType={selectedReading}
                isDarkMode={isDarkMode}
                onReadingComplete={handleReadingComplete}
              />
              <ReadingOutput
                readingType={selectedReading}
                isDarkMode={isDarkMode}
                reading={currentReading}
              />
            </div>
          )}
        </main>

        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default App;