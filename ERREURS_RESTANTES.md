# Erreurs Restantes - Migration Vue 3

## ✅ Corrigé

1. **router-view dans transition** → Syntaxe Vue Router 4 corrigée
2. **@coreui/vue** → Mis à jour vers version 4.0.0 (compatible Vue 3)

## ⚠️ À Corriger

### 1. Composants Google Maps (CRITIQUE)
**Problème**: `vue2-google-maps` n'est pas compatible Vue 3
**Composants manquants**: GmapMap, GmapMarker, GmapPolygon, GmapPolyline, GmapInfoWindow

**Solution**: 
- Option A: Utiliser `@googlemaps/js-api-loader` (recommandé)
- Option B: Utiliser `vue3-google-map` (alternative)
- Option C: Commenter temporairement les composants Google Maps

**Fichiers affectés**:
- `src/pages/Maps.vue`
- `src/main.js` (import VueGoogleMaps)

### 2. Erreur 404 API
**Problème**: Endpoint `/Home/getParcel` retourne 404
**Cause**: Problème d'API backend, pas lié à Vue 3
**Fichier**: `src/services/Parcel.js`

### 3. Erreur "Cannot read properties of undefined (reading 'super')"
**Problème**: Probablement lié à `vue2-google-maps` ou un autre plugin incompatible
**Solution**: Corriger après avoir remplacé vue2-google-maps

### 4. Warnings Chart.js
**Problème**: Configuration d'échelle invalide (xAxes/yAxes)
**Cause**: Chart.js 4 utilise une syntaxe différente de Chart.js 2
**Solution**: Adapter les options des graphiques

## 📋 Plan d'Action

1. ✅ Corriger router-view
2. ✅ Mettre à jour @coreui/vue
3. ⏳ Remplacer vue2-google-maps
4. ⏳ Corriger les options Chart.js
5. ⏳ Vérifier les endpoints API


