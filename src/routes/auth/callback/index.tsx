import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the auth callback
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Redirect to home page or dashboard after successful sign in
        navigate('/');
      }
    });
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