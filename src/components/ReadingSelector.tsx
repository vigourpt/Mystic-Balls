import React from 'react';
import type { ReadingType } from '../types';

interface Props {
  READING_TYPES: ReadingType[];
  handleReadingTypeSelect: (reading: ReadingType) => void;
  isDarkMode: boolean;
}

const ReadingSelector: React.FC<Props> = ({ READING_TYPES, handleReadingTypeSelect, isDarkMode }) => {
  return (
    <section id="reading-types">
      <h2 className="text-2xl md:text-3xl font-bold text-white relative group mb-12">
        <span className="absolute -inset-2 bg-fuchsia-500/20 blur-xl rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
        <span className="absolute -inset-2 bg-fuchsia-500/20 blur-lg rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
        <span className="absolute -inset-2 bg-fuchsia-500/20 blur-md rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
        <span className="relative glow-text text-center block">Discover Our Reading Types</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {READING_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => handleReadingTypeSelect(type)}
              className={`p-8 rounded-xl relative overflow-hidden reading-card ${
                isDarkMode ? 'bg-indigo-900/30' : 'bg-white/80'
              } backdrop-blur-sm hover:scale-105 transition-all duration-300 flex flex-col items-center text-center`}
            >
              <Icon className={`w-16 h-16 mb-6 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {type.title.replace(' Reading', '')}
              </h3>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`}>
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ReadingSelector;
