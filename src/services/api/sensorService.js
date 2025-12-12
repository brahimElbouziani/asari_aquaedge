/**
 * Sensor Data Service
 * Handles all sensor data-related API calls
 * Based on API Documentation
 */
import { apiInstance, apiRequest } from './base';

export const sensorService = {
  /**
   * Get Sensor History - Get historical sensor data for a node
   * POST /Home/sensor_historique
   * 
   * @param {string} id - Node ID (e.g., "M05DA3939584D43246724")
   * @returns {Promise} Sensor data from external APIs (Pycno/ZentraCloud)
   * 
   * Note: Only works for non-"z" prefixed node IDs
   */
  async getSensorHistory(id) {
    return apiRequest(
      () => apiInstance.post('/Home/sensor_historique', { id }),
      { showError: true }
    );
  },

  /**
   * Get Node Data from API - Get sensor data from external APIs for a specific date range
   * GET /Home/getnodeData/:id/:dates/:datee
   * 
   * @param {string} id - NodeId
   * @param {string} dates - Start date (format: YYYY-MM-DD)
   * @param {string} datee - End date (format: YYYY-MM-DD)
   * @returns {Promise} Sensor data
   * 
   * Note: 
   * - "z" prefixed nodes: ZentraCloud API data
   * - "M"/"K" prefixed nodes: Pycno API data
   * - Other nodes: Raptor API data
   */
  async getNodeData(id, dates, datee) {
    return apiRequest(
      () => apiInstance.get(`/Home/getnodeData/${id}/${dates}/${datee}`),
      { showError: true }
    );
  },

  /**
   * Get Node Hours Data - Get hourly sensor data for a specific date range
   * GET /Home/nodehours/:id/:dateS/:dateE/:pock/:type
   * 
   * @param {string} id - NodeId
   * @param {string} dateS - Start date (format: YYYY-MM-DD)
   * @param {string} dateE - End date (format: YYYY-MM-DD)
   * @param {number} pock - Packet size (number)
   * @param {string} type - Sensor type (e.g., "TEMP", "HUM", "S1T", "S2T", etc.)
   * @returns {Promise} Array of sensor readings
   */
  async getNodeHoursData(id, dateS, dateE, pock, type) {
    return apiRequest(
      () => apiInstance.get(`/Home/nodehours/${id}/${dateS}/${dateE}/${pock}/${type}`),
      { showError: true }
    );
  },

  /**
   * Get Sensor Data by Date Range
   * POST /Home/sensor_get_by_dates
   * 
   * @param {string} id - Node ID
   * @param {string} start - Start date
   * @param {string} end - End date
   * @returns {Promise} Sensor data
   */
  async getSensorByDates(id, start, end) {
    return apiRequest(
      () => apiInstance.post('/Home/sensor_get_by_dates', { id, start, end }),
      { showError: true }
    );
  },

  /**
   * Get Latest Sensor Data
   * POST /Home/sensor_get_latest
   * 
   * @param {string} id - Node ID
   * @returns {Promise} Latest sensor data
   */
  async getLatestSensor(id) {
    return apiRequest(
      () => apiInstance.post('/Home/sensor_get_latest', { id }),
      { showError: true }
    );
  },

  /**
   * Get Sensor Data Fixed Dates
   * POST /Home/sensor_get_dates_fixed
   * 
   * @param {string} id - Node ID
   * @param {number} days - Number of days
   * @param {string} type - Sensor type
   * @returns {Promise} Sensor data
   */
  async getSensorDatesFixed(id, days, type) {
    return apiRequest(
      () => apiInstance.post('/Home/sensor_get_dates_fixed', { id, days, type }),
      { showError: true }
    );
  },

  /**
   * Export Data - Export node data to Excel file
   * POST /Home/export_data
   * 
   * @param {Object} exportData - Export parameters
   * @param {string} exportData.id - Node ID
   * @param {string} exportData.dateS - Start date
   * @param {string} exportData.dateE - End date
   * @param {string} exportData.value_check - Value check
   * @param {number} exportData.nbr_port - Number of ports
   * @param {string} exportData.prf - Profile
   * @param {number} exportData.p1-p6 - Port values
   * @returns {Promise} Excel file download
   */
  async exportData(exportData) {
    return apiRequest(
      () => apiInstance.post('/Home/export_data', exportData, {
        responseType: 'blob'
      }),
      { showError: true }
    );
  },

  /**
   * Check Data - Check node data
   * POST /Home/checkData
   * 
   * @param {string} id - Node ID
   * @param {string} start - Start date
   * @param {string} end - End date
   * @param {string} value_check - Value check
   * @returns {Promise} Check result
   */
  async checkData(id, start, end, value_check) {
    return apiRequest(
      () => apiInstance.post('/Home/checkData', { id, start, end, value_check }),
      { showError: true }
    );
  },

  /**
   * Get ET0 - Get ET0 (Evapotranspiration) data
   * GET /Home/eto_node/:idParcel/:dated/:datef
   * 
   * @param {string} idParcel - Parcel ID
   * @param {string} dated - Start date
   * @param {string} datef - End date
   * @returns {Promise} ET0 data
   */
  async getET0(idParcel, dated, datef) {
    return apiRequest(
      () => apiInstance.get(`/Home/eto_node/${idParcel}/${dated}/${datef}`),
      { showError: true }
    );
  },

  /**
   * Get Soil Moisture - Get satellite soil moisture data
   * GET /Home/getImageSatelliteDates/:id
   * 
   * @param {string} id - Node ID
   * @returns {Promise} Soil moisture data
   */
  async getSoilMoisture(id) {
    return apiRequest(
      () => apiInstance.get(`/Home/getImageSatelliteDates/${id}`),
      { showError: true }
    );
  },

  /**
   * Get Corrected Meteo - Get corrected meteorological data
   * GET /Home/correct_meteo/:S1_T/:S4_T/:bool_hamza
   * 
   * @param {number} S1_T - Sensor 1 temperature
   * @param {number} S4_T - Sensor 4 temperature
   * @param {boolean|string} bool_hamza - Boolean flag
   * @returns {Promise} Corrected meteorological data
   */
  async getCorrectedMeteo(S1_T, S4_T, bool_hamza) {
    return apiRequest(
      () => apiInstance.get(`/Home/correct_meteo/${S1_T}/${S4_T}/${bool_hamza}`),
      { showError: true }
    );
  },
};

