# Référence API - Page Notifications

Ce document décrit les routes backend nécessaires et la structure des données pour la page Notifications.

## Routes Backend Requises

### 1. Récupérer toutes les notifications (Admin)
**Route principale utilisée par la page**

- **Méthode:** `GET`
- **URL:** `/Home/getNotifs`
- **Authentification:** Requise (token dans header Authorization)
- **Paramètres:** Aucun
- **Description:** Récupère toutes les notifications pour l'interface admin

**Exemple de requête:**
```http
GET http://localhost:4247/Home/getNotifs
Authorization: Bearer <token>
```

**Réponse attendue:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "Node": "507f1f77bcf86cd799439011",
    "UidApp": "user_uid",
    "Farmer": "John's Farm",
    "Title": "Irrigation Alert",
    "msg": "Erreur de capteur détectée",
    "min": "30",
    "hours": "2",
    "Date": "2024-01-01 10:00:00",
    "date": "2024-01-01 10:00:00"
  }
]
```

---

### 2. Supprimer une notification
**Utilisée pour supprimer une notification**

- **Méthode:** `DELETE`
- **URL:** `/Home/deleteNotif/:id`
- **Authentification:** Requise
- **Paramètres:**
  - `id` (path) - MongoDB `_id` de la notification à supprimer

**Exemple de requête:**
```http
DELETE http://localhost:4247/Home/deleteNotif/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Réponse attendue:**
```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

---

### 3. Récupérer les notifications d'un utilisateur mobile (Optionnel)
**Non utilisée actuellement dans la page, mais disponible dans le service**

- **Méthode:** `GET`
- **URL:** `/Home/getAppNotif/:uidApp`
- **Authentification:** Requise
- **Paramètres:**
  - `uidApp` (path) - UID de l'utilisateur mobile

**Exemple de requête:**
```http
GET http://localhost:4247/Home/getAppNotif/user_uid_123
Authorization: Bearer <token>
```

**Réponse attendue:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "Node": "507f1f77bcf86cd799439011",
    "UidApp": "user_uid_123",
    "Farmer": "John's Farm",
    "Title": "Irrigation Alert",
    "min": "30",
    "hours": "2",
    "Date": "2024-01-01 10:00:00"
  }
]
```

---

## Structure des Données

### Objet Notification

La page Notifications attend un tableau d'objets avec la structure suivante:

```typescript
interface Notification {
  _id: string;              // MongoDB ID (requis pour suppression)
  Node: string;             // ID du nœud (requis)
  Farmer?: string;          // Nom de l'agriculteur (optionnel, affiche "N/A" si absent)
  Title?: string;           // Titre de la notification (optionnel)
  msg?: string;             // Message de la notification (optionnel)
  Date?: string;            // Date au format "YYYY-MM-DD HH:mm:ss" (optionnel)
  date?: string;            // Alternative pour la date (optionnel)
  hours?: string;           // Heures (optionnel, pour durée)
  min?: string;             // Minutes (optionnel, pour durée)
  UidApp?: string;          // UID utilisateur app (optionnel)
}
```

### Champs Utilisés par la Page

| Champ | Utilisation | Obligatoire | Format |
|-------|-------------|-------------|--------|
| `_id` | Identification pour suppression | ✅ Oui | String (MongoDB ObjectId) |
| `Node` | Affichage et navigation vers le nœud | ✅ Oui | String |
| `Farmer` | Colonne "Agriculteur" | ❌ Non | String |
| `Title` | Colonne "Titre" ou fallback pour message | ❌ Non | String |
| `msg` | Colonne "Message" | ❌ Non | String |
| `Date` ou `date` | Colonne "Date", tri et filtres | ❌ Non | String (ISO ou "YYYY-MM-DD HH:mm:ss") |
| `hours` | Affichage durée (si présent) | ❌ Non | String ou Number |
| `min` | Affichage durée (si présent) | ❌ Non | String ou Number |

