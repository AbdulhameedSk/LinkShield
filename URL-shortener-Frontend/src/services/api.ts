import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  email: string;
  password: string;
}

export interface ShortenRequest {
  url: string;
  short?: string;
  expiry?: number;
}

export interface ShortenResponse {
  url: string;
  short: string;
  expiry: number;
  rate_limit: number;
  rate_limit_reset: number;
}

export interface Scam {
  url: string;
  description: string;
  rating: number;
}

export interface Admin {
  name: string;
  email: string;
  verified_urls: string[];
}

export interface TagRequest {
  shortID: string;
  tags: string[];
}

// Auth APIs
export const authAPI = {
  signup: (user: User) => api.post('/signup', user),
  login: (user: User) => api.post('/login', user),
};

// URL Shortener APIs
export const urlAPI = {
  shorten: (data: ShortenRequest) => api.post('/api/v1', data),
  getByShortID: (shortID: string) => api.get(`/api/v1/${shortID}`),
  editURL: (shortID: string, data: ShortenRequest) => api.put(`/api/v1/${shortID}`, data),
  deleteURL: (shortID: string) => api.delete(`/api/v1/${shortID}`),
  addTag: (data: TagRequest) => api.post('/api/v1/addTag', data),
};

// Scam APIs
export const scamAPI = {
  getVerifiedScams: () => api.get('/api/v1/getVerifiedScams'),
  getScams: () => api.get('/api/v1/GetScams'),
  addScam: (scam: Scam) => api.post('/api/v1/AddScams', scam),
  vote: (url: string) => api.post('/api/v1/vote', { url }),
  addAdmin: (admin: Admin) => api.post('/api/v1/addAdmin', admin),
  verifyScamByAdmin: (url: string) => api.post('/api/v1/verifyScamByAdmin', { url }),
};

export default api; 