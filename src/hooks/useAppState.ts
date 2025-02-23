import { useState } from 'react';
import { ReadingType, Step } from '../types';

export const useAppState = () => {
  const [selectedReadingType, setSelectedReadingType] = useState<ReadingType | null>(null);
  const [readingOutput, setReadingOutput] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  
  return {
    selectedReadingType,
    setSelectedReadingType,
    readingOutput,
    setReadingOutput,
    currentStep,
    setCurrentStep
  };
};