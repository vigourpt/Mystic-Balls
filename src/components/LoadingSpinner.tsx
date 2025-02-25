/** @jsxImportSource react */
import { useState, useEffect } from 'react';
import type { FC } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showSlowLoadingMessage?: boolean;
  slowLoadingMessage?: string;
  progress?: number;
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  showSlowLoadingMessage = true,
  slowLoadingMessage = 'This is taking longer than expected. Please wait a moment...',
  progress,
  className = ''
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!showSlowLoadingMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showSlowLoadingMessage]);

  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${className}`} 
      role="status" 
      aria-live="polite"
    >
      <div className={`${sizeClasses[size]} border-white border-b-transparent rounded-full animate-spin mb-4`}></div>
      <div className="text-white text-center">
        {message && <p className="mb-2">{message}</p>}
        {progress !== undefined && (
          <p className="text-gray-300 text-sm">{`Progress: ${progress}%`}</p>
        )}
        {showMessage && showSlowLoadingMessage && (
          <p className="text-gray-400 text-sm">
            {slowLoadingMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;