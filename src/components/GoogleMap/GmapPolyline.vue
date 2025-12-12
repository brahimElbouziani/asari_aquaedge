<template>
  <!-- Polyline is rendered by Google Maps API -->
</template>

<script>
import { ref, onMounted, onUnmounted, watch, inject } from 'vue';

export default {
  name: 'GmapPolyline',
  props: {
    path: {
      type: Array,
      required: true,
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['click'],
  setup(props, { expose, emit }) {
    const polyline = ref(null);

    const googleMapRef = inject('googleMap', null);
    const googleMapPromiseRef = inject('googleMapPromise', null);

    const getMapFromParent = async () => {
      // Get map from inject (refs)
      let map = googleMapRef?.value;
      
      if (!map && googleMapPromiseRef?.value) {
        map = await googleMapPromiseRef.value;
      }
      
      // Wait for map if not ready yet
      if (!map && googleMapPromiseRef?.value) {
        try {
          map = await googleMapPromiseRef.value;
        } catch (e) {
          console.warn('Failed to get map from promise:', e);
        }
      }
      
      // Fallback: try to get from DOM
      if (!map) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (typeof google !== 'undefined' && google.maps) {
          const mapElements = document.querySelectorAll('[data-map-instance]');
          if (mapElements.length > 0 && mapElements[0]._mapInstance) {
            return mapElements[0]._mapInstance;
          }
        }
      }

      return map;
    };

    const createPolyline = async () => {
      const map = await getMapFromParent();
      
      if (!map || !props.path || props.path.length === 0) {
        return;
      }

      const pathArray = props.path.map(point => {
        if (Array.isArray(point)) {
          return new google.maps.LatLng(point[0], point[1]);
        }
        return new google.maps.LatLng(point.lat, point.lng);
      });

      const polylineOptions = {
        path: pathArray,
        map: map,
        ...props.options
      };

      polyline.value = new google.maps.Polyline(polylineOptions);

      if (props.options.clickable !== false) {
        polyline.value.addListener('click', (event) => {
          emit('click', event);
        });
      }
    };

    onMounted(() => {
      if (typeof google !== 'undefined' && google.maps) {
        createPolyline();
      } else {
        const checkInterval = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps) {
            clearInterval(checkInterval);
            createPolyline();
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    });

    watch(() => props.path, () => {
      if (polyline.value && props.path && props.path.length > 0) {
        const pathArray = props.path.map(point => {
          if (Array.isArray(point)) {
            return new google.maps.LatLng(point[0], point[1]);
          }
          return new google.maps.LatLng(point.lat, point.lng);
        });
        polyline.value.setPath(pathArray);
      }
    }, { deep: true });

    onUnmounted(() => {
      if (polyline.value) {
        polyline.value.setMap(null);
        polyline.value = null;
      }
    });

    expose({
      polyline: polyline.value
    });

    return {};
  }
};
</script>

