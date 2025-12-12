/**
 * API Services Index
 * Central export for all API services
 * Based on API Documentation
 */
export { apiInstance, apiRequest } from './base';
export { authService } from './authService';
export { userService } from './userService';
export { nodeService } from './nodeService';
export { sensorService } from './sensorService';
export { notificationService } from './notificationService';
export { commentService } from './commentService';
export { fileService } from './fileService';
export { weatherService } from './weatherService';
export { parcelService } from './parcelService';

// Default export with all services
export default {
  auth: () => import('./authService').then(m => m.authService),
  user: () => import('./userService').then(m => m.userService),
  node: () => import('./nodeService').then(m => m.nodeService),
  sensor: () => import('./sensorService').then(m => m.sensorService),
  notification: () => import('./notificationService').then(m => m.notificationService),
  comment: () => import('./commentService').then(m => m.commentService),
  file: () => import('./fileService').then(m => m.fileService),
  weather: () => import('./weatherService').then(m => m.weatherService),
  parcel: () => import('./parcelService').then(m => m.parcelService),
};

