// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from "./components/SidebarPlugin";

// asset imports
// VueMaterial is Vue 2 only, commenting out for Vue 3
// import VueMaterial from "vue-material";
// import "vue-material/dist/vue-material.css";
import "./assets/scss/material-dashboard.scss";

// library auto imports
import "es6-promise/auto";

/**
 * This is the main Light Bootstrap Dashboard Vue plugin where dashboard related plugins are registerd.
 */
export default {
  install(app) {
    // Vue 3 compatible
    app.use(SideBar);
    // VueMaterial is Vue 2 only, removed for Vue 3
    // app.use(VueMaterial);
  }
};
