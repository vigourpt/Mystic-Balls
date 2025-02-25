import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { useAuthState } from './hooks/useAuthState';
import { READING_TYPES } from './data/readingTypes';
import Header from './components/Header';
import Footer from './components/Footer';
import ReadingSelector from './components/ReadingSelector';
import LoadingSpinner from './components/LoadingSpinner';
import { PricingPlan, ReadingType } from './types';
import { checkProject } from './lib/supabaseClient';
import { supabaseClient } from '../lib/supabaseClient';
import { UserProfile } from './services/supabase';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import TourGuide from './components/TourGuide';
import { ONBOARDING_STEPS } from './config/tutorial';
import { Step } from './types';
import { useUsageTracking } from './hooks/useUsageTracking';
import { fireConfetti } from './utils/confetti';

// Lazy load components
const LoginModal = lazy(() => import('./components/LoginModal'));
const UpgradeModal = lazy(() => import('./components/UpgradeModal'));
const ReadingForm = lazy(() => import('./components/ReadingForm'));
const ReadingOutput = lazy(() => import('./components/ReadingOutput'));
const FAQ = lazy(() => import('./components/FAQ'));

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingSpinner size="large" message="Loading..." />}>
      {children}
    </React.Suspense>
  );
};

const App = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  const [selectedReadingType, setSelectedReadingType] = useState<ReadingType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[] | null>(null);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step | null>(() => 
    ONBOARDING_STEPS.length > 0 ? ONBOARDING_STEPS[0] as Step : null
  );
  const [readingOutput, setReadingOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, loading: authLoading } = useAuthState();
  const { signOut } = useAuth();
  useUsageTracking(user?.id ?? null);

  const handleReadingSubmit = useCallback(async (formData: Record<string, string>): Promise<void> => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    setReadingOutput(null);

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      const response = await fetch('/.netlify/functions/getReading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          readingType: selectedReadingType?.id,
          userInput: formData,
        }),
      });

      if (!response.ok) {
        if (response.status === 402) {
          setShowPaymentModal(true);
          return;
        }
        throw new Error('Failed to get reading');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setReadingOutput(data.reading);
      fireConfetti();
      
      if (!profiles?.[0]?.is_premium) {
        const { data: updatedProfile, error } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && updatedProfile) setProfiles([updatedProfile]);
      }
    } catch (error) {
      console.error('Error getting reading:', error);
      setReadingOutput(error instanceof Error ? error.message : "There was an error getting your reading. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedReadingType, profiles, setShowLoginModal, setShowPaymentModal]);

  const handleSubscribe = useCallback(async (plan: PricingPlan) => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.stripePriceId, customerId: user?.id })
      });
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      if (result.url) {
        fireConfetti();
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  }, [user]);

  const nextStep = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.findIndex(step => step.id === currentStep?.id);
    if (currentIndex >= 0 && currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1] as Step);
    } else {
      setCurrentStep(null);
    }
  }, [currentStep]);

  const handleReadingTypeSelect = useCallback((readingType: ReadingType) => {
    setSelectedReadingType(readingType);
    setReadingOutput(null);
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    setIsDarkMode((prev: boolean) => !prev);  // Add type annotation for prev
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    checkProject();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('user_profiles')
          .select('*');

        setProfiles(error ? null : data);
      } catch (err) {
        setProfiles(null);
      }
    };
  
    fetchProfiles();
  }, []);

  // Either use mainContent in the JSX or remove it if not needed
  const mainContent = useMemo(() => {
    if (currentPage === 'privacy') {
      return <PrivacyPolicy isDarkMode={isDarkMode} onBack={() => setCurrentPage(null)} />;
    }
    if (currentPage === 'terms') {
      return <TermsOfService isDarkMode={isDarkMode} onBack={() => setCurrentPage(null)} />;
    }
    if (selectedReadingType) {
      return (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedReadingType(null)}
            className="mb-8 flex items-center gap-2 px-4 py-2 text-white bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg transition-colors"
          >
            <span>←</span>
            Back to Reading Types
          </button>
          <ErrorBoundary>
            <ReadingForm
              readingType={selectedReadingType}
              onSubmit={handleReadingSubmit}
              isDarkMode={isDarkMode}
            />
          </ErrorBoundary>
          {readingOutput && (
            <div className="mt-8">
              <ErrorBoundary>
                <ReadingOutput
                  readingType={selectedReadingType}
                  isDarkMode={isDarkMode}
                  reading={readingOutput}
                  isLoading={isLoading}
                />
              </ErrorBoundary>
              <button
                onClick={() => setSelectedReadingType(null)}
                className="mt-8 flex items-center gap-2 px-4 py-2 text-white bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg transition-colors mx-auto"
              >
                <span>←</span>
                Back to Reading Types
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <ReadingSelector
          READING_TYPES={READING_TYPES}
          handleReadingTypeSelect={handleReadingTypeSelect}
          isDarkMode={isDarkMode}
        />
      </div>
    );
}, [currentPage, selectedReadingType, isDarkMode, handleReadingTypeSelect, readingOutput, isLoading, handleReadingSubmit]);

// Add loading check back
if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner 
        size="large"
        message="Initializing application..."
        showSlowLoadingMessage={true}
      />
    </div>
  );
}

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100'
    }`}>
      <Header
        user={user}
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onSignOut={signOut}
        userProfile={profiles?.[0]}
      />
      <div className="container mx-auto px-4">
        <div className="pt-16 pb-16 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white relative group mb-8">
            <span className="absolute -inset-1 bg-fuchsia-500/20 blur-xl rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute -inset-1 bg-fuchsia-500/20 blur-lg rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute -inset-1 bg-fuchsia-500/20 blur-md rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative glow-text">Welcome to Your Spiritual Journey</span>
          </h2>
          <p className={`text-xl md:text-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore ancient wisdom through our diverse collection of spiritual readings. Whether you 
            seek guidance, clarity, or deeper understanding, our AI-powered insights combine traditional 
            knowledge with modern technology to illuminate your path forward.
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        {mainContent}  {/* Use mainContent here instead of the inline conditions */}
      </main>
      {!selectedReadingType && !currentPage && (
        <ErrorBoundary>
          <FAQ isDarkMode={isDarkMode} />
        </ErrorBoundary>
      )}
      <Footer
        onPrivacyClick={() => setCurrentPage('privacy')}
        onTermsClick={() => setCurrentPage('terms')}
        isDarkMode={isDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <Suspense fallback={<LoadingSpinner />}>
        {showLoginModal && (
          <ErrorBoundary>
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            />
          </ErrorBoundary>
        )}
        {showPaymentModal && (
          <ErrorBoundary>
            <UpgradeModal
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onSubscribe={handleSubscribe}
            />
          </ErrorBoundary>
        )}
      </Suspense>
      
      {currentStep && (
        <ErrorBoundary>
          <TourGuide
            currentStep={currentStep}
            onClose={() => setCurrentStep(null)}
            nextStep={nextStep}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default App;