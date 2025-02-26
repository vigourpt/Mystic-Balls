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

        // Let Supabase handle the OAuth callback automatically
        const { data, error } = await supabaseClient.auth.getSessionFromUrl({
          storeSession: true,
        });

        if (error || !data.session) {
          console.error('Error during OAuth callback:', error);
          console.error('Error details:', {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
          });
          navigate('/?error=authentication_failed');
          return;
        }

        console.log('Authentication successful:', data.session);
        console.log('Session details:', data.session); // Debugging log
        navigate('/');
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