import React, { useState } from 'react';
import { Moon, Sun, ScrollText, Hash, Stars, Scroll, Dice3, BookHeart, LogOut } from 'lucide-react';
import ReadingSelector from './components/ReadingSelector';
import ReadingForm from './components/ReadingForm';
import ReadingOutput from './components/ReadingOutput';
import PaymentModal from './components/PaymentModal';
import LoginModal from './components/LoginModal';
import Advertisement from './components/Advertisement';
import { ReadingType, PaymentPlan } from './types';
import { useAuth } from './hooks/useAuth';
import { useUsageTracking } from './hooks/useUsageTracking';

function App() {
  const [selectedReading, setSelectedReading] = useState<ReadingType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentReading, setCurrentReading] = useState<string | undefined>();
  
  const { user, loading, signIn, signOut } = useAuth();
  const { usage, incrementUsage, hasReachedLimit, remainingReadings, setPremiumStatus } = useUsageTracking(user?.uid || null);

  const readingTypes = [
    { id: 'tarot', name: 'Tarot', icon: ScrollText, description: 'Discover insights through the ancient wisdom of tarot cards' },
    { id: 'numerology', name: 'Numerology', icon: Hash, description: 'Unlock the meaning behind your personal numbers' },
    { id: 'astrology', name: 'Astrology', icon: Stars, description: 'Explore your celestial connections and cosmic path' },
    { id: 'oracle', name: 'Oracle Cards', icon: BookHeart, description: 'Receive guidance through mystical oracle messages' },
    { id: 'runes', name: 'Runes', icon: Scroll, description: 'Ancient Norse wisdom for modern guidance' },
    { id: 'iching', name: 'I Ching', icon: Dice3, description: 'Connect with ancient Chinese divination wisdom' },
  ];

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleReadingComplete = (reading: string) => {
    incrementUsage();
    setCurrentReading(reading);
  };

  const handleReadingRequest = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return false;
    }
    
    if (hasReachedLimit()) {
      setIsPaymentModalOpen(true);
      return false;
    }
    
    return true;
  };

  const handleSubscribe = async (plan: PaymentPlan) => {
    // TODO: Integrate with your payment processor (e.g., Stripe)
    // For now, we'll just simulate a successful subscription
    setPremiumStatus(true);
    setIsPaymentModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'
    }`}>
      <div className="container mx-auto px-4 py-8 relative">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} relative`}>
            <span className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur"></span>
            <span className="relative">Mystic Insights</span>
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className={`px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-gray-800'
                }`}>
                  {usage.isPremium ? 'Premium' : `${remainingReadings()} readings left`}
                </div>
                <button
                  onClick={signOut}
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-gray-800'
                  } hover:opacity-80 transition-opacity`}
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-indigo-800 text-white' : 'bg-indigo-200 text-gray-800'
                } hover:opacity-80 transition-opacity`}
              >
                Sign In
              </button>
            )}
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
                onReadingRequest={handleReadingRequest}
              />
              <ReadingOutput
                readingType={selectedReading}
                isDarkMode={isDarkMode}
                reading={currentReading}
              />
            </div>
          )}
        </main>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          isDarkMode={isDarkMode}
          onSubscribe={handleSubscribe}
          remainingReadings={remainingReadings()}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          isDarkMode={isDarkMode}
          onLogin={signIn}
        />
      </div>
    </div>
  );
}

export default App;