import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the auth callback immediately
    const handleCallback = async () => {
      try {
        const { error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        navigate('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}