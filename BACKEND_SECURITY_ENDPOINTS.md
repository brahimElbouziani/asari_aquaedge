# Backend Security Endpoints - Guide d'Implémentation

Ce document liste tous les endpoints backend nécessaires pour que la page de sécurité fonctionne complètement.

---

## ✅ Déjà Implémenté

### 1. Changer le mot de passe
**Endpoint:** `POST /Home/Update`

**Status:** ✅ **DÉJÀ FONCTIONNEL**

Le changement de mot de passe utilise le même endpoint que la mise à jour du profil. Il suffit d'envoyer:
```json
{
  "data": {
    "email": "",
    "firstname": "",
    "lastname": "",
    "new": "nouveau_mot_de_passe",
    "old": "ancien_mot_de_passe"
  },
  "d": { /* old user object */ }
}
```

**Aucune modification nécessaire** - Cet endpoint fonctionne déjà.

---

## ❌ À Implémenter

### 2. Get Active Sessions
**Endpoint:** `POST /Home/getActiveSessions`

**Request:**
```json
{
  "token": "jwt_token_here"
}
```

**Response (Success):**
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
      "device": "Mac - Safari",
      "location": "Lyon, France",
      "lastActive": "2024-01-14T15:20:00Z",
      "isCurrent": false,
      "ipAddress": "192.168.1.2",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

**Response (Error):**
```json
{
  "err": "Failed to load sessions"
}
```

**Implémentation Backend (Node.js/MongoDB):**

```javascript
// POST /Home/getActiveSessions
app.post('/Home/getActiveSessions', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Vérifier le token et récupérer l'utilisateur
    const userId = verifyToken(token);
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({ err: "User not found" });
    }
    
    // Récupérer les sessions de l'utilisateur
    const sessions = user.sessions || [];
    
    // Marquer la session actuelle
    const sessionsWithCurrent = sessions.map(session => ({
      ...session.toObject(),
      isCurrent: session.token === token
    }));
    
    // Trier par lastActive (plus récent en premier)
    sessionsWithCurrent.sort((a, b) => 
      new Date(b.lastActive) - new Date(a.lastActive)
    );
    
    res.json({ data: sessionsWithCurrent });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.json({ err: "Failed to load sessions" });
  }
});
```

**Schéma de base de données:**
```javascript
// Dans votre modèle User
sessions: [{
  id: String,           // ID unique de la session
  device: String,       // e.g., "Windows - Chrome"
  location: String,     // e.g., "Paris, France"
  lastActive: Date,     // Dernière activité
  ipAddress: String,    // Adresse IP
  userAgent: String,    // User agent string
  token: String,        // JWT token de cette session
  createdAt: Date       // Date de création
}]
```

**Notes:**
- Les sessions doivent être créées lors de la connexion
- `lastActive` doit être mis à jour à chaque requête authentifiée
- Le token actuel doit être identifié pour marquer `isCurrent: true`

---

### 3. Revoke Session
**Endpoint:** `POST /Home/revokeSession`

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
// OU
{
  "err": "Cannot revoke current session"
}
```

**Implémentation Backend (Node.js/MongoDB):**

```javascript
// POST /Home/revokeSession
app.post('/Home/revokeSession', async (req, res) => {
  try {
    const { sessionId, token } = req.body;
    
    // Vérifier le token et récupérer l'utilisateur
    const userId = verifyToken(token);
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({ err: "User not found" });
    }
    
    // Trouver la session à révoquer
    const session = user.sessions.find(s => s.id === sessionId);
    if (!session) {
      return res.json({ err: "Session not found" });
    }
    
    // Empêcher de révoquer la session actuelle (optionnel)
    if (session.token === token) {
      return res.json({ err: "Cannot revoke current session" });
    }
    
    // Retirer la session
    await User.findByIdAndUpdate(userId, {
      $pull: { sessions: { id: sessionId } }
    });
    
    res.json({ data: "Session revoked successfully" });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.json({ err: "Failed to revoke session" });
  }
});
```

**Notes:**
- La session est retirée du tableau `sessions` de l'utilisateur
- Le token de la session révoquée devient invalide
- Optionnel: empêcher de révoquer la session actuelle

---

### 4. Toggle 2FA
**Endpoint:** `POST /Home/toggle2FA`

**Request:**
```json
{
  "enabled": true,
  "token": "jwt_token_here"
}
```

**Response (Success - Activation):**
```json
{
  "data": {
    "enabled": true,
    "qrCode": "data:image/png;base64,...",  // QR code pour l'authentification
    "secret": "JBSWY3DPEHPK3PXP"            // Secret pour l'authentification
  }
}
```

**Response (Success - Désactivation):**
```json
{
  "data": {
    "enabled": false
  }
}
```

**Response (Error):**
```json
{
  "err": "Failed to toggle 2FA"
}
```

**Implémentation Backend (Node.js/MongoDB):**

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// POST /Home/toggle2FA
app.post('/Home/toggle2FA', async (req, res) => {
  try {
    const { enabled, token } = req.body;
    
    // Vérifier le token et récupérer l'utilisateur
    const userId = verifyToken(token);
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({ err: "User not found" });
    }
    
    if (enabled) {
      // Activer 2FA
      const secret = speakeasy.generateSecret({
        name: `${user.Email} (YourApp)`,
        issuer: 'YourApp'
      });
      
      // Générer le QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
      
      // Sauvegarder le secret (chiffré de préférence)
      await User.findByIdAndUpdate(userId, {
        twoFactorEnabled: true,
        twoFactorSecret: secret.base32  // Stocker le secret chiffré
      });
      
      res.json({
        data: {
          enabled: true,
          qrCode: qrCodeUrl,
          secret: secret.base32
        }
      });
    } else {
      // Désactiver 2FA
      await User.findByIdAndUpdate(userId, {
        twoFactorEnabled: false,
        twoFactorSecret: undefined
      });
      
      res.json({
        data: {
          enabled: false
        }
      });
    }
  } catch (error) {
    console.error('Toggle 2FA error:', error);
    res.json({ err: "Failed to toggle 2FA" });
  }
});
```

