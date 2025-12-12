// Vue 3 Migration - GlobalComponents
import DropDown from "./components/Dropdown.vue";

// Import real Google Maps components
import GmapMap from "./components/GoogleMap/GmapMap.vue";
import GmapMarker from "./components/GoogleMap/GmapMarker.vue";
import GmapPolygon from "./components/GoogleMap/GmapPolygon.vue";
import GmapPolyline from "./components/GoogleMap/GmapPolyline.vue";
import GmapInfoWindow from "./components/GoogleMap/GmapInfoWindow.vue";

// Stub for components not yet implemented
import { h } from 'vue';

const GoogleMapsStub = {
  name: 'GoogleMapsStub',
  render() {
    return h('div', { style: 'display: none;' });
  },
  props: {
    position: { type: Object, default: () => ({ lat: 0, lng: 0 }) },
    options: { type: Object, default: () => ({}) }
  }
};

// Vue Material stub components (temporary - vue-material is not compatible with Vue 3)
const VueMaterialStub = {
  name: 'VueMaterialStub',
  render() {
    return h('div', { class: 'vue-material-stub' });
  },
  props: {
    // Accept common props
    vModel: { type: [Array, Object], default: null },
    mdLabel: { type: String, default: '' },
    style: { type: [String, Object], default: '' },
    class: { type: [String, Object, Array], default: '' },
    'data-background-color': { type: String, default: '' },
    'md-alignment': { type: String, default: '' }
  }
};

const GlobalComponents = {
  install(app) {
    app.component("drop-down", DropDown);
    
    // Register real Google Maps components
    app.component("GmapMap", GmapMap);
    app.component("GmapMarker", GmapMarker);
    app.component("GmapPolygon", GmapPolygon);
    app.component("GmapPolyline", GmapPolyline);
    app.component("GmapInfoWindow", GmapInfoWindow);
    
    // Stub components not yet implemented
    app.component("GmapCircle", GoogleMapsStub);
    app.component("GmapRectangle", GoogleMapsStub);
    
    // Register Vue Material stub components (vue-material is not compatible with Vue 3)
    // TODO: Replace with PrimeVue or Vuetify components
    app.component("md-table", VueMaterialStub);
    app.component("md-table-row", VueMaterialStub);
    app.component("md-table-cell", VueMaterialStub);
    app.component("md-card", VueMaterialStub);
    app.component("md-card-header", VueMaterialStub);
    app.component("md-card-content", VueMaterialStub);
    app.component("md-card-actions", VueMaterialStub);
  }
};

export default GlobalComponents;

