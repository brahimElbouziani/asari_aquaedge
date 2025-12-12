# Backend Implementation Guide for User Profile

This document outlines exactly what needs to be implemented in the backend to support the `/user` profile page.

---

## Current Status

### ✅ Already Working
- `POST /Home/User` - Get current user (works)
- `POST /Home/Update` - Update profile (works, but needs password)

### ❌ Needs Implementation
- Support for `phone` and `address` fields in update
- Active sessions management
- Security preferences storage

---

## Priority 1: Fix Update Profile Endpoint

### Current Issue
The `POST /Home/Update` endpoint returns `{"err": "Update failed"}` when updating profile without password change.

### What to Fix

**Endpoint:** `POST /Home/Update`

**Current Request Format:**
```json
{
  "data": {
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "new": "",
    "old": "current_password"
  },
  "d": {
    "_id": "user_id",
    "Email": "user@example.com",
    "firstname": "",
    "lastname": "",
    "password": "hashed_password",
    // ... other fields
  }
}
```

### Required Changes

1. **Accept empty password fields when not changing password:**
   - If `new` is empty string `""`, don't try to change password
   - Still require `old` password for security (to verify user identity)
   - Only update password if `new` is provided and not empty

2. **Add support for `phone` and `address` fields:**
   ```json
   {
     "data": {
       "email": "user@example.com",
       "firstname": "John",
       "lastname": "Doe",
       "phone": "+33123456789",  // NEW FIELD
       "address": {              // NEW FIELD
         "country": "France",
         "city": "Paris",
         "postalCode": "75001",
         "taxId": "FR12345678901"
       },
       "new": "",
       "old": "current_password"
     },
     "d": { /* old user object */ }
   }
   ```

3. **Update database schema to store:**
   - `phone` (String, optional)
   - `address` (Object, optional) with:
     - `country` (String)
     - `city` (String)
     - `postalCode` (String)
     - `taxId` (String)

### Backend Code Example (Node.js/MongoDB)

```javascript
// POST /Home/Update
app.post('/Home/Update', async (req, res) => {
  try {
    const { data, d } = req.body;
    const { email, firstname, lastname, phone, address, new: newPassword, old: oldPassword } = data;
    
    // Verify old password if provided (required for security)
    if (oldPassword) {
      const user = await User.findById(d._id);
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        return res.json({ err: "wrong Old password" });
      }
    }
    
    // Prepare update object
    const updateData = {
      Email: email,
      firstname: firstname,
      lastname: lastname
    };
    
    // Add phone if provided
    if (phone !== undefined) {
      updateData.phone = phone;
    }
    
    // Add address if provided
    if (address && typeof address === 'object') {
      updateData.address = {
        country: address.country || '',
        city: address.city || '',
        postalCode: address.postalCode || '',
        taxId: address.taxId || ''
      };
    }
    
    // Update password only if new password is provided
    if (newPassword && newPassword.trim() !== '') {
      // Validate password format
      if (!isValidPasswordFormat(newPassword)) {
        return res.json({ err: "Wrong Password exemple: A_griedge2020" });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }
    
    // Update user
    await User.findByIdAndUpdate(d._id, updateData);
    
    res.json({ data: "Done" });
  } catch (error) {
    console.error('Update error:', error);
    res.json({ err: "Update failed" });
  }
});
```

---

## Priority 2: Active Sessions Management

### New Endpoint: Get Active Sessions

