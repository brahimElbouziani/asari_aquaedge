# Platform Irrigation Front

Application web Vue 3 pour la gestion de l'irrigation agricole.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd platForm-_Irrigation_front

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run serve
```

L'application sera accessible sur `http://localhost:8080`

## 📦 Scripts Disponibles

```bash
# Serveur de développement
npm run serve

# Build de production
npm run build

# Linter
npm run lint

# Nettoyer le projet
./clean-project.sh
```

## 🏗️ Structure du Projet

```
platForm-_Irrigation_front/
├── public/          # Fichiers statiques
├── src/
│   ├── assets/     # Ressources (CSS, images, icônes)
│   ├── components/ # Composants réutilisables
│   ├── pages/      # Pages/Vues
│   ├── services/   # Services API
│   ├── store/      # Store Pinia
│   ├── routes/     # Configuration routes
│   └── utils/      # Utilitaires
├── package.json
└── vue.config.js
```

Pour plus de détails, voir [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🛠️ Technologies Utilisées

- **Vue 3.5.25** - Framework JavaScript
- **Vue Router 4** - Routing
- **Pinia** - Gestion d'état
- **PrimeVue 4** - Composants UI
- **Vuetify 3** - Framework Material Design
- **Vue Google Maps** - Intégration cartes
- **Chart.js** - Graphiques

## 📚 Documentation

- [Guide de Restructuration](./RESTRUCTURE_GUIDE.md) - Comment nettoyer et organiser le projet
- [Guide d'Importation](./IMPORT_GUIDE.md) - Comment importer/utiliser le projet
- [Structure du Projet](./PROJECT_STRUCTURE.md) - Détails de l'organisation

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine :

```env
VUE_APP_API_URL=https://votre-api.com
VUE_APP_FIREBASE_API_KEY=votre-clé
VUE_APP_GOOGLE_MAPS_API_KEY=votre-clé
```

## 📝 Fonctionnalités

- ✅ Gestion des parcelles agricoles
- ✅ Visualisation sur cartes Google Maps
- ✅ Tableaux de données
- ✅ Notifications en temps réel
- ✅ Profil utilisateur
- ✅ Dashboard avec graphiques

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

[Spécifier votre licence]

## 👥 Auteurs

[Vos noms]

## 🙏 Remerciements

- Vue.js Team
- PrimeVue Team
- Vuetify Team
