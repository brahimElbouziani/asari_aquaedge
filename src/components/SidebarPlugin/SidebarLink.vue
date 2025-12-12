<template>
  <li class="nav-item">
    <router-link
      :to="to"
      class="nav-link-premium sidebar-circular-button"
      active-class="active-link"
      @click="handleClick"
      :data-tooltip="getTooltipText"
    >
      <div class="icon-box">
        <slot name="icon">
          <!-- Fallback if no icon slot provided -->
          <i class="pi pi-circle" style="font-size: 8px;"></i>
        </slot>
      </div>
      <!-- Active Indicator -->
      <span class="active-indicator"></span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "sidebar-link",
  props: {
    to: {
      type: [String, Object],
      default: () => {
        return {
          name: "dashboard",
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    getTooltipText() {
      // Get text from slot for tooltip when collapsed
      const textSlot = this.$slots.default;
      if (textSlot && textSlot[0] && textSlot[0].text) {
        return textSlot[0].text.trim();
      }
      return '';
    },
    isSidebarCollapsed() {
      // Check if sidebar is collapsed by checking parent
      const sidebar = this.$parent?.$parent;
      return sidebar?.isCollapsed || false;
    }
  },
  methods: {
    handleClick() {
      // Auto-close on mobile after navigation
      if (this.$sidebar && this.$sidebar.autoClose && window.innerWidth <= 991) {
        setTimeout(() => {
          this.$sidebar.displaySidebar(false);
        }, 100);
      }
    }
  }
};
</script>

<style scoped>
/* Override global styles for circular buttons */
.nav-item {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Each button in its own circular container - exactly like the image */
.nav-link-premium.sidebar-circular-button {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0 !important;
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  margin: 0 !important;
  border-radius: 50% !important;
  background: #ffffff !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: visible !important;
  border: none !important;
  padding: 0 !important;
  /* Override global styles */
  font-size: inherit !important;
  line-height: inherit !important;
  letter-spacing: inherit !important;
}

/* Circular nav item styling - Each in own container */
.circular-nav-item {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0.75rem;
}

.nav-link-premium.sidebar-circular-button {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  border-radius: 50% !important;
  background: #ffffff !important;
  border: none !important;
  padding: 0 !important;
}

/* Icon Box - Circular style */
.nav-link-premium.sidebar-circular-button .icon-box {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
  flex-shrink: 0 !important;
  margin: 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 50% !important;
  background: transparent !important;
  padding: 0 !important;
}

.icon-box svg,
.icon-box .sidebar-icon,
.icon-box .lucide-icon {
  width: 18px !important;
  height: 18px !important;
  flex-shrink: 0;
  color: #6b7280;
  stroke: #6b7280;
  stroke-width: 2;
  fill: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ensure icons inherit color properly */
.icon-box svg path,
.sidebar-icon path {
  stroke: inherit;
  fill: none;
}

/* Force material icons to respect parent color */
::v-deep .md-icon {
  font-size: 20px !important;
  margin: 0 !important;
  color: inherit !important;
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block !important;
  width: 20px !important;
  height: 20px !important;
  line-height: 20px !important;
  font-family: 'Material Icons' !important;
  font-weight: normal !important;
  font-style: normal !important;
}

.nav-link-premium:hover ::v-deep .md-icon {
  transform: scale(1.1);
}

/* Ensure Material Icons font is loaded */
::v-deep .material-icons {
  font-family: 'Material Icons' !important;
  font-weight: normal !important;
  font-style: normal !important;
  font-size: 20px !important;
  display: inline-block !important;
  line-height: 1 !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  word-wrap: normal !important;
  white-space: nowrap !important;
  direction: ltr !important;
  font-feature-settings: 'liga' !important;
  -webkit-font-feature-settings: 'liga' !important;
  -webkit-font-smoothing: antialiased !important;
}

/* Tooltips removed - no floating tooltips */
.link-text {
  display: none !important;
}

.link-text p,
.link-text span {
  margin: 0;
  padding: 0;
  line-height: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Lucide Icons styling */
.sidebar-icon {
  width: 18px !important;
  height: 18px !important;
  flex-shrink: 0;
  color: #6b7280;
  stroke: #6b7280;
  stroke-width: 2;
  fill: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-icon path {
  stroke: inherit;
  fill: none;
}

/* Active state - Dark green circular background like image */
.nav-link-premium.active-link {
  background: #2e7d32 !important;
  box-shadow: none !important;
  border: none !important;
}

.nav-link-premium.active-link .icon-box {
  background: transparent !important;
}

/* Force white color for all icon types when active (white on dark green) */
.nav-link-premium.active-link .sidebar-icon,
.nav-link-premium.active-link .icon-box svg,
.nav-link-premium.active-link .icon-box .lucide-icon,
.nav-link-premium.active-link .icon-box i,
.nav-link-premium.active-link ::v-deep .md-icon,
.nav-link-premium.active-link ::v-deep .material-icons {
  color: #ffffff !important;
  stroke: #ffffff !important;
  fill: #ffffff !important;
  width: 18px !important;
  height: 18px !important;
}

/* Ensure SVG paths are white */
.nav-link-premium.active-link .icon-box svg path,
.nav-link-premium.active-link .sidebar-icon path,
.nav-link-premium.active-link .icon-box svg * {
  stroke: #ffffff !important;
  fill: #ffffff !important;
}

/* Ensure Lucide icons are white when active */
.nav-link-premium.active-link .sidebar-icon {
  color: #ffffff !important;
  stroke: #ffffff !important;
}

.nav-link-premium.active-link .sidebar-icon path {
  stroke: #ffffff !important;
  fill: none !important;
}

/* Hover state - Light background */
.nav-link-premium:hover:not(.active-link) {
  background: #f5f5f5;
  transform: scale(1.05);
}

.nav-link-premium:hover:not(.active-link) .sidebar-icon,
.nav-link-premium:hover:not(.active-link) .icon-box svg,
.nav-link-premium:hover:not(.active-link) .icon-box .lucide-icon,
.nav-link-premium:hover:not(.active-link) .icon-box svg path,
.nav-link-premium:hover:not(.active-link) .sidebar-icon path {
  color: var(--primary-color, #4caf50) !important;
  stroke: var(--primary-color, #4caf50) !important;
}

/* Keep active icons white even on hover */
.nav-link-premium.active-link:hover .sidebar-icon,
.nav-link-premium.active-link:hover .icon-box svg,
.nav-link-premium.active-link:hover .icon-box .lucide-icon,
.nav-link-premium.active-link:hover .icon-box svg path,
.nav-link-premium.active-link:hover .sidebar-icon path {
  color: #ffffff !important;
  stroke: #ffffff !important;
  fill: #ffffff !important;
}

/* Active indicator - Removed, using border-left instead */
.active-indicator {
  display: none;
}

/* Custom Tooltip - Smaller size */
.nav-link-premium::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.3;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.01em;
}

.nav-link-premium::before {
  content: '';
  position: absolute;
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 5px 0;
  border-color: transparent rgba(26, 26, 26, 0.95) transparent transparent;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10001;
}

.nav-link-premium:hover::after,
.nav-link-premium:hover::before {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.nav-link-premium:hover::before {
  transform: translateY(-50%);
}
</style>
