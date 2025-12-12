<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">
            <i class="pi pi-chart-line"></i>
            État Global
          </h1>
         </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="kpi-grid">
        <!-- Offline Devices Card -->
        <div class="kpi-card card-offline">
          <div class="card-inner">
            <div class="card-header-section">
              <div class="icon-container icon-offline">
                <i class="pi pi-wifi"></i>
              </div>
              <div class="title-section">
                <h3 class="card-title">Hors-ligne</h3>
              </div>
            </div>
            <div class="value-section">
              <div class="main-value value-offline">
                {{ offlineCount }}<span class="separator">/</span>{{ totalDevices }}
              </div>
            </div>
          </div>
        </div>

        <!-- Battery Alert Card -->
        <div class="kpi-card card-battery">
          <div class="card-inner">
            <div class="card-header-section">
              <div class="icon-container icon-battery">
                <i class="pi pi-bolt"></i>
              </div>
              <div class="title-section">
                <h3 class="card-title">Batteries</h3>
              </div>
            </div>
            <div class="value-section">
              <div class="main-value value-battery">
                {{ batteryAlertCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Signal Quality Card -->
        <div class="kpi-card card-signal">
          <div class="card-inner">
            <div class="card-header-section">
              <div class="icon-container icon-signal">
                <i class="pi pi-link"></i>
              </div>
              <div class="title-section">
                <h3 class="card-title">Signal</h3>
              </div>
            </div>
            <div class="value-section">
              <div class="main-value value-signal">
                {{ averageSignalQuality }}<span class="unit"> dBm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-wrapper">
          <i class="pi pi-spin pi-spinner"></i>
          <p>Chargement des données...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { nodeService, sensorService } from "@/services/api/index";

export default {
  name: 'Dashboard',
  setup() {
    const loading = ref(false);
    const totalDevices = ref(0);
    const offlineCount = ref(0);
    const batteryAlertCount = ref(0);
    const averageSignalQuality = ref(0);
    let refreshInterval = null;

    // Thresholds
    const OFFLINE_THRESHOLD_HOURS = 4;
    const BATTERY_CRITICAL_PERCENT = 20;
    const BATTERY_CRITICAL_VOLTAGE = 3600; // 3.6V in mV

    /**
     * Check if device is offline (no data for more than threshold hours)
     */
    const isDeviceOffline = (lastUpdateDate) => {
      if (!lastUpdateDate) return true;
      
      const lastUpdate = new Date(lastUpdateDate);
      const now = new Date();
      const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
      
      return hoursSinceUpdate > OFFLINE_THRESHOLD_HOURS;
    };

    /**
     * Check if battery is critical
     */
    const isBatteryCritical = (batteryValue) => {
      if (!batteryValue || batteryValue === null) return false;
      
      // If battery is in mV (typically 3000-4200 for 3V-4.2V range)
      // Critical if < 3600mV (3.6V)
      if (batteryValue < BATTERY_CRITICAL_VOLTAGE) {
        return true;
      }
      
      // If battery is in percentage (0-100)
      if (batteryValue <= 100 && batteryValue < BATTERY_CRITICAL_PERCENT) {
        return true;
      }
      
      return false;
    };

    /**
     * Load all devices and calculate KPIs
     */
    const loadKPIs = async () => {
      try {
        loading.value = true;
        
        // Get all nodes
        const nodesResult = await nodeService.getNodes();
        let nodes = [];
        
        if (nodesResult?.data) {
          nodes = Array.isArray(nodesResult.data) ? nodesResult.data : [];
        } else if (Array.isArray(nodesResult)) {
          nodes = nodesResult;
        }

        totalDevices.value = nodes.length;
        
        if (nodes.length === 0) {
          offlineCount.value = 0;
          batteryAlertCount.value = 0;
          averageSignalQuality.value = 0;
          return;
        }

        let offlineDevices = 0;
        let criticalBatteries = 0;
        let signalValues = [];
        let processedNodes = 0;

        // Process each node to get latest sensor data
        for (const node of nodes) {
          try {
            const nodeId = node.NodeId || node._id;
            if (!nodeId) continue;

            // Get latest sensor data
            const sensorResult = await sensorService.getLatestSensor(nodeId);
            const sensorData = sensorResult?.data || sensorResult;
            
            if (sensorData && sensorData.Date) {
              // Check if offline
              if (isDeviceOffline(sensorData.Date)) {
                offlineDevices++;
              }

              // Check battery
              if (sensorData.BAT !== undefined && sensorData.BAT !== null) {
                if (isBatteryCritical(sensorData.BAT)) {
                  criticalBatteries++;
                }
              }

              // Get signal quality (RSSI or similar field)
              const signalValue = sensorData.RSSI || 
                                 sensorData.Signal || 
                                 sensorData.SignalQuality ||
                                 sensorData.SIG;
              
              if (signalValue !== undefined && signalValue !== null) {
                signalValues.push(Number(signalValue));
              }
            } else {
              // No data means offline
              offlineDevices++;
            }
            
            processedNodes++;
            
            // Add small delay to avoid overwhelming the API
            if (processedNodes % 5 === 0) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.warn(`Error processing node ${node.NodeId || node._id}:`, error);
            // If we can't get data, consider it offline
            offlineDevices++;
          }
        }

        offlineCount.value = offlineDevices;
        batteryAlertCount.value = criticalBatteries;
        
        // Calculate average signal quality
        if (signalValues.length > 0) {
          const sum = signalValues.reduce((a, b) => a + b, 0);
          averageSignalQuality.value = Math.round(sum / signalValues.length);
        } else {
          averageSignalQuality.value = 0; // No signal data available
        }

      } catch (error) {
        console.error('Error loading KPIs:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadKPIs();
      
      // Refresh every 5 minutes
      refreshInterval = setInterval(() => {
        loadKPIs();
      }, 5 * 60 * 1000);
    });

    onBeforeUnmount(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      loading,
      totalDevices,
      offlineCount,
      batteryAlertCount,
      averageSignalQuality
    };
  }
};
</script>

<style scoped>
/* Reset and Base */
.dashboard-wrapper {
  width: 100%;
  min-height: 100vh;
  background: 
    radial-gradient(ellipse 80% 60% at bottom right, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.08) 30%, rgba(46, 125, 50, 0.03) 60%, transparent 100%),
    linear-gradient(135deg, #f5f7fa 0%, #f5f7fa 100%);
  background-color: #f5f7fa;
  padding: 0;
  margin: 0;
  position: relative;
}

.dashboard-wrapper::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle at bottom right, rgba(46, 125, 50, 0.12) 0%, rgba(46, 125, 50, 0.05) 50%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
  z-index: 1;
}

/* Header Styles */
.dashboard-header {
  margin-bottom: 1rem;
}

.header-content {
  background: rgba(255, 255, 255, 0.98);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.6);
  backdrop-filter: blur(10px);
}

.dashboard-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-title i {
  color: #667eea;
  font-size: 1.25rem;
}

.dashboard-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.75rem;
  width: 100%;
  box-sizing: border-box;
}

