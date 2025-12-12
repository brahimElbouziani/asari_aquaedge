<template>
  <!-- Marker is rendered by Google Maps API -->
</template>

<script>
import { ref, onMounted, onUnmounted, watch, inject, nextTick } from 'vue';

export default {
  name: 'GmapMarker',
  props: {
    position: {
      type: Object,
      required: true,
      default: () => ({ lat: 0, lng: 0 })
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: [Object, String],
      default: null
    },
    label: {
      type: [Object, String],
      default: null
    },
    clickable: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { expose, emit }) {
    const marker = ref(null);
    const googleMapRef = inject('googleMap', null);
    const googleMapPromiseRef = inject('googleMapPromise', null);

    const createMarker = async () => {
      // Wait for Google Maps API to be loaded
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      while (typeof google === 'undefined' || !google.maps || !google.maps.Marker) {
        if (attempts >= maxAttempts) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      // Get map from inject (refs)
      let map = googleMapRef?.value;
      
      // If map ref exists but is null, wait for it
      if (googleMapRef && !map) {
        // Wait for map to be initialized
        for (let i = 0; i < 50; i++) {
          map = googleMapRef.value;
          if (map) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Try to get from promise
      if (!map && googleMapPromiseRef?.value) {
        try {
          map = await googleMapPromiseRef.value;
        } catch (e) {
          // Silent fail
        }
      }
      
      // Fallback: try to get from DOM
      if (!map) {
        map = await getMapFromParent();
      }
      
      if (!map) {
        return;
      }

      // Validate position
      if (!props.position || typeof props.position.lat !== 'number' || typeof props.position.lng !== 'number') {
        return;
      }

      // Don't create marker if position is 0,0 (likely invalid)
      if (props.position.lat === 0 && props.position.lng === 0) {
        return;
      }

      const markerOptions = {
        position: new google.maps.LatLng(props.position.lat, props.position.lng),
        map: map,
        title: props.title || '',
        clickable: props.clickable,
        draggable: props.draggable
      };

      // Handle icon
      if (props.icon) {
        if (typeof props.icon === 'string') {
          markerOptions.icon = props.icon;
        } else if (props.icon.url) {
          // Handle require() URLs - they might need special processing
          let iconUrl = props.icon.url;
          
          // If it's a module path, try to resolve it
          if (typeof iconUrl === 'string' && iconUrl.startsWith('../')) {
            // This is a relative path, should work with require
            iconUrl = props.icon.url;
          }
          
          // Create icon object
          const iconConfig = {
            url: iconUrl
          };
          
          if (props.icon.scaledSize) {
            iconConfig.scaledSize = new google.maps.Size(
              props.icon.scaledSize.width, 
              props.icon.scaledSize.height
            );
          }
          
          if (props.icon.size) {
            iconConfig.size = new google.maps.Size(
              props.icon.size.width, 
              props.icon.size.height
            );
          }
          
          markerOptions.icon = iconConfig;
        }
      }

      // Handle label
      if (props.label) {
        if (typeof props.label === 'string') {
          markerOptions.label = props.label;
        } else {
          markerOptions.label = props.label;
        }
      }

      try {
        marker.value = new google.maps.Marker(markerOptions);

        // Handle click event
        marker.value.addListener('click', () => {
          emit('click', {
            latLng: {
              lat: () => props.position.lat,
              lng: () => props.position.lng
            }
          });
        });
      } catch (error) {
        console.error('Error creating marker:', error);
      }
    };

    const getMapFromParent = async () => {
      // Wait for map to be ready, try multiple times
      for (let i = 0; i < 50; i++) {
        if (typeof google !== 'undefined' && google.maps) {
          // Try to find map in DOM
          const mapElements = document.querySelectorAll('[data-map-instance]');
          if (mapElements.length > 0 && mapElements[0]._mapInstance) {
            return mapElements[0]._mapInstance;
          }
          
          // Also check if map ref has value
          if (googleMapRef?.value) {
            return googleMapRef.value;
          }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return null;
    };

    onMounted(() => {
      // Try to create marker immediately
      createMarker().catch(() => {
        // Silent fail
      });
      
      // Also set up a retry mechanism in case map isn't ready yet
      let retryCount = 0;
      const maxRetries = 20;
      const retryInterval = setInterval(() => {
        if (marker.value) {
          // Marker created successfully, stop retrying
          clearInterval(retryInterval);
          return;
        }
        
        if (retryCount >= maxRetries) {
          clearInterval(retryInterval);
          return;
        }
        
        retryCount++;
        createMarker().catch(() => {
          // Silent fail
        });
      }, 500);
      
      // Clean up interval after 10 seconds
      setTimeout(() => {
        clearInterval(retryInterval);
      }, 10000);
    });

    // Watch for map ref changes
    watch(() => googleMapRef?.value, (newMap) => {
      if (newMap && !marker.value && props.position && props.position.lat && props.position.lng) {
        createMarker().catch(() => {
          // Silent fail
        });
      }
    }, { immediate: true });

    watch(() => props.position, (newPosition) => {
      if (marker.value && newPosition && newPosition.lat && newPosition.lng) {
        marker.value.setPosition(new google.maps.LatLng(newPosition.lat, newPosition.lng));
      } else if (!marker.value && newPosition && newPosition.lat && newPosition.lng) {
        // If marker doesn't exist yet but position is valid, try to create it
        createMarker().catch(() => {
          // Silent fail
        });
      }
    }, { deep: true, immediate: true });

    onUnmounted(() => {
      if (marker.value) {
        marker.value.setMap(null);
        marker.value = null;
      }
    });

    expose({
      marker: marker.value
    });

    return {};
  }
};
</script>

