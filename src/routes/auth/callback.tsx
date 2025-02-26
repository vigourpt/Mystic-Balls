import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // Timeout reference

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Add a timeout to handle long authentication delays
        const timeout = setTimeout(() => {
          console.error('Authentication timeout reached.');
          navigate('/auth/error?type=timeout');
        }, 10000); // 10 seconds timeout
        setTimeoutId(timeout);

        // Parse query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/auth/error?type=oauth_error');
          return;
        }

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            navigate('/auth/error?type=session_error');
            return;
          }

          console.log('Authentication successful');
          navigate('/');
        } else {
          console.warn('Missing tokens in the callback URL.');
          navigate('/auth/error?type=missing_tokens');
        }
      } catch (err) {
        console.error('Unexpected error during authentication callback:', err);
        navigate('/auth/error?type=unexpected_error');
      } finally {
        setIsLoading(false); // Stop loading state
        if (timeoutId) clearTimeout(timeoutId); // Clear timeout
      }
    };

    handleAuthCallback();

    // Cleanup function to cancel timeout if the component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate, timeoutId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {isLoading ? 'Completing sign in...' : 'Redirecting...'}
        </h2>
        <p>{isLoading ? 'Please wait while we redirect you.' : 'Thank you for your patience.'}</p>
      </div>
    </div>
  );
};

export default AuthCallback;