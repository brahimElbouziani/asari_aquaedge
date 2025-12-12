#!/bin/bash

# Script de nettoyage du projet Vue 3
# Usage: ./clean-project.sh

set -e

echo "🧹 Début du nettoyage du projet..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Supprimer les fichiers de backup
info "Suppression des fichiers de backup..."
find . -name "*.backup" -type f -not -path "./node_modules/*" -delete 2>/dev/null || true
find . -name "*.vue2.*" -type f -not -path "./node_modules/*" -delete 2>/dev/null || true
find . -name "*.vue3.*" -type f -not -path "./node_modules/*" -delete 2>/dev/null || true
info "Fichiers de backup supprimés"

# 2. Supprimer les fichiers de migration (garder seulement les importants)
info "Nettoyage des fichiers de migration..."
rm -f MIGRATION_*.md 2>/dev/null || true
rm -f CORRECTIONS_*.md 2>/dev/null || true
rm -f RESUME_*.md 2>/dev/null || true
rm -f STATUS_*.md 2>/dev/null || true
rm -f STEP*.md 2>/dev/null || true
rm -f UPGRADE_*.md 2>/dev/null || true
rm -f WARNINGS_*.md 2>/dev/null || true
rm -f FIX*.md 2>/dev/null || true
rm -f ERREURS_*.md 2>/dev/null || true
rm -f SOLUTION_*.md 2>/dev/null || true
rm -f CHANGELOG.md 2>/dev/null || true
info "Fichiers de migration nettoyés (START_MIGRATION.md et MIGRATION_STEP_BY_STEP.md conservés)"

# 3. Supprimer les fichiers de build
info "Suppression des dossiers de build..."
rm -rf dist/ 2>/dev/null || true
rm -rf asari/ 2>/dev/null || true
info "Dossiers de build supprimés"

# 4. Supprimer les logs
info "Suppression des fichiers de log..."
rm -f *.log 2>/dev/null || true
rm -f npm-debug.log 2>/dev/null || true
info "Fichiers de log supprimés"

# 5. Supprimer les fichiers package.json dupliqués
info "Nettoyage des fichiers package.json dupliqués..."
rm -f package.json.recommended 2>/dev/null || true
rm -f package.json.vue3 2>/dev/null || true
info "Fichiers package.json dupliqués supprimés"

# 6. Supprimer les fichiers dupliqués dans src/
info "Nettoyage des fichiers dupliqués dans src/..."
rm -f src/App.vue3.vue 2>/dev/null || true
rm -f src/main.vue3.js 2>/dev/null || true
rm -f src/routes/index.vue3.js 2>/dev/null || true
rm -f src/store/index.vue3.js 2>/dev/null || true
rm -f src/globalComponents.vue3.js 2>/dev/null || true
rm -f src/globalDirectives.vue3.js 2>/dev/null || true
rm -f src/material-dashboard.vue3.js 2>/dev/null || true
rm -f src/components/NotificationPlugin/index.vue3.js 2>/dev/null || true
rm -f src/components/SidebarPlugin/index.vue3.js 2>/dev/null || true
info "Fichiers dupliqués supprimés"

# 7. Supprimer les dossiers vides ou inutiles
info "Nettoyage des dossiers inutiles..."
rm -rf src/red 2>/dev/null || true
rm -rf src/assets/icons\ copy 2>/dev/null || true
info "Dossiers inutiles supprimés"

# 8. Nettoyer node_modules (optionnel - décommenter si nécessaire)
# warn "Voulez-vous supprimer node_modules? (y/n)"
# read -r response
# if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
#     rm -rf node_modules/
#     info "node_modules supprimé"
# fi

echo ""
echo -e "${GREEN}✅ Nettoyage terminé avec succès!${NC}"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Vérifiez que le projet fonctionne: npm run serve"
echo "   2. Testez la build: npm run build"
echo "   3. Mettez à jour le README.md si nécessaire"
echo ""

