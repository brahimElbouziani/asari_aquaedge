// Vue 3 Migration - main.js (Version Progressive)
import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes"; // Router Vue 3
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";

// PrimeVue imports
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primeicons/primeicons.css'; // Load PrimeIcons FIRST
import fr from './locales/fr';

// Global CSS - Inter Font (must be after PrimeIcons to override properly)
import '@/assets/css/inter-font.css';
// CSS Variables & Base Styles (import via main.scss which imports SCSS partials)
import '@/assets/css/main.scss';
// SaaS Pages Global Styles
import '@/assets/css/saas-pages.css';
// Responsive System
import '@/assets/css/responsive.css';
// Page Content Styles - Ensure visibility
import '@/assets/css/page-content.css';

// Firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebase";

// Plugins Vue 3 - Import before use
import GlobalComponents from "./globalComponents.js";
import GlobalDirectives from "./globalDirectives.js";
import Notifications from "./components/NotificationPlugin/index.js";
import MaterialDashboard from "./material-dashboard.js";

// CoreUI Vue 3 (compatible)
import CoreuiVue from "@coreui/vue";

// Components
import MdIcon from "./components/MdIcon.vue";

// Global properties
import Chartist from "chartist";
import { iconsSet as icons } from "./assets/icons/icons.js";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Create Vue 3 app
const app = createApp(App);

// Create Pinia store
const pinia = createPinia();

// Configure PrimeVue with Aura theme
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  locale: fr
});

// Register PrimeVue Services (must be after PrimeVue)
app.use(ToastService);
app.use(ConfirmationService);

// Register md-icon component globally
app.component("md-icon", MdIcon);

// Use router and store
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(CoreuiVue);
app.use(MaterialDashboard);
app.use(GlobalComponents);
app.use(GlobalDirectives);
app.use(Notifications);

// Global properties
app.config.globalProperties.$Chartist = Chartist;
app.config.globalProperties.$icons = icons;

// Plugins temporairement commentés (incompatibles Vue 3)
// TODO: Adapter ces plugins pour Vue 3
// import BootstrapVue from "bootstrap-vue";
// import VueMaterial from "vue-material";
// import VueGoogleMaps from "vue2-google-maps";
// import VueFormWizard from "vue-form-wizard";
// import VueSkycons from "vue-skycon";
// import Vuesax from 'vuesax';
// import VModal from 'vue-js-modal';
// import VueFusionCharts from "vue-fusioncharts";
// import { IconsPlugin } from "bootstrap-vue";
// import { Tabs, Tab } from "vue-tabs-component";

// Initialize authentication before mounting
import { useMainStore } from './store';

// Initialize auth from localStorage (non-blocking)
const store = useMainStore();
// Initialize auth in background, don't block app mounting
store.initializeAuth().catch(err => {
  console.warn('Auth initialization failed:', err);
});

// Global error handler for Vue
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', instance);
  console.error('Info:', info);
};

// Mount app immediately (auth will be checked by route guards)
app.mount("#app");
