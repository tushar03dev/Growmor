import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        // Store the token and user data
        login({ token, user: { /* user data will be fetched from token */ } });
        navigate('/'); // Redirect to home page
      } else {
        navigate('/login'); // Redirect to login if no token
      }
    };

    handleCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing your login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
