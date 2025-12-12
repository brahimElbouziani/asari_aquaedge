<template>
  <div class="otp-input-container">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="`input-${index}`"
      v-model="digits[index]"
      type="text"
      maxlength="1"
      class="otp-input"
      :class="{ 'is-complete': digits[index] }"
      :placeholder="placeholder"
      @input="handleInput(index, $event)"
      @keydown="handleKeyDown(index, $event)"
      @paste="handlePaste"
    />
  </div>
</template>

<script>
export default {
  name: 'OtpInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    numInputs: {
      type: Number,
      default: 6
    },
    separator: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '_'
    },
    shouldAutoFocus: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: 'text'
    }
  },
  data() {
    return {
      digits: []
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const newDigits = newVal.split('').slice(0, this.numInputs);
          while (newDigits.length < this.numInputs) {
            newDigits.push('');
          }
          this.digits = newDigits;
        } else {
          this.digits = Array(this.numInputs).fill('');
        }
      }
    }
  },
  mounted() {
    this.digits = Array(this.numInputs).fill('');
    if (this.shouldAutoFocus && this.$refs['input-0'] && this.$refs['input-0'][0]) {
      this.$refs['input-0'][0].focus();
    }
  },
  methods: {
    handleInput(index, event) {
      let value = event.target.value;
      
      // Only allow numbers if inputType is number
      if (this.inputType === 'number') {
        value = value.replace(/[^0-9]/g, '');
      }
      
      // Only take the last character if multiple are entered
      if (value.length > 1) {
        value = value.slice(-1);
      }
      
      this.$set(this.digits, index, value);
      
      // Move to next input if value entered
      if (value && index < this.numInputs - 1) {
        const nextInput = this.$refs[`input-${index + 1}`];
        if (nextInput && nextInput[0]) {
          nextInput[0].focus();
        }
      }
      
      this.emitValue();
    },
    handleKeyDown(index, event) {
      // Handle backspace
      if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
        const prevInput = this.$refs[`input-${index - 1}`];
        if (prevInput && prevInput[0]) {
          prevInput[0].focus();
        }
      }
      
      // Handle arrow keys
      if (event.key === 'ArrowLeft' && index > 0) {
        const prevInput = this.$refs[`input-${index - 1}`];
        if (prevInput && prevInput[0]) {
          prevInput[0].focus();
        }
      }
      
      if (event.key === 'ArrowRight' && index < this.numInputs - 1) {
        const nextInput = this.$refs[`input-${index + 1}`];
        if (nextInput && nextInput[0]) {
          nextInput[0].focus();
        }
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text').trim();
      const digits = pastedData.split('').slice(0, this.numInputs);
      
      digits.forEach((digit, index) => {
        if (this.inputType === 'number') {
          if (/[0-9]/.test(digit)) {
            this.$set(this.digits, index, digit);
          }
        } else {
          this.$set(this.digits, index, digit);
        }
      });
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = this.digits.findIndex(d => !d);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : this.numInputs - 1;
      const nextInput = this.$refs[`input-${focusIndex}`];
      if (nextInput && nextInput[0]) {
        nextInput[0].focus();
      }
      
      this.emitValue();
    },
    emitValue() {
      const value = this.digits.join('');
      this.$emit('input', value);
    }
  }
};
</script>

<style scoped>
.otp-input-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.otp-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.otp-input.is-complete {
  background-color: #e4e4e4;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>

