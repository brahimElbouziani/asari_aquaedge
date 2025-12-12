<template>
  <!-- Polygon is rendered by Google Maps API -->
</template>

<script>
import { ref, onMounted, onUnmounted, watch, inject } from 'vue';

export default {
  name: 'GmapPolygon',
  props: {
    paths: {
      type: Array,
      required: true,
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['click', 'paths_changed', 'mouseover', 'mouseout'],
  setup(props, { expose, emit }) {
    const polygon = ref(null);

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

    const createPolygon = async () => {
      const map = await getMapFromParent();
      
      if (!map || !props.paths || props.paths.length === 0) {
        return;
      }

      // Convert paths to LatLng array
      const pathArray = props.paths.map(path => {
        if (Array.isArray(path)) {
          return new google.maps.LatLng(path[0], path[1]);
        }
        return new google.maps.LatLng(path.lat, path.lng);
      });

      const polygonOptions = {
        paths: pathArray,
        map: map,
        ...props.options
      };

      polygon.value = new google.maps.Polygon(polygonOptions);

      // Handle events
      if (props.options.clickable !== false) {
        polygon.value.addListener('click', (event) => {
          emit('click', event);
        });
      }

      polygon.value.addListener('mouseover', (event) => {
        emit('mouseover', event);
      });

      polygon.value.addListener('mouseout', (event) => {
        emit('mouseout', event);
      });
    };

    onMounted(() => {
      if (typeof google !== 'undefined' && google.maps) {
        createPolygon();
      } else {
        const checkInterval = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps) {
            clearInterval(checkInterval);
            createPolygon();
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    });

    watch(() => props.paths, () => {
      if (polygon.value && props.paths && props.paths.length > 0) {
        const pathArray = props.paths.map(path => {
          if (Array.isArray(path)) {
            return new google.maps.LatLng(path[0], path[1]);
          }
          return new google.maps.LatLng(path.lat, path.lng);
        });
        polygon.value.setPaths(pathArray);
        emit('paths_changed', polygon.value.getPath());
      }
    }, { deep: true });

    watch(() => props.options, (newOptions) => {
      if (polygon.value) {
        Object.assign(polygon.value, newOptions);
      }
    }, { deep: true });

    onUnmounted(() => {
      if (polygon.value) {
        polygon.value.setMap(null);
        polygon.value = null;
      }
    });

    expose({
      polygon: polygon.value
    });

    return {};
  }
};
</script>

