<template>
  <header 
    class="top-navbar-modern modern-header" 
    :class="{ 'sidebar-collapsed': isCollapsed }"
    style="display: flex !important; visibility: visible !important; opacity: 1 !important; position: sticky !important; top: 0 !important; z-index: 1000 !important; width: 100% !important; background: #ffffff !important;"
  >
    <div class="navbar-container">
      <!-- Left Section - Only Title -->
      <div class="navbar-left">
        <!-- Mobile Menu Toggle Only -->
        <button 
          class="sidebar-toggle-btn mobile-menu-btn" 
          @click="toggleMobileSidebar"
          aria-label="Toggle Menu"
          v-if="!isDesktop"
        >
          <i class="pi pi-bars"></i>
        </button>
        
        <div class="page-title-section">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
      </div>

      <!-- Right Section - Removed, keeping only title -->
    </div>
  </header>
</template>

<script>
import { useRoute } from 'vue-router';
import { useMainStore } from '@/store';
import router from '@/routes';
import { inject, computed, ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'TopNavbar',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const route = useRoute();
    const sidebarStore = inject('sidebarStore', null);
    const sidebarRef = inject('sidebarRef', null);
    const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false));
    const toggleSidebarCollapse = inject('toggleSidebarCollapse', () => {});
    
    // Toggle functionality removed - sidebar always in circular mode
    
    const isDesktop = ref(window.innerWidth > 991);
    
    const handleResize = () => {
      isDesktop.value = window.innerWidth > 991;
    };
    
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
    
    return { 
      route,
      sidebarStore,
      sidebarRef,
      isCollapsed: computed(() => true), // Always collapsed (circular)
      isSidebarCollapsed: computed(() => true),
      isDesktop
    };
  },
  data() {
    return {
      showUserMenu: false,
      userName: 'Utilisateur',
      userRole: 'Administrateur',
      isDesktop: window.innerWidth > 991,
      isSidebarCollapsed: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.checkSidebarState();
    
    // Listen for sidebar collapse changes
    this.$nextTick(() => {
      this.updateSidebarState();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  computed: {
    currentPageTitle() {
      const routeNames = {
        '/dashboard': 'Tableau de bord',
        '/maps': 'Capteurs',
        '/table': 'Données',
        '/Add': 'Ajouter un capteur',
        '/notifications': 'Alertes',
        '/analytics': 'Analyses',
        '/settings': 'Paramètres',
        '/support': 'Support',
        '/contact': 'Contact',
        '/docs': 'Documentation',
        '/user': 'Mon Profil',
      };
      return routeNames[this.route.path] || 'Tableau de bord';
    }
  },
  methods: {
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    // toggleSidebar is now handled in setup()
    toggleMobileSidebar() {
      // Toggle mobile sidebar
      if (this.sidebarStore) {
        this.sidebarStore.displaySidebar(!this.sidebarStore.showSidebar);
      } else {
        // Fallback for Vue 2 compatibility
        const sidebar = this.$root?.$sidebar || this.$sidebar;
        if (sidebar) {
          sidebar.displaySidebar(!sidebar.showSidebar);
        }
      }
    },
    findSidebarComponent() {
      // Find the SideBar component instance
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name === 'SideBar' || parent.toggleCollapse) {
          return parent;
        }
        parent = parent.$parent;
      }
      return null;
    },
    updateSidebarState() {
      this.$nextTick(() => {
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
          this.isSidebarCollapsed = wrapper.classList.contains('sidebar-collapsed');
        }
      });
    },
    checkSidebarState() {
      // Check initial sidebar state
      this.updateSidebarState();
      // Set up observer for sidebar state changes
      const observer = new MutationObserver(() => {
        this.updateSidebarState();
      });
      
      const wrapper = document.querySelector('.wrapper');
      if (wrapper) {
        observer.observe(wrapper, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
      
      this.observer = observer;
    },
    onResize() {
      this.isDesktop = window.innerWidth > 991;
    },
    logout() {
      localStorage.removeItem("authToken");
      const store = useMainStore();
      store.khrjat();
      router.push("/login");
    }
  },
  watch: {
    '$route'() {
      // Close dropdown on route change
      this.showUserMenu = false;
    }
  }
};
</script>

<style scoped>
/* Header - Beautiful Modern SaaS Design - ALWAYS VISIBLE */
.top-navbar-modern.modern-header,
header.top-navbar-modern,
.top-navbar-modern {
  background: #ffffff !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  position: sticky !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 100 !important; /* Below floating sidebar */
  width: 100% !important;
  height: 56px !important;
  min-height: 56px !important;
  max-height: 56px !important;
  font-family: var(--font-inter, "Inter", "Inter Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif) !important;
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  flex-shrink: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
}

@supports (backdrop-filter: blur(8px)) {
  .top-navbar-modern.modern-header {
    background: rgba(255, 255, 255, 0.6);
  }
}

.navbar-container {
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  max-width: 100%;
  margin: 0 auto;
  height: 56px;
  min-height: 56px;
  width: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 0.75rem;
}

/* Mobile Menu Toggle Button Only */
.sidebar-toggle-btn.mobile-menu-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-toggle-btn.mobile-menu-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  transform: scale(1.05);
}

.sidebar-toggle-btn.mobile-menu-btn:active {
  transform: scale(0.95);
}

.sidebar-toggle-btn.mobile-menu-btn i {
  font-size: 1rem;
  font-family: 'primeicons' !important;
}

.navbar-icon-btn i {
  font-family: 'primeicons' !important;
}

.user-avatar i {
  font-family: 'primeicons' !important;
}

.dropdown-icon {
  font-family: 'primeicons' !important;
}

.search-icon {
  font-family: 'primeicons' !important;
}

.mobile-menu-btn {
  display: none;
}

@media (min-width: 992px) {
  .mobile-menu-btn {
    display: none;
  }
}

.page-title-section {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.page-title {
  font-family: var(--font-inter) !important;
  font-size: 0.9375rem !important; /* 15px - More compact */
  font-weight: var(--font-weight-semibold) !important;
  color: #111827;
  margin: 0;
  line-height: 1.3 !important;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.navbar-right {
  display: none !important;
}

/* Search Container */
.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 1rem;
}

.search-input {
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 280px;
  transition: all 0.2s;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Icon Buttons */
.navbar-icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.navbar-icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.navbar-icon-btn i {
  font-size: 1.125rem;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-avatar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-avatar-btn:hover {
  background: rgba(76, 175, 80, 0.08);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.25);
  transition: all 0.2s ease;
}

.user-avatar-btn:hover .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.35);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
}

.user-role {
  font-size: 0.6875rem;
  color: #6b7280;
  line-height: 1.2;
}

.dropdown-icon {
  color: #6b7280;
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

/* Dropdown Menu - Beautiful Design */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  min-width: 220px;
  z-index: 50;
  overflow: hidden;
  padding: 0.5rem;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  border-radius: 8px;
  font-weight: 500;
}

.dropdown-item:hover {
  background: rgba(76, 175, 80, 0.08);
  color: #4caf50;
}

.dropdown-item:hover i {
  color: #4caf50;
}

.dropdown-item i {
  color: #6b7280;
  font-size: 1rem;
  transition: color 0.2s ease;
}

.dropdown-item.logout-item {
  color: #ef4444;
}

.dropdown-item.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.dropdown-item.logout-item:hover i {
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

/* Responsive */
@media (max-width: 991px) {
  .navbar-container {
    padding: 0.375rem 1rem;
    height: 52px;
    min-height: 52px;
  }

  .top-navbar-modern {
    height: 52px;
    min-height: 52px;
    max-height: 52px;
  }

  .navbar-left {
    gap: 0.5rem;
  }

  .navbar-right {
    gap: 0.375rem;
  }

  .search-container {
    display: none;
  }

  .user-info {
    display: none;
  }

  .page-title {
    font-size: 0.875rem;
  }

  .sidebar-toggle-btn {
    width: 30px;
    height: 30px;
  }

  .navbar-icon-btn {
    width: 30px;
    height: 30px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.375rem 0.75rem;
    height: 48px;
    min-height: 48px;
  }

  .top-navbar-modern {
    height: 48px;
    min-height: 48px;
    max-height: 48px;
  }

  .navbar-left {
    gap: 0.375rem;
  }

  .navbar-right {
    gap: 0.25rem;
  }

  .page-title {
    font-size: 0.8125rem;
  }

  .sidebar-toggle-btn {
    width: 28px;
    height: 28px;
  }

  .sidebar-toggle-btn i {
    font-size: 0.875rem;
  }

  .navbar-icon-btn {
    width: 28px;
    height: 28px;
  }

  .navbar-icon-btn i {
    font-size: 1rem;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .user-avatar-btn {
    padding: 0.125rem 0.375rem;
    gap: 0.375rem;
  }
}
</style>

<style>
/* Global styles to ensure header is visible - Not scoped */
header.top-navbar-modern,
.top-navbar-modern.modern-header,
.top-navbar-modern {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  width: 100% !important;
  height: 56px !important;
  min-height: 56px !important;
  max-height: 56px !important;
  background: #ffffff !important;
  border: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
  flex-shrink: 0 !important;
}

@media (max-width: 991px) {
  header.top-navbar-modern,
  .top-navbar-modern.modern-header,
  .top-navbar-modern {
    height: 52px !important;
    min-height: 52px !important;
    max-height: 52px !important;
  }
}

@media (max-width: 768px) {
  header.top-navbar-modern,
  .top-navbar-modern.modern-header,
  .top-navbar-modern {
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
  }
}
</style>
