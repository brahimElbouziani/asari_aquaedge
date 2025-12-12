/**
 * Parcel Service
 * Handles parcel-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';
import { nodeService } from './nodeService';

export const parcelService = {
  /**
   * Add Parcel - Add a new parcel
   * POST /Home/addparcel
   * 
   * @param {Array} position - Polygon coordinates
   * @param {Object} data - Parcel data
   * @param {string} admin - Admin token
   * @returns {Promise} Response data
   */
  async addParcel(position, data, admin) {
    return apiRequest(
      () => apiInstance.post('/Home/addparcel', {
        polygon: position,
        data: data,
        id_admin: admin
      }),
      { showError: true, showSuccess: true, successMessage: 'Parcel added successfully' }
    );
  },

  /**
   * Get Parcel - Get all parcels for admin
   * POST /Home/getParcel
   * 
   * @param {string} idAdmin - Admin token (optional, uses localStorage if not provided)
   * @returns {Promise} Array of parcels
   * 
   * Note: Falls back to getNodes if endpoint returns 404
   */
  async getParcel(idAdmin = null) {
    const token = idAdmin || localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token available for getParcel request');
      return { data: [], error: null };
    }

    const requestData = { id_admin: token };

    try {
      const result = await apiRequest(
        () => apiInstance.post('/Home/getParcel', requestData),
        { showError: false }
      );

      if (result.error) {
        // If 404, try fallback to getNodes
        if (result.error.includes('404') || result.error.includes('Not Found')) {
          console.warn('❌ Endpoint /Home/getParcel not found (404).');
          console.warn('🔄 Trying fallback: using getNodes instead...');
          
          const nodesResult = await nodeService.getNodes(token);
          if (nodesResult.data && Array.isArray(nodesResult.data)) {
            console.log(`✅ Fallback: Loaded ${nodesResult.data.length} nodes (may contain parcel data)`);
            return { data: nodesResult.data, error: null };
          }
        }
        return result;
      }

      if (result.data && Array.isArray(result.data)) {
        console.log(`✅ Successfully loaded ${result.data.length} parcels from /Home/getParcel`);
        return result;
      } else {
        console.warn('⚠️ Invalid response format from getParcel:', result.data);
        return { data: [], error: null };
      }
    } catch (err) {
      // If 404, try fallback to getNodes
      if (err.response?.status === 404) {
        console.warn('❌ Endpoint /Home/getParcel not found (404).');
        console.warn('🔄 Trying fallback: using getNodes instead...');
        
        const nodesResult = await nodeService.getNodes(token);
        if (nodesResult.data && Array.isArray(nodesResult.data)) {
          console.log(`✅ Fallback: Loaded ${nodesResult.data.length} nodes (may contain parcel data)`);
          return { data: nodesResult.data, error: null };
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn('🔒 Unauthorized access to getParcel. Token may be invalid or expired.');
        console.warn('💡 Try logging out and logging back in to refresh your token.');
        return { data: [], error: 'Unauthorized' };
      }
      
      return { data: [], error: err.message };
    }
  },
};

