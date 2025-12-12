<template>
  <button
    :type="type"
    :class="['md-button', buttonClass, { 'md-success': success, 'md-raised': raised }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MdButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    buttonClass: {
      type: [String, Object],
      default: ''
    },
    success: Boolean,
    raised: Boolean,
    disabled: Boolean
  },
  emits: ['click']
};
</script>

<style scoped>
.md-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.md-button.md-success {
  background-color: #4CAF50;
  color: white;
}
.md-button.md-success:hover:not(:disabled) {
  background-color: #45a049;
}
.md-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.md-button.md-raised {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>







