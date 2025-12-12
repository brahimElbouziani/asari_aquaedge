/**
 * Comments Service
 * Handles all comment-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const commentService = {
  /**
   * Add Comment - Add a comment to a node
   * POST /Home/AddComments
   * 
   * @param {Object} commentData - Comment data
   * @param {Object} commentData.data - Node and user data
   * @param {string} commentData.data.Node - Node ID
   * @param {string} commentData.data.UidApp - User UID
   * @param {string} commentData.data.Farmer - Farmer name
   * @param {string} commentData.comment - Comment text
   * @returns {Promise} Created comment object
   */
  async addComment(commentData) {
    return apiRequest(
      () => apiInstance.post('/Home/AddComments', commentData),
      { showError: true, showSuccess: true, successMessage: 'Comment added successfully' }
    );
  },
};

