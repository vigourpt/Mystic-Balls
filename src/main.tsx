/** @jsxImportSource react */
import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import AuthCallback from './routes/AuthCallback';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner'; // Assuming this component exists

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Handle browser navigation without full page reload
let isFirstLoad = true;
window.addEventListener('popstate', (event) => {
  event.preventDefault();
  if (!isFirstLoad) {
    // Update app state instead of reloading
    window.dispatchEvent(new CustomEvent('app:navigation'));
  }
  isFirstLoad = false;
});

const AppInitializer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      root.render(
        process.env.NODE_ENV === 'production' ? (
          <StrictMode>
            <AppRoutes />
          </StrictMode>
        ) : (
          <AppRoutes />
        )
      );
      setIsLoading(false);
    } catch (err) {
      console.error('Error rendering the app:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Initializing application..." />;
  }

  if (error) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
        <h1>Something went wrong</h1>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
        <pre style={{ color: 'red', marginTop: '20px' }}>{error}</pre>
      </div>
    );
  }

  return null;
};

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/*" element={<AppInitializer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);