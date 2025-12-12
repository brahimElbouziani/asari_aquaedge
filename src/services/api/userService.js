/**
 * User Management Service
 * Handles all user-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const userService = {
  /**
   * Get Current User - Get current authenticated user information
   * POST /Home/User
   * 
   * Note: Backend currently only supports POST for this endpoint
   * 
   * @param {string} token - JWT token (optional, uses localStorage if not provided)
   * @returns {Promise} User object with _id, Email, firstname, lastname, password
   */
  async getCurrentUser(token = null) {
    const authToken = token || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/User', { token: authToken }),
      { showError: true }
    );
  },

  /**
   * Update User Profile - Update user profile information
   * POST /Home/Update
   * 
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.email - New email
   * @param {string} profileData.firstname - First name
   * @param {string} profileData.lastname - Last name
   * @param {string} profileData.phone - Phone number (optional)
   * @param {Object} profileData.address - Address object (optional)
   * @param {string} profileData.address.country - Country
   * @param {string} profileData.address.city - City/Region
   * @param {string} profileData.address.postalCode - Postal code
   * @param {string} profileData.address.taxId - Tax ID
   * @param {string} profileData.oldPassword - Old password (for password change)
   * @param {string} profileData.newPassword - New password (for password change)
   * @param {Object} oldData - Current user data object from database
   * @returns {Promise} "Done" on success or error object
   * 
   * Error Responses:
   * - {err: "wrong Old password"} - Invalid old password
   * - {err: "Wrong Password exemple: A_griedge2020"} - Password doesn't meet requirements
   * - {err: "Wrong mail"} - Invalid email format
   * - {err: "This email already existe"} - Email already in use
   */
  async updateProfile(profileData, oldData) {
    // Try to send phone and address - backend may support them now
    // If backend doesn't support them, they'll be ignored but won't cause errors
    const data = {
      email: profileData.email || '',
      lastname: profileData.lastname || '',
      firstname: profileData.firstname || '',
      new: profileData.newPassword || '',
      old: profileData.oldPassword || '',
    };
    
    // Add phone and address if provided (backend may support them)
    if (profileData.phone !== undefined) {
      data.phone = profileData.phone;
    }
    
    if (profileData.address !== undefined) {
      data.address = profileData.address;
    }
    
    return apiRequest(
      () => apiInstance.post('/Home/Update', { data, d: oldData }),
      { showError: true, showSuccess: true, successMessage: 'Profile updated successfully' }
    );
  },

  /**
   * Add Mobile User - Add or update a mobile app user
   * POST /Home/addnewUser
   * 
   * @param {Object} userData - User data
   * @param {string} userData.firstname - User's first name (optional)
   * @param {string} userData.lastname - User's last name (optional)
   * @param {string} userData.telephone - User's phone number (required)
   * @param {string} userData.lang - User's preferred language ("fr", "ar", or "en") (optional)
   * @param {string} userData.uid - Unique user identifier (required)
   * @param {string} userData.push_token - Expo push notification token (optional)
   * @returns {Promise} "succes" on success
   * 
   * Note: 
   * - If user with same phone exists but different UID, old user is deleted and new one created
   * - If user already exists, only language and push_token are updated
   * - Push token is required for receiving push notifications
   */
  async addMobileUser(userData) {
    return apiRequest(
      () => apiInstance.post('/Home/addnewUser', userData),
      { showError: true, showSuccess: true, successMessage: 'User added successfully' }
    );
  },

  /**
   * Update User Language - Update user's preferred language and/or push notification token
   * POST /Home/editLangUser
   * 
   * @param {Object} langData - Language data
   * @param {string} langData.uid - User UID (required)
   * @param {string} langData.lang - Preferred language ("fr", "ar", or "en") (optional)
   * @param {string} langData.push_token - Expo push notification token (optional)
   * @returns {Promise} "succes" on success
   * 
   * Supported Languages: "fr", "ar", "en"
   * Note: Both lang and push_token are optional. Only provided fields will be updated.
   */
  async updateUserLanguage(langData) {
    return apiRequest(
      () => apiInstance.post('/Home/editLangUser', langData),
      { showError: true, showSuccess: true, successMessage: 'Language updated successfully' }
    );
  },

  /**
   * Check User - Check if user exists (legacy endpoint)
   * POST /Home/checkUser
   * 
   * @param {string} phone - Phone number
   * @param {string} email - Email address
   * @returns {Promise} Response with status 200 if user exists
   */
  async checkUser(phone, email) {
    return apiRequest(
      () => apiInstance.post('/Home/checkUser', { phone, email }),
      { showError: true }
    );
  },

  /**
   * Change Password Only - Helper method to change password
   * POST /Home/Update
   * 
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {Object} oldData - Current user data object from database
   * @returns {Promise} "Done" on success
   */
  async changePassword(currentPassword, newPassword, oldData) {
    const data = {
      email: '',
      lastname: '',
      firstname: '',
      new: newPassword,
      old: currentPassword,
    };
    
    return apiRequest(
      () => apiInstance.post('/Home/Update', { data, d: oldData }),
      { showError: true, showSuccess: true, successMessage: 'Password changed successfully' }
    );
  },

  /**
   * Get Active Sessions - Get all active sessions for current user
   * POST /Home/getActiveSessions
   * 
   * @param {string} token - JWT token (optional, uses localStorage if not provided)
   * @returns {Promise} Array of session objects
   */
  async getActiveSessions(token = null) {
    const authToken = token || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/getActiveSessions', { token: authToken }),
      { showError: true }
    );
  },

  /**
   * Revoke Session - Revoke/invalidate a specific session
   * POST /Home/revokeSession
   * 
   * @param {string} sessionId - Session ID to revoke
   * @param {string} token - JWT token (optional, uses localStorage if not provided)
   * @returns {Promise} Success message
   */
  async revokeSession(sessionId, token = null) {
    const authToken = token || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/revokeSession', { sessionId, token: authToken }),
      { showError: true, showSuccess: true, successMessage: 'Session revoked successfully' }
    );
  },

  /**
   * Toggle Two-Factor Authentication - Enable/disable 2FA
   * POST /Home/toggle2FA
   * 
   * @param {boolean} enabled - Enable (true) or disable (false) 2FA
   * @param {string} token - JWT token (optional, uses localStorage if not provided)
   * @returns {Promise} 2FA status and optional QR code
   */
  async toggle2FA(enabled, token = null) {
    const authToken = token || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/toggle2FA', { enabled, token: authToken }),
      { showError: true, showSuccess: true, successMessage: `2FA ${enabled ? 'enabled' : 'disabled'} successfully` }
    );
  },

  /**
   * Update Security Preferences - Update user security preferences
   * POST /Home/updateSecurityPreferences
   * 
   * @param {Object} preferences - Security preferences
   * @param {boolean} preferences.securityNotifications - Enable security notifications
   * @param {boolean} preferences.rememberMe - Remember me preference
   * @param {string} token - JWT token (optional, uses localStorage if not provided)
   * @returns {Promise} Success message
   */
  async updateSecurityPreferences(preferences, token = null) {
    const authToken = token || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/updateSecurityPreferences', { preferences, token: authToken }),
      { showError: true, showSuccess: true, successMessage: 'Security preferences updated successfully' }
    );
  },
};

