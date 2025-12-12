<template>
  <div class="sensor-detail-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <button class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h1 class="page-title">
            <i class="fas fa-chart-line"></i>
            Capteur {{ nodeId || 'Chargement...' }}
          </h1>
        </div>
        <div class="header-actions">
          <button class="export-button" @click="exportToExcel">
            <i class="fas fa-file-excel"></i>
            <span class="export-text">Exporter Excel</span>
          </button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <!-- Filters Section -->
      <div class="filters-section">
        <div class="date-range-picker">
          <label>Période</label>
          <Calendar
            v-model="dateRange"
            selectionMode="range"
            :manualInput="false"
            dateFormat="dd/mm/yy"
            placeholder="Sélectionner une période"
            showIcon
            iconDisplay="input"
            :maxDate="new Date()"
            @update:modelValue="updateDateRange"
            class="date-range-calendar"
          />
        </div>
        <div class="quick-filters">
          <button 
            class="quick-filter-btn" 
            :class="{ active: activeFilter === 'installation' }"
            @click="setFilter('installation')"
          >
            <i class="fas fa-calendar-alt"></i>
            Depuis Installation
          </button>
          <button 
            class="quick-filter-btn" 
            :class="{ active: activeFilter === 'month' }"
            @click="setFilter('month')"
          >
            <i class="fas fa-calendar-alt"></i>
            Dernier Mois
          </button>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="tabs-section">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'sensors' }"
          @click="activeTab = 'sensors'"
        >
          Données des Capteurs
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'detailed' }"
          @click="activeTab = 'detailed'"
        >
          Données Détaillées
        </button>
      </div>

      <div v-if="loading" class="loading-container">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement des données...</p>
      </div>

      <div v-else class="charts-section">
        <!-- Sensors Data Tab -->
        <div v-show="activeTab === 'sensors'" class="tab-content">
          <div class="chart-card">
            <div class="chart-header">
              <h3>
                <i class="fas fa-chart-line"></i>
                Évolution des Mesures
              </h3>
            </div>
            <div class="chart-wrapper">
              <Chart 
                type="line" 
                :data="chartData" 
                :options="chartOptions"
              />
            </div>
          </div>
        </div>

        <!-- Detailed Data Tab -->
        <div v-show="activeTab === 'detailed'" class="tab-content">
          <div class="chart-card">
            <div class="chart-header">
              <h3>
                <i class="fas fa-table"></i>
                Données Détaillées
              </h3>
            </div>
            <div class="table-wrapper">
              <DataTable 
                :value="sensorDataTable" 
                :paginator="true" 
                :rows="20"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                tableStyle="min-width: 100%"
                class="p-datatable-striped"
                :loading="loading"
                sortMode="multiple"
                removableSort
                showGridlines
                stripedRows
              >
                <Column field="Date" header="Date" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    {{ formatTableDate(data.Date || data.DateAdd) }}
                  </template>
                </Column>
                <Column field="S1T" header="Humidité du sol 1 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.S1T !== null && data.S1T !== undefined ? data.S1T.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="S2T" header="Humidité du sol 2 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.S2T !== null && data.S2T !== undefined ? data.S2T.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="S3T" header="Humidité du sol 3 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.S3T !== null && data.S3T !== undefined ? data.S3T.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="S4T" header="Humidité du sol 4 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.S4T !== null && data.S4T !== undefined ? data.S4T.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="ST1" header="Température du sol 1 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.ST1 !== null && data.ST1 !== undefined ? data.ST1.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="ST2" header="Température du sol 2 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.ST2 !== null && data.ST2 !== undefined ? data.ST2.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="ST3" header="Température du sol 3 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.ST3 !== null && data.ST3 !== undefined ? data.ST3.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="ST4" header="Température du sol 4 (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.ST4 !== null && data.ST4 !== undefined ? data.ST4.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="EC1" header="Conductivité électrique 1 (mS/cm)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.EC1 !== null && data.EC1 !== undefined ? data.EC1.toFixed(2) : '-' }}
                  </template>
                </Column>
                <Column field="EC2" header="Conductivité électrique 2 (mS/cm)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.EC2 !== null && data.EC2 !== undefined ? data.EC2.toFixed(2) : '-' }}
                  </template>
                </Column>
                <Column field="EC3" header="Conductivité électrique 3 (mS/cm)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.EC3 !== null && data.EC3 !== undefined ? data.EC3.toFixed(2) : '-' }}
                  </template>
                </Column>
                <Column field="EC4" header="Conductivité électrique 4 (mS/cm)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.EC4 !== null && data.EC4 !== undefined ? data.EC4.toFixed(2) : '-' }}
                  </template>
                </Column>
                <Column field="HUM" header="Humidité (%)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.HUM !== null && data.HUM !== undefined ? data.HUM.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="TEMP" header="Température (°C)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.TEMP !== null && data.TEMP !== undefined ? data.TEMP.toFixed(1) : '-' }}
                  </template>
                </Column>
                <Column field="BAT" header="Batterie" :sortable="true">
                  <template #body="{ data }">
                    {{ data.BAT !== null && data.BAT !== undefined ? data.BAT : '-' }}
                  </template>
                </Column>
                <Column field="RSSI" header="Signal (dBm)" :sortable="true">
                  <template #body="{ data }">
                    {{ data.RSSI !== null && data.RSSI !== undefined ? data.RSSI : '-' }}
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { nodeService, sensorService } from '@/services/api/index';
import Chart from 'primevue/chart';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import isEmpty from '@/outils/isEmpty';
import * as XLSX from 'xlsx';

