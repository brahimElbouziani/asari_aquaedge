<template>
  <div class="page-maps">
    <!-- Loading Overlay -->
    <div v-if="loadingMarkers" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement des marqueurs...</p>
      </div>
    </div>

    <div class="maps-page-container">
      <div class="maps-content-wrapper">
      <CCol ref="content" xs="12" lg="12" class="maps-col">
        <CCard class="maps-card">
          <CCardBody class="maps-card-body">
          <v-card shaped>
            <GmapMap
              :center="center"
              :zoom="5"
              mapTypeId="satellite"
              ref="mapRef"
              :options="mapOptions"
              :style="{ width: '100%', height: mapHeight }"
              @click="handleMapClick"
              @ready="onMapReady"
              @bounds_changed="onBoundsChanged"
            >
            <!-- @click="onclearmap" -->
              <!--   image marker loading -->
              <GmapMarker
                v-bind:position="loadingMarker.position"
                :icon="loadingMarker.icon"
              />
              <GmapMarker
                v-for="(marker, index) in clickedPoints"
                v-bind:key="index+'-add'"
                :position="marker.position"
                :icon="{
                  url: require('../assets/icons/add.png'),
                  scaledSize: { width: 20, height: 20 },
                }"
              />
              <GmapPolygon
                :paths="polygonPaths"
                :options="{
                  strokeColor: '#fcf003',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#93c47e',
                  fillOpacity: 0.35,
                }"
              />

              <!--  polygons initiale  -->
              <div v-for="(item,index) in polygons" :key="item._id">
                <GmapPolygon
                
                  :key="index"
                  :ref="`polygon-${item._id}-${index}`"
                  :paths="item.Coord"
                  :options="getPolygonOptions()"
                  @click="onPolygonClick(item)"
                  @paths_changed="onPolygonDragEnd($event, item, index)"
                />

                <GmapMarker
                  :key="`marker-${index}`"
                  :position="getPolygonCenter(item.Coord)"
                  :label="{
                    text: `${item.name}`,
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight:'bold'
                  }"
                  :icon="{
                    url: '../assets/icons/transparent.png',
                    size: { width: 0, height: 0 },
                  }"
                />
              </div>

              <div
                v-for="(poly, index) in polygons_satte"
                :key="JSON.stringify(poly)"
              >
                <GmapPolygon
                  :paths="poly.coords"
                  :options="getPolygonOptions2(poly)"
                  @click="toggleInfoWindow(index, $event)"
                  @mouseover="onMouseoverPolygon(poly)"
                  @mouseout="onMouseoutPolygon(poly)"
                >
                </GmapPolygon>

                <GmapInfoWindow
                  :position="infoWindowPos"
                  :opened="currentPolygonIndex === index"
                  @closeclick="
                    (infoWindowPos = null), (currentPolygonIndex = null)
                  "
                >
                  <div
                    style="background-color: #F8F9FA; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.2);"
                  >
                    <p style="margin: 0; color: #6c757d;">
                      Soil Moisture: {{ poly.properties }}
                    </p>
                  </div>
                </GmapInfoWindow>
              </div>

              <!-- Node Markers - Loaded from API -->
              <!-- Markers are created directly using Google Maps API in createGoogleMarkers() -->
              <!-- No need for GmapMarker components here -->
              
              <GmapPolyline
                :path="polylinePath"
                :options="{
                  strokeColor: '#fcf003',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                }"
              />
              
            </GmapMap>



            <div v-show="polygons_satte.length > 0">
              <div class="map-profondeur">
                <button
                  class="map-button-profondeur"
                  :class="{ 'active-button': profendeur === '10 cm' }"
                  @click="selectButtonprof('10 cm')"
                >
                  <i class="fas fa-ruler-vertical"></i> 10 cm
                </button>

                <button
                  class="map-button-profondeur"
                  :class="{ 'active-button': profendeur === '25 cm' }"
                  @click="selectButtonprof('25 cm')"
                >
                  <i class="fas fa-ruler-vertical"></i> 25 cm
                </button>

                <button
                  class="map-button-profondeur"
                  :class="{ 'active-button': profendeur === '40 cm' }"
                  @click="selectButtonprof('40 cm')"
                >
                  <i class="fas fa-ruler-vertical"></i> 40 cm
                </button>

                <button
                  class="map-button-profondeur"
                  :class="{ 'active-button': profendeur === '55 cm' }"
                  @click="selectButtonprof('55 cm')"
                >
                  <i class="fas fa-ruler-vertical"></i> 55 cm
                </button>
              </div>

              <template>
                <div class="chart-controls">
                  <div
                    class="map-check"
                    :class="{ checked: checkboxchartet0 }"
                    @click="
                      (checkboxchartet0 = !checkboxchartet0),
                        (checkboxchart = false)
                    "
                  >
                    <i
                      :class="
                        checkboxchartet0
                          ? 'fas fa-check-square'
                          : 'far fa-square'
                      "
                    ></i>
                    <span class="label-text"> ET0</span>
                  </div>

                  <div
                    class="map-check"
                    :class="{ checked: checkboxchart }"
                    @click="
                      (checkboxchart = !checkboxchart),
                        (checkboxchartet0 = false)
                    "
                  >
                    <i
                      :class="
                        checkboxchart ? 'fas fa-check-square' : 'far fa-square'
                      "
                    ></i>
                    <span class="label-text"> Évolution</span>
                  </div>
                </div>
              </template>

              <div
                v-show="checkboxchart"
                id="chartContainer"
                style="position: absolute; top: 5rem; left: 6rem; width: 450px; height: 230px; z-index: 2;"
              >
                <CChartLine
                  :datasets="defaultDatasets"
                  :options="defaultOptions"
                  :labels="labels"
                />
              </div>

              <div
                v-show="checkboxchartet0"
                id="chartContainer"
                style="position: absolute; top: 5rem; left: 6rem; width: 450px; height: 230px; z-index: 2;"
              >
                <CChartLine
                  :datasets="defaultDatasetset0"
                  :options="defaultOptionset0"
                  :labels="labelset0"
                />
              </div>

              <div class="map-controls">
                <button
                  class="map-button"
                  :class="{ 'active-button': activeButton === 'Absolu' }"
                  @click="selectButton('Absolu')"
                >
                  <i class="fas fa-arrows-alt-h"></i> Absolu
                </button>

                <button
                  class="map-button"
                  :class="{ 'active-button': activeButton === 'Relatif' }"
                  @click="selectButton('Relatif')"
                >
                  <i class="fas fa-crosshairs"></i> Relatif
                </button>
              </div>

              <div id="gradient-bar" v-show="activeButton === 'Absolu'">
                <div class="label-top">Humidité élevée</div>
                <div class="bar-container">
                  <div class="value">100%</div>
                  <div class="value">83%</div>
                  <div class="value">67%</div>
                  <div class="value">50%</div>
                  <div class="value">33%</div>
                  <div class="value">17%</div>
                  <div class="value">0%</div>
                </div>
                <div class="label-bottom">Humidité faible</div>
              </div>

              <div
                id="gradient-barbarminmax"
                v-show="activeButton === 'Relatif'"
              >
                <div class="label-top">Humidité élevée</div>

                <div class="bar-container">
                  <div class="valueminmax">{{ VALUE_MAX }}%</div>
                  <div class="valueminmax">
                    {{averageValue}}%
                  </div>
                  <div class="valueminmax">{{ VALUE_MIN }}%</div>
                </div>

                <div class="label-bottom">Humidité faible</div>
              </div>

              <div class="map-start">
                <button
                  class="map-button"
                  :class="{ 'active-button': playing }"
                  @click="play_show()"
                >
                  <i :class="playing ? 'fas fa-pause' : 'fas fa-play'"></i>

                  <span>{{ playing ? "  Stop" : "  Début" }}</span>
                </button>
              </div>

            </div>
            <button
            v-if="clickedPoints.length > 0"
              class="map-action-button map-delete-button"
              @click="deleteLastPoint"
            >
                <i class='fas fa-trash'></i>
            </button>
            <button
            v-if="clickedPoints.length > 2"
              class="map-action-button map-save-button"
              @click="openModal"
            >
              <i class='fas fa-save'></i>
            </button>

          </v-card>
          <div
            class="carousel-wrapper"
            style="position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; margin-bottom: 9px;"
          >
            <div class="container">
              <div class="scrolling-wrapper">
                <div
                  class="card1"
                  @click="handleCardClick(item)"
                  v-for="(item, index) in carouselItems"
                  :key="index"
                  :class="{ 'selected-card': selectedCard === item.key }"
                >
                  <div class="card1-body">
                    <p
                      class="card1-title"
                      :class="{ 'selected-text': selectedCard === item.key }"
                    >
                      {{ item.title }}
                    </p>
                    <p
                      class="card1-text"
                      :class="{ 'selected-text': selectedCard === item.key }"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                  <img
                    :src="item.image"
                    class="card1-img-top"
                    alt="Card Image"
                    style="width: 26px; margin-bottom: 10px;"
                  />
                </div>
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
      </div>
    </div>
    <polygon-modal :show="showModal" :polygonData="currentPolygon" @close="showModal = false" @save="handleSavePolygon"></polygon-modal>
  </div>
