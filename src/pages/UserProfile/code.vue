<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <span>****************</span>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: Boolean
    },
    methods: {
      closeModal() {
        console.log("**********************");
        this.$emit('update:isVisible', false);
      }
    }
  };
  </script>
  
  <style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    /* Add more styling as per your requirement */
  }
  </style>
  