**Schéma de base de données:**
```javascript
// Dans votre modèle User
twoFactorEnabled: { type: Boolean, default: false },
twoFactorSecret: { type: String }  // Secret TOTP (chiffré de préférence)
```

**Dépendances npm:**
```bash
npm install speakeasy qrcode
```

**Notes:**
- Utilise TOTP (Time-based One-Time Password) standard
- Le secret doit être stocké de manière sécurisée (chiffré)
- Le QR code est généré pour la configuration initiale
- Lors de l'activation, retourner le QR code pour que l'utilisateur le scanne

---

### 5. Update Security Preferences
**Endpoint:** `POST /Home/updateSecurityPreferences`

**Request:**
```json
{
  "preferences": {
    "securityNotifications": true,
    "rememberMe": false
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

**Response (Error):**
```json
{
  "err": "Failed to update preferences"
}
```

**Implémentation Backend (Node.js/MongoDB):**

```javascript
// POST /Home/updateSecurityPreferences
app.post('/Home/updateSecurityPreferences', async (req, res) => {
  try {
    const { preferences, token } = req.body;
    
    // Vérifier le token et récupérer l'utilisateur
    const userId = verifyToken(token);
    
    // Mettre à jour les préférences
    await User.findByIdAndUpdate(userId, {
      securityPreferences: {
        securityNotifications: preferences.securityNotifications ?? true,
        rememberMe: preferences.rememberMe ?? false
      }
    });
    
    res.json({ data: "Preferences updated successfully" });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.json({ err: "Failed to update preferences" });
  }
});
```

**Schéma de base de données:**
```javascript
// Dans votre modèle User
securityPreferences: {
  securityNotifications: { type: Boolean, default: true },
  rememberMe: { type: Boolean, default: false }
}
```

**Notes:**
- Les préférences sont stockées dans le document User
- Valeurs par défaut si non spécifiées
- Retournées dans `POST /Home/User` (déjà implémenté selon votre document)

---

## 📋 Checklist Backend

### Priorité 1 (Fonctionnalités de base)
- [ ] **Implémenter `POST /Home/getActiveSessions`**
  - Créer sessions lors de la connexion
  - Mettre à jour `lastActive` à chaque requête
  - Retourner liste des sessions avec `isCurrent` marqué

- [ ] **Implémenter `POST /Home/revokeSession`**
  - Retirer session du tableau `sessions`
  - Valider que la session existe
  - Optionnel: empêcher révoquer session actuelle

### Priorité 2 (Fonctionnalités avancées)
- [ ] **Implémenter `POST /Home/toggle2FA`**
  - Générer secret TOTP lors de l'activation
  - Générer QR code pour configuration
  - Stocker secret de manière sécurisée
  - Mettre à jour `twoFactorEnabled` dans User

- [ ] **Implémenter `POST /Home/updateSecurityPreferences`**
  - Mettre à jour `securityPreferences` dans User
  - Valider les valeurs reçues

### Schéma de base de données
- [ ] **Ajouter `sessions` array au modèle User**
  ```javascript
  sessions: [{
    id: String,
    device: String,
    location: String,
    lastActive: Date,
    ipAddress: String,
    userAgent: String,
    token: String,
    createdAt: Date
  }]
  ```

- [ ] **Ajouter `twoFactorEnabled` et `twoFactorSecret` au modèle User**
  ```javascript
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String }
  ```

- [ ] **Ajouter `securityPreferences` au modèle User** (déjà fait selon votre doc)
  ```javascript
  securityPreferences: {
    securityNotifications: { type: Boolean, default: true },
    rememberMe: { type: Boolean, default: false }
  }
  ```

---

## 🔧 Fonctions Helper Nécessaires

### 1. Créer Session lors de la Connexion

```javascript
async function createSession(userId, req) {
  const session = {
    id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    device: getDeviceFromUserAgent(req.headers['user-agent']),
    location: await getLocationFromIP(req.ip), // Optionnel: utiliser service externe
    lastActive: new Date(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    token: generateJWT(userId), // Votre fonction de génération JWT
    createdAt: new Date()
  };
  
  await User.findByIdAndUpdate(userId, {
    $push: { sessions: session }
  });
  
  return session;
}
```

### 2. Mettre à jour lastActive

```javascript
// Dans votre middleware d'authentification
async function updateSessionActivity(token) {
  const userId = verifyToken(token);
  await User.updateOne(
    { 'sessions.token': token },
    { $set: { 'sessions.$.lastActive': new Date() } }
  );
}
```

### 3. Détecter Device depuis User Agent

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

### 4. Obtenir Location depuis IP (Optionnel)

```javascript
const axios = require('axios');

async function getLocationFromIP(ip) {
  try {
    // Utiliser un service gratuit comme ip-api.com
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return `${response.data.city}, ${response.data.country}`;
  } catch (error) {
    return 'Unknown Location';
  }
}
```

---

## 📦 Dépendances npm Requises

```bash
# Pour 2FA
npm install speakeasy qrcode

# Pour location depuis IP (optionnel)
npm install axios
```

---

## 🧪 Tests Recommandés

### Test 1: Get Active Sessions
```bash
curl -X POST http://localhost:4247/Home/getActiveSessions \
  -H "Content-Type: application/json" \
  -d '{"token": "your_jwt_token"}'
```

**Expected:** Liste des sessions avec `isCurrent` marqué

### Test 2: Revoke Session
```bash
curl -X POST http://localhost:4247/Home/revokeSession \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session_id", "token": "your_jwt_token"}'
```

**Expected:** `{"data": "Session revoked successfully"}`

### Test 3: Toggle 2FA
```bash
# Activer
curl -X POST http://localhost:4247/Home/toggle2FA \
  -H "Content-Type: application/json" \
  -d '{"enabled": true, "token": "your_jwt_token"}'

# Désactiver
curl -X POST http://localhost:4247/Home/toggle2FA \
  -H "Content-Type: application/json" \
  -d '{"enabled": false, "token": "your_jwt_token"}'
```

**Expected:** QR code lors de l'activation, confirmation lors de la désactivation

### Test 4: Update Security Preferences
```bash
curl -X POST http://localhost:4247/Home/updateSecurityPreferences \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "securityNotifications": true,
      "rememberMe": false
    },
    "token": "your_jwt_token"
  }'
