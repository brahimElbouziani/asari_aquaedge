# User Profile API Reference

This document outlines all the API endpoints and data structures needed for the `/user` page (`http://localhost:8080/user`).

## Overview

The User Profile page consists of two main sections:
1. **Profile Tab** - Edit user profile information
2. **Security Tab** - Manage password, 2FA, sessions, and security preferences

---

## Required API Endpoints

### 1. Get Current User
**Endpoint:** `POST /Home/User`

**Request:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "data": {
    "_id": "user_id",
    "Email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "+33123456789",
    "password": "hashed_password",
    "address": {
      "country": "France",
      "city": "Paris",
      "postalCode": "75001",
      "taxId": "FR12345678901"
    },
    "role": "admin",
    "location": "Paris, France"
  }
}
```

**Status:** ✅ Already implemented

**Note:** The backend currently only supports POST for this endpoint. The frontend uses POST with token in the request body.

---

### 2. Update User Profile
**Endpoint:** `POST /Home/Update`

**Request:**
```json
{
  "data": {
    "email": "newemail@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "+33123456789",
    "address": {
      "country": "France",
      "city": "Paris",
      "postalCode": "75001",
      "taxId": "FR12345678901"
    },
    "new": "new_password_optional",
    "old": "old_password_optional"
  },
  "d": {
    // Complete old user object from database (required for update)
    "_id": "user_id",
    "Email": "oldemail@example.com",
    "firstname": "Old",
    "lastname": "Name",
    "password": "hashed_old_password",
    // ... all other fields
  }
}
```

**Response (Success):**
```json
{
  "data": "Done"
}
```

**Response (Error):**
```json
{
  "err": "wrong Old password"
}
// OR
{
  "err": "Wrong Password exemple: A_griedge2020"
}
// OR
{
  "err": "Wrong mail"
}
// OR
{
  "err": "This email already existe"
}
```

**Status:** ✅ Already implemented (but needs to support `phone` and `address` fields)

**Note:** The backend should accept and store:
- `phone` field
- `address` object with: `country`, `city`, `postalCode`, `taxId`

---

### 3. Change Password (Security Tab)
**Endpoint:** `POST /Home/Update`

**Request:**
```json
{
  "data": {
    "email": "",
    "firstname": "",
    "lastname": "",
    "new": "new_password",
    "old": "current_password"
  },
  "d": {
    // Complete old user object from database
    "_id": "user_id",
    "Email": "user@example.com",
    // ... all other fields
  }
}
```

**Response (Success):**
```json
{
  "data": "Done"
}
```

**Response (Error):**
```json
{
  "err": "wrong Old password"
}
// OR
{
  "err": "Wrong Password exemple: A_griedge2020"
}
```

**Status:** ✅ Already implemented

---

### 4. Get Active Sessions (Security Tab)
**Endpoint:** `POST /Home/getActiveSessions` (or similar)

**Request:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "session_id_1",
      "device": "Windows - Chrome",
      "location": "Paris, France",
      "lastActive": "2024-01-15T10:30:00Z",
      "isCurrent": true,
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "id": "session_id_2",
      "device": "iPhone - Safari",
      "location": "Lyon, France",
      "lastActive": "2024-01-15T09:00:00Z",
      "isCurrent": false,
      "ipAddress": "192.168.1.2",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

**Status:** ❌ Not implemented - Needs to be created

---

### 5. Revoke Session (Security Tab)
**Endpoint:** `POST /Home/revokeSession` (or similar)

**Request:**
```json
{
  "sessionId": "session_id_to_revoke",
  "token": "jwt_token_here"
}
```

**Response (Success):**
```json
{
  "data": "Session revoked successfully"
}
```

**Response (Error):**
```json
{
  "err": "Session not found"
}
// OR
{
  "err": "Cannot revoke current session"
}
```

**Status:** ❌ Not implemented - Needs to be created

---

### 6. Toggle Two-Factor Authentication (Security Tab)
**Endpoint:** `POST /Home/toggle2FA` (or similar)

**Request:**
```json
{
  "enabled": true,
  "token": "jwt_token_here"
}
```

**Response (Success):**
```json
{
  "data": {
    "enabled": true,
    "qrCode": "data:image/png;base64,..." // Optional: QR code for setup
  }
}
```

**Response (Error):**
```json
{
  "err": "Failed to enable 2FA"
}
```

**Status:** ❌ Not implemented - Needs to be created

---

### 7. Update Security Preferences (Security Tab)
**Endpoint:** `POST /Home/updateSecurityPreferences` (or similar)

**Request:**
```json
{
  "preferences": {
    "securityNotifications": true,
    "rememberMe": true
  },
  "token": "jwt_token_here"
}
```

**Response (Success):**
```json
{
  "data": "Preferences updated successfully"
}
```

**Status:** ❌ Not implemented - Needs to be created

---

## Data Structures

### User Object (Complete Structure)
```typescript
interface User {
  _id: string;                    // MongoDB ID
  Email: string;                   // User email (required)
  firstname: string;               // First name (required, max 10 chars)
  lastname: string;                // Last name (required, max 10 chars)
  password: string;                // Hashed password
  phone?: string;                  // Phone number (optional)
  address?: {                      // Address object (optional)
    country?: string;
    city?: string;
    postalCode?: string;
    taxId?: string;
  };
  role?: string;                   // User role (e.g., "admin")
  location?: string;               // User location
  securityPreferences?: {          // Security preferences (optional)
    securityNotifications: boolean;
    rememberMe: boolean;
  };
  twoFactorEnabled?: boolean;      // 2FA status (optional)
  sessions?: Session[];            // Active sessions (optional)
}
```

### Session Object
```typescript
interface Session {
  id: string;                      // Session ID
  device: string;                   // Device description (e.g., "Windows - Chrome")
  location: string;                // Location (e.g., "Paris, France")
  lastActive: Date | string;       // Last activity timestamp
  isCurrent: boolean;              // Is this the current session?
  ipAddress?: string;              // IP address (optional)
  userAgent?: string;              // User agent string (optional)
}
```

### Profile Update Request
```typescript
interface ProfileUpdateData {
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  address?: {
    country?: string;
    city?: string;
    postalCode?: string;
    taxId?: string;
  };
  newPassword?: string;            // Optional: new password
  oldPassword?: string;            // Required if changing password
}
```

---

## Backend Implementation Checklist

### ✅ Already Implemented
- [x] Get Current User (`POST /Home/User`)
- [x] Update Profile (`POST /Home/Update`) - *but needs phone & address support*

### ❌ Needs Implementation

#### Priority 1 (Core Functionality)
- [ ] **Update Profile to support `phone` and `address` fields**
  - Modify `POST /Home/Update` to accept and store:
    - `phone` (string)
    - `address` (object with: country, city, postalCode, taxId)

#### Priority 2 (Security Features)
- [ ] **Get Active Sessions** (`POST /Home/getActiveSessions`)
  - Return list of active sessions for the user
  - Include device info, location, last active time
  - Mark current session

- [ ] **Revoke Session** (`POST /Home/revokeSession`)
  - Invalidate a specific session
  - Prevent revoking current session (or handle gracefully)

#### Priority 3 (Advanced Features)
- [ ] **Toggle 2FA** (`POST /Home/toggle2FA`)
  - Enable/disable two-factor authentication
  - Generate QR code for setup (if enabling)
  - Store 2FA secret securely

- [ ] **Update Security Preferences** (`POST /Home/updateSecurityPreferences`)
  - Store user security preferences
  - Preferences: securityNotifications, rememberMe

---

## Database Schema Updates Needed

### User Collection
Add/update fields:
```javascript
{
  // Existing fields
  _id: ObjectId,
  Email: String,
  firstname: String,
  lastname: String,
  password: String,
  
  // New fields to add
  phone: String,                    // Optional
  address: {                        // Optional
    country: String,
    city: String,
    postalCode: String,
    taxId: String
  },
  securityPreferences: {            // Optional
    securityNotifications: Boolean,
    rememberMe: Boolean
  },
  twoFactorEnabled: Boolean,         // Optional, default: false
  twoFactorSecret: String,          // Optional, encrypted
  sessions: [{                      // Optional array
    id: String,
    device: String,
    location: String,
    lastActive: Date,
    ipAddress: String,
    userAgent: String,
    createdAt: Date
  }]
}
```

---

## Error Handling

All endpoints should return consistent error format:
```json
{
  "err": "Error message here"
}
```

Common error messages:
- `"wrong Old password"` - Invalid current password
- `"Wrong Password exemple: A_griedge2020"` - Password doesn't meet requirements
- `"Wrong mail"` - Invalid email format
- `"This email already existe"` - Email already in use
- `"Session not found"` - Session doesn't exist
- `"Unauthorized"` - Invalid or missing token

---

## Security Considerations

1. **Password Requirements:**
   - Minimum 8 characters
   - Should include uppercase, lowercase, numbers, and special characters
   - Example format: `A_griedge2020`

2. **Session Management:**
   - Store sessions with JWT token mapping
   - Track IP address and user agent
   - Auto-expire old sessions (e.g., 30 days inactivity)
   - Invalidate all sessions on password change

3. **2FA Implementation:**
   - Use TOTP (Time-based One-Time Password)
   - Store secret encrypted
   - Generate QR code for initial setup
   - Require 2FA code on login if enabled

4. **Data Validation:**
   - Validate email format
   - Validate phone format (international)
   - Validate address fields
   - Sanitize all input data

---

## Testing Checklist

- [ ] Get current user returns all fields including phone and address
- [ ] Update profile with phone and address works
- [ ] Update profile without password works
- [ ] Update profile with password change works
- [ ] Password validation works correctly
- [ ] Get active sessions returns correct data
- [ ] Revoke session works (except current session)
- [ ] Toggle 2FA enables/disables correctly
- [ ] Security preferences save correctly
- [ ] Error messages are clear and helpful

---

## Notes

1. The `oldData` parameter in update requests is the complete user object from the database. This is required for the backend to properly update the user.

2. Phone and address fields are optional - users may not have them set initially.

3. Sessions should be automatically created on login and tracked per user.

4. 2FA is optional - users can enable/disable it from the Security tab.

5. Security preferences are stored per user and persist across sessions.

