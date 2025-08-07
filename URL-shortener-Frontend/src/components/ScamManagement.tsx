import React, { useState, useEffect } from 'react';
import { scamAPI, Scam } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ExclamationTriangleIcon, ShieldCheckIcon, ThumbsUpIcon } from '@heroicons/react/24/outline';

const ScamManagement: React.FC = () => {
  const [scams, setScams] = useState<Scam[]>([]);
  const [verifiedScams, setVerifiedScams] = useState<Scam[]>([]);
  const [newScam, setNewScam] = useState({ url: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'reported' | 'verified'>('reported');
  const { user } = useAuth();

  useEffect(() => {
    fetchScams();
    fetchVerifiedScams();
  }, []);

  const fetchScams = async () => {
    try {
      const response = await scamAPI.getScams();
      setScams(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch scams:', err);
    }
  };

  const fetchVerifiedScams = async () => {
    try {
      const response = await scamAPI.getVerifiedScams();
      setVerifiedScams(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch verified scams:', err);
    }
  };

  const handleReportScam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await scamAPI.addScam({
        url: newScam.url,
        description: newScam.description,
        rating: 1,
      });
      setNewScam({ url: '', description: '' });
      fetchScams();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to report scam');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (url: string) => {
    try {
      await scamAPI.vote(url);
      fetchScams();
    } catch (err: any) {
      console.error('Failed to vote:', err);
    }
  };

  const handleVerifyScam = async (url: string) => {
    try {
      await scamAPI.verifyScamByAdmin(url);
      fetchVerifiedScams();
      fetchScams();
    } catch (err: any) {
      console.error('Failed to verify scam:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Scam Management</h2>

          {/* Report New Scam */}
          <div className="mb-8 p-4 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Report a Scam URL
            </h3>
            <form onSubmit={handleReportScam} className="space-y-4">
              <div>
                <label htmlFor="scamUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Scam URL
                </label>
                <input
                  type="url"
                  id="scamUrl"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="https://example.com/scam-site"
                  value={newScam.url}
                  onChange={(e) => setNewScam({ ...newScam, url: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe why this URL is a scam..."
                  value={newScam.description}
                  onChange={(e) => setNewScam({ ...newScam, description: e.target.value })}
                />
              </div>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Reporting...' : 'Report Scam'}
              </button>
            </form>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('reported')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reported'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reported Scams ({scams.length})
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'verified'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Verified Scams ({verifiedScams.length})
              </button>
            </nav>
          </div>

          {/* Scam Lists */}
          {activeTab === 'reported' && (
            <div className="space-y-4">
              {scams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reported scams yet.</p>
              ) : (
                scams.map((scam, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{scam.url}</h4>
                        <p className="text-sm text-gray-600 mb-2">{scam.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Reports: {scam.rating}
                          </span>
                          <button
                            onClick={() => handleVote(scam.url)}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ThumbsUpIcon className="h-4 w-4 mr-1" />
                            Vote
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleVerifyScam(scam.url)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        Verify
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'verified' && (
            <div className="space-y-4">
              {verifiedScams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No verified scams yet.</p>
              ) : (
                verifiedScams.map((scam, index) => (
                  <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{scam.url}</h4>
                        <p className="text-sm text-gray-600 mb-2">{scam.description}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified by Admin
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScamManagement; 