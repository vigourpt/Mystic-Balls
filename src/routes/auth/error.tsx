import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorType = queryParams.get('type');

  const getErrorMessage = () => {
    switch (errorType) {
      case 'timeout':
        return 'Authentication timeout. Please try again.';
      case 'oauth_error':
        return 'OAuth error occurred. Please contact support.';
      case 'session_error':
        return 'Failed to establish a session. Please try again.';
      case 'missing_tokens':
        return 'Missing authentication tokens. Please try again.';
      case 'unexpected_error':
        return 'An unexpected error occurred. Please try again later.';
      default:
        return 'An unknown error occurred. Please contact support.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-white">Authentication Error</h1>
        <p className="text-indigo-200 mb-6">{getErrorMessage()}</p>
        <button
          onClick={() => navigate('/')}
          className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default OAuthError;
