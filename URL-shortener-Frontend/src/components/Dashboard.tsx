import React, { useState } from 'react';
import { urlAPI, ShortenRequest, ShortenResponse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LinkIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [url, setUrl] = useState('');
  const [customShort, setCustomShort] = useState('');
  const [expiry, setExpiry] = useState(24);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: ShortenRequest = {
        url,
        expiry,
      };

      if (customShort) {
        data.short = customShort;
      }

      const response = await urlAPI.shorten(data);
      setShortenedUrl(response.data);
      setUrl('');
      setCustomShort('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LinkIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">URL Shortener</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shorten Your URL</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Long URL
              </label>
              <input
                type="url"
                id="url"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/very-long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customShort" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Short Code (Optional)
                </label>
                <input
                  type="text"
                  id="customShort"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="my-custom-link"
                  value={customShort}
                  onChange={(e) => setCustomShort(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry (hours)
                </label>
                <select
                  id="expiry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={expiry}
                  onChange={(e) => setExpiry(Number(e.target.value))}
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={168}>1 week</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {/* Result */}
          {shortenedUrl && (
            <div className="mt-8 p-4 bg-green-50 rounded-md">
              <h3 className="text-lg font-medium text-green-800 mb-2">URL Shortened Successfully!</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shortenedUrl.short}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
                <button
                  onClick={() => copyToClipboard(shortenedUrl.short)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-sm text-green-700">
                <p>Original URL: {shortenedUrl.url}</p>
                <p>Expires in: {shortenedUrl.expiry} hours</p>
                <p>Rate limit remaining: {shortenedUrl.rate_limit}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 