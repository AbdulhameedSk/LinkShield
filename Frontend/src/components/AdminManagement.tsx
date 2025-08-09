import React, { useState } from 'react';
import { scamAPI } from '../services/api';
import type { Admin } from '../services/api';
import { UserPlusIcon, CheckIcon } from '@heroicons/react/24/outline';

const AdminManagement: React.FC = () => {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const adminData: Admin = {
        name: admin.name,
        email: admin.email,
        verified_urls: [],
      };

      await scamAPI.addAdmin(adminData);
      setSuccess('Admin added successfully!');
      setAdmin({ name: '', email: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <UserPlusIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Add New Admin</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter admin name"
                value={admin.name}
                onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="admin@example.com"
                value={admin.email}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Adding Admin...' : 'Add Admin'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Admin Permissions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Can verify reported scam URLs</li>
              <li>• Can manage scam reports</li>
              <li>• Has access to admin-only features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement; 