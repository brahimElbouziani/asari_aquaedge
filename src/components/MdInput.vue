<template>
  <input
    :type="type"
    :name="name"
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :autocomplete="autocomplete"
    :class="inputClass"
    @input="handleInput"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script>
export default {
  name: 'MdInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    name: String,
    id: String,
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    autocomplete: String,
    inputClass: String
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>

<style scoped>
input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
input:focus {
  outline: none;
  border-color: #4CAF50;
}
input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>

