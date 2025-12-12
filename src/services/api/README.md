# API Services Usage Guide

This directory contains all API service modules based on the API Documentation. All services use the centralized `apiInstance` from `base.js` which is configured to use `http://localhost:4247` as the base URL.

## Available Services

### Authentication Service (`authService.js`)
- `login(email, password)` - Authenticate admin user
- `verifyToken(token)` - Verify JWT token validity
- `createAdmin(email, password, nameCompany)` - Create new admin user

### User Service (`userService.js`)
- `getCurrentUser(token)` - Get current authenticated user
- `updateProfile(profileData, oldData)` - Update user profile
- `addMobileUser(userData)` - Add/update mobile app user
- `updateUserLanguage(langData)` - Update user language and push token
- `checkUser(phone, email)` - Check if user exists
- `changePassword(currentPassword, newPassword, oldData)` - Change password

### Node Service (`nodeService.js`)
- `getNodes(idAdmin)` - Get all nodes for admin
- `getNodesApp(uidApp)` - Get nodes for mobile app user
- `addNodeApp(nodeData)` - Add node from mobile app
- `getNodeDetails(nodeId)` - Get node by NodeId
- `getNodeDetailsDatabase(id)` - Get node by MongoDB _id
- `updateNodeDetails(nodeData)` - Update node details (mobile app)
- `editNode(id, details)` - Edit node (admin)
- `deleteNode(id)` - Delete node
- `addNode(nodeData)` - Add node (admin, legacy)

### Sensor Service (`sensorService.js`)
- `getSensorHistory(id)` - Get historical sensor data
- `getNodeData(id, dates, datee)` - Get sensor data for date range
- `getNodeHoursData(id, dateS, dateE, pock, type)` - Get hourly sensor data
- `getSensorByDates(id, start, end)` - Get sensor data by dates
- `getLatestSensor(id)` - Get latest sensor reading
- `getSensorDatesFixed(id, days, type)` - Get sensor data for fixed days
- `exportData(exportData)` - Export data to Excel
- `checkData(id, start, end, value_check)` - Check node data
- `getET0(idParcel, dated, datef)` - Get ET0 (Evapotranspiration) data
- `getSoilMoisture(id)` - Get satellite soil moisture data
- `getCorrectedMeteo(S1_T, S4_T, bool_hamza)` - Get corrected meteorological data

### Notification Service (`notificationService.js`)
- `getAppNotifications(uidApp)` - Get notifications for mobile app user
- `deleteNotification(id)` - Delete notification
- `getNotifications()` - Get all notifications (admin)

### Comment Service (`commentService.js`)
- `addComment(commentData)` - Add comment to a node

### File Service (`fileService.js`)
- `getNodeFile(id)` - Download Excel file for node

### Weather Service (`weatherService.js`)
- `getWeatherData(lat, long)` - Get weather data (⚠️ DEPRECATED)
- `getSentinelData()` - Get satellite/sentinel data

### Parcel Service (`parcelService.js`)
- `addParcel(position, data, admin)` - Add new parcel
- `getParcel(idAdmin)` - Get all parcels for admin

## Usage Examples

### Import Services

```javascript
// Import individual services
import { authService, nodeService, sensorService } from '@/services/api';

// Or import all services
import * as apiServices from '@/services/api';
```

### Authentication Example

```javascript
import { authService } from '@/services/api';

// Login
const loginResult = await authService.login('admin@example.com', 'password123');
if (loginResult.data) {
  // Token is automatically stored in localStorage by the base service
  console.log('Login successful:', loginResult.data);
} else {
  console.error('Login failed:', loginResult.error);
}

// Verify token
const verifyResult = await authService.verifyToken();
if (verifyResult.data) {
  console.log('Token is valid');
}
```

### Node Management Example