```

**Expected:** `{"data": "Preferences updated successfully"}`

---

## 📝 Notes Importantes

1. **Sessions Management:**
   - Créer une session à chaque connexion
   - Mettre à jour `lastActive` à chaque requête authentifiée
   - Nettoyer les sessions expirées (optionnel: après 30 jours d'inactivité)

2. **2FA Security:**
   - Stocker le secret de manière sécurisée (chiffré)
   - Valider le code TOTP lors de la connexion si 2FA est activé
   - Ne jamais exposer le secret dans les réponses API

3. **Security Preferences:**
   - Les préférences sont déjà retournées dans `POST /Home/User` (selon votre doc)
   - S'assurer que les valeurs par défaut sont correctes

4. **Error Handling:**
   - Tous les endpoints doivent retourner `{ err: "message" }` en cas d'erreur
   - Tous les endpoints doivent retourner `{ data: ... }` en cas de succès

---

## ✅ Résumé

**Endpoints à implémenter:**
1. ✅ `POST /Home/Update` - **DÉJÀ FONCTIONNEL** (changement de mot de passe)
2. ❌ `POST /Home/getActiveSessions` - **À IMPLÉMENTER**
3. ❌ `POST /Home/revokeSession` - **À IMPLÉMENTER**
4. ❌ `POST /Home/toggle2FA` - **À IMPLÉMENTER**
5. ❌ `POST /Home/updateSecurityPreferences` - **À IMPLÉMENTER**

**Champs de base de données à ajouter:**
- `sessions` (array)
- `twoFactorEnabled` (Boolean)
- `twoFactorSecret` (String)
- `securityPreferences` (Object) - **DÉJÀ FAIT** selon votre doc

Une fois ces endpoints implémentés, toutes les fonctionnalités de sécurité fonctionneront complètement! 🎉

