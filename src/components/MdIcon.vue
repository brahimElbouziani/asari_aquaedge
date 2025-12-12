<!-- Vue 3 Migration - md-icon replacement -->
<template>
  <i class="material-icons md-icon">{{ name }}</i>
</template>

<script>
export default {
  name: 'MdIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.md-icon {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>


