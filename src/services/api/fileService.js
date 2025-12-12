/**
 * File Operations Service
 * Handles all file-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const fileService = {
  /**
   * Get Node File - Download Excel file for a specific node
   * GET /Home/nodefile/:id
   * 
   * @param {string} id - NodeId
   * @returns {Promise} Excel file download (.xlsx)
   * 
   * Error Response: 404 - "Not found" (if file doesn't exist)
   */
  async getNodeFile(id) {
    return apiRequest(
      () => apiInstance.get(`/Home/nodefile/${id}`, {
        responseType: 'blob'
      }),
      { showError: true }
    );
  },
};

