<template>
  <div class="content-wrapper">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script>
export default {};
</script>
<style>
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  margin-top: 0;
  padding: 0;
  background: #f9fafb;
  /* Height will be managed by parent flex container */
  /* Consistent left padding for floating buttons - inherited from parent */
  padding-left: inherit;
}

/* Ensure all direct children respect the padding */
.content-wrapper > * {
  padding-left: inherit;
}

/* Ensure page content is visible */
.content-wrapper > * {
  display: block;
  visibility: visible;
  opacity: 1;
  width: 100%;
  min-height: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
