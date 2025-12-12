/**
 * Weather & Data Service
 * Handles all weather-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const weatherService = {
  /**
   * Get Weather Data - Get weather data for coordinates
   * GET /Home/getWeatherData/:lat/:long
   * 
   * ⚠️ DEPRECATED - DarkSky API is no longer available
   * 
   * @param {number} lat - Latitude
   * @param {number} long - Longitude
   * @returns {Promise} Weather data or error message
   * 
   * Status Code: 503 - Service Unavailable
   */
  async getWeatherData(lat, long) {
    return apiRequest(
      () => apiInstance.get(`/Home/getWeatherData/${lat}/${long}`),
      { showError: true }
    );
  },

  /**
   * Get Sentinel Data - Get satellite/sentinel data for nodes
   * GET /Home/getsentinel
   * 
   * @returns {Promise} Satellite imagery statistics and polygon data
   * 
   * Note: This endpoint appears to be incomplete in the current implementation
   */
  async getSentinelData() {
    return apiRequest(
      () => apiInstance.get('/Home/getsentinel'),
      { showError: true }
    );
  },
};