### Gestion des Champs Manquants

La page gère automatiquement les champs optionnels:
- Si `Farmer` est absent → affiche "N/A"
- Si `Title` est absent mais `msg` existe → utilise `msg` comme titre
- Si `Date` est absent → affiche "N/A"
- Si `msg` est absent → affiche "Aucun message"
- Si `hours` et `min` sont absents → n'affiche pas la colonne durée

---

## Configuration Backend

### Base URL
Par défaut: `http://localhost:4247`
Configurable via variable d'environnement: `VUE_APP_API_BASE_URL`

### Authentification
- **Type:** Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Source:** `localStorage.getItem('authToken')`
- **Gestion:** Automatique via intercepteur axios

### Headers Requis
```http
Content-Type: application/json
Authorization: Bearer <token>
```

---

## Exemples de Réponses

### Succès - Liste de notifications
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "Node": "M05DA3939584D43246724",
    "Farmer": "Ahmed Benali",
    "Title": "Alerte de capteur",
    "msg": "Température anormale détectée sur le nœud",
    "Date": "2024-01-15 14:30:00",
    "hours": "2",
    "min": "30"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "Node": "z123456789",
    "Farmer": "Fatima Alami",
    "Title": "Erreur de connexion",
    "msg": "Le nœud est hors ligne depuis 3 heures",
    "Date": "2024-01-15 12:00:00"
  }
]
```

### Succès - Suppression
```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

### Erreur - Format standard
```json
{
  "message": "Erreur de serveur",
  "err": "Détails de l'erreur"
}
```

---

## Codes de Statut HTTP

| Code | Signification | Action Frontend |
|------|---------------|-----------------|
| `200` | Succès | Affiche les données |
| `401` | Non autorisé | Redirige vers login |
| `403` | Accès interdit | Supprime token, redirige |
| `404` | Non trouvé | Affiche message d'erreur |
| `500` | Erreur serveur | Affiche message d'erreur |

---

## Filtres et Tri (Frontend)

La page implémente des filtres côté client:

### Filtres de Date
- **3 mois:** Affiche les notifications des 3 derniers mois
- **6 mois:** Affiche les notifications des 6 derniers mois
- **Tout:** Affiche toutes les notifications

### Tri
- Par **Date** (défaut)
- Par **Node**
- Par **Farmer**

### Recherche
Recherche dans les champs: `Node`, `Farmer`, `Title`, `msg`

---

## Notes Importantes

1. **Format de Date:** Le backend peut retourner la date dans différents formats. La page essaie de parser automatiquement avec `new Date()`.

2. **Ordre:** La page inverse l'ordre du tableau pour afficher les plus récentes en premier (`reverse()`).

3. **Filtrage:** Les notifications sont filtrées côté client après récupération. Pour de grandes quantités, envisager un filtrage côté serveur.

4. **Pagination:** La pagination est gérée côté client par PrimeVue DataTable (10 lignes par défaut, configurable).

5. **Champs Flexibles:** La page accepte soit `Date` soit `date`, soit `Title` soit `msg`, pour compatibilité avec différentes versions de l'API.

---

## Test des Routes

### Test avec cURL

**Récupérer les notifications:**
```bash
curl -X GET "http://localhost:4247/Home/getNotifs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Supprimer une notification:**
```bash
curl -X DELETE "http://localhost:4247/Home/deleteNotif/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Intégration Frontend

### Service utilisé
```javascript
import { notificationService } from '@/services/api/index';

// Récupérer les notifications
const result = await notificationService.getNotifications();
if (result.data) {
  console.log('Notifications:', result.data);
}

// Supprimer une notification
const deleteResult = await notificationService.deleteNotification('notification_id');
if (deleteResult.data) {
  console.log('Supprimé avec succès');
}
```

### Fichiers concernés
- `src/pages/Notifications.vue` - Page principale
- `src/services/api/notificationService.js` - Service API
- `src/services/api/base.js` - Configuration axios

