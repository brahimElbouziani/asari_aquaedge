// Vue 3 Migration - GlobalDirectives
// Note: vue-clickaway n'est pas compatible Vue 3, il faudra utiliser @vueuse/core ou créer une directive custom

const GlobalDirectives = {
  install(app) {
    // Directive click-outside custom pour Vue 3
    app.directive("click-outside", {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener("click", el.clickOutsideEvent);
      }
    });
  }
};

export default GlobalDirectives;


