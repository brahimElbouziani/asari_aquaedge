<template>
  <div :class="['md-card-content', contentClass]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MdCardContent',
  props: {
    contentClass: {
      type: [String, Object],
      default: ''
    }
  }
};
</script>

<style scoped>
.md-card-content {
  padding: 16px;
}
</style>


