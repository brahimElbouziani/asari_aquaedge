/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const authService = {
  /**
   * Login - Authenticate admin user and get JWT token
   * POST /Home/Login
   * 
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise} Response with token, type, and logo
   */
  async login(email, password) {
    return apiRequest(
      () => apiInstance.post('/Home/Login', { email, password }),
      { showError: true }
    );
  },

  /**
   * Verify Token - Verify if a JWT token is valid
   * POST /Home/token
   * 
   * @param {string} token - JWT token to verify
   * @returns {Promise} Response with user_id if valid
   */
  async verifyToken(token = null) {
    const authToken = token || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/token', { token: authToken }),
      { showError: false }
    );
  },

  /**
   * Create Admin - Create a new admin user
   * POST /Home/Creat
   * 
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {string} nameCompany - Company name
   * @returns {Promise} "User Add" or "Already Exist!"
   */
  async createAdmin(email, password, nameCompany) {
    return apiRequest(
      () => apiInstance.post('/Home/Creat', {
        email,
        password,
        name_company: nameCompany
      }),
      { showError: true }
    );
  },

  /**
   * Request Password Reset - Send reset code to user's email
   * POST /Home/forgotPassword
   * 
   * @param {string} email - User email
   * @returns {Promise} Success message
   */
  async requestPasswordReset(email) {
    return apiRequest(
      () => apiInstance.post('/Home/forgotPassword', { email }),
      { showError: true }
    );
  },

  /**
   * Verify Reset Code - Verify the reset code sent to user's email
   * POST /Home/verifyResetCode
   * 
   * @param {string} email - User email
   * @param {string} code - Verification code (6 digits)
   * @returns {Promise} Success message or token
   */
  async verifyResetCode(email, code) {
    return apiRequest(
      () => apiInstance.post('/Home/verifyResetCode', { email, code }),
      { showError: true }
    );
  },

  /**
   * Reset Password - Reset user password with verification code
   * POST /Home/resetPassword
   * 
   * @param {string} email - User email
   * @param {string} code - Verification code
   * @param {string} newPassword - New password
   * @returns {Promise} Success message
   */
  async resetPassword(email, code, newPassword) {
    return apiRequest(
      () => apiInstance.post('/Home/resetPassword', { 
        email, 
        code, 
        newPassword 
      }),
      { showError: true }
    );
  },
};

