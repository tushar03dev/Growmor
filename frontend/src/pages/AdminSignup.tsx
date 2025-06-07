import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminKey: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Use the AuthContext login function
      login({
        token: data.token,
        user: { ...data.admin, isAdmin: true }
      });
      
      toast({
        title: "Account created",
        description: "Welcome to the admin panel",
      });

      navigate('/admin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Signup failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Key Input */}
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <label className="block text-lg font-semibold text-yellow-800 mb-2">
              Admin Key *
            </label>
            <input
              type="password"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              required
              className="w-full p-2 border border-yellow-300 rounded"
              placeholder="Enter admin key"
            />
            <p className="text-sm text-yellow-700 mt-1">
              Enter the admin key to verify your admin privileges
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
