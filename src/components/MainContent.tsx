import React, { Suspense, lazy } from 'react';
import { ReadingType } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ReadingSelector from './ReadingSelector';
import { READING_TYPES } from '../data/readingTypes';

// Lazy load components
const ReadingForm = lazy(() => import('./ReadingForm'));
const ReadingOutput = lazy(() => import('./ReadingOutput'));

interface MainContentProps {
  selectedReadingType: ReadingType | null;
  isDarkMode: boolean;
  handleReadingSubmit: (formData: Record<string, string>) => Promise<void>;
  readingOutput: string | null;
  isLoading: boolean;
  setSelectedReadingType: (type: ReadingType | null) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  selectedReadingType,
  isDarkMode,
  handleReadingSubmit,
  readingOutput,
  isLoading,
  setSelectedReadingType
}) => {
  return (
    <div className={`container mx-auto px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {selectedReadingType ? (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedReadingType(null)}
            className="mb-8 flex items-center gap-2 px-4 py-2 text-white bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg transition-colors"
          >
            <span>←</span>
            Back to Reading Types
          </button>
          <Suspense fallback={<LoadingSpinner />}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <ReadingForm
                  readingType={selectedReadingType}
                  onSubmit={handleReadingSubmit}
                  isDarkMode={isDarkMode}
                />
                {readingOutput && (
                  <ReadingOutput
                    readingType={selectedReadingType}
                    isDarkMode={isDarkMode}
                    reading={readingOutput}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
          </Suspense>
        </div>
      ) : (
        <ReadingSelector
          READING_TYPES={READING_TYPES}  // Changed from readingTypes to READING_TYPES
          handleReadingTypeSelect={setSelectedReadingType}  // Changed from onSelect to match component props
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};