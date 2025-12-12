// Wrapper pour compatibilité vuelidate avec Vue 3 Options API
import { useVuelidate } from '@vuelidate/core';

export function useVuelidateCompat(validations, state) {
  // Pour Options API, on retourne un computed qui utilise useVuelidate
  return {
    get $v() {
      return useVuelidate(validations, state);
    }
  };
}


