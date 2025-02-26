import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCallback from './auth/callback.tsx';
import App from '../App';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Main application route */}
        <Route path="/" element={<App />} />

        {/* Auth callback route for handling Supabase authentication */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Add additional routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;