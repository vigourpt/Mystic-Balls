import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ReadingType } from '../types';

interface ReadingTypeOption {
  id: ReadingType;
  name: string;
  icon: LucideIcon;
  description: string;
}

interface Props {
  readingTypes: ReadingTypeOption[];
  onSelect: (type: ReadingType) => void;
  isDarkMode: boolean;
}

const ReadingSelector: React.FC<Props> = ({ readingTypes, onSelect, isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {readingTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gradient-to-br from-indigo-800/50 to-purple-800/50 hover:from-indigo-700/50 hover:to-purple-700/50'
              : 'bg-gradient-to-br from-white to-indigo-50 hover:from-indigo-50 hover:to-white'
          } backdrop-blur-sm shadow-xl`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <type.icon
              size={48}
              className={`${
                isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
              } transition-transform group-hover:scale-110`}
            />
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {type.name}
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-indigo-200' : 'text-gray-600'
            }`}>
              {type.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ReadingSelector;