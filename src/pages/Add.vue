<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Ajouter un capteur</h1>
      <Button 
        icon="pi pi-magic" 
        @click="fillDemoData" 
        class="demo-button"
        v-tooltip="'Remplir tous les champs avec des exemples pour tester'"
      />
    </div>
    <Card>
      <template #content>
        <div class="form-container">
          <!-- Stepper Navigation -->
          <div class="stepper-navigation">
            <div 
              class="step-item" 
              :class="{ active: currentStep === 1, completed: currentStep > 1 }"
              @click="currentStep = 1"
            >
              <i class="pi pi-info-circle"></i>
              <span>Informations de base</span>
            </div>
            <div class="step-divider"></div>
            <div 
              class="step-item" 
              :class="{ active: currentStep === 2, completed: currentStep > 2 }"
              @click="currentStep >= 2 && (currentStep = 2)"
            >
              <i class="pi pi-leaf"></i>
              <span>Informations agronomiques</span>
            </div>
            <div class="step-divider"></div>
            <div 
              class="step-item" 
              :class="{ active: currentStep === 3, completed: currentStep > 3 }"
              @click="currentStep >= 3 && (currentStep = 3)"
            >
              <i class="pi pi-tint"></i>
              <span>Informations d'irrigation</span>
            </div>
          </div>

          <!-- Step 1: Basic Information -->
          <div v-show="currentStep === 1" class="form-step">
            <h3>Informations de base</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Identifiant du capteur <span class="required">*</span></label>
                <InputText v-model="formData.nodeId" placeholder="Exemple: A-N4-E02-C02" />
                <small v-if="errors.nodeId" class="error-text">{{ errors.nodeId }}</small>
              </div>
              <div class="form-field">
                <label>Nom de client <span class="required">*</span></label>
                <InputText v-model="formData.fname" placeholder="Nom du client" />
                <small v-if="errors.fname" class="error-text">{{ errors.fname }}</small>
              </div>
              <div class="form-field coordinates-section">
                <label>Coordonnées <span class="required">*</span></label>
                <div class="coordinates-search">
                  <div class="coordinates-header">
                    <div class="coordinates-input">
                      <InputNumber 
                        v-model="formData.lat" 
                        placeholder="Latitude"
                        :minFractionDigits="0"
                        :maxFractionDigits="6"
                        :useGrouping="false"
                        @update:modelValue="updateMapCenter"
                      />
                      <InputNumber 
                        v-model="formData.long" 
                        placeholder="Longitude"
                        :minFractionDigits="0"
                        :maxFractionDigits="6"
                        :useGrouping="false"
                        @update:modelValue="updateMapCenter"
                      />
                    </div>
                    <Button 
                      :icon="showMap ? 'pi pi-eye-slash' : 'pi pi-map'" 
                      @click="toggleMap" 
                      class="p-button-rounded p-button-text p-button-sm"
                      :class="showMap ? 'p-button-danger' : 'p-button-info'"
                      v-tooltip="showMap ? 'Masquer la carte' : 'Afficher la carte'"
                    />
                  </div>
                  <div v-if="showMap" class="map-section">
                    <div class="search-box">
                      <InputText 
                        v-model="searchQuery" 
                        placeholder="Rechercher une ville ou une adresse..." 
                        class="search-input"
                        @keyup.enter="searchLocation"
                      />
                      <Button 
                        icon="pi pi-search" 
                        @click="searchLocation" 
                        class="p-button-rounded p-button-text"
                        v-tooltip="'Rechercher'"
                      />
                      <Button 
                        icon="pi pi-map-marker" 
                        @click="centerOnMorocco" 
                        class="p-button-rounded p-button-text p-button-success"
                        v-tooltip="'Centrer sur le Maroc'"
                        label="Maroc"
                      />
                      <a 
                        href="https://www.google.com/maps?region=MA" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="map-link-button"
                        v-tooltip="'Ouvrir Google Maps - Maroc'"
                      >
                        <Button 
                          icon="pi pi-external-link" 
                          class="p-button-rounded p-button-text p-button-info"
                          label="Google Maps"
                        />
                      </a>
                    </div>
                    <div class="map-container">
                      <GmapMap
                        :center="mapCenter"
                        :zoom="mapZoom"
                        mapTypeId="satellite"
                        :options="{ 
                          region: 'MA',
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: false
                        }"
                        :style="{ width: '100%', height: '300px', borderRadius: '8px' }"
                        @click="onMapClick"
                      >
                        <GmapMarker
                          v-if="showMap && formData.lat && formData.long"
                          :position="markerPosition"
                          :draggable="true"
                          :title="'Position: ' + (formData.lat || mapCenter.lat) + ', ' + (formData.long || mapCenter.lng)"
                          @dragend="onMarkerDrag"
                        />
                      </GmapMap>
                    </div>
                  </div>
                </div>
                <small v-if="errors.lat || errors.long" class="error-text">
                  {{ errors.lat || errors.long }}
                </small>
              </div>
              <div class="form-field">
                <label>Superficie totale (m²) <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.st" 
                  placeholder="Superficie"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                />
                <small v-if="errors.st" class="error-text">{{ errors.st }}</small>
              </div>
              <div class="form-field">
                <label>Système d'irrigation <span class="required">*</span></label>
                <InputText 
                  v-model="formData.is" 
                  placeholder="Exemple: Irrigation goutte à goutte, Aspersion, etc."
                />
                <small v-if="errors.is" class="error-text">{{ errors.is }}</small>
              </div>

            </div>
            <div class="form-actions">
              <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="validateStep1" />
            </div>
          </div>

          <!-- Step 2: Agronomic Information -->
          <div v-show="currentStep === 2" class="form-step">
            <h3>Informations agronomiques</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Culture <span class="required">*</span></label>
                <InputText v-model="formData.cult" placeholder="Exemple: Tomate, Blé, Olives, etc." />
                <small v-if="errors.cult" class="error-text">{{ errors.cult }}</small>
              </div>
              <div class="form-field">
                <label>Densité (H × L) <span class="required">*</span></label>
                <div class="density-input">
                  <InputNumber 
                    v-model="formData.cd1" 
                    placeholder="Hauteur"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                  />
                  <span>×</span>
                  <InputNumber 
                    v-model="formData.cd2" 
                    placeholder="Largeur"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                  />
                </div>
                <small v-if="errors.cd1 || errors.cd2" class="error-text">
                  {{ errors.cd1 || errors.cd2 }}
                </small>
              </div>
              <div class="form-field">
                <label>Profondeur des racines (cm) <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.rootd" 
                  placeholder="Profondeur"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                />
                <small v-if="errors.rootd" class="error-text">{{ errors.rootd }}</small>
              </div>
              <div class="form-field">
                <label>Texture du sol</label>
                <InputText v-model="formData.Soil" placeholder="Exemple: Argileux, Sableux, Limoneux" />
              </div>
              <div class="form-field soil-composition">
                <label>Composition du sol <span class="required">*</span></label>
                <div class="soil-composition-simple">
                  <div class="soil-item-simple">
                    <span class="soil-dot clay-dot"></span>
                    <span class="soil-label-text">Argile</span>
                    <InputNumber 
                      v-model="formData.clay" 
                      :min="0" 
                      :max="100" 
                      suffix="%" 
                      class="soil-input"
                      :minFractionDigits="0"
                      :maxFractionDigits="2"
                      :useGrouping="false"
                    />
                  </div>
                  <div class="soil-item-simple">
                    <span class="soil-dot limon-dot"></span>
                    <span class="soil-label-text">Limon</span>
                    <InputNumber 
                      v-model="formData.Limon" 
                      :min="0" 
                      :max="100" 
                      suffix="%" 
                      class="soil-input"
                      :minFractionDigits="0"
                      :maxFractionDigits="2"
                      :useGrouping="false"
                    />
                  </div>
                  <div class="soil-item-simple">
                    <span class="soil-dot sand-dot"></span>
                    <span class="soil-label-text">Sable</span>
                    <InputNumber 
                      v-model="formData.sand" 
                      :min="0" 
                      :max="100" 
                      suffix="%" 
                      class="soil-input"
                      :minFractionDigits="0"
                      :maxFractionDigits="2"
                      :useGrouping="false"
                    />
                  </div>
                </div>
                <small v-if="errors.clay || errors.Limon || errors.sand" class="error-text">
                  {{ errors.clay || errors.Limon || errors.sand }}
                </small>
              </div>
              <div class="form-field">
                <label>Matière organique (%)</label>
                <InputNumber 
                  v-model="formData.oms" 
                  placeholder="Matière organique"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                />
              </div>
              <div class="form-field">
                <label>Salinité du sol</label>
                <InputText v-model="formData.Ss" placeholder="Niveau de salinité" />
              </div>
            </div>
            <div class="form-actions">
              <Button label="Précédent" icon="pi pi-arrow-left" class="p-button-text" @click="currentStep = 1" />
              <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="validateStep2" />
            </div>
          </div>

          <!-- Step 3: Irrigation Information -->
          <div v-show="currentStep === 3" class="form-step">
            <h3>Informations d'irrigation</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Espacement des goutteurs (cm) <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.sod" 
                  placeholder="Espacement"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                />
                <small v-if="errors.sod" class="error-text">{{ errors.sod }}</small>
              </div>
              <div class="form-field">
                <label>Nombre de rampes <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.nor" 
                  placeholder="Nombre de rampes"
                  :minFractionDigits="0"
                  :maxFractionDigits="0"
                />
                <small v-if="errors.nor" class="error-text">{{ errors.nor }}</small>
              </div>
              <div class="form-field">
                <label>Débit des goutteurs (L/h) <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.frod" 
                  placeholder="Débit"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                />
                <small v-if="errors.frod" class="error-text">{{ errors.frod }}</small>
              </div>
              <div class="form-field">
                <label>Coefficient uniformité <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.cou" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                  placeholder="0.00 - 1.00"
                />
                <small v-if="errors.cou" class="error-text">{{ errors.cou }}</small>
              </div>
              <div class="form-field">
                <label>Efficacité d'irrigation <span class="required">*</span></label>
                <InputNumber 
                  v-model="formData.ire" 
                  :min="0" 
                  :max="1" 
                  :step="0.01"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                  placeholder="0.00 - 1.00"
                />
                <small v-if="errors.ire" class="error-text">{{ errors.ire }}</small>
              </div>
            </div>
            <div class="form-actions">
              <Button label="Précédent" icon="pi pi-arrow-left" class="p-button-text" @click="currentStep = 2" />
              <Button 
                label="Ajouter le capteur" 
                icon="pi pi-check" 
                @click="addNode" 
                :loading="loading"
                class="p-button-success"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Tooltip from 'primevue/tooltip';
