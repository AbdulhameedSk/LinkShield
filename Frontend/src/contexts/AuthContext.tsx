import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  hydrated: boolean; // new flag to signal localStorage has been read
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Synchronous initial read (prevents redirect flicker)
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const initialUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
  const [user, setUser] = useState<string | null>(initialUser);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // In case initial synchronous read missed (SSR or later hydration)
    if (!hydrated) {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('user');
      if (token && userEmail) {
        setIsAuthenticated(true);
        setUser(userEmail);
      }
      setHydrated(true);
    }
  }, [hydrated]);

  const login = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', email);
    setIsAuthenticated(true);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};