**Endpoint:** `POST /Home/getActiveSessions`

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
    }
  ]
}
```

### Implementation Steps

1. **Create sessions collection or add to user document:**
   ```javascript
   // Option 1: Add to User document
   {
     _id: ObjectId,
     Email: String,
     sessions: [{
       id: String,           // Unique session ID
       device: String,        // e.g., "Windows - Chrome"
       location: String,      // e.g., "Paris, France"
       lastActive: Date,
       ipAddress: String,
       userAgent: String,
       createdAt: Date,
       token: String          // JWT token for this session
     }]
   }
   
   // Option 2: Separate Sessions collection
   {
     _id: ObjectId,
     userId: ObjectId,
     sessionId: String,
     device: String,
     location: String,
     lastActive: Date,
     ipAddress: String,
     userAgent: String,
     token: String,
     createdAt: Date
   }
   ```

2. **Track sessions on login:**
   ```javascript
   // When user logs in
   const session = {
     id: generateSessionId(),
     device: extractDeviceFromUserAgent(req.headers['user-agent']),
     location: await getLocationFromIP(req.ip),
     lastActive: new Date(),
     ipAddress: req.ip,
     userAgent: req.headers['user-agent'],
     token: jwtToken,
     createdAt: new Date()
   };
   
   await User.findByIdAndUpdate(userId, {
     $push: { sessions: session }
   });
   ```

3. **Update lastActive on each request:**
   ```javascript
   // In authentication middleware
   if (token) {
     await User.updateOne(
       { 'sessions.token': token },
       { $set: { 'sessions.$.lastActive': new Date() } }
     );
   }
   ```

4. **Implement getActiveSessions endpoint:**
   ```javascript
   app.post('/Home/getActiveSessions', async (req, res) => {
     try {
       const { token } = req.body;
       const userId = verifyToken(token);
       
       const user = await User.findById(userId);
       if (!user) {
         return res.json({ err: "User not found" });
       }
       
       // Mark current session
       const sessions = user.sessions.map(session => ({
         ...session.toObject(),
         isCurrent: session.token === token
       }));
       
       // Sort by lastActive (most recent first)
       sessions.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
       
       res.json({ data: sessions });
     } catch (error) {
       res.json({ err: "Failed to load sessions" });
     }
   });
   ```

---

## Priority 3: Revoke Session

### New Endpoint: Revoke Session

**Endpoint:** `POST /Home/revokeSession`

**Request:**
```json
{
  "sessionId": "session_id_to_revoke",
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "data": "Session revoked successfully"
}
```

### Implementation

```javascript
app.post('/Home/revokeSession', async (req, res) => {
  try {
    const { sessionId, token } = req.body;
    const userId = verifyToken(token);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ err: "User not found" });
    }
    
    // Find session to revoke
    const session = user.sessions.find(s => s.id === sessionId);
    if (!session) {
      return res.json({ err: "Session not found" });
    }
    
    // Prevent revoking current session (optional - or handle gracefully)
    if (session.token === token) {
      return res.json({ err: "Cannot revoke current session" });
    }
    
    // Remove session
    await User.findByIdAndUpdate(userId, {
      $pull: { sessions: { id: sessionId } }
    });
    
    res.json({ data: "Session revoked successfully" });
  } catch (error) {
    res.json({ err: "Failed to revoke session" });
  }
});
```

---

## Priority 4: Security Preferences

### New Endpoint: Update Security Preferences

**Endpoint:** `POST /Home/updateSecurityPreferences`

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

**Response:**
```json
{
  "data": "Preferences updated successfully"
}
```

### Implementation

```javascript
app.post('/Home/updateSecurityPreferences', async (req, res) => {
  try {
    const { preferences, token } = req.body;
    const userId = verifyToken(token);
    
    await User.findByIdAndUpdate(userId, {
      securityPreferences: {
        securityNotifications: preferences.securityNotifications || false,
        rememberMe: preferences.rememberMe || false
      }
    });
    
    res.json({ data: "Preferences updated successfully" });
  } catch (error) {
    res.json({ err: "Failed to update preferences" });
  }
});
```

---

## Database Schema Updates

### User Collection Schema

```javascript
{
  _id: ObjectId,
  Email: String,              // Required
  firstname: String,           // Required
  lastname: String,            // Required
  password: String,            // Required (hashed)
  role: String,                // e.g., "admin"
  
  // NEW FIELDS TO ADD:
  phone: String,               // Optional
  address: {                   // Optional
    country: String,
    city: String,
    postalCode: String,
    taxId: String
  },
  securityPreferences: {       // Optional
    securityNotifications: Boolean,
    rememberMe: Boolean
  },
  sessions: [{                 // Optional array
    id: String,
    device: String,
    location: String,
    lastActive: Date,
    ipAddress: String,
    userAgent: String,
    token: String,
    createdAt: Date
  }],
  twoFactorEnabled: Boolean,   // Optional, default: false
  twoFactorSecret: String      // Optional, encrypted
}
```

---

## Implementation Checklist

### Immediate (Required for Profile to Work)
- [ ] **Fix `POST /Home/Update` to accept empty password when not changing password**
  - Still require `old` password for security
  - Only update password if `new` is provided and not empty
  - Return proper error messages

- [ ] **Add `phone` field support to `POST /Home/Update`**
  - Accept `phone` in request
  - Store in database
  - Return in `POST /Home/User` response

- [ ] **Add `address` field support to `POST /Home/Update`**
  - Accept `address` object in request
  - Store in database
  - Return in `POST /Home/User` response

### High Priority (Security Features)
- [ ] **Implement `POST /Home/getActiveSessions`**
  - Track sessions on login
  - Update lastActive on requests
  - Return list of active sessions
  - Mark current session

- [ ] **Implement `POST /Home/revokeSession`**
  - Remove session from user's sessions array
  - Invalidate session token
  - Prevent revoking current session (or handle gracefully)

### Medium Priority (Advanced Features)
- [ ] **Implement `POST /Home/updateSecurityPreferences`**
  - Store security preferences in user document
  - Return preferences in `POST /Home/User` response

- [ ] **Implement `POST /Home/toggle2FA`** (Optional)
  - Enable/disable 2FA
  - Generate and store 2FA secret
  - Return QR code for setup

---

## Helper Functions Needed

### 1. Device Detection from User Agent
```javascript
function getDeviceFromUserAgent(userAgent) {
  let device = 'Unknown';
  let browser = 'Unknown';
  
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    device = 'iPhone';
  } else if (/Android/.test(userAgent)) {
    device = 'Android';
  } else if (/Mac/.test(userAgent)) {
    device = 'Mac';
  } else if (/Windows/.test(userAgent)) {
    device = 'Windows';
  } else if (/Linux/.test(userAgent)) {
    device = 'Linux';
  }
  
  if (/Chrome/.test(userAgent) && !/Edge|Edg/.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Firefox/.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browser = 'Safari';
  } else if (/Edge|Edg/.test(userAgent)) {
    browser = 'Edge';
  }
  
  return `${device} - ${browser}`;
}
```

### 2. Location from IP (Optional)
```javascript
// Using a service like ipapi.co or ip-api.com
async function getLocationFromIP(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return `${response.data.city}, ${response.data.country}`;
  } catch (error) {
    return 'Unknown Location';
  }
}
```

### 3. Session ID Generator
```javascript
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```

---

## Testing

### Test Update Profile
```bash
# Test updating profile without password change
curl -X POST http://localhost:4247/Home/Update \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "email": "test@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "phone": "+33123456789",
      "address": {
        "country": "France",
        "city": "Paris",
        "postalCode": "75001",
        "taxId": "FR12345678901"
      },
      "new": "",
      "old": "current_password"
    },
    "d": {
      "_id": "user_id",
      "Email": "test@example.com",
      "password": "hashed_password"
    }
  }'
```

### Test Get Sessions
```bash
curl -X POST http://localhost:4247/Home/getActiveSessions \
  -H "Content-Type: application/json" \
  -d '{
    "token": "jwt_token_here"
  }'
```

---

## Error Handling

All endpoints should return consistent error format:
```json
{
  "err": "Error message here"
}
```

Common errors:
- `"wrong Old password"` - Invalid current password
- `"Wrong Password exemple: A_griedge2020"` - Password doesn't meet requirements
- `"Wrong mail"` - Invalid email format
- `"This email already existe"` - Email already in use
- `"Update failed"` - Generic update error (should be more specific)
- `"Session not found"` - Session doesn't exist
- `"User not found"` - User doesn't exist

---

## Summary

**Minimum Required for Profile Page to Work:**
1. Fix `POST /Home/Update` to handle empty password fields
2. Add `phone` field support
3. Add `address` field support

**Recommended for Full Functionality:**
4. Implement sessions tracking and management
5. Implement security preferences storage

**Optional:**
6. Two-factor authentication
7. Advanced session management (auto-expire, etc.)

