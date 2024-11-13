import React from 'react';
import { LogIn } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onLogin: () => Promise<any>;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose, isDarkMode, onLogin }) => {
  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await onLogin();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${
        isDarkMode
          ? 'bg-indigo-900 text-white'
          : 'bg-white text-gray-800'
      } rounded-xl p-6 max-w-md w-full shadow-xl`}>
        <div className="flex items-center gap-2 mb-4">
          <LogIn className={isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} />
          <h2 className="text-xl font-semibold">Sign In</h2>
        </div>
        
        <p className={`mb-6 ${isDarkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
          Sign in to track your readings and unlock premium features!
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white transition-colors`}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;