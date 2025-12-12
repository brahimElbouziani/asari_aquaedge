/**
 * Vue 3 Compatible Click Outside Directive
 * Replaces vue-clickaway which is Vue 2 only
 * 
 * Usage: v-click-outside="methodName"
 * The method will be called when clicking outside the element
 */
const clickOutsideDirective = {
  beforeMount(el, binding) {
    // Store binding for access in handler
    el._clickOutside = binding;
    
    // Create handler function
    el.clickOutsideHandler = function(event) {
      // Check that click was outside the el and its children
      if (!(el === event.target || el.contains(event.target))) {
        const handler = el._clickOutside.value;
        
        // Try to call the handler
        if (handler && typeof handler === 'function') {
          handler(event);
        } else if (el._clickOutside.instance && el._clickOutside.expression) {
          // Fallback: get method from instance using expression
          const method = el._clickOutside.instance[el._clickOutside.expression];
          if (typeof method === 'function') {
            method(event);
          }
        }
      }
    };
    
    // Add event listener on next tick to avoid immediate trigger
    setTimeout(() => {
      document.addEventListener("click", el.clickOutsideHandler, true);
    }, 0);
  },
  updated(el, binding) {
    // Update stored binding
    el._clickOutside = binding;
  },
  unmounted(el) {
    if (el.clickOutsideHandler) {
      document.removeEventListener("click", el.clickOutsideHandler, true);
    }
    delete el._clickOutside;
    delete el.clickOutsideHandler;
  }
};

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */
const GlobalDirectives = {
  install(app) {
    // Vue 3 compatible
    app.directive("click-outside", clickOutsideDirective);
  }
};

export default GlobalDirectives;
