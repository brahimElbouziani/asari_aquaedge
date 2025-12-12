<!-- Vue 3 Migration - CChartLine replacement using vue-chartjs v5 -->
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import { Line } from 'vue-chartjs';
import 'chart.js/auto';

export default {
  name: 'CChartLine',
  components: {
    Line
  },
  props: {
    datasets: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: [Number, String],
      default: null
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets.map(dataset => ({
          label: dataset.label || '',
          backgroundColor: dataset.backgroundColor || 'rgba(0, 0, 0, 0.1)',
          borderColor: dataset.borderColor || dataset.backgroundColor || 'rgba(0, 0, 0, 0.1)',
          data: dataset.data || [],
          fill: dataset.fill !== undefined ? dataset.fill : false
        }))
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: this.options.maintainAspectRatio !== undefined 
          ? this.options.maintainAspectRatio 
          : true,
        ...this.options
      };
    }
  }
};
</script>
