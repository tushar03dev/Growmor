import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the authentication context state
interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with your actual user type later
  token: string | null;
  login: (userData: { token: string; user: any }) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component to wrap your app or parts of it
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      // In a real app, you would verify the token with your backend
      // For this frontend-only setup, we'll assume a stored token means authenticated
      setToken(storedToken);
      setIsAuthenticated(true);
      // Optionally fetch user profile here if needed, using the token
      // For now, we'll just set a placeholder user or fetch it on a protected route
      setUser({ name: 'Authenticated User' }); // Placeholder
    }
  }, []);

  // Function to handle login
  const login = (userData: { token: string; user: any }) => {
    localStorage.setItem('jwtToken', userData.token);
    setToken(userData.token);
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Provide the state and functions through the context
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
