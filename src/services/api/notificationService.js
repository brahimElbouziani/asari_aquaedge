/**
 * Notifications Service
 * Handles all notification-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const notificationService = {
  /**
   * Get App Notifications - Get all notifications for a mobile app user
   * GET /Home/getAppNotif/:uidApp
   * 
   * @param {string} uidApp - User UID (unique identifier)
   * @returns {Promise} Array of notifications
   */
  async getAppNotifications(uidApp) {
    return apiRequest(
      () => apiInstance.get(`/Home/getAppNotif/${uidApp}`),
      { showError: true }
    );
  },

  /**
   * Delete Notification - Delete a notification
   * DELETE /Home/deleteNotif/:id
   * 
   * @param {string} id - MongoDB _id of the notification
   * @returns {Promise} Deletion result
   */
  async deleteNotification(id) {
    return apiRequest(
      () => apiInstance.delete(`/Home/deleteNotif/${id}`),
      { showError: true, showSuccess: true, successMessage: 'Notification deleted successfully' }
    );
  },

  /**
   * Get Notifications (Admin) - Get all notifications (admin interface)
   * GET /Home/getNotifs
   * 
   * @returns {Promise} Array of notifications
   */
  async getNotifications() {
    return apiRequest(
      () => apiInstance.get('/Home/getNotifs'),
      { showError: true }
    );
  },
};

