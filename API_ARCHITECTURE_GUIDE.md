# Guide d'Architecture API - Structure Organisée et Performante

## 📋 Vue d'ensemble

Cette nouvelle architecture offre :
- ✅ **Gestion centralisée** des appels API
- ✅ **Composables réutilisables** pour la logique métier
- ✅ **Gestion d'erreurs** automatique
- ✅ **États de chargement** intégrés
- ✅ **Code plus propre** et maintenable
- ✅ **Meilleures performances** avec Vue 3 Composition API

## 🏗️ Structure des fichiers

```
src/
├── services/
│   └── api/
│       ├── base.js          # Configuration axios et gestion d'erreurs
│       ├── userService.js    # Services utilisateur
│       └── index.js          # Exports centralisés
├── composables/
│   ├── useUser.js           # Composable pour les données utilisateur
│   └── useApi.js            # Composable générique pour les appels API
└── pages/
    └── UserProfile/
        └── EditProfileForm.optimized.vue  # Exemple optimisé
```

## 🚀 Utilisation

### 1. Utiliser le composable `useUser`

```vue
<script setup>
import { useUser } from '@/composables/useUser';

const { 
  user,           // Données utilisateur réactives
  loading,        // État de chargement
  error,          // Message d'erreur
  success,        // Message de succès
  fullName,       // Nom complet calculé
  hasProfileImage,// Si l'utilisateur a une image
  profileImage,   // URL de l'image
  fetchUser,      // Fonction pour charger les données
  updateProfile,  // Fonction pour mettre à jour
  reset           // Réinitialiser l'état
} = useUser();

// Charger les données utilisateur
onMounted(async () => {
  await fetchUser();
});

// Mettre à jour le profil
const handleUpdate = async () => {
  const success = await updateProfile({
    email: 'new@email.com',
    firstname: 'John',
    lastname: 'Doe',
    oldPassword: 'currentPassword',
    newPassword: 'newPassword'
  }, oldData);
  
  if (success) {
    // Succès !
  }
};
</script>
```

### 2. Utiliser le service API directement

```javascript
import { userService } from '@/services/api';

// Login
const { data, error } = await userService.login(email, password);
if (error) {
  console.error('Erreur:', error);
} else {
  console.log('Utilisateur:', data);
}

// Get user
const { data: userData, error: userError } = await userService.getCurrentUser();
```

### 3. Utiliser le composable générique `useApi`

```vue
<script setup>
import { useApi } from '@/composables/useApi';
import { userService } from '@/services/api';

const { loading, error, success, execute } = useApi();

const fetchData = async () => {
  const { data, error } = await execute(
    () => userService.getCurrentUser(),
    {
      showError: true,
      showSuccess: false,
      onSuccess: (result) => {
        console.log('Données chargées:', result);
      },
      onError: (err) => {
        console.error('Erreur:', err);
      }
    }
  );
};
</script>
```

## 📝 Migration depuis l'ancien code

### Avant (ancien code)

```javascript
// ❌ Ancien code - répétitif et verbeux
import User from '@/services/Users';

created() {
  let token = localStorage.getItem("authToken");
  User.GetUser(token)
    .then((res) => {
      this.email = res.data.Email;
      this.firstname = res.data.firstname;
      // ... beaucoup de code répétitif
    })
    .catch((er) => console.log(er));
}

methods: {
  save() {
    User.Updatedetails(data, this.olddata)
      .then((r) => {
        this.suc = "Profil mis à jour";
        setTimeout(() => { this.suc = ""; }, 3000);
      })
      .catch((er) => {
        this.err = er;
        setTimeout(() => { this.err = ""; }, 3000);
      });
  }
}
```

### Après (nouveau code)

```javascript
// ✅ Nouveau code - propre et réutilisable
import { useUser } from '@/composables/useUser';

const { user, loading, error, success, fetchUser, updateProfile } = useUser();

onMounted(async () => {
  await fetchUser(); // Gestion automatique des erreurs
});

const handleSave = async () => {
  const success = await updateProfile(formData, oldData);
  // Gestion automatique des messages de succès/erreur
};
```

## 🎯 Avantages de la nouvelle architecture

### 1. **Performance**
- ✅ Utilisation de la Composition API (plus rapide)
- ✅ Réactivité optimisée avec `ref` et `computed`
- ✅ Pas de re-renders inutiles

### 2. **Maintenabilité**
- ✅ Code réutilisable dans les composables
- ✅ Logique métier séparée de la présentation
- ✅ Gestion d'erreurs centralisée

### 3. **Expérience développeur**
- ✅ TypeScript-ready (facile à ajouter)
- ✅ Auto-complétion dans l'IDE
- ✅ Code plus lisible et testable

### 4. **Gestion d'erreurs**
- ✅ Intercepteurs axios pour les erreurs communes
- ✅ Messages d'erreur automatiques
- ✅ Redirection automatique en cas de 401/403

## 🔧 Configuration

### Variables d'environnement (optionnel)

Créez un fichier `.env` :

```env
VITE_API_BASE_URL=https://agriedge.ca/asari_platfomr/
```

### Personnalisation des intercepteurs

Modifiez `src/services/api/base.js` pour ajouter vos propres intercepteurs :

```javascript
// Ajouter un toast sur les erreurs
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Votre logique personnalisée
    }
    return Promise.reject(error);
  }
);
```

## 📚 Exemples complets

### Exemple 1 : Formulaire de profil optimisé

Voir `EditProfileForm.optimized.vue` pour un exemple complet avec :
- Chargement des données
- Validation
- Mise à jour
- Gestion des erreurs
- États de chargement

### Exemple 2 : Créer un nouveau service

```javascript
// src/services/api/productService.js
import { apiInstance, apiRequest } from './base';

export const productService = {
  async getProducts() {
    return apiRequest(
      () => apiInstance.get('/products'),
      { showError: true }
    );
  },
  
  async createProduct(productData) {
    return apiRequest(
      () => apiInstance.post('/products', productData),
      { showError: true, showSuccess: true, successMessage: 'Produit créé' }
    );
  }
};
```

### Exemple 3 : Créer un nouveau composable

```javascript
// src/composables/useProducts.js
import { ref, computed } from 'vue';
import { productService } from '@/services/api/productService';

export function useProducts() {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const fetchProducts = async () => {
    loading.value = true;
    const { data, error: apiError } = await productService.getProducts();
    if (apiError) {
      error.value = apiError;
    } else {
      products.value = data;
    }
    loading.value = false;
  };
  
  return { products, loading, error, fetchProducts };
}
```

## 🐛 Débogage

### Activer les logs détaillés

Dans `src/services/api/base.js`, ajoutez :

```javascript
instance.interceptors.request.use((config) => {
  console.log('API Request:', config.method, config.url, config.data);
  return config;
});

instance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

## ✅ Checklist de migration

- [ ] Remplacer les imports `User` par `useUser`
- [ ] Migrer les composants vers Composition API
- [ ] Utiliser les composables pour la logique métier
- [ ] Tester tous les appels API
- [ ] Vérifier la gestion des erreurs
- [ ] Optimiser les performances

## 📞 Support

Pour toute question ou problème, consultez :
- Les exemples dans `EditProfileForm.optimized.vue`
- La documentation Vue 3 Composition API
- Les commentaires dans le code source

