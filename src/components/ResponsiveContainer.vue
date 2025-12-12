<template>
  <div 
    class="responsive-container" 
    :class="containerClass"
    :style="containerStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useResponsive } from '@/composables/useResponsive';

export default {
  name: 'ResponsiveContainer',
  props: {
    fluid: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: null
    },
    padding: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const { isMobile, isTablet, isDesktop, getContainerMaxWidth } = useResponsive();

    const containerClass = computed(() => {
      return {
        'container-fluid': props.fluid,
        'container-responsive': !props.fluid,
        'is-mobile': isMobile.value,
        'is-tablet': isTablet.value,
        'is-desktop': isDesktop.value
      };
    });

    const containerStyle = computed(() => {
      const style = {};
      
      if (!props.fluid && !props.maxWidth) {
        style.maxWidth = getContainerMaxWidth();
      } else if (props.maxWidth) {
        style.maxWidth = props.maxWidth;
      }

      if (props.padding) {
        style.padding = props.padding;
      }

      return style;
    });

    return {
      containerClass,
      containerStyle
    };
  }
};
</script>

<style scoped>
.responsive-container {
  width: 100%;
  margin: 0 auto;
  transition: max-width 0.3s ease;
}

.container-responsive {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 576px) {
  .container-responsive {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 992px) {
  .container-responsive {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.container-fluid {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>