```javascript
import { nodeService } from '@/services/api';

// Get all nodes
const nodesResult = await nodeService.getNodes();
if (nodesResult.data) {
  console.log('Nodes:', nodesResult.data);
}

// Get node details
const nodeDetails = await nodeService.getNodeDetails('A-N4-E02-C02');
if (nodeDetails.data) {
  console.log('Node details:', nodeDetails.data);
}

// Add node
const newNode = {
  uid: 'user_uid',
  node_id: 'A-N4-E02-C02',
  name: 'John\'s Farm',
  latitude: 33.5731,
  longitude: -7.5898,
  // ... other fields
};
const addResult = await nodeService.addNodeApp(newNode);
if (addResult.data === 'succes') {
  console.log('Node added successfully');
}
```

### Sensor Data Example

```javascript
import { sensorService } from '@/services/api';

// Get sensor history
const history = await sensorService.getSensorHistory('M05DA3939584D43246724');
if (history.data) {
  console.log('Sensor history:', history.data);
}

// Get node data for date range
const nodeData = await sensorService.getNodeData(
  'A-N4-E02-C02',
  '2024-01-01',
  '2024-01-31'
);
if (nodeData.data) {
  console.log('Node data:', nodeData.data);
}

// Export data
const exportResult = await sensorService.exportData({
  id: 'A-N4-E02-C02',
  dateS: '2024-01-01',
  dateE: '2024-01-31',
  value_check: 'some_value',
  nbr_port: 4,
  prf: 'profile',
  p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6
});
// Handle blob response for file download
```

### User Management Example

```javascript
import { userService } from '@/services/api';

// Get current user
const userResult = await userService.getCurrentUser();
if (userResult.data) {
  console.log('Current user:', userResult.data);
}

// Update profile
const updateResult = await userService.updateProfile(
  {
    email: 'newemail@example.com',
    firstname: 'John',
    lastname: 'Doe',
    oldPassword: 'oldpass',
    newPassword: 'newpass'
  },
  oldUserData // Current user data from database
);
if (updateResult.data === 'Done') {
  console.log('Profile updated');
}

// Add mobile user
const mobileUserResult = await userService.addMobileUser({
  firstname: 'John',
  lastname: 'Doe',
  telephone: '+212612345678',
  lang: 'fr',
  uid: 'user_uid_here',
  push_token: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'
});
if (mobileUserResult.data === 'succes') {
  console.log('Mobile user added');
}
```

### Notifications Example

```javascript
import { notificationService } from '@/services/api';

// Get notifications
const notifsResult = await notificationService.getNotifications();
if (notifsResult.data) {
  console.log('Notifications:', notifsResult.data);
}

// Delete notification
const deleteResult = await notificationService.deleteNotification('notification_id');
if (deleteResult.data) {
  console.log('Notification deleted');
}
```

## Error Handling

All services use the `apiRequest` wrapper which handles errors automatically. Each method returns an object with:
- `data`: Response data on success, `null` on error
- `error`: Error message on failure, `null` on success

```javascript
const result = await nodeService.getNodes();
if (result.error) {
  console.error('Error:', result.error);
  // Handle error
} else {
  console.log('Success:', result.data);
  // Use data
}
```

## Response Format

All API calls return a consistent format:
```javascript
{
  data: <response_data> | null,
  error: <error_message> | null
}
```

## Base URL Configuration

The base URL is configured in `base.js` and defaults to `http://localhost:4247`. You can override it using the environment variable `VUE_APP_API_BASE_URL`.

## Authentication

Most endpoints require authentication. The token is automatically retrieved from `localStorage.getItem('authToken')` and added to requests. For endpoints that require the token in the request body (like `/Home/getNodes`), it's automatically included.

## Notes

1. All endpoints are prefixed with `/Home` as per API documentation
2. Date formats should be `YYYY-MM-DD`
3. JWT tokens are passed in request body for some endpoints, not headers
4. Node IDs have different prefixes:
   - "z" prefix: ZentraCloud devices
   - "M"/"K" prefix: Pycno devices
   - Other: Raptor devices
5. Supported languages: `"fr"`, `"ar"`, `"en"`

