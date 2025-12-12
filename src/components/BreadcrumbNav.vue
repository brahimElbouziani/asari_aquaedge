<template>
  <nav class="breadcrumb-nav" aria-label="Breadcrumb">
    <ol class="breadcrumb-nav__list">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="index"
        class="breadcrumb-nav__item"
        :class="{ 'is-active': index === breadcrumbs.length - 1 }"
      >
        <router-link 
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="breadcrumb-nav__link"
        >
          <component 
            v-if="crumb.icon" 
            :is="crumb.icon" 
            class="breadcrumb-nav__icon"
            :size="16"
          />
          <span class="breadcrumb-nav__text">{{ crumb.label }}</span>
        </router-link>
        <span 
          v-else
          class="breadcrumb-nav__current"
        >
          <component 
            v-if="crumb.icon" 
            :is="crumb.icon" 
            class="breadcrumb-nav__icon"
            :size="16"
          />
          <span class="breadcrumb-nav__text">{{ crumb.label }}</span>
        </span>
        <span 
          v-if="index < breadcrumbs.length - 1"
          class="breadcrumb-nav__separator"
          aria-hidden="true"
        >
          <ChevronRight :size="16" />
        </span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRight, Home } from 'lucide-vue-next'

export default defineComponent({
  name: 'BreadcrumbNav',
  setup() {
    const route = useRoute()

    // Map routes to breadcrumb labels
    const routeLabels = {
      '/': 'Accueil',
      '/dashboard': 'Tableau de bord',
      '/maps': 'Capteurs',
      '/table': 'Données',
      '/sensor-detail': 'Détails du Capteur',
      '/Add': 'Ajouter un capteur',
      '/notifications': 'Alertes',
      '/user': 'Profil',
      '/analytics': 'Analytique',
      '/settings': 'Paramètres',
      '/support': 'Support',
      '/contact': 'Contact',
      '/documentation': 'Documentation'
    }

    // Map routes to icons
    const routeIcons = {
      '/': Home,
      '/dashboard': null,
      '/maps': null,
      '/table': null,
      '/Add': null,
      '/notifications': null,
      '/user': null
    }

    const breadcrumbs = computed(() => {
      const paths = route.path.split('/').filter(Boolean)
      const crumbs = [{ path: '/', label: 'Accueil', icon: Home }]

      let currentPath = ''
      let i = 0
      
      while (i < paths.length) {
        const path = paths[i]
        currentPath += `/${path}`
        
        // Special handling for sensor-detail routes
        if (path === 'sensor-detail' && paths[i + 1]) {
          // This is the sensor-detail path
          const label = routeLabels[currentPath] || 'Détails du Capteur'
          const icon = routeIcons[currentPath] || null
          crumbs.push({
            path: currentPath,
            label,
            icon
          })
          
          // Handle the ID
          i++
          const idPath = currentPath + '/' + paths[i]
          crumbs.push({
            path: idPath,
            label: paths[i], // Use the ID as label (e.g., Z6-19028)
            icon: null
          })
          currentPath = idPath
        } else {
          // Default handling for other routes
          const label = routeLabels[currentPath] || path.charAt(0).toUpperCase() + path.slice(1)
          const icon = routeIcons[currentPath] || null
          crumbs.push({
            path: currentPath,
            label,
            icon
          })
        }
        
        i++
      }

      return crumbs
    })

    return {
      breadcrumbs,
      ChevronRight
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/base/variables';
@import '@/assets/css/base/mixins';

.breadcrumb-nav {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.breadcrumb-nav__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-nav__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-nav__link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-md, 8px);
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-base, 0.3s) cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;

  &:hover {
    color: var(--primary-color, #4CAF50);
    background: rgba(76, 175, 80, 0.08);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color, #4CAF50);
    outline-offset: 2px;
  }
}

.breadcrumb-nav__current {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-md, 8px);
  color: var(--text-main, #1a1a1a);
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(76, 175, 80, 0.1);
}

.breadcrumb-nav__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: inherit;
  stroke: currentColor;
  stroke-width: 2;
}

.breadcrumb-nav__text {
  white-space: nowrap;
}

.breadcrumb-nav__separator {
  display: flex;
  align-items: center;
  color: var(--text-secondary, #9ca3af);
  opacity: 0.6;
  margin: 0 0.25rem;
  
  svg {
    width: 16px;
    height: 16px;
  }
}

// Responsive
@include respond-to('mobile') {
  .breadcrumb-nav {
    padding: 0.75rem 1rem;
  }

  .breadcrumb-nav__link,
  .breadcrumb-nav__current {
    padding: 0.375rem 0.5rem;
    font-size: 0.8125rem;
  }

  .breadcrumb-nav__text {
    // Hide text on very small screens, show only icons
    @media (max-width: 480px) {
      display: none;
    }
  }
}
</style>

