<template>
  <Card class="stat-card" :class="{ 'clickable': clickable }" @click="handleClick">
    <template #content>
      <div class="stat-content">
        <div class="stat-icon" :style="iconStyle">
          <i :class="icon" v-if="icon"></i>
          <slot name="icon" v-else>
            <i class="pi pi-chart-line"></i>
          </slot>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">
            <span v-if="prefix">{{ prefix }}</span>{{ formattedValue }}<span v-if="suffix">{{ suffix }}</span>
          </h3>
          <p class="stat-label">{{ label }}</p>
          <div v-if="trend" class="stat-trend" :class="trendClass">
            <i :class="trendIcon"></i>
            <span>{{ trend }}%</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import { computed } from 'vue';
import Card from 'primevue/card';

export default {
  name: 'StatCard',
  components: {
    Card
  },
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'pi pi-chart-line'
    },
    iconGradient: {
      type: Array,
      default: () => ['#667eea', '#764ba2']
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    trend: {
      type: Number,
      default: null
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const formattedValue = computed(() => {
      if (typeof props.value === 'number') {
        return props.value.toLocaleString('fr-FR');
      }
      return props.value;
    });

    const iconStyle = computed(() => {
      return {
        background: `linear-gradient(135deg, ${props.iconGradient[0]} 0%, ${props.iconGradient[1]} 100%)`
      };
    });

    const trendClass = computed(() => {
      if (!props.trend) return '';
      return props.trend >= 0 ? 'trend-up' : 'trend-down';
    });

    const trendIcon = computed(() => {
      if (!props.trend) return '';
      return props.trend >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
    });

    const handleClick = () => {
      if (props.clickable) {
        emit('click');
      }
    };

    return {
      formattedValue,
      iconStyle,
      trendClass,
      trendIcon,
      handleClick
    };
  }
};
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-trend.trend-up {
  color: #4caf50;
}

.stat-trend.trend-down {
  color: #f44336;
}

.stat-trend i {
  font-size: 0.75rem;
}
</style>






