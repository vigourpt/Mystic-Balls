import React, { useState } from 'react';
import { ReadingType } from '../types';
import { getReading } from '../services/openai';

interface Props {
  readingType: ReadingType;
  isDarkMode: boolean;
  onReadingComplete: (reading: string) => void;
}

const ReadingForm: React.FC<Props> = ({ readingType, isDarkMode, onReadingComplete }) => {
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const inputClassName = `w-full p-3 rounded-lg bg-opacity-50 ${
    isDarkMode
      ? 'bg-indigo-900 text-white placeholder-indigo-300 border-indigo-700'
      : 'bg-white text-gray-800 placeholder-gray-400 border-indigo-100'
  } border focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const labelClassName = `block mb-2 ${
    isDarkMode ? 'text-indigo-200' : 'text-gray-700'
  }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userInput = {
        question,
        name,
        birthdate,
        birthTime,
        location
      };

      const reading = await getReading(readingType, userInput);
      onReadingComplete(reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reading');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFields = () => {
    switch (readingType) {
      case 'numerology':
        return (
          <>
            <div className="mb-4">
              <label className={labelClassName}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-4">
              <label className={labelClassName}>Birth Date</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className={inputClassName}
                required
              />
            </div>
          </>
        );
      case 'astrology':
        return (
          <>
            <div className="mb-4">
              <label className={labelClassName}>Birth Date</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className={inputClassName}
                required
              />
            </div>
            <div className="mb-4">
              <label className={labelClassName}>Birth Time (optional)</label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="mb-4">
              <label className={labelClassName}>Birth Location (optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClassName}
                placeholder="City, Country"
              />
            </div>
          </>
        );
      default:
        return (
          <div className="mb-4">
            <label className={labelClassName}>Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`${inputClassName} h-32 resize-none`}
              placeholder="What would you like to know?"
              required
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-xl ${
      isDarkMode
        ? 'bg-indigo-900/30 backdrop-blur-sm'
        : 'bg-white/80 backdrop-blur-sm'
    } shadow-xl`}>
      <h2 className={`text-2xl font-semibold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {readingType.charAt(0).toUpperCase() + readingType.slice(1)} Reading
      </h2>
      {renderFields()}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-lg ${
          isDarkMode
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        } transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Generating Reading...' : 'Get Your Reading'}
      </button>
    </form>
  );
};

export default ReadingForm;