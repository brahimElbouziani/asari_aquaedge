<template>
  <div :class="['md-field', fieldClass]">
    <label v-if="label" :for="id">{{ label }}</label>
    <slot></slot>
    <span v-if="showError" class="md-error">{{ errorText }}</span>
  </div>
</template>

<script>
export default {
  name: 'MdField',
  props: {
    label: String,
    id: String,
    fieldClass: {
      type: [String, Object],
      default: ''
    },
    showError: Boolean,
    errorText: String
  }
};
</script>

<style scoped>
.md-field {
  margin-bottom: 16px;
}
.md-field label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}
.md-error {
  display: block;
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}
.md-invalid input {
  border-color: #f44336;
}
</style>







