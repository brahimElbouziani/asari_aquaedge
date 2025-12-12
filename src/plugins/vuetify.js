// Vue 3 Migration - Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  },
  // Supprimer les avertissements de dépréciation
  defaults: {
    VApp: {
      // Utiliser v-app au lieu de composants dépréciés
    },
    VMain: {
      // Utiliser v-main au lieu de composants dépréciés
    }
  }
});
