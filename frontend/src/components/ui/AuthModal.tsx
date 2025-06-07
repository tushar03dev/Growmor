import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignIn from '../GoogleSignIn';

const AuthModal = ({ open, onOpenChange }) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiUrl = tab === 'login'
      ? 'http://localhost:3000/api/auth/login'
      : 'http://localhost:3000/api/auth/signup';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred.');
        setLoading(false);
        return;
      }

      login(data);
      onOpenChange(false);

    } catch (err) {
      setError('Network error or server not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tab === 'login' ? 'Login' : 'Sign Up'}</DialogTitle>
          <DialogDescription>
            {tab === 'login'
              ? 'Login to your account to continue.'
              : 'Create a new account to get started.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mb-4 gap-2">
          <button
            className={`px-4 py-2 rounded ${tab === 'login' ? 'bg-growmor-green-dark text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('login')}
            disabled={tab === 'login'}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === 'signup' ? 'bg-growmor-green-dark text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('signup')}
            disabled={tab === 'signup'}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-growmor-green-dark text-white py-2 rounded hover:bg-growmor-green-dark/90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (tab === 'login' ? 'Logging in...' : 'Signing up...') : tab === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <GoogleSignIn />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
