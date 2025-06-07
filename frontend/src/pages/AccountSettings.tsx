import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AccountSettings = () => {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="max-w-2xl bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
              disabled
            />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            
            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {message.text && (
            <div className={`p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-growmor-green-dark text-white py-2 rounded hover:bg-growmor-green-dark/90"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
