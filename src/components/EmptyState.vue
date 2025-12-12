<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <i :class="icon" v-if="icon"></i>
      <slot name="icon" v-else>
        <i class="pi pi-inbox"></i>
      </slot>
    </div>
    <h3 class="empty-state-title">{{ title }}</h3>
    <p class="empty-state-description">{{ description }}</p>
    <div class="empty-state-actions" v-if="$slots.actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'pi pi-inbox'
    },
    title: {
      type: String,
      default: 'Aucune donnée'
    },
    description: {
      type: String,
      default: 'Il n\'y a pas de données à afficher pour le moment.'
    }
  }
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.empty-state-icon {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.empty-state-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>