</template>

<script>
import router from "@/routes";
import { nodeService, parcelService, sensorService } from "@/services/api/index";
import isEmpty from "@/outils/isEmpty";
import CChartLine from "@/components/CChartLine.vue";
import { Carousel, Slide } from "vue-carousel";
import PolygonModal from '../components/PolygonModal.vue';

// Note: Google Maps est chargé automatiquement par le composant GmapMap

export default {
  components: {
    CChartLine,
    Carousel,
    Slide,
    PolygonModal,
  },
  data() {
    return {
      activeClick:false,
      showModal: false,
      currentPolygon: null,
      checkboxchartet0: false,
      checkboxchart: false,
      defaultDatasetset0: [
        {
          label: "ET0",
          data: [],
          borderColor: "#40E0D0",
        },
      ],
      labelset0: [],
      defaultDatasets: [
        {
          label: "Humidité à 10 cm", // Name of your first value
          data: [], // Your array of first values
          borderColor: "#f87979", // You can customize the color and other parameters of each line
        },
        {
          label: "Humidité à 25 cm", // Name of your second value
          data: [], // Your array of second values
          borderColor: "#7c79f8",
        },
        {
          label: "Humidité à 40 cm", // Name of your third value
          data: [], // Your array of third values
          borderColor: "#79f883",
        },
        {
          label: "Humidité à 55 cm", // Name of your fourth value
          data: [], // Your array of fourth values
          borderColor: "#f8d279",
        },
      ],
      labels: [],

      defaultOptions: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            ticks: {
              beginAtZero: true,
              color: "white", // Change the color of the x-axis labels (Chart.js v4)
              font: {
                size: 14, // Change the font size of the x-axis labels
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Change the grid lines color (Chart.js v4)
            },
          },
          y: {
            ticks: {
              beginAtZero: true,
              color: "white", // Change the color of the y-axis labels (Chart.js v4)
              font: {
                size: 14, // Change the font size of the y-axis labels
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Change the grid lines color (Chart.js v4)
            },
          },
        },
        elements: {
          line: {
            tension: 0.1,
            borderColor: "white", // Change the line color
            borderWidth: 2,
          },
          point: {
            backgroundColor: "white", // Change the point color
          },
        },
        legend: {
          labels: {
            fontColor: "white", // Change the legend color
            fontSize: 14,
          },
        },
      },
      defaultOptionset0: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Évapotranspiration mm/jour",
            color: "white", // adjust as needed (Chart.js v4)
            font: {
              size: 18,
              family: "'San Francisco', Arial, sans-serif", // adjust as needed
            },
          },
          legend: {
            labels: {
              color: "white", // Change the legend color (Chart.js v4)
              font: {
                size: 14,
              },
            },
          },
        },

        scales: {
          x: {
            ticks: {
              beginAtZero: true,
              color: "white", // Change the color of the x-axis labels (Chart.js v4)
              font: {
                size: 12, // Change the font size of the x-axis labels
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)", // Change the grid lines color (Chart.js v4)
            },
          },
          y: {
            ticks: {
              beginAtZero: false,
              color: "white", // Change the color of the y-axis labels (Chart.js v4)
              font: {
                size: 12, // Change the font size of the y-axis labels
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 1)", // Change the grid lines color (Chart.js v4)
            },
          },
        },
        elements: {
          line: {
            tension: 0.1,
            borderColor: "#FF0000", // Change the line color
            borderWidth: 2,
          },
          point: {
            backgroundColor: "white", // Change the point color
          },
        },
      },
      nodes: null,
      edit_active: false,
      stop_position: 0,
      playing: false,
      VALUE_MAX: 1,
      VALUE_MIN: 1,
      activeButton: "Absolu",
      profendeur: "10 cm",
      itemselect: null,
      loadingMarker: {
        position: { lat: 0, lng: 0 },
        icon: "",
      },
      mapHeight: null,
      selectedCard: null,
      carouselItems: [],
      list_polygonsatt: [],
      infoWindowPos: null,
      currentPolygonIndex: null,
      polygons_satte: [],
      polygons: [],
      polygons_initiale: [],
      newpath_tosave: [],
      polygons_selecionne: null,
      center: { lat: 32, lng: -7 },
      markers: [],
      googleMarkers: [], // Array to store Google Maps Marker instances
      markerInfoWindow: null, // InfoWindow for marker hover
      mapInstance: null, // Google Maps instance
      loadingMarkers: false,
      _debugLogged: false, // Debug flag to log node structure once
      markersadd: [],
      p1:"",
      p2:"",
      p3:"",
      p4:"",
      p5:"",
      p6:"",
      nbr_port:"",
      prf:"",
      clickedPoints: [],
      polylinePath: [],
      polygonPaths: [],
    };
  },
  computed: {
    averageValue() {
      const min = parseFloat(this.VALUE_MIN);
      const max = parseFloat(this.VALUE_MAX);
      if (isNaN(min) || isNaN(max)) return 0;
      return ((min + max) / 2).toFixed(1);
    },
    validMarkers() {
      const valid = this.markers.filter(marker => 
        marker && 
        marker.position && 
        typeof marker.position.lat === 'number' && 
        typeof marker.position.lng === 'number' &&
        !isNaN(marker.position.lat) &&
        !isNaN(marker.position.lng)
      );
      return valid;
    },
  },
    watch: {
    markers: {
      handler(newMarkers) {
        // Create markers when array changes and map is ready
        if (this.mapInstance && newMarkers.length > 0) {
          this.$nextTick(() => {
            this.createGoogleMarkers();
            this.zoomToMarkers();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    mapOptions() {
      return {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
      };
    },
  },
  methods: {
    handleMapClick(event) {
    if (this.activeClick) {
      this.draw(event);
      }
    },
    AddParcel()
    {
      this.activeClick = !this.activeClick;
      if(this.activeClick == false)
      {
        this.clickedPoints = [];
        this.clickedPoints= [];
        this.polylinePath= [];
        this.polygonPaths= [];
      }
    },
    importData() {
      // TODO: Implement import functionality
    },
    openModal(){
      this.currentPolygon = [];
      this.currentPolygon = this.clickedPoints;
      this.showModal = true;
    },
    handleSavePolygon(polygonDetails) {
      this.showModal = false;
    },

    getPolygonCenter(coords) {
      let totalLat = 0;
      let totalLng = 0;

      for (const coord of coords) {
        totalLat += coord.lat;
        totalLng += coord.lng;
      }

      return { lat: totalLat / coords.length, lng: totalLng / coords.length };
    },

    onPolygonDragEnd(mvcArray, item) {
      let polygons_edited = this.polygons.filter((p) => p._id == item._id);
      let paths = [];
      for (let i = 0; i < mvcArray.getLength(); i++) {
        let path = [];
        for (let j = 0; j < mvcArray.getAt(i).getLength(); j++) {
          let point = mvcArray.getAt(i).getAt(j);
          path.push({ lat: point.lat(), lng: point.lng() });
        }
        paths.push(path);
      }
      //  polygons_edited[0].poly[0].coord = paths;
      this.newpath_tosave = paths;
      this.polygons_selecionne = polygons_edited;
    },

    oneditbuttonclick() {
      if (this.edit_active) {
        this.sauvgardeEdit();
      } else {
        this.$toast.info("Cliquez pour modifier la parcelle", {
          position: "bottom-right",
          timeout: 2200,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          showCloseButtonOnHover: true,
          hideProgressBar: false,
          closeButton: "button",
          icon: "fas fa-edit",
        });
      }

      this.edit_active = !this.edit_active;
    },

    sauvgardeEdit() {
      if (this.newpath_tosave.length == 0) {
        if (this.polygons_selecionne)
          this.polygons_selecionne[0].poly[0].edit = false;
        return;
      }

      let id = this.polygons_selecionne[0]._id;
      let details = this.polygons_selecionne[0];
      let obj = [];
      this.newpath_tosave[0].map((item) =>
        obj.push({
          latitude: item.lat,
          longitude: item.lng,
        })
      );
      details.poly[0].coord = [];
      details.poly[0].coord = [obj];
      nodeService.editNode(id, details)
        .then((response) => {
          this.$toast.success("Enregistrement réussi !", {
            position: "bottom-right",
            timeout: 2200,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            showCloseButtonOnHover: true,
            hideProgressBar: false,
            closeButton: "button",
            icon: "fas fa-check-circle",
          });

          this.newpath_tosave = [];

          this.polygons_selecionne[0].poly[0].edit = false;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      // this.polygons = JSON.parse(JSON.stringify(this.polygons_initiale));
    },

    play_show() {
      if (this.playing) {
        this.playing = false;
        return;
      }

      this.playing = true;

      if (this.stop_position <= 0)
        this.stop_position = this.carouselItems.length - 1;

      let i = this.stop_position;
      const playNext = () => {
        if (i >= 0 && this.playing) {
          this.handleCardClick(this.carouselItems[i]);
          i--;
          setTimeout(playNext, 550); // Adjust time delay as needed
        }
        if (i < 0) this.playing = false;
        this.stop_position = i;
      };
      playNext();
    },

    selectButton(button) {
      this.activeButton = button;
      // Add any additional logic for when a button is clicked...
    },

    selectButtonprof(button) {
      this.profendeur = button;
      // Add any additional logic for when a button is clicked...

      this.handleCardClick(this.itemselect);
    },

    handleCardClick(item) 
    {
      let temp = null;
      if (this.profendeur === "10 cm") 
        temp = item.id;
      else if (this.profendeur === "25 cm") 
        temp = item.id1;
      else if (this.profendeur === "40 cm") 
        temp = item.id2;
      else if (this.profendeur === "55 cm") 
        temp = item.id3;

      this.itemselect = item;

      this.selectedCard = item.key;
      // Use the `id` as needed
      this.polygons_satte = [];

      this.polygons_satte = this.convertGeoJsonToGmapPolygon(temp);
      
    },

    getPolygonOptions() {
      let strokeColor;

      // if (poly.isHovered) {
        strokeColor = this.edit_active ? "#ff7300" : "#eaff00";
      // } else {
      //   strokeColor = "#0093de";
      // }

      return {
        fillColor: 'rgba(252, 252, 144, 0.5)',
        fillOpacity: 1,
        strokeColor: strokeColor,
        strokeWeight:  4,
        clickable: true,
        editable: false,
        draggable: false,
        zIndex: 1,
      };
    },

    // getPolygonOptions(poly) {
    //   let strokeColor;

    //   if (poly.isHovered) {
    //     strokeColor = this.edit_active ? "#ff7300" : "#eaff00";
    //   } else {
    //     strokeColor = "#0093de";
    //   }

    //   return {
    //     fillColor: poly.color,
    //     fillOpacity: 1,
    //     strokeColor: strokeColor,
    //     strokeWeight: poly.isHovered ? 4 : 1,
    //     clickable: true,
    //     editable: poly.edit,
    //     draggable: poly.edit,
    //     zIndex: 1,
    //   };
    // },

    getPolygonOptions2(poly) {
      return {
        fillColor:
          this.activeButton === "Absolu" ? poly.color : poly.color_min_max,
        fillOpacity: 1,
        strokeColor: poly.isHovered ? "#eaff00" : "#0093de",
        strokeWeight: poly.isHovered ? 0.5 : 0,
        clickable: true,
        editable: false,
        zIndex: 1,
      };
    },

    onMouseoverPolygon(poly) {
      // In Vue 3, direct property assignment works for reactivity
      poly.isHovered = true;
    },

    onMouseoutPolygon(poly) {
      // In Vue 3, direct property assignment works for reactivity
      poly.isHovered = false;
    },

    onPolygonMouseOver(poly) {
      // In Vue 3, direct property assignment works for reactivity
      poly.isHovered = true;
    },

    onPolygonMouseOut(poly) {
      // In Vue 3, direct property assignment works for reactivity
      poly.isHovered = false;
    },

    draw(event) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      this.clickedPoints.push({ position: { lat: latitude, lng: longitude } });

      if (this.clickedPoints.length > 1) {
        this.drawPolyline();
      }
      if (this.clickedPoints.length > 2) {
        this.drawPolygon();
        // let polygonData = { /* ... */ };
        // this.openModal(this.clickedPoints);
      }
    },

    drawPolyline() {
      const path = this.clickedPoints.map((marker) => marker.position);
      this.polylinePath = path;
    },

    drawPolygon() {
      this.polygonPaths = this.clickedPoints.map((marker) => marker.position);
    },

    deleteLastPoint() {
      this.clickedPoints.pop();
      this.polylinePath = this.clickedPoints.map((marker) => marker.position);
      this.polygonPaths = this.clickedPoints.map((marker) => marker.position);
    },

    onclearmap() {
      this.edit_active = false;

      this.carouselItems = [];
      this.polygons_satte = [];
      this.polygons = [];
      // this.polygons_initiale = [];
      this.stop_position = 0;
      /* Node.getNodesAquaedge().then((res) => {
        this.nodes = res;
        const polygonsTemp = res.map((item) => {
          item.poly = item.poly.map((poly) => {
            poly.coord = poly.coord[0].map((coord) => ({
              lat: coord.latitude,
              lng: coord.longitude,
            }));
            return poly;
          });
          return item;
        }); 
        this.polygons = polygonsTemp;
         this.polygons_initiale = JSON.parse(JSON.stringify(polygonsTemp));
        this.zoom_entier();
      }); */

      this.polygons = JSON.parse(JSON.stringify(this.polygons_initiale));

      // Vérifier que google est disponible avant d'appeler zoom_entier
      if (typeof google !== 'undefined' && google.maps) {
        this.$nextTick(() => {
          this.zoom_entier();
        });
      }
    },

    toggleInfoWindow(index, event) {
      this.infoWindowPos = event.latLng;
      this.currentPolygonIndex = index;
    },
    processCoordinates(feature) {
      let polygonsCoords = [];

      const processSinglePolygon = (polygon) => {
        return polygon
          .map((coordPair) => {
            const lat = parseFloat(coordPair[1]);
            const lng = parseFloat(coordPair[0]);

            if (!isFinite(lat) || !isFinite(lng)) {
              return null;
            }
            return { lat, lng };
          })
          .filter((coord) => coord !== null);
      };

      // Check if it's a MultiPolygon (nested arrays)
      if (
        Array.isArray(feature.geometry.coordinates[0][0]) &&
        feature.geometry.coordinates[0][0].length > 2
      ) {
        // Handle as MultiPolygon
        feature.geometry.coordinates[0].forEach((polygon) => {
          const processedCoords = processSinglePolygon(polygon);

          if (processedCoords.length > 0) {
            polygonsCoords.push(processedCoords);
          }
        });
      } else {
        // Handle as single Polygon
        const processedCoords = processSinglePolygon(
          feature.geometry.coordinates[0]
        );
        if (processedCoords.length > 0) {
          polygonsCoords.push(processedCoords);
        }
      }

      return polygonsCoords;
    },
    convertGeoJsonToGmapPolygon(geoJson) {
      let i = 1;

      return geoJson.features.map((feature, index) => {
        /*        console.log('feature' + index)
        console.log("soil_moisture" +  feature.properties["soil_moisture"].toFixed(2))
        console.log(feature.geometry.coordinates[0])
 */

        const coords = this.processCoordinates(feature);

        /* 
         const coords = feature.geometry.coordinates[0].map((coordPair) => 
         {
          const lat = parseFloat(coordPair[1]);
          const lng = parseFloat(coordPair[0]); 

          if (!isFinite(lat) || !isFinite(lng)) 
          {
            console.error('Invalid coordinate:', coordPair);
             return null;
          }  
          return { lat, lng };
        }).filter(coord => coord !== null); */

        const color = feature.properties.color;
        const color_min_max = feature.properties.color_min_max;

        let properties = feature.properties["soil_moisture"];

        if (this.profendeur === "10 cm")
          properties = feature.properties["soil_moisture"].toFixed(2);
        else if (this.profendeur === "25 cm")
          properties = feature.properties["soil_moisture"].toFixed(2);
        else if (this.profendeur === "40 cm")
          properties = feature.properties["soil_moisture"].toFixed(2);
        else if (this.profendeur === "55 cm")
          properties = feature.properties["soil_moisture"].toFixed(2);

        const min = feature.properties["min_soil_moisture"].toFixed(1);
        const max = feature.properties["max_soil_moisture"].toFixed(1);

        this.VALUE_MAX = max;
        this.VALUE_MIN = min;
        i++;
        return { coords, color, color_min_max, properties };
      });
    },

    getetodata() {
      let idParcel = this.polygons_selecionne[0]._id;
      // Get today's date
      const datef = new Date();
      // Get the date 20 days ago
      const dated = new Date();
      dated.setDate(dated.getDate() - 20);
      // Format the dates to yyyy-mm-dd
      const formattedDatef = `${datef.getFullYear()}-${datef.getMonth() +
        1}-${datef.getDate()}`;
      const formattedDated = `${dated.getFullYear()}-${dated.getMonth() +
        1}-${dated.getDate()}`;
      sensorService.getET0(idParcel, formattedDated, formattedDatef).then((result) => {
        const res = result.data || [];
        res.forEach((data) => {
          let date = new Date(data.Date);
          const day = date.getDate();
          const monthshort = date.toLocaleString("fr-FR", {
            month: "short",
          });
          this.labelset0.push(`${day} ${monthshort}`);
          this.defaultDatasetset0[0].data.push(data.value.toFixed(1));
        });
      });
    },

    getimagesattlite(id, n_days, date) {
      
      this.defaultDatasets[0].data = [];
      this.defaultDatasets[1].data = [];
      this.defaultDatasets[2].data = [];
      this.defaultDatasets[3].data = [];
      this.labels = [];

      const getSoilMoistureColorminmax = (min, max, current) => {
        // Logique pour déterminer la couleur
        // Vous pouvez ajuster cette logique en fonction de vos besoins spécifiques
        const range = max - min;
        const normalizedValue = (current - min) / range;

        if (normalizedValue < 0.33) {
          return 'red'; // Exemple pour la partie basse du spectre
        } else if (normalizedValue >= 0.33 && normalizedValue < 0.66) {
          return 'green'; // Exemple pour la partie moyenne
        } else {
          return '#0583D2'; // Exemple pour la partie haute
        }
      };

      const getSoilMoistureColor = (soilMoisture) => {
        if (soilMoisture < 10) {
          return "red"; // Rouge
        } else if (soilMoisture >= 20 && soilMoisture < 40) {
          return "orange"; // Orange
        } else if (soilMoisture >= 40 && soilMoisture < 50) {
          return "yellow"; // Jaune
        } else if (soilMoisture >= 50 && soilMoisture < 60) {
          return "green"; // Vert
        } else if (soilMoisture >= 60 && soilMoisture < 70) {
          return "#B8E3FF";
        } else if (soilMoisture >= 70 && soilMoisture < 80) {
          return "#0583D2"; // Bleu
        } else {
          return "#16558F"; // Bleu Foncé
        }
      };

      
      sensorService.getSoilMoisture(id).then((result) => {
        const res = result.data || [];
        this.loadingMarker.position = { lat: 0, lng: 0 };
        this.loadingMarker.icon = "";

        this.list_polygonsatt = res;

        let index = 1;
        this.list_polygonsatt.forEach((polygon) => {
          polygon.imageObject = JSON.parse(polygon.imageObject);

          const depth1_map = polygon.imageObject.depth1_map;
          const depth2_map = polygon.imageObject.depth2_map;
          const depth3_map = polygon.imageObject.depth3_map;
          const depth4_map = polygon.imageObject.depth4_map;
          let soilMoisture;

          depth1_map.features.forEach((feature) => {
            soilMoisture = feature.properties.soil_moisture;
            const minMoisture = feature.properties.min_soil_moisture;
            const maxMoisture = feature.properties.max_soil_moisture;
            feature.properties["color_min_max"] = getSoilMoistureColorminmax(
              minMoisture,
              maxMoisture,
              soilMoisture
            );
            feature.properties["color"] = getSoilMoistureColor(soilMoisture);
          });

          depth2_map.features.forEach((feature) => {
            soilMoisture = feature.properties.soil_moisture;
            feature.properties["color"] = getSoilMoistureColor(soilMoisture);
            const minMoisture = feature.properties.min_soil_moisture;
            const maxMoisture = feature.properties.max_soil_moisture;
            feature.properties["color_min_max"] = getSoilMoistureColorminmax(
              minMoisture,
              maxMoisture,
              soilMoisture
            );
          });
          depth3_map.features.forEach((feature) => {
            soilMoisture = feature.properties.soil_moisture;
            feature.properties["color"] = getSoilMoistureColor(soilMoisture);

            const minMoisture = feature.properties.min_soil_moisture;
            const maxMoisture = feature.properties.max_soil_moisture;
            feature.properties["color_min_max"] = getSoilMoistureColorminmax(
              minMoisture,
              maxMoisture,
              soilMoisture
            );
          });
          depth4_map.features.forEach((feature) => {
            soilMoisture = feature.properties.soil_moisture;
            feature.properties["color"] = getSoilMoistureColor(soilMoisture);

            const minMoisture = feature.properties.min_soil_moisture;
            const maxMoisture = feature.properties.max_soil_moisture;
            feature.properties["color_min_max"] = getSoilMoistureColorminmax(
              minMoisture,
              maxMoisture,
              soilMoisture
            );
          });

          const timestep = polygon.Datetime;

          this.defaultDatasets[0].data.push(
            polygon.imageObject.depth1_avg.toFixed(0)
          );

          if (polygon.imageObject.depth2_avg)
            this.defaultDatasets[1].data.push(
              polygon.imageObject.depth2_avg.toFixed(0)
            );

          if (polygon.imageObject.depth3_avg)
            this.defaultDatasets[2].data.push(
              polygon.imageObject.depth3_avg.toFixed(0)
            );

          if (polygon.imageObject.depth4_avg)
            this.defaultDatasets[3].data.push(
              polygon.imageObject.depth4_avg.toFixed(0)
            );

          const date = new Date(timestep);

          const hour = date.getHours();
          const day = date.getDate();

          const monthshort = date.toLocaleString("fr-FR", { month: "short" });

          const month = date.toLocaleString("fr-FR", { month: "long" });

          this.labels.push(`${day} ${monthshort} ${hour}:00`);

          // Set the image based on the hour of the day
          let image = "";
          if (hour >= 1 && hour < 11) {
            image = require("../assets/icons/sun.png");
          } else if (hour >= 11 && hour < 18) {
            image = require("../assets/icons/dawn.png");
          } else if (hour >= 18 && hour <= 23) {
            image = require("../assets/icons/moon.png");
          }

          index++;
          this.carouselItems.push({
            key: index,
            id: depth1_map,
            id1: depth2_map,
            id2: depth3_map,
            id3: depth4_map,
            title: `${day}`,
            description: month,
            image: image,
          });
        });
        this.carouselItems.reverse();
        this.labels;
        this.defaultDatasets[0].data;
        this.defaultDatasets[1].data;
        this.defaultDatasets[2].data;
        this.defaultDatasets[3].data;

        this.handleCardClick(this.carouselItems[0]);
      });
    },
    
    onPolygonClick(polygon) {
      if (this.edit_active == true) {
        if (this.polygons_selecionne) {
          if (this.polygons_selecionne[0]) {
            this.polygons_selecionne[0].poly[0].edit = false;
            this.sauvgardeEdit();
          }
        }

        polygon.poly[0].edit = true;
        this.polygons_selecionne = [polygon];
        return;
      }

      this.stop_position = 0;
      if (this.polygons_selecionne)
        this.onMouseoutPolygon(this.polygons_selecionne[0].poly[0]);
      
      this.carouselItems = [];
      this.polygons_satte = [];
      this.polygons = JSON.parse(JSON.stringify(this.polygons_initiale));
      let center = this.getPolygonCenter(polygon.Coord);
      this.loadingMarker.position = {
        lat: center.lat,
        lng: center.lng,
      }; // set the position of the loading marker
      this.loadingMarker.icon = require("../assets/icons/loading.png"); // set the loading gif as the icon
      const id = polygon._id; // You should store the ID in the polygon object when creating it
      const date = new Date().toISOString().split("T")[0]; // Current date in 'YYYY-MM-DD' format
      const n_days = 10;

      // Filter out the clicked polygon based on its id
      this.polygons_selecionne = this.polygons.filter((p) => p._id == id);
      
      this.getetodata();
      this.getimagesattlite(id, n_days, date);
      this.polygons = this.polygons.filter((p) => p._id !== id);
      let coordinates = this.polygons_selecionne[0].Coord;
      // Calculate bounds of the polygon
      let minLat = coordinates[0].lat;
      let maxLat = coordinates[0].lat;
      let minLng = coordinates[0].lng;
      let maxLng = coordinates[0].lng;
      for (let i = 1; i < coordinates.length; i++) {
        const coord = coordinates[i];
        minLat = Math.min(minLat, coord.lat);
        maxLat = Math.max(maxLat, coord.lat);
        minLng = Math.min(minLng, coord.lng);
        maxLng = Math.max(maxLng, coord.lng);
      }
      // Vérifier que google.maps est disponible
      if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps API not loaded yet');
        return;
      }
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      // Update center
      this.center = { lat: centerLat, lng: centerLng };
      // Zoom to fit polygon in view
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(minLat, minLng),
        new google.maps.LatLng(maxLat, maxLng)
      );
      
      // Attendre que la map soit prête avant d'appeler fitBounds
      if (this.$refs.mapRef) {
        if (this.$refs.mapRef.$mapObject) {
            try {
              this.$refs.mapRef.$mapObject.fitBounds(bounds);
            } catch (err) {
              // Silent fail
            }
          } else if (this.$refs.mapRef.$mapPromise) {
            this.$refs.mapRef.$mapPromise.then((map) => {
              if (map) {
                map.fitBounds(bounds);
              }
            }).catch(() => {
              // Silent fail
            });
        }
      }
    },

    // profilePath(position, id) {
    //   this.$refs.mapRef.$mapPromise.then((map) => {
    //     if (map.getZoom() < 12) {
    //       map.panTo(position);
    //       map.setZoom(12);
    //     } else if (map.getZoom() == 12) {
    //       map.panTo(position);
    //       map.setZoom(18);
    //     } else {
    //       router.push(`/dashboard?id=${id}`);
    //     }
    //   });
    // },
    setMapHeight() {
      // Calculate map height leaving space for header and sidebar
      const windowHeight = window.innerHeight;
      const headerHeight = 120; // Increased to reduce map height more
      const calculatedHeight = windowHeight - headerHeight;
      this.mapHeight = `${calculatedHeight}px`;
    },

    zoom_entier() {
      // Vérifier que google.maps est disponible
      if (typeof google === 'undefined' || !google.maps) {
        return;
      }
      
      if (!this.$refs.mapRef) {
        return;
      }
      
      // Vérifier si $mapObject existe (vue2-google-maps) ou $mapPromise (alternative)
      if (this.$refs.mapRef.$mapObject) {
        try {
          let bounds = new google.maps.LatLngBounds();
          this.polygons.forEach((polygon) => {
            if (polygon.Coord && Array.isArray(polygon.Coord)) {
              polygon.Coord.forEach((path) => {
                if (path && typeof path.lat === 'number' && typeof path.lng === 'number') {
                  bounds.extend(path);
                }
              });
            }
          });
          
          // Vérifier que bounds est valide avant d'appeler fitBounds
            if (!bounds.isEmpty()) {
              this.$refs.mapRef.$mapObject.fitBounds(bounds);
            }
          } catch (err) {
            // Silent fail
          }
        } else if (this.$refs.mapRef.$mapPromise) {
          // Attendre que la map soit prête si on utilise une promesse
          this.$refs.mapRef.$mapPromise.then((map) => {
            if (map) {
              let bounds = new google.maps.LatLngBounds();
              this.polygons.forEach((polygon) => {
                if (polygon.Coord && Array.isArray(polygon.Coord)) {
                  polygon.Coord.forEach((path) => {
                    if (path && typeof path.lat === 'number' && typeof path.lng === 'number') {
                      bounds.extend(path);
                    }
                  });
                }
              });
              if (!bounds.isEmpty()) {
                map.fitBounds(bounds);
              }
            }
          }).catch(() => {
            // Silent fail
          });
        }
    },

    /**
     * Handle marker click - navigate to node details or zoom in
     * @param {Object} position - Marker position {lat, lng}
     * @param {string} id - Node ID
     */
    profilePath(position, id) {
      // Validate inputs
      if (!position || !id) {
        return;
      }

      // Validate position coordinates
      const lat = parseFloat(position.lat);
      const lng = parseFloat(position.lng);
      if (isNaN(lat) || isNaN(lng)) {
        return;
      }

      // Use mapInstance if available
      if (!this.mapInstance || !this.mapInstance.getZoom) {
        return;
      }

      const map = this.mapInstance;
      const zoom = map.getZoom();
      
      // Zoom behavior: zoom in progressively, then navigate to dashboard
      if (zoom < 12) {
        // First click: zoom to level 12
        map.panTo(new google.maps.LatLng(lat, lng));
        map.setZoom(12);
      } else if (zoom === 12) {
        // Second click: zoom to level 18
        map.panTo(new google.maps.LatLng(lat, lng));
        map.setZoom(18);
      } else {
        // Third click: navigate to sensor detail page
        router.push(`/sensor-detail/${id}`);
      }
    },

    /**
     * Navigate to node dashboard with node details (kept for backward compatibility)
     * @param {string} id - Node ID
     */
    async navigateToNodeDashboard(id) {
      try {
        const result = await nodeService.getNodeDetails(id);
        const res = result?.data;
        
        if (res && !isEmpty(res)) {
          // Extract node details
          this.p1 = res.port1 || '';
          this.p2 = res.port2 || '';
          this.p3 = res.port3 || '';
          this.p4 = res.port4 || '';
          this.p5 = res.port5 || '';
          this.p6 = res.port6 || '';
          this.nbr_port = res.nbr_port || 4;
          this.prf = res.profondeur || '';
          
          // Build dashboard URL with parameters
          const params = new URLSearchParams({
            id: id,
            nbr: this.nbr_port.toString(),
            p1: this.p1,
            p2: this.p2,
            p3: this.p3,
            p4: this.p4,
            p5: this.p5,
            p6: this.p6,
            prf: this.prf,
          });
          
          // Determine number of ports based on node ID prefix
          const nodePorts = (id[0] === 'Z' || id[0] === 'z') ? this.nbr_port : 4;
          params.set('nbr', nodePorts.toString());
          
          // Navigate to dashboard
          router.push(`/dashboard?${params.toString()}`);
        }
      } catch (error) {
        console.error('Error fetching node details:', error);
      }
    },

    getPolygonCenter(coords) {
      let x = 0, y = 0, len = coords.length;
      for (let i = 0; i < len; i++) {
        x += coords[i].lat;
        y += coords[i].lng;
      }
      return { lat: x / len, lng: y / len };
    },

    // Handle map ready event
    onMapReady(map) {
      if (this.$refs && this.$refs.mapRef) {
        if (this.$refs.mapRef.$mapObject) {
          this.mapInstance = this.$refs.mapRef.$mapObject;
        } else if (map) {
          this.mapInstance = map;
        } else if (this.$refs.mapRef.$mapPromise) {
          this.$refs.mapRef.$mapPromise.then((mapInstance) => {
            this.mapInstance = mapInstance;
            this.createGoogleMarkers();
          }).catch(() => {
            // Silent fail - map will be available later
          });
        }
        
        // Create markers if map is ready and markers exist
        if (this.mapInstance && this.markers.length > 0) {
          this.$nextTick(() => {
            this.createGoogleMarkers();
            this.zoomToMarkers();
          });
        }
      }
    },
    
    /**
     * Create Google Maps markers directly using the API
     * This is the same method used for other map elements
     */
    createGoogleMarkers() {
      if (!this.mapInstance || typeof google === 'undefined' || !google.maps) {
        return;
      }
      
      // Clear existing markers
      this.clearGoogleMarkers();
      
      // Create new markers
      const validMarkers = this.validMarkers;
      
      validMarkers.forEach((markerData) => {
        try {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(markerData.position.lat, markerData.position.lng),
            map: this.mapInstance,
            title: markerData.title || markerData.id || 'Node',
            clickable: true,
            draggable: false,
            icon: {
              url: require('../assets/icons/ico_marker.png'),
              scaledSize: new google.maps.Size(60, 50),
            }
          });
          
          // Add click listener
          marker.addListener('click', () => {
            this.profilePath(markerData.position, markerData.id);
          });
          
          // Add hover listeners to show info
          marker.addListener('mouseover', () => {
            this.showMarkerInfo(marker, markerData);
          });
          
          marker.addListener('mouseout', () => {
            this.hideMarkerInfo();
          });
          
          this.googleMarkers.push(marker);
        } catch (error) {
          console.error('Error creating marker:', error);
        }
      });
    },
    
    /**
     * Clear all Google Maps markers
     */
    clearGoogleMarkers() {
      // Close any open info window
      this.hideMarkerInfo();
      
      this.googleMarkers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      this.googleMarkers = [];
    },
    
    /**
     * Show info window on marker hover
     */
    showMarkerInfo(marker, markerData) {
      if (!this.mapInstance || typeof google === 'undefined' || !google.maps) {
        return;
      }
      
      // Close existing info window if any
      if (this.markerInfoWindow) {
        this.markerInfoWindow.close();
      }
      
      // Create modern, compact info window content in French
      const content = `
        <div style="
          padding: 0;
          min-width: 200px;
          max-width: 280px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        ">
          <div style="
            background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
            padding: 12px 16px;
            border-radius: 8px 8px 0 0;
            color: white;
          ">
            <h3 style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: white;
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              <span style="font-size: 18px;">📍</span>
              ${markerData.title || markerData.id || 'Nœud'}
            </h3>
          </div>
          <div style="
            padding: 12px 16px;
            background: #ffffff;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #f0f0f0;
            ">
              <span style="
                background: #e8f5e9;
                color: #2e7d32;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.5px;
              ">ID</span>
              <span style="
                font-size: 13px;
                color: #424242;
                font-weight: 500;
              ">${markerData.id || 'N/A'}</span>
            </div>
            ${markerData.nodeData?.farmerName ? `
              <div style="
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f0f0f0;
              ">
                <span style="font-size: 16px;">👤</span>
                <div>
                  <div style="
                    font-size: 11px;
                    color: #757575;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 2px;
                  ">Nom</div>
                  <div style="
                    font-size: 14px;
                    color: #212121;
                    font-weight: 500;
                  ">${markerData.nodeData.farmerName}</div>
                </div>
              </div>
            ` : ''}
            <div style="
              display: flex;
              align-items: flex-start;
              gap: 10px;
              margin-top: 8px;
            ">
              <span style="font-size: 14px; margin-top: 2px;">🌐</span>
              <div>
                <div style="
                  font-size: 11px;
                  color: #757575;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 2px;
                ">Coordonnées</div>
                <div style="
                  font-size: 12px;
                  color: #616161;
                  font-family: 'Courier New', monospace;
                  background: #f5f5f5;
                  padding: 4px 8px;
                  border-radius: 4px;
                  display: inline-block;
                ">
                  ${markerData.position.lat.toFixed(6)}, ${markerData.position.lng.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Create and open info window with modern styling
      this.markerInfoWindow = new google.maps.InfoWindow({
        content: content,
        pixelOffset: new google.maps.Size(0, -10)
      });
      
      this.markerInfoWindow.open(this.mapInstance, marker);
    },
    
    /**
     * Hide marker info window
     */
    hideMarkerInfo() {
      if (this.markerInfoWindow) {
        this.markerInfoWindow.close();
        this.markerInfoWindow = null;
      }
    },

    // Handle bounds changed event
    onBoundsChanged() {
      // Map bounds changed - can be used for future features if needed
    },

    /**
     * Load markers from node data
     * Fetches node data from API and creates markers on the map
     */
    async loadMarkers() {
      try {
        this.loadingMarkers = true;
        
        // Fetch node data from API
        const result = await nodeService.getNodes();
        
        // Check for API errors
        if (result?.error) {
          this.markers = [];
          return;
        }
        
        // Extract nodes data - handle both direct array and wrapped response
        // apiRequest returns { data: response.data, error: null }
        // So result.data should be the array from axios response.data
        let nodesData = [];
        
        if (result?.data) {
          // If result.data exists, use it (could be array or object with array)
          if (Array.isArray(result.data)) {
            nodesData = result.data;
          } else if (result.data.data && Array.isArray(result.data.data)) {
            // Handle nested data structure
            nodesData = result.data.data;
          } else if (result.data.nodes && Array.isArray(result.data.nodes)) {
            // Handle nodes property
            nodesData = result.data.nodes;
          }
        } else if (Array.isArray(result)) {
          // Direct array response
          nodesData = result;
        }
        
        // Validate response is an array
        if (!Array.isArray(nodesData) || nodesData.length === 0) {
          this.markers = [];
          return;
        }
        
        // Process and create markers from node data
        const newMarkers = this.processNodeDataToMarkers(nodesData);
        
        // In Vue 3, direct assignment works for reactivity
        this.markers = newMarkers;
        
        // Auto-zoom to fit all markers if any were loaded
        if (this.markers.length > 0) {
          // Wait for map to be ready before zooming
          this.$nextTick(() => {
            if (this.mapInstance || this.$refs.mapRef) {
              this.zoomToMarkers();
            }
          });
        }
        
      } catch (error) {
        console.error('Error loading markers:', error);
        this.markers = [];
      } finally {
        this.loadingMarkers = false;
      }
    },

    /**
     * Process node data array and convert to marker objects
     * @param {Array} nodesData - Array of node objects from API
     * @returns {Array} Array of marker objects
     */
    processNodeDataToMarkers(nodesData) {
      const markers = [];
      
      for (const node of nodesData) {
        // Validate node object exists
        if (!node || typeof node !== 'object') {
          continue;
        }
        
        // Extract and validate coordinates
        const marker = this.createMarkerFromNode(node);
        
        if (marker) {
          markers.push(marker);
        }
      }
      
      return markers;
    },

    /**
     * Create a marker object from a single node
     * @param {Object} node - Node object from API
     * @returns {Object|null} Marker object or null if invalid
     */
    createMarkerFromNode(node) {
      // Try different possible field names for latitude/longitude
      const lat = this.extractCoordinate(node, ['latitude', 'lat', 'Latitude', 'Lat']);
      const lng = this.extractCoordinate(node, ['longitude', 'lng', 'Longitude', 'Lng', 'lon']);
      
      // Validate coordinates
      if (lat === null || lng === null) {
        return null;
      }
      
      // Validate coordinate ranges (latitude: -90 to 90, longitude: -180 to 180)
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return null;
      }
      
      // Create marker object
      const marker = {
        position: {
          lat: lat,
          lng: lng,
        },
        title: node.FarmerName || node.farmerName || node.name || node.NodeId || node.id || 'Node',
        id: node.NodeId || node.id || node._id || '',
        // Additional node data can be stored here if needed
        nodeData: {
          farmerName: node.FarmerName || node.farmerName,
          nodeId: node.NodeId || node.id,
          // Add other fields as needed
        },
      };
      
      return marker;
    },

    /**
     * Extract coordinate value from node object, trying multiple field names
     * @param {Object} node - Node object
     * @param {Array<string>} fieldNames - Array of possible field names to try
     * @returns {number|null} Coordinate value or null if not found/invalid
     */
    extractCoordinate(node, fieldNames) {
      for (const fieldName of fieldNames) {
        if (node[fieldName] !== undefined && node[fieldName] !== null) {
          const value = parseFloat(node[fieldName]);
          if (!isNaN(value) && isFinite(value)) {
            return value;
          }
        }
      }
      return null;
    },

    // Zoom to fit all markers - NO RETRY LOGIC
    zoomToMarkers() {
      // Early returns - no retries
      if (!this.markers || this.markers.length === 0) return;
      if (typeof google === 'undefined' || !google.maps) return;
      if (!this.mapInstance) return;

      const bounds = new google.maps.LatLngBounds();
      
      // Add all marker positions to bounds
      this.markers.forEach((marker) => {
        if (marker && marker.position && marker.position.lat && marker.position.lng) {
          const lat = parseFloat(marker.position.lat);
          const lng = parseFloat(marker.position.lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend(new google.maps.LatLng(lat, lng));
          }
        }
      });

      // Also add polygon centers if available
      if (this.polygons && this.polygons.length > 0) {
        this.polygons.forEach((polygon) => {
          if (polygon.Coord && Array.isArray(polygon.Coord) && polygon.Coord.length > 0) {
            const center = this.getPolygonCenter(polygon.Coord);
            bounds.extend(new google.maps.LatLng(center.lat, center.lng));
          }
        });
      }

      // Fit bounds to map - only if map instance exists
      if (!bounds.isEmpty() && this.mapInstance && this.mapInstance.fitBounds) {
        try {
          this.mapInstance.fitBounds(bounds);
          google.maps.event.addListenerOnce(this.mapInstance, 'bounds_changed', () => {
            try {
              const zoom = this.mapInstance.getZoom();
              if (zoom && zoom > 15) {
                this.mapInstance.setZoom(15);
              }
            } catch (e) {
              // Ignore zoom errors
            }
          });
        } catch (err) {
          // Silent fail - map might not be fully ready
        }
      }
    },
  },
  mounted() {
    this.setMapHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.setMapHeight);
    // Clean up Google Maps markers and info window
    this.hideMarkerInfo();
    this.clearGoogleMarkers();
  },
  async created() {
    // Ne pas charger Google Maps ici - le composant GmapMap le fera
    // Cela évite de charger Google Maps plusieurs fois
    
    parcelService.getParcel()
      .then((result) => {
        const res = result.data || [];
        // Vérifier que res est un tableau valide
        if (!Array.isArray(res) || res.length === 0) {
          this.polygons = [];
          this.polygons_initiale = [];
          return;
        }
      
      this.nodes = res;
      let polygonsTemp = res.map((item) => {
        // Gérer deux structures différentes : Coord (parcelles) ou poly (nodes)
        if (item.Coord && Array.isArray(item.Coord) && item.Coord.length > 0) {
          // Format parcelles : utiliser Coord
          item.Coord = item.Coord.map((position) => {
            // Vérifier que position est un tableau avec au moins 2 éléments
            if (!Array.isArray(position) || position.length < 2) {
              return { lat: 0, lng: 0 };
            }
            return {
              lat: position[0],
              lng: position[1],
            };
          });
          return item;
        } else if (item.poly && Array.isArray(item.poly) && item.poly.length > 0) {
          // Format nodes : utiliser poly
          // Convertir poly en format Coord pour compatibilité
          item.Coord = item.poly.map((poly) => {
            if (poly.coord && Array.isArray(poly.coord) && poly.coord.length > 0) {
              // Si coord est un tableau de tableaux
              if (Array.isArray(poly.coord[0])) {
                return poly.coord[0].map((coord) => {
                  if (coord.latitude !== undefined && coord.longitude !== undefined) {
                    return { lat: coord.latitude, lng: coord.longitude };
                  } else if (Array.isArray(coord) && coord.length >= 2) {
                    return { lat: coord[0], lng: coord[1] };
                  }
                  return { lat: 0, lng: 0 };
                });
              } else {
                // Si coord est un tableau simple
                return poly.coord.map((coord) => {
                  if (coord.latitude !== undefined && coord.longitude !== undefined) {
                    return { lat: coord.latitude, lng: coord.longitude };
                  } else if (Array.isArray(coord) && coord.length >= 2) {
                    return { lat: coord[0], lng: coord[1] };
                  }
                  return { lat: 0, lng: 0 };
                });
              }
            }
            return [];
          }).flat().filter(coord => coord.lat !== 0 || coord.lng !== 0);
          
          // Si Coord est vide après conversion, essayer d'utiliser latitude/longitude
          if (item.Coord.length === 0 && item.latitude && item.longitude) {
            item.Coord = [{ lat: item.latitude, lng: item.longitude }];
          }
          
          return item.Coord.length > 0 ? item : null;
        } else if (item.latitude && item.longitude) {
          // Si seulement latitude/longitude disponibles, créer un point
          item.Coord = [{ lat: item.latitude, lng: item.longitude }];
          return item;
        } else {
          // Aucune donnée de coordonnées disponible
          return null;
        }
      }).filter(item => item !== null); // Filtrer les items invalides
      
      this.polygons = polygonsTemp;
      this.polygons_initiale = JSON.parse(JSON.stringify(polygonsTemp));
      
      // Attendre que google soit disponible avant d'appeler zoom_entier
      if (typeof google !== 'undefined' && google.maps && polygonsTemp.length > 0) {
        this.$nextTick(() => {
          this.zoom_entier();
        });
      }
    }).catch(() => {
      this.polygons = [];
      this.polygons_initiale = [];
    });
    // Node.getNodesAquaedge().then((res) => {
    //   this.nodes = res;
    //   let polygonsTemp = res.map((item) => {
    //     item.poly = item.poly.map((poly) => {
    //       poly.coord = poly.coord[0].map((coord) => ({
    //         lat: coord.latitude,
    //         lng: coord.longitude,
    //       }));
    //       return poly;
    //     });
    //     item.poly[0].edit = false;
    //     return item;
    //   });

    //   console.log(polygonsTemp);

    //   this.polygons = polygonsTemp;
    //   // this.polygons_initiale = polygonsTemp;

    //   this.polygons_initiale = JSON.parse(JSON.stringify(polygonsTemp));

    //   this.zoom_entier();
    // });

    // Load markers from node data
    try {
      await this.loadMarkers();
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  },
};
</script>
<style>
/* Map Type Control - Normal size buttons */
.gm-style .gm-style-cc {
  display: none !important;
}

button[title="Afficher les images satellite"],
button[title="Afficher un plan de ville"],
button[aria-label="Afficher les images satellite"],
button[aria-label="Afficher un plan de ville"] {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
  font-size: 11px !important;
  color: rgba(46, 125, 50, 0.9) !important;
  background: #ffffff !important;
  border: 1.5px solid rgba(46, 125, 50, 0.9) !important;
  border-radius: 6px !important;
  padding: 6px 10px !important;
  text-align: center !important;
  text-decoration: none !important;
  margin: 0 2px !important;
  cursor: pointer !important;
  transition: all 0.2s ease-in-out !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  height: 28px !important;
  min-width: 60px !important;
  vertical-align: middle !important;
  line-height: 1 !important;
}

button[title="Afficher les images satellite"]:hover,
button[title="Afficher un plan de ville"]:hover,
button[aria-label="Afficher les images satellite"]:hover,
button[aria-label="Afficher un plan de ville"]:hover {
  background: rgba(46, 125, 50, 0.9) !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 6px rgba(46, 125, 50, 0.3) !important;
}

/* Target Google Maps type control buttons more specifically */
.gm-style .gm-style-cc button,
.gm-style button[role="menuitemradio"],
.gm-style button[type="button"][role="menuitemradio"] {
  height: 28px !important;
  min-width: 60px !important;
  padding: 6px 10px !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
}


li[title="Afficher les images satellite avec le nom des rues"] {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
  font-size: 11px !important;
  color: rgba(46, 125, 50, 0.9) !important;
  background-color: #f8f9fa !important;
  border-radius: 6px !important;
  padding: 6px 10px !important;
  line-height: 1.2 !important;
}

li[title="Afficher le relief sur la carte"] {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
  font-size: 11px !important;
  color: rgba(46, 125, 50, 0.9) !important;
  background-color: #f8f9fa !important;
  border-radius: 6px !important;
  padding: 6px 10px !important;
  line-height: 1.2 !important;
}

/* Make Google Maps type control container smaller */
.gm-style .gm-style-cc {
  font-size: 11px !important;
}

.gm-style .gm-style-cc table {
  height: auto !important;
}

.gm-style .gm-style-cc td {
  height: 28px !important;
  padding: 0 !important;
  vertical-align: middle !important;
}

/* Target the specific button text */
.gm-style button[role="menuitemradio"] {
  font-size: 11px !important;
  font-weight: 500 !important;
}
</style>
<style lang="scss" scoped>
/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner i {
  font-size: 3rem;
  color: rgba(46, 125, 50, 0.9);
  margin-bottom: 1rem;
}

.loading-spinner p {
  color: rgba(46, 125, 50, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* Map Info Bar */
.map-info-bar {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px 24px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.info-item i {
  color: rgba(46, 125, 50, 0.9);
  font-size: 16px;
}

.zoom-button {
  background: rgba(46, 125, 50, 0.9);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(46, 125, 50, 0.3);
}

.zoom-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(46, 125, 50, 0.4);
}

.zoom-button:active {
  transform: translateY(0);
}

.zoom-button i {
  font-size: 14px;
}

/* Improved Map Container - Compact and Responsive */
/* Map Container - Leaves space for sidebar and header */
.page-maps {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px); /* Reduced height for more space */
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.maps-page-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.maps-content-wrapper {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.maps-col {
  padding: 0 !important;
  margin: 0 !important;
  height: 100%;
}

.maps-card {
  height: 100%;
  border: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
}

.maps-card-body {
  padding: 0 !important;
  margin: 0 !important;
  height: 100%;
}

.maps-card-body .v-card {
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Map Controls Styling */
.map-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 1000;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.map-button {
  background: white;
  border: 1.5px solid rgba(46, 125, 50, 0.9);
  color: rgba(46, 125, 50, 0.9);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.map-button-small {
  padding: 8px !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  justify-content: center !important;
  border-radius: 4px !important;
  gap: 0 !important;
}

.map-button-small i {
  font-size: 16px !important;
  margin: 0 !important;
}

.map-button-import {
  padding: 0 !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  justify-content: center !important;
  align-items: center !important;
  border-radius: 4px !important;
  gap: 0 !important;
  display: flex !important;
  background: #428874 !important;
  color: white !important;
  border: 2px solid #428874 !important;
}

.map-button-import i {
  font-size: 18px !important;
  margin: 0 !important;
  line-height: 1 !important;
}

.map-button-import:hover {
  background: #357a65 !important;
  border-color: #357a65 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 136, 116, 0.4);
}

.map-button:hover {
  background: rgba(46, 125, 50, 0.9);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(46, 125, 50, 0.3);
}

.map-button.active-button {
  background: rgba(46, 125, 50, 0.9);
  color: white;
  box-shadow: 0 2px 6px rgba(46, 125, 50, 0.4);
}

.map-button i {
  font-size: 12px;
}

/* Action buttons (delete, save) */
.map-action-button {
  position: absolute;
  right: 10px;
  width: 36px;
  height: 36px;
  background: white;
  border: 1.5px solid rgba(46, 125, 50, 0.9);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1000;
}

.map-action-button i {
  color: rgba(46, 125, 50, 0.9);
  font-size: 14px;
}

.map-action-button:hover {
  background: rgba(46, 125, 50, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(46, 125, 50, 0.3);
}

.map-action-button:hover i {
  color: white;
}

.map-delete-button {
  top: 50%;
  transform: translate(0, -50%);
}

.map-save-button {
  top: 55%;
  transform: translate(0, -50%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .map-info-bar {
    flex-direction: column;
    gap: 10px;
    padding: 10px 15px;
    top: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    width: calc(100% - 20px);
  }

  .map-controls {
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    width: calc(100% - 20px);
  }

  .map-button {
    flex: 1;
    min-width: 120px;
    justify-content: center;
    padding: 10px 16px;
    font-size: 12px;
  }

  .info-item {
    font-size: 12px;
  }

  .zoom-button {
    width: 100%;
    justify-content: center;
  }
}

@import '@/assets/css/pages/maps';
</style>
