/**
 * Base API Service
 * Centralized API configuration and error handling
 */
import axios from 'axios';

// Create axios instance
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'https://agriedge.ca/asari_platfomr/',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Add token to body for POST requests if needed
        if (config.method === 'post' && config.data && typeof config.data === 'object') {
          if (!config.data.id_admin && !config.data.token) {
            config.data.id_admin = token;
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common errors
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('authToken');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            break;
          case 403:
            localStorage.removeItem('authToken');
            break;
          case 500:
            console.error('Server error:', error.response.data);
            break;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiInstance = createApiInstance();

/**
 * Generic API request handler
 */
export const apiRequest = async (requestFn, options = {}) => {
  const { showError = true, showSuccess = false, successMessage = '' } = options;
  
  try {
    const response = await requestFn();
    
    if (showSuccess && successMessage) {
      // Toast will be handled by composable if needed
      console.log(successMessage);
    }
    
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.err || 
                        error.message || 
                        'Une erreur s\'est produite';
    
    if (showError) {
      console.error('API Error:', errorMessage);
    }
    
    return { data: null, error: errorMessage };
  }
};

