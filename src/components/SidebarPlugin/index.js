import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";

const SidebarStore = {
  showSidebar: false,
  displaySidebar(value) {
    this.showSidebar = value;
  }
};

const SidebarPlugin = {
  install(app) {
    // Vue 3 compatible
    app.mixin({
      data() {
        return {
          sidebarStore: SidebarStore
        };
      }
    });

    // Provide/Inject pattern for Vue 3
    app.provide('sidebarStore', SidebarStore);
    
    // Global properties for Vue 3
    app.config.globalProperties.$sidebar = SidebarStore;
    
    app.component("side-bar", Sidebar);
    app.component("sidebar-link", SidebarLink);
  }
};

export default SidebarPlugin;
