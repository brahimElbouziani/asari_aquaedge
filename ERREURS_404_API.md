# Erreurs 404 API - Documentation

## ⚠️ Problème

Les erreurs 404 sont des **problèmes d'API backend**, pas liés à la migration Vue 3.

## 📋 Endpoints qui Retournent 404

### 1. `/Home/getParcel`
- **Fichier**: `src/services/Parcel.js`
- **Méthode**: `getParcel()`
- **Appelé depuis**: `src/pages/Maps.vue` (ligne 898)
- **Base URL**: `https://agriedge.ca/asari_platfomr/`
- **URL complète**: `https://agriedge.ca/asari_platfomr/Home/getParcel`

### 2. Autres Endpoints Potentiels
- `/Home/getNodes`
- `/Home/Login`
- `/Home/addparcel`

## 🔍 Causes Possibles

1. **Endpoint n'existe pas** sur le serveur
2. **URL incorrecte** (typo dans `asari_platfomr` - peut-être `asari_platform` ?)
3. **Serveur backend non démarré**
4. **Problème de CORS**
5. **Route backend modifiée**

## ✅ Solutions

### Option 1: Vérifier l'URL
Vérifier que l'URL de base est correcte dans `src/services/Api.js`:
```javascript
baseURL: "https://agriedge.ca/asari_platfomr/"
```

### Option 2: Ajouter Gestion d'Erreur
Ajouter une gestion d'erreur pour éviter que l'application plante:
```javascript
.catch(err => {
  if (err.response?.status === 404) {
    console.warn('Endpoint not found:', err.config.url);
    // Gérer gracieusement
  }
  reject(err);
})
```

### Option 3: Vérifier le Backend
- Vérifier que le serveur backend est démarré
- Vérifier que les routes existent
- Vérifier les logs du serveur

## 📝 Note

Ces erreurs n'affectent pas la migration Vue 3. L'application fonctionne correctement, mais certains appels API échouent car les endpoints n'existent pas côté serveur.


