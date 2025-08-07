import React, { useState } from 'react';
import { urlAPI, ShortenRequest, TagRequest } from '../services/api';
import { PencilIcon, TrashIcon, TagIcon, CheckIcon } from '@heroicons/react/24/outline';

const UrlManagement: React.FC = () => {
  const [shortID, setShortID] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newExpiry, setNewExpiry] = useState(24);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEditUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data: ShortenRequest = {
        url: newUrl,
        expiry: newExpiry,
      };

      await urlAPI.editURL(shortID, data);
      setSuccess('URL updated successfully!');
      setShortID('');
      setNewUrl('');
      setNewExpiry(24);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortID) {
      setError('Please enter a short ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await urlAPI.deleteURL(shortID);
      setSuccess('URL deleted successfully!');
      setShortID('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete URL');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTags = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortID || !tags) {
      setError('Please enter both short ID and tags');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const data: TagRequest = {
        shortID,
        tags: tagArray,
      };

      await urlAPI.addTag(data);
      setSuccess('Tags added successfully!');
      setShortID('');
      setTags('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">URL Management</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit URL */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <PencilIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Edit URL</h3>
            </div>
            <form onSubmit={handleEditUrl} className="space-y-4">
              <div>
                <label htmlFor="editShortID" className="block text-sm font-medium text-gray-700 mb-2">
                  Short ID
                </label>
                <input
                  type="text"
                  id="editShortID"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter short ID"
                  value={shortID}
                  onChange={(e) => setShortID(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  New URL
                </label>
                <input
                  type="url"
                  id="editUrl"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/new-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                  New Expiry (hours)
                </label>
                <select
                  id="editExpiry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(Number(e.target.value))}
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={168}>1 week</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update URL'}
              </button>
            </form>
          </div>

          {/* Delete URL */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Delete URL</h3>
            </div>
            <form onSubmit={handleDeleteUrl} className="space-y-4">
              <div>
                <label htmlFor="deleteShortID" className="block text-sm font-medium text-gray-700 mb-2">
                  Short ID
                </label>
                <input
                  type="text"
                  id="deleteShortID"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter short ID to delete"
                  value={shortID}
                  onChange={(e) => setShortID(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete URL'}
              </button>
            </form>
          </div>

          {/* Add Tags */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <TagIcon className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Add Tags</h3>
            </div>
            <form onSubmit={handleAddTags} className="space-y-4">
              <div>
                <label htmlFor="tagShortID" className="block text-sm font-medium text-gray-700 mb-2">
                  Short ID
                </label>
                <input
                  type="text"
                  id="tagShortID"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter short ID"
                  value={shortID}
                  onChange={(e) => setShortID(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="tag1, tag2, tag3"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Tags'}
              </button>
            </form>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <div className="text-sm text-green-700">{success}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlManagement; 