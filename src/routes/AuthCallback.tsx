import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error('Error during OAuth callback:', error.message);
        navigate('/login'); // Redirect to login on error
      } else {
        navigate('/dashboard'); // Redirect to dashboard on success
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-700">Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;
