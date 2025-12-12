// Vue 3 Migration - Store (Pinia) with localStorage persistence
import { defineStore } from 'pinia';
import { authService } from '@/services/api/index';

// Helper functions for localStorage
const STORAGE_KEY = 'agriedge_auth';
const TOKEN_KEY = 'authToken';

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading auth from localStorage:', e);
  }
  return { Auth: false, tk: null };
};

const saveAuthToStorage = (auth, token) => {
  try {
    const data = { Auth: auth, tk: token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Error saving auth to localStorage:', e);
  }
};

const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('Type');
    localStorage.removeItem('Logo');
  } catch (e) {
    console.error('Error clearing auth from localStorage:', e);
  }
};

// Initialize from localStorage
const storedAuth = getStoredAuth();
const storedToken = localStorage.getItem(TOKEN_KEY);

export const useMainStore = defineStore('main', {
  state: () => ({
    Auth: storedAuth.Auth || false,
    tk: storedToken || storedAuth.tk || null,
    weath: []
  }),
  
  getters: {
    isAuthenticated: (state) => {
      return state.Auth && state.tk !== null;
    },
    getToken: (state) => {
      return state.tk || localStorage.getItem(TOKEN_KEY);
    }
  },
  
  actions: {
    // Login - set auth and save to localStorage
    dkhlat(token = null) {
      this.Auth = true;
      if (token) {
        this.tk = token;
      }
      saveAuthToStorage(true, this.tk);
    },
    
    // Logout - clear auth and localStorage
    khrjat() {
      this.Auth = false;
      this.tk = null;
      clearAuthFromStorage();
    },
    
    // Set token and save
    setToken(token) {
      this.tk = token;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      saveAuthToStorage(this.Auth, token);
    },
    
    // Check token validity
    async checktoken(token = null) {
      const tokenToCheck = token || this.tk || localStorage.getItem(TOKEN_KEY);
      if (!tokenToCheck) {
        this.khrjat();
        return false;
      }
      
      const result = await authService.verifyToken(tokenToCheck);
      if (result.data) {
        console.log('token valid');
        // Ensure auth state is synced
        this.dkhlat(tokenToCheck);
        return true;
      } else {
        console.log('token invalid', result.error);
        // Clear invalid token
        this.khrjat();
        return false;
      }
    },
    
    // Initialize auth from localStorage on app start
    async initializeAuth() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Verify token is still valid
        const isValid = await this.checktoken(token);
        if (isValid) {
          this.dkhlat(token);
          return true;
        }
      }
      return false;
    }
  }
});

