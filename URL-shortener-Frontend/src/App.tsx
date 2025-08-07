import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ScamManagement from './components/ScamManagement';
import AdminManagement from './components/AdminManagement';
import UrlManagement from './components/UrlManagement';
import { LinkIcon, ExclamationTriangleIcon, UserPlusIcon, CogIcon, HomeIcon } from '@heroicons/react/24/outline';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Navigation Component
const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
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
  );
};

// Main Layout Component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <a
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </a>
              <a
                href="/url-management"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <CogIcon className="h-5 w-5 mr-3" />
                URL Management
              </a>
              <a
                href="/scam-management"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
                Scam Management
              </a>
              <a
                href="/admin-management"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <UserPlusIcon className="h-5 w-5 mr-3" />
                Admin Management
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/url-management"
              element={
                <ProtectedRoute>
                  <UrlManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scam-management"
              element={
                <ProtectedRoute>
                  <ScamManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-management"
              element={
                <ProtectedRoute>
                  <AdminManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
