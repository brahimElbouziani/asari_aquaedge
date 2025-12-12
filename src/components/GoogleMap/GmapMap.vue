<template>
  <div ref="mapContainer" :style="mapStyle"></div>
</template>

<script>
import { ref, computed, provide, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Loader } from 'google-maps';
import { API_KEY } from '@/pages/API_KEY';

export default {
  name: 'GmapMap',
  props: {
    center: {
      type: Object,
      required: true,
      default: () => ({ lat: 0, lng: 0 })
    },
    zoom: {
      type: Number,
      default: 5
    },
    mapTypeId: {
      type: String,
      default: 'roadmap'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    style: {
      type: [Object, String],
      default: () => ({ width: '100%', height: '400px' })
    }
  },
  emits: ['click', 'ready'],
  setup(props, { expose, emit }) {
    const mapContainer = ref(null);
    const map = ref(null);
    const mapPromise = ref(null);
    const markers = ref([]);
    const polygons = ref([]);
    const polylines = ref([]);
    const infoWindows = ref([]);
    
    const mapStyle = computed(() => {
      if (typeof props.style === 'string') {
        return props.style;
      }
      // Convert style object to Vue style format
      const defaultStyle = { width: '100%', height: '400px' };
      return Object.assign({}, defaultStyle, props.style);
    });

    // Provide map refs immediately (they will be updated when map is ready)
    // This allows provide() to be called in setup() as required by Vue 3
    provide('googleMap', map);
    provide('googleMapPromise', mapPromise);
    
    // Loader instance - create only once
    let loader = null;
    let isLoaderInitialized = false;
    
    const getLoader = () => {
      if (!loader && !isLoaderInitialized) {
        loader = new Loader(API_KEY);
        isLoaderInitialized = true;
      }
      return loader;
    };
    
    // Store map instance for child components
    const storeMapInstance = () => {
      if (mapContainer.value && map.value) {
        mapContainer.value._mapInstance = map.value;
        mapContainer.value.setAttribute('data-map-instance', 'true');
      }
    };
    
    // Initialize map
    const initMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (typeof google !== 'undefined' && google.maps && google.maps.Map) {
          // Google Maps already loaded, proceed
          createMapInstance();
        } else {
          // Load Google Maps API
          const loaderInstance = getLoader();
          if (loaderInstance) {
            await loaderInstance.load();
            createMapInstance();
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    const createMapInstance = () => {
      if (!mapContainer.value) {
        console.error('Map container not found');
        return;
      }

      if (!google || !google.maps || !google.maps.Map) {
        console.error('Google Maps API not loaded');
        return;
      }

      try {
        const mapOptions = {
          center: new google.maps.LatLng(props.center.lat, props.center.lng),
          zoom: props.zoom,
          mapTypeId: props.mapTypeId === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
          ...props.options
        };

        map.value = new google.maps.Map(mapContainer.value, mapOptions);
        
        // Update mapPromise
        mapPromise.value = Promise.resolve(map.value);
        
        // Store map instance for child components
        storeMapInstance();
        
        // Handle map click
        map.value.addListener('click', (event) => {
          emit('click', {
            latLng: {
              lat: () => event.latLng.lat(),
              lng: () => event.latLng.lng()
            }
          });
        });
        
        emit('ready', map.value);
      } catch (error) {
        console.error('Error creating map instance:', error);
      }
    };

    // Watch for center changes
    watch(() => props.center, (newCenter) => {
      if (map.value && newCenter) {
        map.value.setCenter(new google.maps.LatLng(newCenter.lat, newCenter.lng));
      }
    }, { deep: true });

    // Watch for zoom changes
    watch(() => props.zoom, (newZoom) => {
      if (map.value) {
        map.value.setZoom(newZoom);
      }
    });

    onMounted(() => {
      nextTick(() => {
        initMap();
      });
    });

    onUnmounted(() => {
      // Clean up markers, polygons, etc.
      markers.value.forEach(marker => marker.setMap(null));
      polygons.value.forEach(polygon => polygon.setMap(null));
      polylines.value.forEach(polyline => polyline.setMap(null));
      infoWindows.value.forEach(infoWindow => infoWindow.close());
    });

    // Expose methods and properties for parent components
    expose({
      get $mapObject() { return map.value; },
      get $mapPromise() { return mapPromise.value || Promise.resolve(map.value); },
      get map() { return map.value; },
      fitBounds: (bounds) => {
        if (map.value && bounds) {
          map.value.fitBounds(bounds);
        }
      },
      panTo: (position) => {
        if (map.value && position) {
          map.value.panTo(new google.maps.LatLng(position.lat, position.lng));
        }
      },
      setZoom: (zoom) => {
        if (map.value) {
          map.value.setZoom(zoom);
        }
      },
      getZoom: () => {
        return map.value ? map.value.getZoom() : null;
      }
    });

    return {
      mapContainer,
      mapStyle
    };
  }
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>