import { nodeService } from "@/services/api/index";
import router from "@/routes";
import GmapMap from '@/components/GoogleMap/GmapMap.vue';
import GmapMarker from '@/components/GoogleMap/GmapMarker.vue';
import { Loader } from 'google-maps';
import { API_KEY } from '@/pages/API_KEY';

export default {
  name: 'Add',
  components: {
    Card,
    InputText,
    InputNumber,
    Dropdown,
    Button,
    GmapMap,
    GmapMarker
  },
  directives: {
    tooltip: Tooltip
  },
  setup() {
    let toast;
    try {
      toast = useToast();
    } catch (e) {
      console.warn('Toast service not available:', e);
      toast = {
        add: (options) => {
          console.log('Toast:', options);
        }
      };
    }
    const currentStep = ref(1);
    const loading = ref(false);
    const errorMessage = ref('');
    const showMap = ref(false);
    const mapCenter = ref({ lat: 33.5731, lng: -6.8498 }); // Default to Morocco (Rabat area to avoid border line)
    const mapZoom = ref(6);
    const searchQuery = ref('');
    const geocoder = ref(null);
    
    // Initialize Google Maps Geocoder
    const loader = new Loader(API_KEY);
    loader.load().then((google) => {
      geocoder.value = new google.maps.Geocoder();
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });
    
    const formData = ref({
      nodeId: '',
      fname: '',
      lat: null,
      long: null,
      st: null,
      is: '',
      nmbr: '2',
      prof: '',
      port1: '',
      port2: '',
      port3: '',
      port4: '',
      port5: '',
      port6: '',
      cult: '',
      cd1: null,
      cd2: null,
      rootd: null,
      Soil: '',
      clay: null,
      Limon: null,
      sand: null,
      oms: null,
      Ss: '',
      sod: null,
      nor: null,
      frod: null,
      cou: null,
      ire: null
    });

    const errors = ref({});

    const validateStep1 = () => {
      errors.value = {};
      let isValid = true;

      if (!formData.value.nodeId || formData.value.nodeId.trim() === '') {
        errors.value.nodeId = 'L\'identifiant du capteur est requis';
        isValid = false;
      }
      if (!formData.value.fname || formData.value.fname.trim() === '') {
        errors.value.fname = 'Le nom du client est requis';
        isValid = false;
      }
      if (!formData.value.lat || formData.value.lat === null) {
        errors.value.lat = 'La latitude est requise';
        isValid = false;
      }
      if (!formData.value.long || formData.value.long === null) {
        errors.value.long = 'La longitude est requise';
        isValid = false;
      }
      if (!formData.value.st || formData.value.st === null) {
        errors.value.st = 'La superficie totale est requise';
        isValid = false;
      }
      if (!formData.value.is || formData.value.is.trim() === '') {
        errors.value.is = 'Le système d\'irrigation est requis';
        isValid = false;
      }

      if (isValid) {
        currentStep.value = 2;
      }
    };

    const validateStep2 = () => {
      errors.value = {};
      let isValid = true;

      if (!formData.value.cult || formData.value.cult.trim() === '') {
        errors.value.cult = 'La culture est requise';
        isValid = false;
      }
      if (!formData.value.cd1 || formData.value.cd1 === null) {
        errors.value.cd1 = 'La densité (hauteur) est requise';
        isValid = false;
      }
      if (!formData.value.cd2 || formData.value.cd2 === null) {
        errors.value.cd2 = 'La densité (largeur) est requise';
        isValid = false;
      }
      if (!formData.value.rootd || formData.value.rootd === null) {
        errors.value.rootd = 'La profondeur des racines est requise';
        isValid = false;
      }
      if (!formData.value.clay || formData.value.clay === null) {
        errors.value.clay = 'Le pourcentage d\'argile est requis';
        isValid = false;
      }
      if (!formData.value.Limon || formData.value.Limon === null) {
        errors.value.Limon = 'Le pourcentage de limon est requis';
        isValid = false;
      }
      if (!formData.value.sand || formData.value.sand === null) {
        errors.value.sand = 'Le pourcentage de sable est requis';
        isValid = false;
      }

      if (isValid) {
        currentStep.value = 3;
      }
    };

    const addNode = async () => {
      // Quick validation first
      errors.value = {};
      errorMessage.value = '';
      
      // Validate step 3 - optimized
      const validationErrors = {};
      if (!formData.value.sod || formData.value.sod === null) {
        validationErrors.sod = 'L\'espacement des goutteurs est requis';
      }
      if (!formData.value.nor || formData.value.nor === null) {
        validationErrors.nor = 'Le nombre de rampes est requis';
      }
      if (!formData.value.frod || formData.value.frod === null) {
        validationErrors.frod = 'Le débit des goutteurs est requis';
      }
      if (!formData.value.cou || formData.value.cou === null) {
        validationErrors.cou = 'Le coefficient uniformité est requis';
      }
      if (!formData.value.ire || formData.value.ire === null) {
        validationErrors.ire = 'L\'efficacité d\'irrigation est requise';
      }

      if (Object.keys(validationErrors).length > 0) {
        errors.value = validationErrors;
        return;
      }

      // Set loading immediately for user feedback
      loading.value = true;
      
      const NodeData = {
        nodeId: String(formData.value.nodeId || ''),
        fname: String(formData.value.fname || ''),
        lat: formData.value.lat,
        long: formData.value.long,
        cult: formData.value.cult ? String(formData.value.cult).trim() : '',
        st: formData.value.st,
        is: String(formData.value.is || ''),
        is1: 4,
        cd1: formData.value.cd1,
        cd2: formData.value.cd2,
        rootd: formData.value.rootd,
        frod: formData.value.frod,
        sod: formData.value.sod,
        nor: formData.value.nor,
        cou: formData.value.cou,
        ire: formData.value.ire,
        Ss: String(formData.value.Ss || ''),
        oms: formData.value.oms,
        Soil: String(formData.value.Soil || ''),
        Date: new Date().toISOString().substr(0, 10),
        clay: formData.value.clay,
        Limon: formData.value.Limon,
        sand: formData.value.sand,
        nbr_port: formData.value.nmbr,
        port1: String(formData.value.port1 || ''),
        port2: String(formData.value.port2 || ''),
        port3: String(formData.value.port3 || ''),
        port4: String(formData.value.port4 || ''),
        port5: String(formData.value.port5 || ''),
        port6: String(formData.value.port6 || ''),
        profondeur: String(formData.value.prof || ''),
        id_admin: localStorage.getItem("authToken"),
      };

      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: La requête a pris trop de temps')), 30000)
        );
        
        const result = await Promise.race([
          nodeService.addNode(NodeData),
          timeoutPromise
        ]);
        
        const data = result?.data || result;
        
        if (data === "Already Exist!" || data === "Already Exist") {
          errorMessage.value = "Ce capteur existe déjà !";
          toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Ce capteur existe déjà !',
            life: 3000
          });
        } else if (result && !result.error) {
          toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le capteur a été ajouté avec succès',
            life: 3000
          });
          // Small delay before redirect to show success message
          setTimeout(() => {
            router.push("/table");
          }, 500);
        } else {
          throw new Error(result?.error || 'Erreur inconnue');
        }
      } catch (error) {
        console.error("Error adding node:", error);
        const errorMsg = error.message?.includes('Timeout') 
          ? "La requête a pris trop de temps. Veuillez vérifier votre connexion et réessayer."
          : "Erreur lors de l'ajout du capteur. Veuillez réessayer.";
        
        errorMessage.value = errorMsg;
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: errorMsg,
          life: 5000
        });
      } finally {
        loading.value = false;
      }
    };

    // Map methods
    const updateMapCenter = () => {
      if (formData.value.lat && formData.value.long) {
        const lat = parseFloat(formData.value.lat);
        const lng = parseFloat(formData.value.long);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          mapCenter.value = { lat, lng };
          mapZoom.value = 15;
        } else {
          mapCenter.value = { lat: 33.5731, lng: -6.8498 };
          mapZoom.value = 6;
        }
      } else {
        mapCenter.value = { lat: 31.7917, lng: -7.0926 };
        mapZoom.value = 5;
      }
    };

    const toggleMap = () => {
      showMap.value = !showMap.value;
      if (showMap.value) {
        if (formData.value.lat && formData.value.long) {
          nextTick(() => {
            updateMapCenter();
          });
        } else {
          // If no coordinates, center on Morocco
          centerOnMorocco();
        }
      }
    };

    const centerOnMorocco = () => {
      mapCenter.value = { lat: 33.5731, lng: -6.8498 }; // Morocco center (Rabat area to avoid border line)
      mapZoom.value = 6;
      formData.value.lat = null;
      formData.value.long = null;
      searchQuery.value = 'Maroc';
    };

    const searchLocation = () => {
      if (!geocoder.value || !searchQuery.value) return;

      geocoder.value.geocode({ address: searchQuery.value }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          formData.value.lat = lat();
          formData.value.long = lng();
          mapCenter.value = { lat: lat(), lng: lng() };
          mapZoom.value = 15;
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    const onMapClick = (event) => {
      if (event && event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        formData.value.lat = lat;
        formData.value.long = lng;
        mapCenter.value = { lat, lng };
        reverseGeocode(lat, lng);
      }
    };

    const onMarkerDrag = (event) => {
      if (event && event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        formData.value.lat = lat;
        formData.value.long = lng;
        mapCenter.value = { lat, lng };
        reverseGeocode(lat, lng);
      }
    };

    const reverseGeocode = (lat, lng) => {
      if (!geocoder.value) return;

      const latlng = { lat, lng };
      geocoder.value.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          searchQuery.value = results[0].formatted_address;
        } else {
          console.error('Reverse geocode was not successful for the following reason: ' + status);
          searchQuery.value = '';
        }
      });
    };

    const markerPosition = () => {
      if (formData.value.lat && formData.value.long) {
        const lat = parseFloat(formData.value.lat);
        const lng = parseFloat(formData.value.long);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          return { lat, lng };
        }
      }
      if (mapCenter.value && mapCenter.value.lat && mapCenter.value.lng) {
        return mapCenter.value;
      }
      return { lat: 33.5731, lng: -6.8498 };
    };

    const fillDemoData = () => {
      // Basic Information
      formData.value.nodeId = 'A-N4-E02-C02';
      formData.value.fname = 'Ahmed Benali';
      formData.value.lat = 33.5731;
      formData.value.long = -6.8498;
      formData.value.st = 5000;
      formData.value.is = 'Irrigation goutte à goutte';
      formData.value.nmbr = '4';
      formData.value.prof = '30-60-90';
      formData.value.port1 = '';
      formData.value.port2 = '';
      formData.value.port3 = '';
      formData.value.port4 = '';
      formData.value.port5 = '';
      formData.value.port6 = '';

      // Agronomic Information
      formData.value.cult = 'Tomate';
      formData.value.cd1 = 3;
      formData.value.cd2 = 3;
      formData.value.rootd = 40;
      formData.value.Soil = 'Argileux';
      formData.value.clay = 35;
      formData.value.Limon = 40;
      formData.value.sand = 25;
      formData.value.oms = 2.5;
      formData.value.Ss = 'Faible';

      // Irrigation Information
      formData.value.sod = 50;
      formData.value.nor = 8;
      formData.value.frod = 2.5;
      formData.value.cou = 0.85;
      formData.value.ire = 0.90;

      // Update map center
      mapCenter.value = { lat: 33.5731, lng: -6.8498 };
      mapZoom.value = 15;
      searchQuery.value = 'Rabat, Maroc';

      // Clear errors
      errors.value = {};
      errorMessage.value = '';

      // Show success message
      toast.add({
        severity: 'info',
        summary: 'Données de démo',
        detail: 'Tous les champs ont été remplis avec des exemples',
        life: 3000
      });
    };

    return {
      currentStep,
      formData,
      errors,
      errorMessage,
      loading,
      validateStep1,
      validateStep2,
      addNode,
      showMap,
      mapCenter,
      mapZoom,
      searchQuery,
      markerPosition,
      toggleMap,
      searchLocation,
      onMapClick,
      onMarkerDrag,
      updateMapCenter,
      centerOnMorocco,
      fillDemoData
    };
  },
  mounted() {
    console.log('Add page mounted');
  }
};
</script>

