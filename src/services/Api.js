import axios from "axios";
/* eslint-disable */

export default () => {
  const token = localStorage.getItem("authToken");
  
  const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'https://agriedge.ca/asari_platfomr/',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  // Intercepteur pour ajouter le token à chaque requête
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Ajouter le token dans les headers si pas déjà présent
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Ajouter aussi dans le body pour les POST si nécessaire
        if (config.method === 'post' && config.data && typeof config.data === 'object') {
          if (!config.data.id_admin && !config.data.token) {
            config.data.id_admin = token;
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
