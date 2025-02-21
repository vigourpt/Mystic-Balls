import React from 'react';
import { ReadingType } from '../types';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  reading: string;
  readingType: ReadingType;
  onBack: () => void;
  readingsRemaining: number | null;
}

const ReadingDisplay: React.FC<Props> = ({ reading, readingType, onBack, readingsRemaining }) => {
  const readingTitle = `Your ${readingType.title}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <button
        onClick={onBack}
        className="flex items-center text-white hover:text-fuchsia-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Back to Reading Types
      </button>

      <div className="relative">
        <span className="absolute -inset-1 bg-fuchsia-500/20 blur-xl rounded-lg opacity-75"></span>
        <span className="absolute -inset-1 bg-fuchsia-500/20 blur-lg rounded-lg opacity-75"></span>
        <span className="absolute -inset-1 bg-fuchsia-500/20 blur-md rounded-lg opacity-75"></span>
        <div className="relative bg-black/50 backdrop-blur-sm p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 glow-text">
            {readingTitle}
          </h2>
          <div className="prose prose-invert max-w-none prose-headings:text-fuchsia-400">
            <ReactMarkdown>{reading}</ReactMarkdown>
          </div>
          {readingsRemaining !== null && (
            <p className="mt-8 text-white text-sm">
              Readings remaining: {readingsRemaining}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingDisplay;