import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Celebrate with confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-white">Payment Successful!</h1>
        <p className="text-indigo-200">Thank you for upgrading. You will be redirected shortly...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;