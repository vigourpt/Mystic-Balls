import React, { useState } from 'react';
import { ReadingType } from '../types';
import { getReading } from '../services/openai';
import AngelNumbersForm from './forms/AngelNumbersForm';
import AstrologyForm from './forms/AstrologyForm';
import DreamForm from './forms/DreamForm';
import HoroscopeForm from './forms/HoroscopeForm';
import NumerologyForm from './forms/NumerologyForm';
import QuestionForm from './forms/QuestionForm';
import { FormValues } from './forms/types';

interface Props {
  readingType: ReadingType;
  isDarkMode: boolean;
  onReadingComplete: (reading: string) => void;
  onReadingRequest: () => boolean;
}

const ReadingForm: React.FC<Props> = ({
  readingType,
  isDarkMode,
  onReadingComplete,
  onReadingRequest
}) => {
  const [formValues, setFormValues] = useState<FormValues>({});
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

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onReadingRequest()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userInput = {
        ...formValues,
        date: new Date().toISOString().split('T')[0]
      };

      const reading = await getReading(readingType, userInput);
      onReadingComplete(reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reading');
    } finally {
      setIsLoading(false);
    }
  };

  const getReadingTitle = (type: ReadingType) => {
    switch (type) {
      case 'iching': return 'I Ching Reading';
      case 'angelNumbers': return 'Angel Numbers Reading';
      case 'magic8ball': return 'Magic 8 Ball';
      default: return type.charAt(0).toUpperCase() + type.slice(1) + ' Reading';
    }
  };

  const renderForm = () => {
    const formProps = {
      isDarkMode,
      inputClassName,
      labelClassName,
      values: formValues,
      onChange: handleInputChange
    };

    switch (readingType) {
      case 'numerology':
        return <NumerologyForm {...formProps} />;
      case 'astrology':
        return <AstrologyForm {...formProps} />;
      case 'angelNumbers':
        return <AngelNumbersForm {...formProps} />;
      case 'horoscope':
        return <HoroscopeForm {...formProps} />;
      case 'dreams':
        return <DreamForm {...formProps} />;
      default:
        return <QuestionForm {...formProps} />;
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
        {getReadingTitle(readingType)}
      </h2>
      {renderForm()}
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
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-indigo-500 hover:bg-indigo-600'
        } text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Generating Reading...' : 'Get Your Reading'}
      </button>
    </form>
  );
};

export default ReadingForm;