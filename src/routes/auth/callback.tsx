import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Attempt to retrieve the session
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error) {
          console.error('Error during authentication callback:', error);
        }

        if (session) {
          console.log('Authentication successful:', session);
        } else {
          console.warn('No session found during authentication callback.');
        }

        // Redirect to the home page after processing
        navigate('/');
      } catch (err) {
        console.error('Unexpected error during authentication callback:', err);
        navigate('/');
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