<style scoped>
.page-content {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.page-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.demo-button {
  padding: 0.4rem 0.6rem !important;
  min-width: auto !important;
  height: auto !important;
  border-radius: 6px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.2s ease !important;
}

.demo-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4) !important;
}

.demo-button :deep(.p-button-icon) {
  font-size: 0.9rem !important;
  margin: 0 !important;
}

.demo-button :deep(.p-button-label) {
  display: none !important;
}

.form-container {
  padding: 1rem 0;
}

/* Stepper Navigation */
.stepper-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  min-width: 180px;
}

.step-item i {
  font-size: 1.5rem;
  color: #6c757d;
}

.step-item span {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.step-item.active {
  background: #e3f2fd;
}

.step-item.active i,
.step-item.active span {
  color: #2196f3;
}

.step-item.completed i {
  color: #4caf50;
}

.step-item.completed span {
  color: #4caf50;
}

.step-divider {
  width: 60px;
  height: 2px;
  background: #dee2e6;
  margin: 0 0.5rem;
}

.form-step {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-step h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #1a1a1a;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: -0.25rem;
}

.density-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.density-input span {
  font-weight: 600;
  color: #495057;
}

.soil-composition {
  grid-column: 1 / -1;
}

.soil-composition-simple {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.soil-item-simple {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.soil-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.clay-dot {
  background: #8b4513;
}

.limon-dot {
  background: #deb887;
}

.sand-dot {
  background: #f4a460;
}

.soil-label-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  min-width: 60px;
}

.soil-input {
  width: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 4px;
  color: #991b1b;
  margin-top: 1rem;
}

.error-message i {
  font-size: 1.25rem;
}

/* Coordinates Section Styles */
.coordinates-section {
  grid-column: 1 / -1;
}

.coordinates-search {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
  width: 100%;
}

.coordinates-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.coordinates-input {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.coordinates-input :deep(.p-inputnumber) {
  flex: 1;
  min-width: 0;
}

.map-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.map-link-button {
  text-decoration: none;
  display: inline-flex;
}

.map-link-button :deep(.p-button) {
  margin: 0;
}

.map-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 300px;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .stepper-navigation {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .step-item {
    min-width: 150px;
    padding: 0.5rem 1rem;
  }

  .step-divider {
    width: 30px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 1.1rem;
  }

  .demo-button {
    padding: 0.35rem 0.5rem !important;
  }

  .stepper-navigation {
    flex-direction: column;
    gap: 1rem;
    padding: 0.75rem;
  }

  .step-divider {
    width: 2px;
    height: 40px;
    margin: 0;
  }

  .step-item {
    min-width: auto;
    width: 100%;
    padding: 0.75rem 1rem;
  }

  .step-item i {
    font-size: 1.25rem;
  }

  .step-item span {
    font-size: 0.8rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-step h3 {
    font-size: 1.1rem;
  }

  .form-field label {
    font-size: 0.8rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .form-actions button {
    width: 100%;
  }

  .coordinates-section {
    grid-column: 1;
  }

  .coordinates-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .coordinates-input {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-box {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .search-box button {
    flex: 1;
    min-width: 120px;
  }

  .map-container {
    height: 250px;
  }

  .density-input {
    flex-direction: column;
    align-items: stretch;
  }

  .density-input span {
    text-align: center;
    padding: 0.5rem 0;
  }

  .soil-composition-simple {
    flex-direction: column;
    gap: 0.75rem;
  }

  .soil-item-simple {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 0.75rem;
  }

  .form-container {
    padding: 0.5rem 0;
  }

  .stepper-navigation {
    padding: 0.5rem;
  }

  .form-grid {
    gap: 0.75rem;
  }

  .map-container {
    height: 200px;
  }

  .search-box {
    flex-direction: column;
  }

  .search-box button {
    width: 100%;
  }
}
</style>
