import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const UserAccount = () => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    address: '123 Garden Street, Green City, GC 12345',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    // Here you would normally send the updated data to your backend
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-growmor-green-dark">User Account</h1>
          {editMode ? (
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="font-semibold block mb-1" htmlFor="name">Name:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1" htmlFor="email">Email:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1" htmlFor="address">Address:</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-2">
                <button type="submit" className="bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90">Save</button>
                <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Name:</span> {form.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {form.email}
              </div>
              <div>
                <span className="font-semibold">Member Since:</span> January 2023
              </div>
              <div>
                <span className="font-semibold">Address:</span> {form.address}
              </div>
              <button className="mt-4 bg-growmor-green-dark text-white px-4 py-2 rounded hover:bg-growmor-green-dark/90" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserAccount;