/* Card Base Styles */
.kpi-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 140px;
  box-sizing: border-box;
  margin: 0;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.07),
    0 10px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(229, 231, 235, 0.9);
}

.kpi-card:hover::before {
  opacity: 1;
}

/* Card specific accent colors on hover */
.card-offline:hover {
  border-top: 3px solid rgba(239, 68, 68, 0.3);
}

.card-battery:hover {
  border-top: 3px solid rgba(245, 158, 11, 0.3);
}

.card-signal:hover {
  border-top: 3px solid rgba(59, 130, 246, 0.3);
}

.card-inner {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

/* Card Header */
.card-header-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.kpi-card:hover .icon-container {
  transform: scale(1.05);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.2);
}

.icon-offline {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
}

.icon-battery {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
}

.icon-signal {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
}

.title-section {
  flex: 1;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

/* Value Section */
.value-section {
  margin: 0.5rem 0 0 0;
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.main-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.separator {
  font-size: 1.25rem;
  font-weight: 400;
  opacity: 0.4;
  margin: 0 0.15rem;
}

.unit {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.7;
}

.value-offline {
  color: #ef4444;
}

.value-battery {
  color: #f59e0b;
}

.value-signal {
  color: #3b82f6;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #667eea;
}

.spinner-wrapper i {
  font-size: 3rem;
}

.spinner-wrapper p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0.75rem;
  }

  .header-content {
    padding: 0.875rem;
  }

  .dashboard-title {
    font-size: 1.125rem;
  }

  .dashboard-title i {
    font-size: 1.125rem;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    width: 100%;
  }

  .card-inner {
    padding: 0.875rem;
  }

  .main-value {
    font-size: 1.5rem;
  }

  .icon-container {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }

  .card-title {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .main-value {
    font-size: 1.75rem;
  }

  .unit {
    font-size: 1rem;
  }

  .card-title {
    font-size: 0.875rem;
  }
}
</style>