export default {
  name: 'SensorDetail',
  components: {
    Chart,
    Calendar,
    DataTable,
    Column,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const nodeId = ref(route.params.id || route.query.id || '');
    const loading = ref(true);
    const activeTab = ref('sensors');
    const activeFilter = ref(null);
    
    // Date range - using PrimeVue Calendar range mode
    const getDefaultDateRange = () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      // Return array of Date objects
      return [new Date(start), new Date(end)];
    };
    const dateRange = ref(getDefaultDateRange());
    
    const startDate = computed(() => {
      if (!dateRange.value || !Array.isArray(dateRange.value) || !dateRange.value[0]) {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
      }
      // Ensure it's a Date object
      const start = dateRange.value[0] instanceof Date 
        ? dateRange.value[0] 
        : new Date(dateRange.value[0]);
      return start.toISOString().split('T')[0];
    });
    
    const endDate = computed(() => {
      if (!dateRange.value || !Array.isArray(dateRange.value) || !dateRange.value[1]) {
        return new Date().toISOString().split('T')[0];
      }
      // Ensure it's a Date object
      const end = dateRange.value[1] instanceof Date 
        ? dateRange.value[1] 
        : new Date(dateRange.value[1]);
      return end.toISOString().split('T')[0];
    });
    
    // Node details
    const nodeDetails = ref({
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      p5: '',
      p6: '',
      nbr_port: 4,
      prf: '',
    });

    // Chart data using PrimeVue Chart format
    const chartData = ref({
      labels: [],
      datasets: []
    });
    
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // Disable animation for better performance with large datasets
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#495057',
            usePointStyle: true,
            padding: 10,
            boxWidth: 12,
            font: {
              size: 11
            }
          },
          onClick: (e, legendItem, legend) => {
            // Toggle dataset visibility on legend click
            const index = legendItem.datasetIndex;
            const chart = legend.chart;
            const meta = chart.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
            chart.update();
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 10,
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
              } else {
                label += 'N/A';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
            maxRotation: 45,
            minRotation: 45,
            maxTicksLimit: 20,
            font: {
              size: 10
            }
          },
          grid: {
            color: '#ebedef',
            display: true
          }
        },
        y: {
          ticks: {
            color: '#495057',
            font: {
              size: 10
            }
          },
          grid: {
            color: '#ebedef',
            display: true
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      elements: {
        line: {
          borderWidth: 2
        }
      }
    });

    // Table data for detailed view
    const sensorDataTable = ref([]);
    
    // Chart data for ET0 using PrimeVue Chart format (kept for potential future use)
    const et0ChartData = ref({
      labels: [],
      datasets: []
    });
    
    const et0Options = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#495057',
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    });

    const loadNodeDetails = async () => {
      if (!nodeId.value) return;
      
      try {
        const result = await nodeService.getNodeDetails(nodeId.value);
        const res = result?.data;
        
        if (res && !isEmpty(res)) {
          nodeDetails.value = {
            p1: res.port1 || '',
            p2: res.port2 || '',
            p3: res.port3 || '',
            p4: res.port4 || '',
            p5: res.port5 || '',
            p6: res.port6 || '',
            nbr_port: res.nbr_port || 4,
            prf: res.profondeur || '',
          };
        }
      } catch (error) {
        console.error('Error loading node details:', error);
      }
    };

    const loadChartData = async () => {
      if (!nodeId.value || !startDate.value || !endDate.value) return;
      
      try {
        const formattedStart = formatDateForAPI(startDate.value);
        const formattedEnd = formatDateForAPI(endDate.value);
        
        if (!formattedStart || !formattedEnd) {
          console.warn('Invalid dates for chart data');
          return;
        }
        
        const result = await sensorService.getSensorByDates(nodeId.value, formattedStart, formattedEnd);
        const res = result?.data || result || [];
        
        if (!Array.isArray(res) || res.length === 0) {
          // No data available - clear charts and table but don't show error
          chartData.value = { labels: [], datasets: [] };
          sensorDataTable.value = [];
          return;
        }
        
        // Store raw data for table
        sensorDataTable.value = res.map(item => ({
          ...item,
          Date: item.Date || item.DateAdd
        }));
        
        // Reset data
        const labels = [];
        const tempSensorData = { S1T: [], S2T: [], S3T: [], S4T: [] };
        const soilTempData = { ST1: [], ST2: [], ST3: [], ST4: [] };
        const ecData = { EC1: [], EC2: [], EC3: [], EC4: [] };
        const otherData = { HUM: [], TEMP: [], BAT: [], RSSI: [] };
        
        // Process all data points
        res.forEach((item) => {
          const date = new Date(item.Date || item.DateAdd);
          const day = date.getDate();
          const monthshort = date.toLocaleString("fr-FR", { month: "short" });
          const hour = date.getHours();
          const minute = String(date.getMinutes()).padStart(2, '0');
          
          labels.push(`${day} ${monthshort} ${hour}:${minute}`);
          
          // Temperature sensors (S1T, S2T, S3T, S4T)
          if (item.S1T !== null && item.S1T !== undefined) tempSensorData.S1T.push(parseFloat(item.S1T.toFixed(1)));
          else tempSensorData.S1T.push(null);
          
          if (item.S2T !== null && item.S2T !== undefined) tempSensorData.S2T.push(parseFloat(item.S2T.toFixed(1)));
          else tempSensorData.S2T.push(null);
          
          if (item.S3T !== null && item.S3T !== undefined) tempSensorData.S3T.push(parseFloat(item.S3T.toFixed(1)));
          else tempSensorData.S3T.push(null);
          
          if (item.S4T !== null && item.S4T !== undefined) tempSensorData.S4T.push(parseFloat(item.S4T.toFixed(1)));
          else tempSensorData.S4T.push(null);
          
          // Soil temperature (ST1, ST2, ST3, ST4)
          if (item.ST1 !== null && item.ST1 !== undefined) soilTempData.ST1.push(parseFloat(item.ST1.toFixed(1)));
          else soilTempData.ST1.push(null);
          
          if (item.ST2 !== null && item.ST2 !== undefined) soilTempData.ST2.push(parseFloat(item.ST2.toFixed(1)));
          else soilTempData.ST2.push(null);
          
          if (item.ST3 !== null && item.ST3 !== undefined) soilTempData.ST3.push(parseFloat(item.ST3.toFixed(1)));
          else soilTempData.ST3.push(null);
          
          if (item.ST4 !== null && item.ST4 !== undefined) soilTempData.ST4.push(parseFloat(item.ST4.toFixed(1)));
          else soilTempData.ST4.push(null);
          
          // Electrical conductivity (EC1, EC2, EC3, EC4)
          if (item.EC1 !== null && item.EC1 !== undefined) ecData.EC1.push(parseFloat(item.EC1.toFixed(2)));
          else ecData.EC1.push(null);
          
          if (item.EC2 !== null && item.EC2 !== undefined) ecData.EC2.push(parseFloat(item.EC2.toFixed(2)));
          else ecData.EC2.push(null);
          
          if (item.EC3 !== null && item.EC3 !== undefined) ecData.EC3.push(parseFloat(item.EC3.toFixed(2)));
          else ecData.EC3.push(null);
          
          if (item.EC4 !== null && item.EC4 !== undefined) ecData.EC4.push(parseFloat(item.EC4.toFixed(2)));
          else ecData.EC4.push(null);
          
          // Other data
          if (item.HUM !== null && item.HUM !== undefined) otherData.HUM.push(parseFloat(item.HUM.toFixed(1)));
          else otherData.HUM.push(null);
          
          if (item.TEMP !== null && item.TEMP !== undefined) otherData.TEMP.push(parseFloat(item.TEMP.toFixed(1)));
          else otherData.TEMP.push(null);
          
          if (item.BAT !== null && item.BAT !== undefined) otherData.BAT.push(parseFloat(item.BAT.toFixed(0)));
          else otherData.BAT.push(null);
          
          if (item.RSSI !== null && item.RSSI !== undefined) otherData.RSSI.push(parseFloat(item.RSSI.toFixed(0)));
          else otherData.RSSI.push(null);
        });
        
        // Build chart datasets - only include datasets with actual data
        const datasets = [];
        
        // Helper function to check if dataset has data
        const hasData = (dataArray) => {
          return dataArray.some(val => val !== null && val !== undefined);
        };
        
        // Temperature sensors (Humidité du sol)
        if (hasData(tempSensorData.S1T)) {
          datasets.push({
            label: 'Humidité du sol 1 (°C)',
            data: tempSensorData.S1T,
            borderColor: '#f87979',
            backgroundColor: 'rgba(248, 121, 121, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(tempSensorData.S2T)) {
          datasets.push({
            label: 'Humidité du sol 2 (°C)',
            data: tempSensorData.S2T,
            borderColor: '#7c79f8',
            backgroundColor: 'rgba(124, 121, 248, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(tempSensorData.S3T)) {
          datasets.push({
            label: 'Humidité du sol 3 (°C)',
            data: tempSensorData.S3T,
            borderColor: '#79f883',
            backgroundColor: 'rgba(121, 248, 131, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(tempSensorData.S4T)) {
          datasets.push({
            label: 'Humidité du sol 4 (°C)',
            data: tempSensorData.S4T,
            borderColor: '#f8d279',
            backgroundColor: 'rgba(248, 210, 121, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        
        // Soil temperature (Température du sol)
        if (hasData(soilTempData.ST1)) {
          datasets.push({
            label: 'Température du sol 1 (°C)',
            data: soilTempData.ST1,
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(soilTempData.ST2)) {
          datasets.push({
            label: 'Température du sol 2 (°C)',
            data: soilTempData.ST2,
            borderColor: '#4ecdc4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(soilTempData.ST3)) {
          datasets.push({
            label: 'Température du sol 3 (°C)',
            data: soilTempData.ST3,
            borderColor: '#45b7d1',
            backgroundColor: 'rgba(69, 183, 209, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(soilTempData.ST4)) {
          datasets.push({
            label: 'Température du sol 4 (°C)',
            data: soilTempData.ST4,
            borderColor: '#f7b731',
            backgroundColor: 'rgba(247, 183, 49, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        
        // Electrical conductivity (Conductivité électrique)
        if (hasData(ecData.EC1)) {
          datasets.push({
            label: 'Conductivité électrique 1 (mS/cm)',
            data: ecData.EC1,
            borderColor: '#a55eea',
            backgroundColor: 'rgba(165, 94, 234, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(ecData.EC2)) {
          datasets.push({
            label: 'Conductivité électrique 2 (mS/cm)',
            data: ecData.EC2,
            borderColor: '#26de81',
            backgroundColor: 'rgba(38, 222, 129, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(ecData.EC3)) {
          datasets.push({
            label: 'Conductivité électrique 3 (mS/cm)',
            data: ecData.EC3,
            borderColor: '#fd79a8',
            backgroundColor: 'rgba(253, 121, 168, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(ecData.EC4)) {
          datasets.push({
            label: 'Conductivité électrique 4 (mS/cm)',
            data: ecData.EC4,
            borderColor: '#fdcb6e',
            backgroundColor: 'rgba(253, 203, 110, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        
        // Other metrics
        if (hasData(otherData.HUM)) {
          datasets.push({
            label: 'Humidité (%)',
            data: otherData.HUM,
            borderColor: '#00BCD4',
            backgroundColor: 'rgba(0, 188, 212, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        if (hasData(otherData.TEMP)) {
          datasets.push({
            label: 'Température (°C)',
            data: otherData.TEMP,
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          });
        }
        
        // Limit labels if too many data points (for performance)
        let displayLabels = labels;
        let displayDatasets = datasets.map(dataset => ({ ...dataset }));
        
        // If more than 100 points, sample the data
        if (labels.length > 100) {
          const step = Math.ceil(labels.length / 100);
          displayLabels = labels.filter((_, index) => index % step === 0 || index === labels.length - 1);
          displayDatasets = datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.filter((_, index) => index % step === 0 || index === dataset.data.length - 1)
          }));
        }
        
        chartData.value = {
          labels: displayLabels,
          datasets: displayDatasets
        };
      } catch (error) {
        // Handle 404 and other errors gracefully
        if (error?.response?.status === 404) {
          console.warn(`No sensor data available for node ${nodeId.value} in the selected date range`);
          // Clear charts and table on 404
          chartData.value = { labels: [], datasets: [] };
          sensorDataTable.value = [];
        } else {
          console.error('Error loading chart data:', error);
        }
      }
    };

    const loadET0Data = async () => {
      if (!nodeId.value || !startDate.value || !endDate.value) return;
      
      try {
        const idParcel = nodeId.value;
        
        const formattedDatef = formatDateForAPI(endDate.value);
        const formattedDated = formatDateForAPI(startDate.value);
        
        // Validate dates are not in the future
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const endDateObj = new Date(formattedDatef);
        
        if (endDateObj > today) {
          console.warn('End date is in the future, using today instead');
          const todayStr = formatDateForAPI(today.toISOString().split('T')[0]);
          const result = await sensorService.getET0(idParcel, formattedDated, todayStr);
          const res = result?.data || result || [];
          
          // Reset data
          const et0Labels = [];
          const et0Values = [];
          
          if (Array.isArray(res) && res.length > 0) {
            res.forEach((data) => {
              const date = new Date(data.Date);
              const day = date.getDate();
              const monthshort = date.toLocaleString("fr-FR", { month: "short" });
              
              et0Labels.push(`${day} ${monthshort}`);
              et0Values.push(parseFloat(data.value.toFixed(1)));
            });
            
            et0ChartData.value = {
              labels: et0Labels,
              datasets: [{
                label: 'ET0 (mm/jour)',
                data: et0Values,
                borderColor: '#00BCD4',
                backgroundColor: 'rgba(0, 188, 212, 0.1)',
                fill: false,
                tension: 0.4
              }]
            };
          } else {
            et0ChartData.value = { labels: [], datasets: [] };
          }
          return;
        }
        
        const result = await sensorService.getET0(idParcel, formattedDated, formattedDatef);
        const res = result?.data || result || [];
        
        // Reset data
        const et0Labels = [];
        const et0Values = [];
        
        if (Array.isArray(res) && res.length > 0) {
          res.forEach((data) => {
            const date = new Date(data.Date);
            const day = date.getDate();
            const monthshort = date.toLocaleString("fr-FR", { month: "short" });
            
            et0Labels.push(`${day} ${monthshort}`);
            et0Values.push(parseFloat(data.value.toFixed(1)));
          });
          
          et0ChartData.value = {
            labels: et0Labels,
            datasets: [{
              label: 'ET0 (mm/jour)',
              data: et0Values,
              borderColor: '#00BCD4',
              backgroundColor: 'rgba(0, 188, 212, 0.1)',
              fill: false,
              tension: 0.4
            }]
          };
        } else {
          et0ChartData.value = { labels: [], datasets: [] };
        }
      } catch (error) {
        // Handle 404 and other errors gracefully
        if (error?.response?.status === 404) {
          console.warn(`No ET0 data available for node ${nodeId.value} in the selected date range`);
          // Clear charts on 404
          et0ChartData.value = { labels: [], datasets: [] };
        } else {
          console.error('Error loading ET0 data:', error);
        }
      }
    };
    
    const formatDateForAPI = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      // Ensure date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '';
      }
      // Ensure date is not in the future
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const dateToUse = date > today ? today : date;
      
      return `${dateToUse.getFullYear()}-${String(dateToUse.getMonth() + 1).padStart(2, '0')}-${String(dateToUse.getDate()).padStart(2, '0')}`;
    };
    
    const updateDateRange = () => {
      // Ensure dateRange contains valid Date objects
      // PrimeVue Calendar in range mode can return null or array with null values during selection
      if (!dateRange.value) {
        // If null, reset to default
        dateRange.value = getDefaultDateRange();
        return;
      }
      
      if (Array.isArray(dateRange.value)) {
        // During range selection, the array might have null values
        // Only update if both dates are selected
        if (dateRange.value[0] && dateRange.value[1]) {
          // Ensure both are Date objects
          if (!(dateRange.value[0] instanceof Date)) {
            dateRange.value[0] = new Date(dateRange.value[0]);
          }
          if (!(dateRange.value[1] instanceof Date)) {
            dateRange.value[1] = new Date(dateRange.value[1]);
          }
          // Only load data when both dates are selected
          activeFilter.value = null;
          loadAllData();
        }
      } else {
        // If it's not an array, reset to default
        dateRange.value = getDefaultDateRange();
      }
    };
    
    const setFilter = (filterType) => {
      activeFilter.value = filterType;
      const today = new Date();
      
      if (filterType === 'month') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        // Ensure we create new Date objects
        dateRange.value = [new Date(lastMonth), new Date(today)];
      } else if (filterType === 'installation') {
        // Set to a very old date or node installation date
        const installationDate = new Date();
        installationDate.setFullYear(2020, 0, 1); // Example: start from 2020
        // Ensure we create new Date objects
        dateRange.value = [new Date(installationDate), new Date(today)];
      }
      
      loadAllData();
    };
    
    const exportToExcel = async () => {
      if (!sensorDataTable.value || sensorDataTable.value.length === 0) {
        alert('Aucune donnée à exporter');
        return;
      }

      try {
        // Prepare data for Excel export
        const excelData = sensorDataTable.value.map(item => {
          const date = formatTableDate(item.Date || item.DateAdd);
          return {
            'Date': date,
            'Humidité du sol 1 (°C)': item.S1T !== null && item.S1T !== undefined ? parseFloat(item.S1T.toFixed(1)) : '',
            'Humidité du sol 2 (°C)': item.S2T !== null && item.S2T !== undefined ? parseFloat(item.S2T.toFixed(1)) : '',
            'Humidité du sol 3 (°C)': item.S3T !== null && item.S3T !== undefined ? parseFloat(item.S3T.toFixed(1)) : '',
            'Humidité du sol 4 (°C)': item.S4T !== null && item.S4T !== undefined ? parseFloat(item.S4T.toFixed(1)) : '',
            'Température du sol 1 (°C)': item.ST1 !== null && item.ST1 !== undefined ? parseFloat(item.ST1.toFixed(1)) : '',
            'Température du sol 2 (°C)': item.ST2 !== null && item.ST2 !== undefined ? parseFloat(item.ST2.toFixed(1)) : '',
            'Température du sol 3 (°C)': item.ST3 !== null && item.ST3 !== undefined ? parseFloat(item.ST3.toFixed(1)) : '',
            'Température du sol 4 (°C)': item.ST4 !== null && item.ST4 !== undefined ? parseFloat(item.ST4.toFixed(1)) : '',
            'Conductivité électrique 1 (mS/cm)': item.EC1 !== null && item.EC1 !== undefined ? parseFloat(item.EC1.toFixed(2)) : '',
            'Conductivité électrique 2 (mS/cm)': item.EC2 !== null && item.EC2 !== undefined ? parseFloat(item.EC2.toFixed(2)) : '',
            'Conductivité électrique 3 (mS/cm)': item.EC3 !== null && item.EC3 !== undefined ? parseFloat(item.EC3.toFixed(2)) : '',
            'Conductivité électrique 4 (mS/cm)': item.EC4 !== null && item.EC4 !== undefined ? parseFloat(item.EC4.toFixed(2)) : '',
            'Humidité (%)': item.HUM !== null && item.HUM !== undefined ? parseFloat(item.HUM.toFixed(1)) : '',
            'Température (°C)': item.TEMP !== null && item.TEMP !== undefined ? parseFloat(item.TEMP.toFixed(1)) : '',
            'Batterie': item.BAT !== null && item.BAT !== undefined ? item.BAT : '',
            'Signal (dBm)': item.RSSI !== null && item.RSSI !== undefined ? item.RSSI : ''
          };
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths for better readability
        const colWidths = [
          { wch: 20 }, // Date
          { wch: 18 }, // Humidité du sol 1
          { wch: 18 }, // Humidité du sol 2
          { wch: 18 }, // Humidité du sol 3
          { wch: 18 }, // Humidité du sol 4
          { wch: 20 }, // Température du sol 1
          { wch: 20 }, // Température du sol 2
          { wch: 20 }, // Température du sol 3
          { wch: 20 }, // Température du sol 4
          { wch: 28 }, // Conductivité électrique 1
          { wch: 28 }, // Conductivité électrique 2
          { wch: 28 }, // Conductivité électrique 3
          { wch: 28 }, // Conductivité électrique 4
          { wch: 12 }, // Humidité
          { wch: 15 }, // Température
          { wch: 10 }, // Batterie
          { wch: 12 }  // Signal
        ];
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Données Capteur');

        // Generate Excel file and download
        const fileName = `capteur_${nodeId.value}_${startDate.value}_${endDate.value}.xlsx`;
        XLSX.writeFile(wb, fileName);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Erreur lors de l\'export Excel');
      }
    };

    const formatTableDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const loadAllData = async () => {
      loading.value = true;
      try {
        await Promise.all([
          loadNodeDetails(),
          loadChartData(),
          // loadET0Data() - No longer needed for detailed tab
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      // Check if there's a previous route in history
      if (window.history.length > 1) {
        router.back();
      } else {
        // Fallback to maps if no history
        router.push('/maps');
      }
    };

    // Watch for route changes to update nodeId and reload data
    watch(() => route.params.id, (newId, oldId) => {
      if (newId && newId !== oldId) {
        nodeId.value = newId;
        loading.value = true;
        loadAllData();
      }
    }, { immediate: false });

    // Watch for query changes
    watch(() => route.query.id, (newId) => {
      if (newId && !route.params.id && newId !== nodeId.value) {
        nodeId.value = newId;
        loading.value = true;
        loadAllData();
      }
    });

    // Watch for full route path changes (for navigation from table)
    watch(() => route.path, (newPath, oldPath) => {
      if (newPath !== oldPath && newPath.includes('/sensor-detail/')) {
        const pathId = newPath.split('/sensor-detail/')[1];
        if (pathId && pathId !== nodeId.value) {
          nodeId.value = pathId;
          loading.value = true;
          loadAllData();
        }
      }
    });

    onMounted(() => {
      // If no nodeId, redirect to maps page
      if (!nodeId.value) {
        router.push('/maps');
        return;
      }
      loadAllData();
    });

    // Watch for chart data changes and force update
    watch(chartData, () => {
      // Force chart to update when data changes
      nextTick(() => {
        // Chart will automatically update via reactivity
      });
    }, { deep: true });

    watch(et0ChartData, () => {
      // Force chart to update when data changes
      nextTick(() => {
        // Chart will automatically update via reactivity
      });
    }, { deep: true });

    return {
      nodeId,
      loading,
      activeTab,
      activeFilter,
      dateRange,
      startDate,
      endDate,
      chartData,
      chartOptions,
      sensorDataTable,
      formatTableDate,
      goBack,
      updateDateRange,
      setFilter,
      exportToExcel,
    };
  },
};
</script>

<style scoped>
.sensor-detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 0;
  margin: 0;
}

.page-header {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.header-content {
  background: #ffffff;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  color: #111827;
}

.page-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.page-title i {
  color: #9ca3af;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.export-button {
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.15s ease;
}

.export-button:hover {
  background: #388e3c;
}

.export-button i {
  font-size: 0.875rem;
}

.export-text {
  display: inline;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  width: 100%;
  box-sizing: border-box;
}

.filters-section {
  background: #ffffff;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0;
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

@media (max-width: 1200px) {
  .filters-section {
    gap: 1.5rem;
  }
}

.date-range-picker {
  flex: 1;
  min-width: 280px;
}

.date-range-picker label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-range-calendar {
  width: 100%;
}

.date-range-calendar :deep(.p-inputtext) {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.date-range-calendar :deep(.p-inputtext:focus) {
  border-color: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.quick-filters {
  display: flex;
  gap: 0.5rem;
}

.quick-filter-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
}

.quick-filter-btn:hover {
  border-color: #d1d5db;
  color: #111827;
  background: #f9fafb;
}

.quick-filter-btn.active {
  background: #2e7d32;
  border-color: #2e7d32;
  color: white;
}

.quick-filter-btn i {
  font-size: 0.75rem;
}

.tabs-section {
  background: #ffffff;
  padding: 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
  display: flex;
}

.tab-button {
  background: transparent;
  border: none;
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease;
  margin-bottom: -1px;
}

.tab-button:hover {
  color: #111827;
}

.tab-button.active {
  color: #2e7d32;
  border-bottom-color: #2e7d32;
}

.tab-content {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: #9ca3af;
}

.loading-container i {
  font-size: 2rem;
  color: #2e7d32;
  margin-bottom: 0.75rem;
}

.loading-container p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.charts-section {
  width: 100%;
  box-sizing: border-box;
}

.tab-content {
  width: 100%;
  box-sizing: border-box;
  display: block;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1.5rem;
}

.chart-header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.chart-header h3 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-header h3 i {
  font-size: 0.875rem;
  color: #6b7280;
}

.chart-wrapper {
  height: 400px;
  position: relative;
  width: 100%;
  min-height: 300px;
  box-sizing: border-box;
  overflow: hidden;
}

.chart-wrapper :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
}

.chart-wrapper :deep(.p-chart) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.chart-wrapper :deep(.p-chart > canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.chart-wrapper :deep(div) {
  width: 100% !important;
  max-width: 100% !important;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
}

.table-wrapper :deep(.p-datatable) {
  width: 100%;
  font-size: 0.875rem;
}

.table-wrapper :deep(.p-datatable-table) {
  width: 100%;
  min-width: 1200px;
}

.table-wrapper :deep(.p-datatable-thead > tr > th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 0.8125rem;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.table-wrapper :deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #6b7280;
}

.table-wrapper :deep(.p-datatable-tbody > tr:hover) {
  background: #f9fafb;
}

.table-wrapper :deep(.p-paginator) {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 0.75rem;
}

.table-wrapper :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  min-width: 2rem;
  height: 2rem;
}

.table-wrapper :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #2e7d32;
  color: white;
}

/* Tablet */
@media (max-width: 1024px) {
  .header-content {
    padding: 0.875rem 1.25rem;
  }

  .page-content {
    padding: 0 1rem 1.5rem;
  }

  .filters-section {
    gap: 1.5rem;
    padding: 1rem 1.25rem;
  }

  .date-range-picker {
    min-width: 250px;
  }

  .chart-wrapper {
    height: 380px;
    width: 100%;
  }
  
  .chart-wrapper :deep(canvas) {
    width: 100% !important;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .page-header {
    padding: 0;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .page-title {
    font-size: 0.875rem;
    flex: 1;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .export-button {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
  }

  .export-button span {
    display: none;
  }

  .export-button i {
    margin: 0;
  }

  .page-content {
    padding: 0 0.75rem 1.5rem;
  }

  .filters-section {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    align-items: stretch;
  }

  .date-range-picker {
    width: 100%;
    min-width: auto;
  }

  .date-range-picker label {
    font-size: 0.75rem;
    margin-bottom: 0.375rem;
  }

  .quick-filters {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .quick-filter-btn {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .quick-filter-btn i {
    font-size: 0.6875rem;
  }

  .tabs-section {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .tabs-section::-webkit-scrollbar {
    display: none;
  }

  .tab-button {
    padding: 0.75rem 1rem;
    white-space: nowrap;
    font-size: 0.8125rem;
    min-width: fit-content;
  }

  .chart-card {
    padding: 1rem;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  .chart-header {
    margin-bottom: 1rem;
    padding-bottom: 0.625rem;
  }

  .chart-header h3 {
    font-size: 0.875rem;
  }

  .chart-wrapper {
    height: 280px;
    width: 100%;
  }
  
  .chart-wrapper :deep(canvas) {
    width: 100% !important;
  }

  .loading-container {
    padding: 3rem 1rem;
  }

  .loading-container i {
    font-size: 1.5rem;
  }

  .loading-container p {
    font-size: 0.8125rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .header-content {
    padding: 0.75rem;
  }

  .back-button {
    padding: 0.375rem;
    font-size: 0.875rem;
  }

  .page-title {
    font-size: 0.8125rem;
  }

  .page-content {
    padding: 0 0.5rem 1rem;
  }

  .filters-section {
    padding: 0.875rem;
  }

  .quick-filters {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .tab-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
  }

  .chart-card {
    padding: 0.875rem;
  }

  .chart-wrapper {
    height: 250px;
    min-height: 200px;
    width: 100%;
  }
  
  .chart-wrapper :deep(canvas) {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .chart-wrapper :deep(.p-chart) {
    width: 100% !important;
  }

  .export-button {
    padding: 0.5rem;
    min-width: 40px;
  }
}
</style>

