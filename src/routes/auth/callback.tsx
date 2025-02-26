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
          navigate('/?error=authentication_timeout');
        }, 10000); // 10 seconds timeout
        setTimeoutId(timeout);

        // Parse query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const state = params.get('state');
        console.log('OAuth callback state:', state); // Log state for debugging

        if (error) {
          console.error('OAuth error:', error);
          console.error('Error details:', {
            error,
            url: window.location.href
          });
          navigate('/?error=authentication_failed');
          return;
        }

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn ? parseInt(expiresIn, 10) : undefined,
          });

          if (sessionError || !data.session) {
            console.error('Error setting session:', sessionError);
            navigate('/?error=session_failed');
            return;
          }

          console.log('Authentication successful:', data.session);
          navigate('/');
        } else {
          console.warn('Missing tokens in the callback URL.');
          console.warn('Callback URL:', window.location.href);
          navigate('/?error=missing_tokens');
        }
      } catch (err) {
        console.error('Unexpected error during authentication callback:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : 'No stack trace'
        });
        navigate('/?error=unexpected_error');
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