# API Services Implementation Summary

## Overview

All API services have been implemented based on the API Documentation (`API_DOCUMENTATION.md`). The services are organized in `src/services/api/` directory and use a centralized base configuration pointing to `http://localhost:4247`.

## Implementation Status

### ✅ Completed Services

1. **Authentication Service** (`authService.js`)
   - Login
   - Verify Token
   - Create Admin

2. **User Management Service** (`userService.js`)
   - Get Current User
   - Update User Profile
   - Add Mobile User
   - Update User Language
   - Check User
   - Change Password

3. **Node Management Service** (`nodeService.js`)
   - Get Nodes (Admin)
   - Get Nodes (Mobile App)
   - Add Node (Mobile App)
   - Get Node Details (by NodeId)
   - Get Node Details (by Database ID)
   - Update Node Details
   - Edit Node (Admin)
   - Delete Node
   - Add Node (Admin, legacy)

4. **Sensor Data Service** (`sensorService.js`)
   - Get Sensor History
   - Get Node Data (date range)
   - Get Node Hours Data
   - Get Sensor by Dates
   - Get Latest Sensor
   - Get Sensor Dates Fixed
   - Export Data
   - Check Data
   - Get ET0
   - Get Soil Moisture
   - Get Corrected Meteo

5. **Notification Service** (`notificationService.js`)
   - Get App Notifications
   - Delete Notification
   - Get Notifications (Admin)

6. **Comment Service** (`commentService.js`)
   - Add Comment

7. **File Service** (`fileService.js`)
   - Get Node File (Excel download)

8. **Weather Service** (`weatherService.js`)
   - Get Weather Data (⚠️ DEPRECATED)
   - Get Sentinel Data

9. **Parcel Service** (`parcelService.js`)
   - Add Parcel
   - Get Parcel (with fallback to getNodes)

## File Structure

```
src/services/api/
├── base.js                    # Centralized axios instance and error handling
├── index.js                   # Main export file
├── authService.js             # Authentication endpoints
├── userService.js             # User management endpoints
├── nodeService.js             # Node management endpoints
├── sensorService.js           # Sensor data endpoints
├── notificationService.js     # Notification endpoints
├── commentService.js          # Comment endpoints
├── fileService.js             # File operation endpoints
├── weatherService.js          # Weather endpoints
├── parcelService.js           # Parcel endpoints
└── README.md                  # Usage guide
```

## Base Configuration

All services use the centralized `apiInstance` from `base.js`:
- **Base URL**: `http://localhost:4247` (configurable via `VUE_APP_API_BASE_URL`)
- **Timeout**: 30 seconds
- **Headers**: `Content-Type: application/json`
- **Authentication**: Automatically adds JWT token from `localStorage.getItem('authToken')`

## Usage

### Import Services

```javascript
// Import individual services
import { authService, nodeService, sensorService } from '@/services/api';

// Or import all
import * as apiServices from '@/services/api';
```

### Example Usage

```javascript
// Authentication
const loginResult = await authService.login('email', 'password');
if (loginResult.data) {
  // Success - token stored automatically
}

// Get Nodes
const nodesResult = await nodeService.getNodes();
if (nodesResult.data) {
  console.log(nodesResult.data);
}

// Get Sensor Data
const sensorResult = await sensorService.getNodeData('A-N4-E02-C02', '2024-01-01', '2024-01-31');
if (sensorResult.data) {
  console.log(sensorResult.data);
}
```

## Response Format

All services return a consistent format:
```javascript
{
  data: <response_data> | null,
  error: <error_message> | null
}
```

## Error Handling

- Automatic error handling via `apiRequest` wrapper
- 401/403 errors automatically clear token and redirect to login
- All errors are logged to console
- User-friendly error messages returned

## Backward Compatibility

The existing service files (`Users.js`, `NodeData.js`, `Parcel.js`) remain unchanged for backward compatibility. New code should use the new API services from `src/services/api/`.

## Migration Guide

### Old Way (Still Works)
```javascript
import Users from '@/services/Users';
Users.login(email, pass).then(res => { ... });
```

### New Way (Recommended)
```javascript
import { authService } from '@/services/api';
const result = await authService.login(email, pass);
if (result.data) { ... }
```

## Next Steps

1. Gradually migrate existing code to use new API services
2. Update components to use new service structure
3. Add TypeScript types (optional)
4. Add unit tests for services (optional)

## Documentation

See `src/services/api/README.md` for detailed usage examples and API reference.

