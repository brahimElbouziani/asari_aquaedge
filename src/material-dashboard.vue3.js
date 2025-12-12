// Vue 3 Migration - MaterialDashboard
import SideBar from "./components/SidebarPlugin/index.vue3.js";

// asset imports
// VueMaterial n'est pas compatible Vue 3, on le commente temporairement
// import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.css";
import "./assets/scss/material-dashboard.scss";

// library auto imports
import "es6-promise/auto";

/**
 * This is the main Light Bootstrap Dashboard Vue plugin where dashboard related plugins are registerd.
 */
export default {
  install(app) {
    app.use(SideBar);
    // VueMaterial n'est pas compatible Vue 3
    // app.use(VueMaterial);
  }
};


