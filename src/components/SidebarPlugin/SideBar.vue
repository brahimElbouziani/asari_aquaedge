<template>
  <div class="sidebar-container">
    <!-- Custom Sidebar -->
    <aside 
      class="custom-sidebar sidebar-container"
      :class="{ 
        'desktop-sidebar': isDesktop, 
        'collapsed': collapsedState,
        'mobile-open': isDesktop ? false : (($sidebar && $sidebar.showSidebar) || (sidebarStore && sidebarStore.showSidebar))
      }"
      :data-state="collapsedState ? 'collapsed' : 'expanded'"
      data-collapsible="icon"
      data-slot="sidebar-container"
    >
      <!-- Sidebar Inner - Modern SaaS pattern -->
      <div class="sidebar-inner" data-sidebar="sidebar" data-slot="sidebar-inner">
        <!-- Logo Section - Beautiful Top Left Navigation -->
        <div class="logo-area sidebar-header" data-slot="sidebar-header" data-sidebar="header">
          <router-link to="/" class="logo-link">
            <img :src="imgLogo" alt="Logo" class="logo-img-premium" />
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex-grow-1 overflow-auto premium-scroll sidebar-nav-content sidebar-content" data-slot="sidebar-content" data-sidebar="content">
        <!-- Mobile Menu Items (Hidden on Desktop) -->
        <div class="mobile-menu-section">
           <slot name="content"></slot>
        </div>

        <!-- Main Links with Collapse Support -->
        <div class="nav-sections">
          <slot>
            <sidebar-link
              v-for="(link, index) in sidebarLinks"
              :key="link.name + index"
              :to="link.path"
              :link="link"
            >
            </sidebar-link>
          </slot>
        </div>
      </div>

        <!-- Profile Button Footer - Circular -->
        <div class="sidebar-footer-premium sidebar-footer circular-profile-section" data-slot="sidebar-footer" data-sidebar="footer">
          <div class="profile-button-wrapper">
            <div 
              class="profile-hover-container"
              @mouseenter="handleProfileHover($event)"
              @mouseleave="handleProfileLeave"
              ref="profileButton"
            >
              <router-link 
                to="/user" 
                class="circular-profile-btn"
              >
                <div class="profile-avatar-circle">
                  <img src="@/assets/img/faces/marc.jpg" alt="Profile" />
                </div>
              </router-link>
              <!-- Profile Tooltip Menu -->
              <transition name="fade">
                <div 
                  v-show="showProfileTooltip"
                  class="profile-tooltip-menu"
                  :style="tooltipStyle"
                >
                  <div class="profile-tooltip-header">
                    <div class="profile-tooltip-avatar">
                      <img src="@/assets/img/faces/marc.jpg" alt="Profile" />
                    </div>
                    <div class="profile-tooltip-info">
                      <div class="tooltip-name">{{ userName }}</div>
                      <div class="tooltip-role">{{ userRole }}</div>
                    </div>
                  </div>
                  <div class="profile-tooltip-divider"></div>
                  <button class="profile-tooltip-logout" @click="logout">
                    <i class="pi pi-sign-out"></i>
                    <span>Déconnexion</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Sidebar Rail Toggle Button - Removed, now in header -->

    <!-- Mobile Overlay -->
    <div 
      v-if="!isDesktop && (($sidebar && $sidebar.showSidebar) || (sidebarStore && sidebarStore.showSidebar))"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script>
import SidebarLink from "./SidebarLink.vue";
import Button from 'primevue/button';
import "@/assets/css/sidebar-premium.css";
import { inject } from 'vue';
import { RouterLink } from 'vue-router';
import router from '@/routes';

