// Vue 3 Migration - SidebarPlugin
import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";
import { reactive } from "vue";

const SidebarStore = reactive({
  showSidebar: false,
  displaySidebar(value) {
    this.showSidebar = value;
  }
});

const SidebarPlugin = {
  install(app) {
    // Provide sidebar store globally
    app.provide('sidebarStore', SidebarStore);
    
    // Register global components
    app.component("side-bar", Sidebar);
    app.component("sidebar-link", SidebarLink);
    
    // Add global property for compatibility
    app.config.globalProperties.$sidebar = SidebarStore;
  }
};

export default SidebarPlugin;


