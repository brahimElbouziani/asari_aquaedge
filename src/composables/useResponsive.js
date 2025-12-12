/**
 * Composable for responsive design
 * Provides reactive screen size detection and breakpoint utilities
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useResponsive() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

  const updateSize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  // Breakpoints (matching CSS breakpoints)
  const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  };

  // Computed breakpoint checks
  const isXs = ref(false);
  const isSm = ref(false);
  const isMd = ref(false);
  const isLg = ref(false);
  const isXl = ref(false);
  const isXxl = ref(false);

  // Mobile/Desktop helpers
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);

  const updateBreakpoints = () => {
    const width = windowWidth.value;
    
    isXs.value = width < breakpoints.sm;
    isSm.value = width >= breakpoints.sm && width < breakpoints.md;
    isMd.value = width >= breakpoints.md && width < breakpoints.lg;
    isLg.value = width >= breakpoints.lg && width < breakpoints.xl;
    isXl.value = width >= breakpoints.xl && width < breakpoints.xxl;
    isXxl.value = width >= breakpoints.xxl;

    // Device type helpers
    isMobile.value = width < breakpoints.md;
    isTablet.value = width >= breakpoints.md && width < breakpoints.lg;
    isDesktop.value = width >= breakpoints.lg;
  };

  // Watch windowWidth and update breakpoints
  const checkBreakpoint = (breakpoint) => {
    updateBreakpoints();
    switch(breakpoint) {
      case 'xs': return isXs.value;
      case 'sm': return isSm.value;
      case 'md': return isMd.value;
      case 'lg': return isLg.value;
      case 'xl': return isXl.value;
      case 'xxl': return isXxl.value;
      default: return false;
    }
  };

  // Get current breakpoint name
  const getCurrentBreakpoint = () => {
    updateBreakpoints();
    if (isXxl.value) return 'xxl';
    if (isXl.value) return 'xl';
    if (isLg.value) return 'lg';
    if (isMd.value) return 'md';
    if (isSm.value) return 'sm';
    return 'xs';
  };

  // Grid columns helper
  const getGridColumns = (defaultCols = 4) => {
    updateBreakpoints();
    if (isMobile.value) return 1;
    if (isTablet.value) return 2;
    return defaultCols;
  };

  // Container max width helper
  const getContainerMaxWidth = () => {
    updateBreakpoints();
    if (isXxl.value) return '1320px';
    if (isXl.value) return '1140px';
    if (isLg.value) return '960px';
    if (isMd.value) return '720px';
    if (isSm.value) return '540px';
    return '100%';
  };

  // Initial update
  updateBreakpoints();

  return {
    windowWidth,
    windowHeight,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
    checkBreakpoint,
    getCurrentBreakpoint,
    getGridColumns,
    getContainerMaxWidth,
    updateBreakpoints
  };
}