export default {
  components: {
    SidebarLink,
    Button,
    RouterLink
  },
  props: {
    sidebarBackgroundImage: {
      type: String,
      default: require("@/assets/img/sidebar-2.jpg"),
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/logo2_agriedge.png"),
    },
    sidebarItemColor: {
      type: String,
      default: "green",
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const sidebarStore = inject('sidebarStore', null);
    return {
      sidebarStore
    };
  },
  computed: {
    // Fallback for Vue 2 compatibility
    $sidebar() {
      return this.sidebarStore || this.$root?.sidebarStore || {
        showSidebar: false,
        displaySidebar: () => {}
      };
    },
    collapsedState() {
      // Use prop isCollapsed directly
      return this.isCollapsed === true;
    }
  },
  watch: {
    isCollapsed: {
      handler(newVal) {
        this.updateWrapperClass();
        this.$emit('sidebar-collapse-changed', newVal);
      },
      immediate: true
    },
    isDesktop: {
      handler() {
        this.updateWrapperClass();
      }
    }
  },
  data() {
    return {
      isDesktop: window.innerWidth > 991,
      userName: 'Utilisateur',
      userRole: 'Administrateur',
      showProfileTooltip: false,
      tooltipStyle: {},
    };
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  methods: {
    updateWrapperClass() {
      // Always keep sidebar collapsed (circular design)
      const wrapper = document.querySelector('.sidebar-wrapper') || document.querySelector('.wrapper');
      if (wrapper) {
        wrapper.classList.add('sidebar-collapsed');
      }
    },
    closeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.displaySidebar(false);
      } else if (this.sidebarStore) {
        this.sidebarStore.displaySidebar(false);
      }
    },
    logout() {
      localStorage.removeItem("authToken");
      if (this.$router) {
        this.$router.push("/login");
      } else if (router) {
        router.push("/login");
      } else {
        window.location.href = "/#/login";
      }
    },
    onResize() {
      this.isDesktop = window.innerWidth > 991;
      if (!this.isDesktop) {
        if (this.$sidebar) {
          this.$sidebar.displaySidebar(false);
        } else if (this.sidebarStore) {
          this.sidebarStore.displaySidebar(false);
        }
      }
    },
    handleProfileHover(event) {
      // Calculate position first, then show tooltip
      this.updateTooltipPosition(event);
      this.showProfileTooltip = true;
    },
    handleProfileLeave() {
      this.showProfileTooltip = false;
    },
    updateTooltipPosition(event) {
      // Get the button element position
      const button = this.$refs.profileButton || (event && (event.currentTarget || event.target));
      if (!button) {
        // Fallback: try to find the button by class
        const fallbackButton = document.querySelector('.circular-profile-btn');
        if (fallbackButton) {
          const rect = fallbackButton.getBoundingClientRect();
          this.tooltipStyle = {
            position: 'fixed',
            left: `${rect.right + 12}px`,
            top: `${rect.top + (rect.height / 2)}px`,
            transform: 'translateY(-50%)',
            zIndex: '10003',
            display: 'block',
          };
        }
        return;
      }
      
      const rect = button.getBoundingClientRect();
      
      this.tooltipStyle = {
        position: 'fixed',
        left: `${rect.right + 12}px`,
        top: `${rect.top + (rect.height / 2)}px`,
        transform: 'translateY(-50%)',
        zIndex: '10003',
        display: 'block',
      };
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    // Always keep sidebar in collapsed (circular) mode
    this.updateWrapperClass();
    // Force collapsed state
    const wrapper = document.querySelector('.sidebar-wrapper');
    if (wrapper) {
      wrapper.classList.add('sidebar-collapsed');
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped>
/* Sidebar Container - Modern SaaS pattern */
.sidebar-container {
  position: relative;
  flex-shrink: 0;
}

/* Modern Sidebar - Floating on all page - Always visible */
.custom-sidebar.sidebar-container {
  background: var(--sidebar-bg);
  border: none !important;
  border-right: none !important;
  box-shadow: none !important;
  padding: 0;
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  transition: width 0.2s ease-linear, left 0.2s ease-linear, right 0.2s ease-linear;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed !important;
  inset-y: 0;
  left: 0;
  z-index: 9999 !important; /* Very high z-index to float above everything */
  overflow-y: auto;
  overflow-x: visible !important;
  overflow: visible !important; /* Allow tooltips to overflow */
  flex-shrink: 0;
  /* Ensure tooltips can overflow sidebar bounds */
  clip-path: none !important;
  top: 0 !important;
  bottom: 0 !important;
}

/* Sidebar Inner - Modern SaaS pattern */
.sidebar-inner {
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1;
  overflow: visible !important;
}

/* Sidebar Header - Logo in its own container */
.sidebar-header {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.75rem;
}

.logo-area {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0.75rem;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-link:hover {
  background: #f5f5f5;
  transform: scale(1.05);
}

.logo-img-premium {
  max-height: 32px;
  width: auto;
  padding: 4px;
}

/* Sidebar Content */
.sidebar-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible !important; /* Allow tooltips to show */
}

/* Sidebar Footer */
.sidebar-footer {
  flex-shrink: 0;
  margin-top: auto;
  overflow: visible !important;
}

.sidebar-footer-premium {
  overflow: visible !important;
}

/* Always Collapsed - Circular Design (Icon Only) */
.custom-sidebar,
.custom-sidebar.collapsed,
.custom-sidebar[data-state="collapsed"] {
  width: var(--sidebar-width-icon) !important;
  min-width: var(--sidebar-width-icon) !important;
}

/* Desktop Sidebar - Fixed positioning */
.custom-sidebar.desktop-sidebar {
  position: fixed;
  transform: translateX(0);
}

@media (min-width: 992px) {
  .custom-sidebar.desktop-sidebar[data-state="collapsed"] {
    width: var(--sidebar-width-icon);
  }
  
  .custom-sidebar.desktop-sidebar[data-state="collapsed"] .sidebar-content {
    overflow: hidden;
  }
}

/* Mobile Sidebar - Hidden by default - No shadow */
.custom-sidebar:not(.desktop-sidebar) {
  position: fixed;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  z-index: 1100;
  box-shadow: none !important;
}

.custom-sidebar:not(.desktop-sidebar).mobile-open {
  transform: translateX(0);
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1099;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar Rail Toggle Button - Removed (circular design always collapsed) */

/* Collapsed Styles - Circular design is always "collapsed" */
.custom-sidebar.collapsed .link-text,
.custom-sidebar.collapsed .logout-button-full :deep(.p-button-label) {
  display: none;
}

.custom-sidebar.collapsed .nav-link-premium {
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}

.custom-sidebar.collapsed .logo-img-premium,
.logo-img-premium {
  max-height: 40px;
  width: auto;
}

.custom-sidebar.collapsed .sidebar-nav-content {
  overflow: hidden;
}

/* Circular nav always shows tooltips */
.circular-nav .nav-link-premium .link-text {
  display: block;
}

/* Hide logo text if any */
.logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Logout Button Styles */
.logout-button-full {
  width: 100% !important;
  justify-content: center !important;
  margin-top: auto;
  border-radius: 8px !important;
}

:deep(.logout-button-full .p-button-label) {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Circular Profile Section - In its own container */
.circular-profile-section {
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible !important;
}

.profile-button-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  overflow: visible !important;
}

.circular-profile-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none !important;
  border: none !important;
  cursor: pointer;
  overflow: hidden;
}

.circular-profile-btn:hover {
  transform: scale(1.05);
  background: #f5f5f5;
}

.circular-profile-btn.router-link-active {
  background: #ffffff;
  box-shadow: none !important;
  border: none !important;
}

.profile-avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-circle i {
  display: none; /* Hide icon, use image instead */
}

/* Profile Hover Container */
.profile-hover-container {
  position: relative !important;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: visible !important;
}

/* Profile Tooltip Menu - Shows on hover */
.profile-tooltip-menu {
  position: fixed !important;
  background: rgba(26, 26, 26, 0.95) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: #ffffff !important;
  border-radius: 12px;
  padding: 0.75rem;
  min-width: 200px;
  z-index: 10003 !important;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: normal;
  display: block !important;
  pointer-events: auto !important;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Show tooltip on hover or when show-tooltip class is added */
:deep(.profile-hover-container:hover .profile-tooltip-menu),
.profile-tooltip-menu.show-tooltip {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(-50%) translateX(0) !important;
  pointer-events: auto !important;
  display: block !important;
}

/* Tooltip Arrow */
.profile-tooltip-menu::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 6px 6px 0;
  border-color: transparent rgba(26, 26, 26, 0.95) transparent transparent;
}

/* Profile Tooltip Header */
.profile-tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
}

.profile-tooltip-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.profile-tooltip-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-tooltip-info {
  flex: 1;
  min-width: 0;
}

.tooltip-name {
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip-role {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Divider */
.profile-tooltip-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

/* Logout Button */
.profile-tooltip-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: var(--font-inter, 'Inter', sans-serif);
}

.profile-tooltip-logout:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.profile-tooltip-logout i {
  font-size: 0.875rem;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-tooltip-logout span {
  flex: 1;
}

/* Collapsed state for profile */
.custom-sidebar.collapsed .circular-profile-btn {
  width: 44px;
  height: 44px;
}

.custom-sidebar.collapsed .profile-tooltip-menu {
  left: calc(100% + 12px);
}
</style>
