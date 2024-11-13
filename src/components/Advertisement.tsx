import React from 'react';

interface Props {
  isDarkMode: boolean;
}

const Advertisement: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <a
      href="https://google.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full p-4 rounded-xl text-center relative overflow-hidden ${
        isDarkMode ? 'bg-indigo-900/30' : 'bg-white/80'
      } backdrop-blur-sm shadow-xl transition-transform hover:scale-[1.02] cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 animate-pulse"></div>
      <div className="relative">
        <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          🌟 Unlock Your Full Spiritual Potential 🌟
        </p>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
          Get personalized readings and spiritual guidance - Special offer: First consultation free!
        </p>
      </div>
    </a>
  );
};

export default Advertisement;