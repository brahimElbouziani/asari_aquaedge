<template>
  <!-- Modern SaaS Structure: sidebar-wrapper with group pattern -->
  <div class="app-wrapper">
    <Notifications></Notifications>

    <!-- Floating Navigation Buttons - No sidebar -->
    <FloatingNavButtons />

    <!-- Main Content Area - Full width, no sidebar gap -->
    <main class="main-content full-width">
      <BreadcrumbNav />
      
      <dashboard-content></dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </main>
  </div>
</template>


<style lang="scss">
/* App Wrapper - No sidebar structure */
.app-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content Area - Full width, with left margin for floating buttons */
.main-content.full-width {
  position: relative;
  width: 100%;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: 
    radial-gradient(ellipse 80% 60% at bottom right, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.08) 30%, rgba(46, 125, 50, 0.03) 60%, transparent 100%),
    linear-gradient(135deg, var(--bg-color, #f9fafb) 0%, var(--bg-color, #f9fafb) 100%);
  background-color: var(--bg-color, #f9fafb);
  overflow-x: hidden;
  overflow-y: visible !important;
  /* Add left padding to account for floating navigation buttons */
  /* Button position (1rem = 16px) + button width (52px) + margin (16px) = 84px */
  padding-left: 5.25rem; /* ~84px - ensures content clears buttons completely */
}

.main-content.full-width::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle at bottom right, rgba(46, 125, 50, 0.12) 0%, rgba(46, 125, 50, 0.05) 50%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

/* Ensure all page content inside main-content respects the padding */
/* Breadcrumb should respect parent padding */
.main-content.full-width > BreadcrumbNav,
.main-content.full-width > .breadcrumb-nav {
  padding-left: inherit;
  margin-left: 0;
}

/* All other content should respect parent padding */
.main-content.full-width > *:not(header):not(top-navbar):not(.top-navbar-modern):not(BreadcrumbNav):not(.breadcrumb-nav) {
  padding-left: 0; /* Reset to 0, will use parent's padding */
}

/* Ensure content-wrapper respects parent padding */
.main-content.full-width .content-wrapper {
  padding-left: 0; /* Reset to 0, parent has the padding */
}

/* Ensure all content containers respect parent padding */
.main-content.full-width .content,
.main-content.full-width .content-wrapper .content,
.main-content.full-width .content-wrapper .content > *,
.main-content.full-width .card-body,
.main-content.full-width .CCardBody,
.main-content.full-width .CCardBody > *,
.main-content.full-width .p-card-body,
.main-content.full-width .v-card,
.main-content.full-width .v-card > *,
/* Maps page containers */
.main-content.full-width .maps-page-container,
.main-content.full-width .maps-content-wrapper,
.main-content.full-width .maps-col,
.main-content.full-width .maps-card,
.main-content.full-width .maps-card-body {
  padding-left: 0 !important; /* Reset to 0, parent has the padding */
  margin-left: 0 !important;
  /* Ensure content doesn't overflow behind buttons */
  position: relative;
  z-index: 1;
  /* Prevent any negative margins that could cause overlap */
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure header is always visible and on top */
.main-content.full-width > header,
.main-content.full-width > .top-navbar-modern,
.main-content.full-width header.top-navbar-modern,
.main-content.full-width > top-navbar,
.main-content.full-width top-navbar {
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: 56px !important;
  min-height: 56px !important;
  max-height: 56px !important;
  flex-shrink: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  background: #ffffff !important;
}

@media (max-width: 991px) {
  .main-content.full-width {
    /* Tablet: Button position (1rem = 16px) + button width (48px) + margin (12px) = 76px */
    padding-left: 4.75rem; /* ~76px */
  }
  
  /* Ensure content containers respect tablet padding */
  .main-content.full-width .content,
  .main-content.full-width .content-wrapper .content,
  .main-content.full-width .card-body,
  .main-content.full-width .CCardBody,
  .main-content.full-width .p-card-body,
  .main-content.full-width .v-card,
  /* Maps page containers */
  .main-content.full-width .maps-page-container,
  .main-content.full-width .maps-content-wrapper,
  .main-content.full-width .maps-col,
  .main-content.full-width .maps-card,
  .main-content.full-width .maps-card-body {
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  
  .main-content.full-width > header,
  .main-content.full-width > .top-navbar-modern,
  .main-content.full-width header.top-navbar-modern,
  .main-content.full-width > top-navbar,
  .main-content.full-width top-navbar {
    height: 52px !important;
    min-height: 52px !important;
    max-height: 52px !important;
  }
}

@media (max-width: 768px) {
  .main-content.full-width {
    /* Mobile: Button position (0.75rem = 12px) + button width (44px) + margin (8px) = 64px */
    padding-left: 4rem; /* ~64px */
  }
  
  /* Ensure content containers respect mobile padding */
  .main-content.full-width .content,
  .main-content.full-width .content-wrapper .content,
  .main-content.full-width .card-body,
  .main-content.full-width .CCardBody,
  .main-content.full-width .p-card-body,
  .main-content.full-width .v-card,
  /* Maps page containers */
  .main-content.full-width .maps-page-container,
  .main-content.full-width .maps-content-wrapper,
  .main-content.full-width .maps-col,
  .main-content.full-width .maps-card,
  .main-content.full-width .maps-card-body {
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  
  .main-content.full-width > header,
  .main-content.full-width > .top-navbar-modern,
  .main-content.full-width header.top-navbar-modern,
  .main-content.full-width > top-navbar,
  .main-content.full-width top-navbar {
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
  }
}

/* Ensure md-icon works if it's still used inside slots */
.md-icon {
  font-family: 'Material Icons' !important;
}

/* Navigation removed - using floating buttons instead */
</style>

<script>
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import FloatingNavButtons from "@/components/FloatingNavButtons.vue";
import BreadcrumbNav from "@/components/BreadcrumbNav.vue";
import { inject, ref } from 'vue';
import { useMainStore } from '@/store';

export default {
  components: {
    DashboardContent,
    ContentFooter,
    FloatingNavButtons,
    BreadcrumbNav
  },
  setup() {
    // Inject sidebar store from plugin (for mobile menu)
    const sidebarStore = inject('sidebarStore', { showSidebar: false });
    // Use auth store
    const store = useMainStore();
    
    return {
      sidebarStore,
      store
    };
  },
  data() {
    return {};
  },
};
</script>
