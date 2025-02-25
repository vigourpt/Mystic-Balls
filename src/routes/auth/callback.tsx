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

        console.log('OAuth callback parameters:', { error, accessToken, refreshToken });

        if (error) {
          console.error('OAuth error received:', error);
          navigate('/?error=authentication_failed');
          return;
        }

        if (accessToken && refreshToken) {
          console.log('Attempting to set session with received tokens...');
          const { data: session, error: sessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError || !session) {
            console.error('Failed to establish session:', sessionError);
            navigate('/?error=session_failed');
            return;
          }

          console.log('Session successfully established:', session);
          navigate('/');
        } else {
          console.warn('OAuth callback missing required tokens.');
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