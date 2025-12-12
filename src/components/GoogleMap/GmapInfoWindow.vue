<template>
  <!-- InfoWindow is rendered by Google Maps API -->
</template>

<script>
import { ref, onMounted, onUnmounted, watch, inject } from 'vue';

export default {
  name: 'GmapInfoWindow',
  props: {
    position: {
      type: Object,
      default: null
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeclick'],
  setup(props, { expose, slots, emit }) {
    const infoWindow = ref(null);
    const contentDiv = ref(null);

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

    const createInfoWindow = async () => {
      if (!props.position) return;

      const map = await getMapFromParent();
      if (!map) return;

      // Create content div for InfoWindow
      contentDiv.value = document.createElement('div');
      
      const infoWindowOptions = {
        content: contentDiv.value
      };

      infoWindow.value = new google.maps.InfoWindow(infoWindowOptions);

      infoWindow.value.addListener('closeclick', () => {
        emit('closeclick');
      });

      if (props.opened) {
        infoWindow.value.open(map, null);
        if (props.position) {
          infoWindow.value.setPosition(new google.maps.LatLng(props.position.lat, props.position.lng));
        }
      }
    };

    const updateContent = () => {
      if (!contentDiv.value || !slots.default) return;
      
      // Clear previous content
      contentDiv.value.innerHTML = '';
      
      // Render slot content
      const slotContent = slots.default();
      if (slotContent && slotContent[0]) {
        // Simple text rendering for now
        if (typeof slotContent[0].children === 'string') {
          contentDiv.value.innerHTML = slotContent[0].children;
        } else if (slotContent[0].el) {
          contentDiv.value.appendChild(slotContent[0].el);
        }
      }
    };

    onMounted(() => {
      if (typeof google !== 'undefined' && google.maps) {
        createInfoWindow().then(() => {
          updateContent();
        });
      } else {
        const checkInterval = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps) {
            clearInterval(checkInterval);
            createInfoWindow().then(() => {
              updateContent();
            });
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    });

    watch(() => props.opened, (newOpened) => {
      if (infoWindow.value && props.position) {
        const map = getMapFromParent();
        map.then(m => {
          if (!m) return;
          
          if (newOpened) {
            infoWindow.value.setPosition(new google.maps.LatLng(props.position.lat, props.position.lng));
            infoWindow.value.open(m);
            updateContent();
          } else {
            infoWindow.value.close();
          }
        });
      }
    });

    watch(() => props.position, (newPosition) => {
      if (infoWindow.value && newPosition && props.opened) {
        infoWindow.value.setPosition(new google.maps.LatLng(newPosition.lat, newPosition.lng));
      }
    }, { deep: true });

    onUnmounted(() => {
      if (infoWindow.value) {
        infoWindow.value.close();
        infoWindow.value = null;
      }
      if (contentDiv.value) {
        contentDiv.value = null;
      }
    });

    expose({
      infoWindow: infoWindow.value
    });

    return {};
  }
};
</script>

