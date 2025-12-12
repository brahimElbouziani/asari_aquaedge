<template>
  <div>
    <DataTable 
      :value="Nodes" 
      :paginator="true" 
      :rows="10"
      tableStyle="min-width: 50rem"
      class="p-datatable-striped"
      @row-click="onRowClick"
    >
      <Column field="FarmerName" header="Nom de client" :sortable="true" style="font-weight: bold;"></Column>
      <Column field="NodeId" header="Node Id" :sortable="true"></Column>
      <Column header="Actions" :exportable="false" bodyStyle="text-align: center;">
        <template #body="slotProps">
          <div class="action-buttons">
            <Button 
              icon="pi pi-eye" 
              class="p-button-rounded p-button-text p-button-info p-button-sm" 
              @click.stop="handleView(slotProps.data)"
              v-tooltip="'Voir les détails'"
            />
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-text p-button-warning p-button-sm" 
              @click.stop="handleModify(slotProps.data)"
              v-tooltip="'Modifier'"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-rounded p-button-text p-button-danger p-button-sm" 
              @click.stop="handleDelete(slotProps.data)"
              v-tooltip="'Supprimer'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <!-- View Details Dialog -->
    <Dialog 
      v-model:visible="viewDialogVisible" 
      modal 
      :header="viewDialogTitle" 
      :style="{ width: '80vw', maxWidth: '900px' }"
      :maximizable="true"
    >
      <div v-if="loadingDetails" class="loading-container">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Chargement des détails...</p>
      </div>
      <div v-else-if="nodeDetails" class="node-details">
        <!-- Basic Information -->
        <div class="basic-info">
          <div class="detail-item" v-if="nodeDetails.FarmerName">
            <label>Nom de client:</label>
            <span>{{ nodeDetails.FarmerName }}</span>
          </div>
          <div class="detail-item" v-if="nodeDetails.NodeId">
            <label>Identifiant du nœud:</label>
            <span>{{ nodeDetails.NodeId }}</span>
          </div>
          <div class="detail-item" v-if="nodeDetails.latitude !== undefined || nodeDetails.longitude !== undefined">
            <label>Coordonnées:</label>
            <span>{{ nodeDetails.latitude }}, {{ nodeDetails.longitude }}</span>
          </div>
          <div class="detail-item" v-if="nodeDetails.Totalarea">
            <label>Superficie totale:</label>
            <span>{{ nodeDetails.Totalarea }} m²</span>
          </div>
          <div class="detail-item" v-if="nodeDetails.Date">
            <label>Date de création:</label>
            <span>{{ formatDate(nodeDetails.Date) }}</span>
          </div>
          <div class="detail-item" v-if="nodeDetails.DateD">
            <label>Date de début:</label>
            <span>{{ formatDate(nodeDetails.DateD) }}</span>
          </div>
        </div>

        <!-- Collapsible Sections -->
        <Accordion :multiple="true" :activeIndex="[]">
          <!-- Agronomic Section -->
          <AccordionTab>
            <template #header>
              <div class="accordion-header">
                <i class="pi pi-leaf accordion-icon"></i>
                <span>Informations Agronomiques</span>
              </div>
            </template>
            <div class="details-grid">
              <div class="detail-item" v-if="nodeDetails.Culture !== undefined">
                <label>Culture:</label>
                <span>{{ nodeDetails.Culture }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.CropDensit1 !== undefined || nodeDetails.CropDensit2 !== undefined">
                <label>Densité (H × L):</label>
                <span>{{ nodeDetails.CropDensit1 || '-' }} × {{ nodeDetails.CropDensit2 || '-' }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.depthroot">
                <label>Profondeur des racines:</label>
                <span>{{ nodeDetails.depthroot }} cm</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Soiltextue">
                <label>Texture du sol:</label>
                <span>{{ nodeDetails.Soiltextue }}</span>
              </div>
              <div class="detail-item soil-texture" v-if="nodeDetails.Clay !== undefined || nodeDetails.Limon !== undefined || nodeDetails.Sand !== undefined">
                <label>Composition du sol:</label>
                <div class="soil-composition-simple">
                  <span class="soil-item-simple">
                    <span class="soil-dot clay-dot"></span>
                    <span class="soil-text">Argile <strong>{{ nodeDetails.Clay || 0 }}%</strong></span>
                  </span>
                  <span class="soil-item-simple">
                    <span class="soil-dot limon-dot"></span>
                    <span class="soil-text">Limon <strong>{{ nodeDetails.Limon || 0 }}%</strong></span>
                  </span>
                  <span class="soil-item-simple">
                    <span class="soil-dot sand-dot"></span>
                    <span class="soil-text">Sable <strong>{{ nodeDetails.Sand || 0 }}%</strong></span>
                  </span>
                </div>
              </div>
              <div class="detail-item" v-if="nodeDetails.OrganicMatter">
                <label>Matière organique:</label>
                <span>{{ nodeDetails.OrganicMatter }}%</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Soilsalinity">
                <label>Salinité du sol:</label>
                <span>{{ nodeDetails.Soilsalinity }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Soilsensordepth1">
                <label>Profondeur capteur sol 1:</label>
                <span>{{ nodeDetails.Soilsensordepth1 }} cm</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Soilsensordepth2">
                <label>Profondeur capteur sol 2:</label>
                <span>{{ nodeDetails.Soilsensordepth2 }} cm</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Soilsensordepth3">
                <label>Profondeur capteur sol 3:</label>
                <span>{{ nodeDetails.Soilsensordepth3 }} cm</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Soilsensordepth4">
                <label>Profondeur capteur sol 4:</label>
                <span>{{ nodeDetails.Soilsensordepth4 }} cm</span>
              </div>
            </div>
          </AccordionTab>

          <!-- Irrigation Section -->
          <AccordionTab>
            <template #header>
              <div class="accordion-header">
                <i class="pi pi-tint accordion-icon"></i>
                <span>Informations d'Irrigation</span>
              </div>
            </template>
            <div class="details-grid">
              <div class="detail-item" v-if="nodeDetails.IrrigationSystem">
                <label>Système d'irrigation:</label>
                <span>{{ nodeDetails.IrrigationSystem }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.DrippersSpaces">
                <label>Espacement des goutteurs:</label>
                <span>{{ nodeDetails.DrippersSpaces }} cm</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Numberramps">
                <label>Nombre de rampes:</label>
                <span>{{ nodeDetails.Numberramps }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.DripppersFlowrate">
                <label>Débit des goutteurs:</label>
                <span>{{ nodeDetails.DripppersFlowrate }} L/h</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Cofficientuinf">
                <label>Coefficient uniformité:</label>
                <span>{{ nodeDetails.Cofficientuinf }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.Irrigationefficiency">
                <label>Efficacité d'irrigation:</label>
                <span>{{ nodeDetails.Irrigationefficiency }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.port1">
                <label>Port 1:</label>
                <span>{{ nodeDetails.port1 }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.port2">
                <label>Port 2:</label>
                <span>{{ nodeDetails.port2 }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.port3">
                <label>Port 3:</label>
                <span>{{ nodeDetails.port3 }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.port4">
                <label>Port 4:</label>
                <span>{{ nodeDetails.port4 }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.port5">
                <label>Port 5:</label>
                <span>{{ nodeDetails.port5 }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.port6">
                <label>Port 6:</label>
                <span>{{ nodeDetails.port6 }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.nbr_port">
                <label>Nombre de ports:</label>
                <span>{{ nodeDetails.nbr_port }}</span>
              </div>
              <div class="detail-item" v-if="nodeDetails.profondeur">
                <label>Profondeur:</label>
                <span>{{ nodeDetails.profondeur }}</span>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>
      <div v-else class="error-message">
        <i class="pi pi-exclamation-circle" style="font-size: 2rem; color: #f44336;"></i>
        <p>Impossible de charger les détails du nœud</p>
      </div>
      <template #footer>
        <Button label="Fermer" icon="pi pi-times" @click="viewDialogVisible = false" class="p-button-text" />
      </template>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog 
      v-model:visible="editDialogVisible" 
      modal 
      :header="editDialogTitle" 
      :style="{ width: '80vw', maxWidth: '900px' }"
      :maximizable="true"
    >
      <div v-if="loadingEdit" class="loading-container">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Chargement des données...</p>
      </div>
      <div v-else-if="editNodeData && Object.keys(editNodeData).length > 0" class="node-details">
        <!-- Basic Information -->
        <div class="basic-info">
          <div class="detail-item">
            <label>Nom de client:</label>
            <InputText v-model="editNodeData.FarmerName" class="edit-input" />
          </div>
          <div class="detail-item">
            <label>Identifiant du nœud:</label>
            <InputText v-model="editNodeData.NodeId" class="edit-input" disabled />
          </div>
          <div class="detail-item coordinates-section">
            <label>Coordonnées:</label>
            <div class="coordinates-search">
              <div class="coordinates-header">
                <div class="coordinates-input">
                  <InputNumber v-model="editNodeData.latitude" placeholder="Latitude" class="edit-input" @update:modelValue="updateMapCenter" />
                  <InputNumber v-model="editNodeData.longitude" placeholder="Longitude" class="edit-input" @update:modelValue="updateMapCenter" />
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
                </div>
                <div class="map-container">
                  <GmapMap
                    :center="mapCenter"
                    :zoom="mapZoom"
                    :style="{ width: '100%', height: '300px', borderRadius: '8px' }"
                    @click="onMapClick"
                  >
                    <GmapMarker
                      v-if="showMap"
                      :position="markerPosition"
                      :draggable="true"
                      :title="'Position: ' + (editNodeData.latitude || mapCenter.lat) + ', ' + (editNodeData.longitude || mapCenter.lng)"
                      @dragend="onMarkerDrag"
                    />
                  </GmapMap>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-item">
            <label>Superficie totale (m²):</label>
            <InputNumber v-model="editNodeData.Totalarea" class="edit-input" />
          </div>
        </div>

        <!-- Collapsible Sections -->
        <Accordion :multiple="true" :activeIndex="[]">
          <!-- Agronomic Section -->
          <AccordionTab>
            <template #header>
              <div class="accordion-header">
                <i class="pi pi-leaf accordion-icon"></i>
                <span>Informations Agronomiques</span>
              </div>
            </template>
            <div class="details-grid">
              <div class="detail-item">
                <label>Culture:</label>
                <InputText v-model="editNodeData.Culture" class="edit-input" placeholder="Type de culture" />
              </div>
              <div class="detail-item">
                <label>Densité (H × L):</label>
                <div class="density-input">
                  <InputNumber v-model="editNodeData.CropDensit1" placeholder="Hauteur" class="edit-input" />
                  <span>×</span>
                  <InputNumber v-model="editNodeData.CropDensit2" placeholder="Largeur" class="edit-input" />
                </div>
              </div>
              <div class="detail-item">
                <label>Profondeur des racines (cm):</label>
                <InputNumber v-model="editNodeData.depthroot" class="edit-input" />
              </div>
              <div class="detail-item">
                <label>Texture du sol:</label>
                <InputText v-model="editNodeData.Soiltextue" class="edit-input" />
              </div>
              <div class="detail-item soil-texture">
                <label>Composition du sol:</label>
                <div class="soil-composition-simple">
                  <div class="soil-item-simple">
                    <span class="soil-dot clay-dot"></span>
                    <span class="soil-label-text">Argile</span>
                    <InputNumber v-model="editNodeData.Clay" :min="0" :max="100" suffix="%" class="soil-input" />
                  </div>
                  <div class="soil-item-simple">
                    <span class="soil-dot limon-dot"></span>
                    <span class="soil-label-text">Limon</span>
                    <InputNumber v-model="editNodeData.Limon" :min="0" :max="100" suffix="%" class="soil-input" />
                  </div>
                  <div class="soil-item-simple">
                    <span class="soil-dot sand-dot"></span>
                    <span class="soil-label-text">Sable</span>
                    <InputNumber v-model="editNodeData.Sand" :min="0" :max="100" suffix="%" class="soil-input" />
                  </div>
                </div>
              </div>
              <div class="detail-item">
                <label>Matière organique (%):</label>
                <InputNumber 
                  v-model="editNodeData.OrganicMatter" 
                  class="edit-input" 
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                />
              </div>
              <div class="detail-item">
                <label>Salinité du sol:</label>
                <InputText v-model="editNodeData.Soilsalinity" class="edit-input" />
              </div>
            </div>
          </AccordionTab>

          <!-- Irrigation Section -->
          <AccordionTab>
            <template #header>
              <div class="accordion-header">
                <i class="pi pi-tint accordion-icon"></i>
                <span>Informations d'Irrigation</span>
              </div>
            </template>
            <div class="details-grid">
              <div class="detail-item">
                <label>Système d'irrigation:</label>
                <InputText v-model="editNodeData.IrrigationSystem" class="edit-input" />
              </div>
              <div class="detail-item">
                <label>Espacement des goutteurs (cm):</label>
                <InputNumber v-model="editNodeData.DrippersSpaces" class="edit-input" />
              </div>
              <div class="detail-item">
                <label>Nombre de rampes:</label>
                <InputNumber v-model="editNodeData.Numberramps" class="edit-input" />
              </div>
              <div class="detail-item">
                <label>Débit des goutteurs (L/h):</label>
                <InputNumber v-model="editNodeData.DripppersFlowrate" class="edit-input" />
              </div>
              <div class="detail-item">
                <label>Coefficient uniformité:</label>
                <InputNumber 
                  v-model="editNodeData.Cofficientuinf" 
                  :min="0" 
                  :max="1" 
                  :step="0.01" 
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                  placeholder="0.00 - 1.00"
                  class="edit-input" 
                />
              </div>
              <div class="detail-item">
                <label>Efficacité d'irrigation:</label>
                <InputNumber 
                  v-model="editNodeData.Irrigationefficiency" 
                  :min="0" 
                  :max="1" 
                  :step="0.01" 
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                  :useGrouping="false"
                  placeholder="0.00 - 1.00"
                  class="edit-input" 
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" @click="editDialogVisible = false" class="p-button-text" />
        <Button label="Enregistrer" icon="pi pi-check" @click="confirmSave" :loading="loadingEdit" autofocus />
      </template>
    </Dialog>

    <!-- Save Confirmation Dialog -->
    <Dialog 
      v-model:visible="saveConfirmDialogVisible" 
      modal 
      header="Confirmer les modifications" 
      :style="{ width: '600px', maxWidth: '90vw' }"
    >
      <div class="save-confirmation">
        <div class="confirmation-warning">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #ff9800;"></i>
          <p><strong>Vous êtes sur le point de modifier ce nœud.</strong></p>
          <p>Veuillez vérifier les changements ci-dessous avant de confirmer :</p>
        </div>
        <div class="changes-summary">
          <h4>Récapitulatif des modifications :</h4>
          <div class="changes-list">
            <div v-for="change in changesList" :key="change.field" class="change-item">
              <div class="change-label">{{ change.label }}:</div>
              <div class="change-values">
                <span class="old-value">{{ change.oldValue || '(vide)' }}</span>
                <i class="pi pi-arrow-right"></i>
                <span class="new-value">{{ change.newValue || '(vide)' }}</span>
              </div>
            </div>
            <div v-if="changesList.length === 0" class="no-changes">
              <i class="pi pi-info-circle"></i>
              <span>Aucun changement détecté</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" @click="saveConfirmDialogVisible = false" class="p-button-text" />
        <Button label="Confirmer et Enregistrer" icon="pi pi-check" @click="saveEdit" class="p-button-success" autofocus />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="deleteDialogVisible" 
      modal 
      header="Confirmer la suppression" 
      :style="{ width: '500px' }"
      :closable="!deleting"
    >
      <div class="confirmation-content">
        <div v-if="deleting" class="deleting-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #f44336;"></i>
          <p>Suppression en cours...</p>
        </div>
        <div v-else>
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #f44336;"></i>
          <div class="delete-message">
            <p><strong>Êtes-vous sûr de vouloir supprimer ce nœud ?</strong></p>
            <p v-if="nodeToDelete" class="node-info">
              <strong>Nœud:</strong> {{ nodeToDelete.FarmerName || nodeToDelete.NodeId || 'Non spécifié' }}
              <br v-if="nodeToDelete.NodeId" />
              <span v-if="nodeToDelete.NodeId"><strong>ID:</strong> {{ nodeToDelete.NodeId }}</span>
            </p>
            <p class="warning-text">⚠️ Cette action est irréversible et supprimera définitivement toutes les données associées à ce nœud.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button 
          label="Annuler" 
          icon="pi pi-times" 
          @click="deleteDialogVisible = false" 
          class="p-button-text" 
          :disabled="deleting"
        />
        <Button 
          label="Supprimer" 
          icon="pi pi-trash" 
          @click="confirmDelete" 
          class="p-button-danger" 
          :loading="deleting"
          :disabled="deleting"
          autofocus 
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import router from '../../routes'
import { nodeService } from "@/services/api/index";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tooltip from 'primevue/tooltip';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import GmapMap from '@/components/GoogleMap/GmapMap.vue';
import GmapMarker from '@/components/GoogleMap/GmapMarker.vue';

export default {
  name: "simple-table",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    Accordion,
    AccordionTab,
    InputText,
    InputNumber,
    GmapMap,
    GmapMarker
  },
  directives: {
    tooltip: Tooltip
  },
  data() {
    return {
      selected: [],
      Nodes: [],
      deleteDialogVisible: false,
      nodeToDelete: null,
      deleting: false,
      viewDialogVisible: false,
      nodeDetails: null,
      loadingDetails: false,
      viewDialogTitle: 'Détails du nœud',
      editDialogVisible: false,
      editNodeData: {},
      loadingEdit: false,
      editDialogTitle: 'Modifier le nœud',
      mapCenter: { lat: 33.5731, lng: -7.5898 },
      mapZoom: 10,
      searchQuery: '',
      geocoder: null,
      placesService: null,
      showMap: false,
      saveConfirmDialogVisible: false,
      originalNodeData: {}
    };
  },
  computed: {
    hasValidCoordinates() {
      const lat = parseFloat(this.editNodeData.latitude);
      const lng = parseFloat(this.editNodeData.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    },
    markerPosition() {
      if (this.hasValidCoordinates) {
        return {
          lat: parseFloat(this.editNodeData.latitude),
          lng: parseFloat(this.editNodeData.longitude)
        };
      }
      // Return map center if no valid coordinates, but ensure it's a valid position
      if (this.mapCenter && this.mapCenter.lat && this.mapCenter.lng) {
        return this.mapCenter;
      }
      // Default position
      return { lat: 33.5731, lng: -7.5898 };
    },
    changesList() {
      const changes = [];
      const fields = [
        { key: 'FarmerName', label: 'Nom de client' },
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' },
        { key: 'Totalarea', label: 'Superficie totale' },
        { key: 'IrrigationSystem', label: 'Système d\'irrigation' },
        { key: 'Culture', label: 'Culture' },
        { key: 'CropDensit1', label: 'Densité (Hauteur)' },
        { key: 'CropDensit2', label: 'Densité (Largeur)' },
        { key: 'DrippersSpaces', label: 'Espacement des goutteurs' },
        { key: 'Numberramps', label: 'Nombre de rampes' },
        { key: 'DripppersFlowrate', label: 'Débit des goutteurs' },
        { key: 'Cofficientuinf', label: 'Coefficient uniformité' },
        { key: 'Irrigationefficiency', label: 'Efficacité d\'irrigation' },
        { key: 'depthroot', label: 'Profondeur des racines' },
        { key: 'Soiltextue', label: 'Texture du sol' },
        { key: 'OrganicMatter', label: 'Matière organique' },
        { key: 'Soilsalinity', label: 'Salinité du sol' },
        { key: 'Clay', label: 'Argile' },
        { key: 'Limon', label: 'Limon' },
        { key: 'Sand', label: 'Sable' }
      ];

      fields.forEach(field => {
        const oldValue = this.originalNodeData[field.key];
        const newValue = this.editNodeData[field.key];
        
        // Compare values (handle numbers and strings)
        const oldVal = oldValue !== undefined && oldValue !== null ? String(oldValue) : '';
        const newVal = newValue !== undefined && newValue !== null ? String(newValue) : '';
        
        if (oldVal !== newVal) {
          changes.push({
            field: field.key,
            label: field.label,
            oldValue: oldVal || '(vide)',
            newValue: newVal || '(vide)'
          });
        }
      });

      return changes;
    }
  },
  methods: {
    onRowClick(event) {
      const item = event.data;
      if (!item || !item.NodeId) {
        console.warn('Invalid row data:', item);
        return;
      }
      this.getpath(
        item.NodeId,
        item.nbr_port,
        item.port1,
        item.port2,
        item.port3,
        item.port4,
        item.port5,
        item.port6,
        item.profondeur
      );
    },
    getpath(id, nbr, p1, p2, p3, p4, p5, p6, prf) {
      if (!id) {
        console.warn('No NodeId provided');
        return;
      }
      // Redirect to sensor detail page instead of dashboard
      router.push(`/sensor-detail/${id}`)
    },
    async handleView(node) {
      if (!node || !node.NodeId) {
        console.warn('Invalid node data for view:', node);
        return;
      }
      
      this.viewDialogVisible = true;
      this.loadingDetails = true;
      this.nodeDetails = null;
      this.viewDialogTitle = `Détails - ${node.FarmerName || node.NodeId}`;
      
      try {
        // Try to get full details by NodeId first
        const result = await nodeService.getNodeDetails(node.NodeId);
        if (result && result.data && !result.error) {
          this.nodeDetails = result.data;
        } else {
          // If that fails, try by database ID
          const nodeId = node._id || node.id;
          if (nodeId) {
            const dbResult = await nodeService.getNodeDetailsDatabase(nodeId);
            if (dbResult && dbResult.data && !dbResult.error) {
              this.nodeDetails = dbResult.data;
            } else {
              // Fallback to the node data we already have
              this.nodeDetails = node;
            }
          } else {
            // Fallback to the node data we already have
            this.nodeDetails = node;
          }
        }
      } catch (error) {
        console.error('Error loading node details:', error);
        // Fallback to the node data we already have
        this.nodeDetails = node;
      } finally {
        this.loadingDetails = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    },
    async handleModify(node) {
      if (!node || !node.NodeId) {
        console.warn('Invalid node data for modify:', node);
        return;
      }
      
      this.editDialogVisible = true;
      this.loadingEdit = true;
      this.editNodeData = {};
      this.searchQuery = '';
      this.editDialogTitle = `Modifier - ${node.FarmerName || node.NodeId}`;
      
      try {
        // Try to get full details by NodeId first
        const result = await nodeService.getNodeDetails(node.NodeId);
        let dataToUse = null;
        if (result && result.data && !result.error) {
          dataToUse = result.data;
        } else {
          // If that fails, try by database ID
          const nodeId = node._id || node.id;
          if (nodeId) {
            const dbResult = await nodeService.getNodeDetailsDatabase(nodeId);
            if (dbResult && dbResult.data && !dbResult.error) {
              dataToUse = dbResult.data;
            } else {
              // Fallback to the node data we already have
              dataToUse = node;
            }
          } else {
            // Fallback to the node data we already have
            dataToUse = node;
          }
        }
        
        // Convert numeric fields to numbers
        if (dataToUse) {
          this.editNodeData = { ...dataToUse };
          // Convert numeric fields - preserve null/undefined, only convert valid numbers
          if (this.editNodeData.Cofficientuinf !== undefined && this.editNodeData.Cofficientuinf !== null && this.editNodeData.Cofficientuinf !== '') {
            const val = parseFloat(this.editNodeData.Cofficientuinf);
            this.editNodeData.Cofficientuinf = isNaN(val) ? null : val;
          } else {
            this.editNodeData.Cofficientuinf = null;
          }
          if (this.editNodeData.Irrigationefficiency !== undefined && this.editNodeData.Irrigationefficiency !== null && this.editNodeData.Irrigationefficiency !== '') {
            const val = parseFloat(this.editNodeData.Irrigationefficiency);
            this.editNodeData.Irrigationefficiency = isNaN(val) ? null : val;
          } else {
            this.editNodeData.Irrigationefficiency = null;
          }
          if (this.editNodeData.OrganicMatter !== undefined && this.editNodeData.OrganicMatter !== null && this.editNodeData.OrganicMatter !== '') {
            const val = parseFloat(this.editNodeData.OrganicMatter);
            this.editNodeData.OrganicMatter = isNaN(val) ? null : val;
          } else {
            this.editNodeData.OrganicMatter = null;
          }
          this.originalNodeData = JSON.parse(JSON.stringify(this.editNodeData)); // Deep copy
        }
        
        // Update map center if coordinates exist
        if (this.editNodeData.latitude && this.editNodeData.longitude) {
          this.updateMapCenter();
        }
        this.showMap = false; // Hide map by default
      } catch (error) {
        console.error('Error loading node details for edit:', error);
        // Fallback to the node data we already have
        this.editNodeData = { ...node };
        // Convert numeric fields - preserve null/undefined, only convert valid numbers
        if (this.editNodeData.Cofficientuinf !== undefined && this.editNodeData.Cofficientuinf !== null && this.editNodeData.Cofficientuinf !== '') {
          const val = parseFloat(this.editNodeData.Cofficientuinf);
          this.editNodeData.Cofficientuinf = isNaN(val) ? null : val;
        } else {
          this.editNodeData.Cofficientuinf = null;
        }
        if (this.editNodeData.Irrigationefficiency !== undefined && this.editNodeData.Irrigationefficiency !== null && this.editNodeData.Irrigationefficiency !== '') {
          const val = parseFloat(this.editNodeData.Irrigationefficiency);
          this.editNodeData.Irrigationefficiency = isNaN(val) ? null : val;
        } else {
          this.editNodeData.Irrigationefficiency = null;
        }
        if (this.editNodeData.OrganicMatter !== undefined && this.editNodeData.OrganicMatter !== null && this.editNodeData.OrganicMatter !== '') {
          const val = parseFloat(this.editNodeData.OrganicMatter);
          this.editNodeData.OrganicMatter = isNaN(val) ? null : val;
        } else {
          this.editNodeData.OrganicMatter = null;
        }
        this.originalNodeData = JSON.parse(JSON.stringify(this.editNodeData)); // Deep copy
        if (node.latitude && node.longitude) {
          this.updateMapCenter();
        }
        this.showMap = false; // Hide map by default
      } finally {
        this.loadingEdit = false;
      }
    },
    onMapClick(event) {
      if (event && event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.editNodeData.latitude = lat;
        this.editNodeData.longitude = lng;
        this.mapCenter = { lat, lng };
        this.reverseGeocode(lat, lng);
      }
    },
    onMarkerDrag(event) {
      if (event && event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.editNodeData.latitude = lat;
        this.editNodeData.longitude = lng;
        this.mapCenter = { lat, lng };
        this.reverseGeocode(lat, lng);
      }
    },
    async searchLocation() {
      if (!this.searchQuery || this.searchQuery.trim() === '') {
        return;
      }

      this.loadingEdit = true;
      try {
        // Use Google Maps Geocoding API
        const { Loader } = await import('google-maps');
        const { API_KEY } = await import('@/pages/API_KEY');
        const loader = new Loader(API_KEY, {
          libraries: ['places']
        });
        const google = await loader.load();

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.searchQuery }, (results, status) => {
          this.loadingEdit = false;
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            this.editNodeData.latitude = lat;
            this.editNodeData.longitude = lng;
            this.mapCenter = { lat, lng };
            this.mapZoom = 15;
            
            // Update search query with formatted address
            this.searchQuery = results[0].formatted_address;
          } else {
            console.error('Geocoding failed:', status);
            alert('Impossible de trouver cette adresse. Veuillez réessayer.');
          }
        });
      } catch (error) {
        this.loadingEdit = false;
        console.error('Error searching location:', error);
        alert('Erreur lors de la recherche. Veuillez réessayer.');
      }
    },
    async reverseGeocode(lat, lng) {
      try {
        const { Loader } = await import('google-maps');
        const { API_KEY } = await import('@/pages/API_KEY');
        const loader = new Loader(API_KEY);
        const google = await loader.load();

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            this.searchQuery = results[0].formatted_address;
          }
        });
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    },
    toggleMap() {
      this.showMap = !this.showMap;
      if (this.showMap) {
        // Wait a bit for the map to render, then update center and zoom
        this.$nextTick(() => {
          this.updateMapCenter();
        });
      }
    },
    updateMapCenter() {
      if (this.editNodeData.latitude && this.editNodeData.longitude) {
        const lat = parseFloat(this.editNodeData.latitude);
        const lng = parseFloat(this.editNodeData.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          this.mapCenter = { lat, lng };
          this.mapZoom = 15; // Zoom level 15 for detailed view
        } else {
          // Default to Morocco if invalid coordinates
          this.mapCenter = { lat: 33.5731, lng: -7.5898 };
          this.mapZoom = 10;
        }
      } else {
        // Default to Morocco if no coordinates
        this.mapCenter = { lat: 33.5731, lng: -7.5898 };
        this.mapZoom = 10;
      }
    },
    confirmSave() {
      // Show confirmation dialog with changes summary
      this.saveConfirmDialogVisible = true;
    },
    async saveEdit() {
      if (!this.editNodeData || !this.editNodeData.NodeId) {
        console.error('Invalid node data for saving');
        return;
      }

      this.saveConfirmDialogVisible = false;

      this.loadingEdit = true;
      try {
        const nodeId = this.editNodeData.NodeId;
        const details = {
          FarmerName: this.editNodeData.FarmerName,
          latitude: this.editNodeData.latitude,
          longitude: this.editNodeData.longitude,
          Totalarea: this.editNodeData.Totalarea,
          IrrigationSystem: this.editNodeData.IrrigationSystem,
          Culture: this.editNodeData.Culture,
          CropDensit1: this.editNodeData.CropDensit1,
          CropDensit2: this.editNodeData.CropDensit2,
          DrippersSpaces: this.editNodeData.DrippersSpaces,
          Numberramps: this.editNodeData.Numberramps,
          Cofficientuinf: this.editNodeData.Cofficientuinf !== null && this.editNodeData.Cofficientuinf !== undefined ? this.editNodeData.Cofficientuinf : null,
          Irrigationefficiency: this.editNodeData.Irrigationefficiency !== null && this.editNodeData.Irrigationefficiency !== undefined ? this.editNodeData.Irrigationefficiency : null,
          Soiltextue: this.editNodeData.Soiltextue,
          OrganicMatter: this.editNodeData.OrganicMatter,
          Soilsalinity: this.editNodeData.Soilsalinity,
          DripppersFlowrate: this.editNodeData.DripppersFlowrate,
          depthroot: this.editNodeData.depthroot,
          Clay: this.editNodeData.Clay,
          Limon: this.editNodeData.Limon,
          Sand: this.editNodeData.Sand,
          port1: this.editNodeData.port1,
          port2: this.editNodeData.port2,
          port3: this.editNodeData.port3,
          port4: this.editNodeData.port4,
          port5: this.editNodeData.port5,
          port6: this.editNodeData.port6,
          nbr_port: this.editNodeData.nbr_port,
          profondeur: this.editNodeData.profondeur
        };

        const result = await nodeService.editNode(nodeId, details);
        if (result && !result.error) {
          // Reload nodes list
          await this.loadNodes();
          this.editDialogVisible = false;
        }
      } catch (error) {
        console.error('Error saving node:', error);
      } finally {
        this.loadingEdit = false;
      }
    },
    async loadNodes() {
      const result = await nodeService.getNodes();
      if (result.data && Array.isArray(result.data)) {
        this.Nodes = result.data;
        console.log('Nodes loaded:', this.Nodes);
      } else {
        console.warn('Invalid nodes data:', result.error);
        this.Nodes = [];
      }
    },
    handleDelete(node) {
      if (!node) {
        console.warn('Invalid node data for delete:', node);
        return;
      }
      this.nodeToDelete = node;
      this.deleteDialogVisible = true;
    },
    async confirmDelete() {
      if (!this.nodeToDelete) {
        return;
      }

      const nodeId = this.nodeToDelete._id || this.nodeToDelete.id;
      if (!nodeId) {
        console.error('No node ID found for deletion');
        this.$toast?.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de trouver l\'identifiant du nœud à supprimer',
          life: 3000
        });
        this.deleteDialogVisible = false;
        this.nodeToDelete = null;
        return;
      }

      this.deleting = true;
      try {
        const result = await nodeService.deleteNode(nodeId);
        if (result && !result.error) {
          // Remove the node from the local list
          this.Nodes = this.Nodes.filter(node => 
            (node._id || node.id) !== nodeId
          );
          
          // Show success message
          this.$toast?.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le nœud a été supprimé avec succès',
            life: 3000
          });
          
          // Reload nodes list to ensure consistency
          await this.loadNodes();
        } else {
          // Show error message
          this.$toast?.add({
            severity: 'error',
            summary: 'Erreur',
            detail: result?.error || 'Erreur lors de la suppression du nœud',
            life: 3000
          });
        }
      } catch (error) {
        console.error('Error deleting node:', error);
        this.$toast?.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de la suppression du nœud',
          life: 3000
        });
      } finally {
        this.deleting = false;
        this.deleteDialogVisible = false;
        this.nodeToDelete = null;
      }
    }
  },
  async created() {
    await this.loadNodes();
  }
};
</script>

<style scoped>
.p-datatable-striped {
  background-color: #4CAF50;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.action-buttons :deep(.p-button) {
  margin: 0;
}

.confirmation-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Center the Actions column header and body */
:deep(.p-datatable thead th:last-child),
:deep(.p-datatable tbody td:last-child) {
  text-align: center !important;
}

/* View Details Dialog Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.node-details {
  padding: 1rem 0;
}

.basic-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* Accordion Styles */
:deep(.p-accordion) {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-accordion-tab) {
  margin-bottom: 0.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: white;
}

:deep(.p-accordion-header) {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: none;
  padding: 1rem 1.25rem;
  transition: all 0.3s ease;
}

:deep(.p-accordion-header:hover) {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
}

:deep(.p-accordion-header:not(.p-disabled) .p-accordion-header-link) {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
}

:deep(.p-accordion-header-link) {
  padding: 0;
  border: none;
  background: transparent;
}

:deep(.p-accordion-content) {
  padding: 1.5rem;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.accordion-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.accordion-icon {
  font-size: 1.25rem;
  color: white;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.detail-item label {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  color: #212529;
  font-size: 1rem;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  color: #f44336;
}

.error-message p {
  margin: 0;
  font-size: 1.1rem;
}

/* Soil Composition Styles - Compact Agronomic Design */
.soil-texture {
  grid-column: 1 / -1;
}

.soil-composition-simple {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
}

.soil-item-simple {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.soil-item-simple:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.soil-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.clay-dot {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

.limon-dot {
  background: linear-gradient(135deg, #D2B48C 0%, #DEB887 100%);
}

.sand-dot {
  background: linear-gradient(135deg, #F4A460 0%, #FFD700 100%);
}

.soil-text {
  font-size: 0.85rem;
  color: #495057;
  white-space: nowrap;
}

.soil-text strong {
  color: #212529;
  font-weight: 600;
  margin-left: 0.2rem;
}

/* Edit Dialog Styles */
.edit-input {
  width: 100%;
  max-width: 100%;
  margin-top: 0.25rem;
  box-sizing: border-box;
}

:deep(.edit-input .p-inputtext),
:deep(.edit-input .p-inputnumber-input) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.coordinates-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  width: 100%;
  box-sizing: border-box;
}

.coordinates-input .edit-input {
  flex: 1;
  min-width: 0;
  max-width: 50%;
}

.density-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  width: 100%;
  box-sizing: border-box;
}

.density-input .edit-input {
  flex: 1;
  min-width: 0;
  max-width: calc(50% - 1rem);
}

.density-input span {
  font-weight: 600;
  color: #495057;
  flex-shrink: 0;
}

.soil-input {
  flex: 1;
  min-width: 0;
  max-width: 120px;
  margin-left: auto;
  box-sizing: border-box;
}

:deep(.soil-input .p-inputnumber-input) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.soil-item-simple {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  max-width: 100%;
  box-sizing: border-box;
}

/* Coordinates Section Styles */
.coordinates-section {
  grid-column: 1 / -1;
}

.coordinates-search {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.search-input {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

:deep(.search-input .p-inputtext) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.map-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

/* Ports Section Styles */
.ports-section {
  grid-column: 1 / -1;
}

.ports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
}

.port-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.port-item label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #495057;
}

.port-input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

:deep(.port-input .p-inputtext) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Save Confirmation Dialog Styles */
.save-confirmation {
  padding: 1rem 0;
}

.confirmation-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff3cd;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ff9800;
}

.confirmation-warning p {
  margin: 0;
  text-align: center;
}

.changes-summary {
  max-height: 400px;
  overflow-y: auto;
}

.changes-summary h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.change-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
}

.change-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.change-values {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.old-value {
  padding: 0.25rem 0.5rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 0.875rem;
  text-decoration: line-through;
}

.new-value {
  padding: 0.25rem 0.5rem;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.change-values i {
  color: #4CAF50;
  font-size: 0.875rem;
}

.no-changes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #6c757d;
  font-style: italic;
  justify-content: center;
}

/* Delete Confirmation Dialog Styles */
.confirmation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  text-align: center;
}

.deleting-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.deleting-state p {
  margin: 0;
  color: #495057;
  font-weight: 500;
}

.delete-message {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.delete-message p {
  margin: 0;
}

.node-info {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #f44336;
  margin: 0.5rem 0;
}

.node-info strong {
  color: #495057;
}

.warning-text {
  padding: 0.75rem;
  background: #ffebee;
  border-radius: 4px;
  border-left: 3px solid #f44336;
  color: #c62828;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
