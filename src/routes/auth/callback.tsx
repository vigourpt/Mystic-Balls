import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Attempt to retrieve the session
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/?error=authentication_failed');
          return;
        }

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            navigate('/?error=session_failed');
            return;
          }

          console.log('Authentication successful');
          navigate('/');
        } else {
          console.warn('Missing tokens in the callback URL.');
          navigate('/?error=missing_tokens');
        }
      } catch (err) {
        console.error('Unexpected error during authentication callback:', err);
        navigate('/?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;