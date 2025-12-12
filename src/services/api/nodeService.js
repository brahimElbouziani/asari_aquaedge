/**
 * Node Management Service
 * Handles all node-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const nodeService = {
  /**
   * Get Nodes (Admin) - Get all nodes for an admin user
   * POST /Home/getNodes
   * 
   * @param {string} idAdmin - Admin token (JWT)
   * @returns {Promise} Array of nodes
   */
  async getNodes(idAdmin = null) {
    const token = idAdmin || localStorage.getItem('authToken');
    return apiRequest(
      () => apiInstance.post('/Home/getNodes', { id_admin: token }),
      { showError: true }
    );
  },

  /**
   * Get Nodes (Mobile App) - Get all nodes for a specific mobile app user
   * GET /Home/getNodesApp/:uidApp
   * 
   * @param {string} uidApp - User UID (unique identifier)
   * @returns {Promise} Array of nodes
   */
  async getNodesApp(uidApp) {
    return apiRequest(
      () => apiInstance.get(`/Home/getNodesApp/${uidApp}`),
      { showError: true }
    );
  },

  /**
   * Add Node (Mobile App) - Create a new irrigation node from mobile app
   * POST /Home/addnewoneApp
   * 
   * @param {Object} nodeData - Node data object
   * @returns {Promise} "succes" or "Already Exist!"
   */
  async addNodeApp(nodeData) {
    return apiRequest(
      () => apiInstance.post('/Home/addnewoneApp', nodeData),
      { showError: true }
    );
  },

  /**
   * Get Node Details by NodeId - Get node details by NodeId
   * GET /Home/getNodedetails/:id
   * 
   * @param {string} nodeId - NodeId (e.g., "A-N4-E02-C02")
   * @returns {Promise} Node details object
   */
  async getNodeDetails(nodeId) {
    return apiRequest(
      () => apiInstance.get(`/Home/getNodedetails/${nodeId}`),
      { showError: true }
    );
  },

  /**
   * Get Node Details by Database ID - Get node details by MongoDB _id
   * GET /Home/getNodeDetailsDatabase/:id
   * 
   * @param {string} id - MongoDB _id
   * @returns {Promise} Node details object
   */
  async getNodeDetailsDatabase(id) {
    return apiRequest(
      () => apiInstance.get(`/Home/getNodeDetailsDatabase/${id}`),
      { showError: true }
    );
  },

  /**
   * Update Node Details (Mobile App) - Update node details from mobile app
   * POST /Home/updateNodeDetails
   * 
   * @param {Object} nodeData - Updated node data
   * @returns {Promise} "Ok" on success
   */
  async updateNodeDetails(nodeData) {
    return apiRequest(
      () => apiInstance.post('/Home/updateNodeDetails', nodeData),
      { showError: true, showSuccess: true, successMessage: 'Node updated successfully' }
    );
  },

  /**
   * Edit Node (Admin) - Edit node details (admin interface)
   * POST /Home/editenode
   * 
   * @param {string} id - NodeId
   * @param {Object} details - Node details to update
   * @returns {Promise} "Ok" on success
   */
  async editNode(id, details) {
    return apiRequest(
      () => apiInstance.post('/Home/editenode', { id, details }),
      { showError: true, showSuccess: true, successMessage: 'Node edited successfully' }
    );
  },

  /**
   * Delete Node - Delete a node and all its notifications
   * DELETE /Home/deleteNode/:id
   * 
   * @param {string} id - MongoDB _id of the node
   * @returns {Promise} Deletion result
   */
  async deleteNode(id) {
    return apiRequest(
      () => apiInstance.delete(`/Home/deleteNode/${id}`),
      { showError: true, showSuccess: true, successMessage: 'Node deleted successfully' }
    );
  },

  /**
   * Add Node (Admin) - Legacy method for admin interface
   * POST /Home/addnewone
   * 
   * @param {Object} nodeData - Node data
   * @returns {Promise} Response
   */
  async addNode(nodeData) {
    return apiRequest(
      () => apiInstance.post('/Home/addnewone', nodeData),
      { showError: true }
    );
  },
};

