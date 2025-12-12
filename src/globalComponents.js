import DropDown from "./components/Dropdown.vue";

// Google Maps Components
import GmapMap from "./components/GoogleMap/GmapMap.vue";
import GmapMarker from "./components/GoogleMap/GmapMarker.vue";
import GmapPolygon from "./components/GoogleMap/GmapPolygon.vue";
import GmapInfoWindow from "./components/GoogleMap/GmapInfoWindow.vue";
import GmapPolyline from "./components/GoogleMap/GmapPolyline.vue";

// SaaS Components
import EmptyState from "./components/EmptyState.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import StatCard from "./components/StatCard.vue";
import ResponsiveContainer from "./components/ResponsiveContainer.vue";

/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app) {
    // Vue 3 compatible
    app.component("drop-down", DropDown);
    
    // Register Google Maps components globally
    app.component("GmapMap", GmapMap);
    app.component("GmapMarker", GmapMarker);
    app.component("GmapPolygon", GmapPolygon);
    app.component("GmapInfoWindow", GmapInfoWindow);
    app.component("GmapPolyline", GmapPolyline);
    
    // Register SaaS components globally
    app.component("empty-state", EmptyState);
    app.component("loading-spinner", LoadingSpinner);
    app.component("stat-card", StatCard);
    app.component("responsive-container", ResponsiveContainer);
  }
};

export default GlobalComponents;
