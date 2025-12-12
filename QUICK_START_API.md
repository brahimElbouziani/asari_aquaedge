# 🚀 Guide Rapide - Nouvelle Architecture API

## ✅ Ce qui a été créé

### 1. **Services API modernes** (`src/services/api/`)
- `base.js` - Configuration axios centralisée avec gestion d'erreurs
- `userService.js` - Tous les appels API utilisateur
- `index.js` - Exports centralisés

### 2. **Composables Vue 3** (`src/composables/`)
- `useUser.js` - Gestion des données utilisateur (chargement, mise à jour)
- `useApi.js` - Composable générique pour les appels API

### 3. **Exemple optimisé**
- `EditProfileForm.optimized.vue` - Version moderne avec Composition API

## 🎯 Comment utiliser (3 étapes)

### Étape 1 : Importer le composable

```vue
<script setup>
import { useUser } from '@/composables/useUser';
</script>
```

### Étape 2 : Utiliser dans votre composant

```vue
<script setup>
import { onMounted } from 'vue';
import { useUser } from '@/composables/useUser';

const { 
  user,        // Données utilisateur
  loading,     // État de chargement
  error,       // Erreurs
  success,     // Messages de succès
  fetchUser,   // Charger les données
  updateProfile // Mettre à jour
} = useUser();

// Charger au montage
onMounted(async () => {
  await fetchUser();
});
</script>
```

### Étape 3 : Utiliser dans le template

```vue
<template>
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <p>{{ user.firstname }} {{ user.lastname }}</p>
    <button @click="handleUpdate">Mettre à jour</button>
  </div>
</template>
```

## 📝 Exemple complet

```vue
<template>
  <div>
    <LoadingSpinner v-if="loading" />
    
    <div v-if="user">
      <input v-model="formData.firstname" />
      <input v-model="formData.lastname" />
      <button @click="handleSave" :disabled="loading">
        Enregistrer
      </button>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUser } from '@/composables/useUser';

const { user, loading, error, success, fetchUser, updateProfile } = useUser();
const formData = ref({ firstname: '', lastname: '' });

onMounted(async () => {
  await fetchUser();
  if (user.value) {
    formData.value = {
      firstname: user.value.firstname,
      lastname: user.value.lastname
    };
  }
});

const handleSave = async () => {
  const success = await updateProfile(formData.value, user.value);
  if (success) {
    console.log('Profil mis à jour !');
  }
};
</script>
```

## 🔄 Migration depuis l'ancien code

### ❌ Avant
```javascript
User.GetUser(token)
  .then(res => {
    this.email = res.data.Email;
    // ...
  })
  .catch(er => console.log(er));
```

### ✅ Après
```javascript
const { user, fetchUser } = useUser();
await fetchUser();
// user.value.email est automatiquement disponible
```

## 📚 Documentation complète

Voir `API_ARCHITECTURE_GUIDE.md` pour :
- Architecture détaillée
- Exemples avancés
- Création de nouveaux services
- Débogage

## 🎁 Avantages immédiats

✅ **Code plus propre** - Moins de répétition  
✅ **Gestion d'erreurs automatique** - Plus besoin de try/catch partout  
✅ **États de chargement intégrés** - `loading` disponible partout  
✅ **Plus rapide** - Utilise Vue 3 Composition API  
✅ **Réutilisable** - Même logique dans tous les composants  

## 🚨 Important

Pour utiliser la nouvelle architecture dans `EditProfileForm.vue`, vous pouvez :
1. **Option 1** : Remplacer le contenu par `EditProfileForm.optimized.vue`
2. **Option 2** : Migrer progressivement en utilisant `useUser` dans le composant actuel

Les deux approches fonctionnent, mais l'option optimisée est recommandée pour de meilleures performances.

