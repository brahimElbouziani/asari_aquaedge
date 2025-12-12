<template>
  <div class="page-content">
    <div class="page-header">
      <h1>Analyses</h1>
    </div>

    <div class="stats-grid">
      <Card>
        <template #content>
          <div class="stat-item">
            <i class="pi pi-thermometer"></i>
            <div>
              <h3>{{ totalSensors }}</h3>
              <p>Capteurs</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="stat-item">
            <i class="pi pi-cloud"></i>
            <div>
              <h3>{{ averageHumidity }}%</h3>
              <p>Humidité</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="stat-item">
            <i class="pi pi-sun"></i>
            <div>
              <h3>{{ averageTemperature }}°C</h3>
              <p>Température</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="stat-item">
            <i class="pi pi-bell"></i>
            <div>
              <h3>{{ activeAlerts }}</h3>
              <p>Alertes</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card class="chart-section">
      <template #header>
        <h3>Évolution de l'humidité</h3>
      </template>
      <template #content>
        <div class="chart-wrapper">
          <Chart type="line" :data="chartData" :options="chartOptions" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';

export default {
  name: 'Analytics',
  components: { Card, Chart },
  setup() {
    const totalSensors = ref(24);
    const averageHumidity = ref(65);
    const averageTemperature = ref(22);
    const activeAlerts = ref(3);

    const chartData = ref({
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Humidité (%)',
        data: [65, 68, 70, 72, 68, 65, 67],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }]
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false, min: 50, max: 100 } }
    });

    return {
      totalSensors,
      averageHumidity,
      averageTemperature,
      activeAlerts,
      chartData,
      chartOptions
    };
  }
};
</script>

<style scoped>
.page-content {
  padding: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #1a1a1a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item i {
  font-size: 2rem;
  color: #4caf50;
}

.stat-item h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.stat-item p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.chart-section {
  margin-top: 1.5rem;
}

.chart-wrapper {
  height: 300px;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-wrapper {
    height: 250px;
  }
}
</style>
