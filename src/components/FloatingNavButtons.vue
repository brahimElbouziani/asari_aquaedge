<template>
  <nav class="floating-nav" aria-label="Main navigation">
    <!-- Logo Button - Top -->
    <router-link 
      to="/" 
      class="floating-nav__button floating-nav__button--logo"
      :class="{ 'is-active': isActiveRoute('/') }"
      aria-label="Home"
    >
      <div class="floating-nav__logo-container">
        <img 
          :src="logoIcon" 
          alt="AgriEdge Icon" 
          class="floating-nav__logo-icon"
        />
        <img 
          :src="logoImage" 
          alt="AgriEdge Logo" 
          class="floating-nav__logo-full"
        />
      </div>
    </router-link>

    <!-- Navigation Buttons Container - Centered in middle -->
    <div class="floating-nav__middle">
      <router-link
        v-for="(item, index) in navItems"
        :key="`nav-${item.path}`"
        :to="item.path"
        class="floating-nav__button"
        :class="{ 'is-active': isActiveRoute(item.path) }"
        :style="{ '--animation-delay': `${index * 0.05}s` }"
        :aria-label="item.title"
        :title="item.title"
      >
        <component 
          :is="item.icon" 
          class="floating-nav__icon"
          :size="20"
        />
        <span class="floating-nav__tooltip">{{ item.title }}</span>
      </router-link>
    </div>

    <!-- Profile Button - Square design at bottom with dropdown -->
    <div 
      class="floating-nav__profile-container"
      @mouseenter="handleProfileHover"
      @mouseleave="handleProfileLeave"
      ref="profileContainer"
    >
      <router-link 
        to="/user" 
        class="floating-nav__button floating-nav__button--profile floating-nav__button--square"
        :class="{ 'is-active': isActiveRoute('/user') }"
        :aria-label="`${userName} - ${userRole}`"
        :title="`${userName} - ${userRole}`"
      >
        <img 
          v-if="hasProfileImage"
          :src="profileImage" 
          :alt="`${userName} profile`" 
          class="floating-nav__profile-img"
        />
        <img 
          v-else
          :src="defaultAvatar" 
          :alt="`${userName} avatar`" 
          class="floating-nav__profile-img floating-nav__default-avatar"
        />
        <span class="floating-nav__tooltip">{{ userName }}</span>
      </router-link>
      
      <!-- Profile Dropdown Menu -->
      <transition name="dropdown-fade">
        <div 
          v-show="showProfileDropdown"
          class="floating-nav__profile-dropdown"
          :style="dropdownStyle"
        >
          <div class="profile-dropdown__header">
            <div class="profile-dropdown__avatar">
              <img 
                v-if="hasProfileImage"
                :src="profileImage" 
                :alt="`${userName} profile`" 
              />
              <img 
                v-else
                :src="defaultAvatar" 
                :alt="`${userName} avatar`" 
              />
            </div>
            <div class="profile-dropdown__info">
              <div class="profile-dropdown__name">{{ userName }}</div>
              <div class="profile-dropdown__role">{{ userRole }}</div>
            </div>
          </div>
          <div class="profile-dropdown__divider"></div>
          <router-link 
            to="/user" 
            class="profile-dropdown__item"
            @click="closeDropdown"
          >
            <i class="pi pi-user"></i>
            <span>Mon Profil</span>
          </router-link>
          <button 
            class="profile-dropdown__item profile-dropdown__item--logout"
            @click="handleLogout"
          >
            <i class="pi pi-sign-out"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script>
import { defineComponent, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import { 
  LayoutDashboard, 
  Activity, 
  Database, 
  PlusCircle, 
  Bell
} from 'lucide-vue-next'

export default defineComponent({
  name: 'FloatingNavButtons',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useMainStore()
    
    const showProfileDropdown = ref(false)
    const dropdownStyle = ref({})
    const profileContainer = ref(null)

    // Navigation items configuration
    const navItems = [
      {
        path: '/dashboard',
        icon: LayoutDashboard,
        title: 'Tableau de bord'
      },
      {
        path: '/maps',
        icon: Activity,
        title: 'Capteurs'
      },
      {
        path: '/table',
        icon: Database,
        title: 'Données'
      },
      {
        path: '/Add',
        icon: PlusCircle,
        title: 'Ajouter un capteur'
      },
      {
        path: '/notifications',
        icon: Bell,
        title: 'Alertes'
      }
    ]

    // User data (should come from store/composable in production)
    const userName = 'Utilisateur'
    const userRole = 'Administrateur'
    const logoIcon = require('@/assets/img/edge.png') // Icon shown normally
    const logoImage = require('@/assets/img/logo2_.png') // Full logo shown on hover
    const defaultAvatar = require('@/assets/img/avatar.png') // Default avatar image
    
    // Check if user has uploaded a profile image
    // In production, this should check from user data/store/API
    const hasProfileImage = computed(() => {
      const userProfileImage = localStorage.getItem('userProfileImage')
      return userProfileImage !== null && userProfileImage !== '' && userProfileImage !== undefined
    })
    
    const profileImage = computed(() => {
      return localStorage.getItem('userProfileImage') || ''
    })

    // Check if route is active
    const isActiveRoute = (path) => {
      if (path === '/') {
        return route.path === '/' || route.path === '/dashboard'
      }
      return route.path === path || route.path.startsWith(path + '/')
    }

    // Handle profile hover
    const handleProfileHover = () => {
      updateDropdownPosition()
      showProfileDropdown.value = true
    }

    // Handle profile leave
    const handleProfileLeave = () => {
      showProfileDropdown.value = false
    }

    // Close dropdown
    const closeDropdown = () => {
      showProfileDropdown.value = false
    }

    // Update dropdown position
    const updateDropdownPosition = () => {
      if (profileContainer.value) {
        const rect = profileContainer.value.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const dropdownWidth = 180 // Reduced dropdown width
        const dropdownHeight = 140 // Approximate dropdown height
        
        // Check if dropdown would overflow on the right side
        const spaceOnRight = viewportWidth - rect.right
        const spaceOnLeft = rect.left
        
        // Calculate top position - move up significantly and ensure it doesn't go off screen
        let topPosition = rect.top - dropdownHeight - 20 // Position dropdown above the button with 20px gap
        if (topPosition < 10) {
          topPosition = 10 // Keep at least 10px from top
        } else if (topPosition + dropdownHeight > viewportHeight - 10) {
          topPosition = viewportHeight - dropdownHeight - 10 // Keep at least 10px from bottom
        }
        
        if (spaceOnRight < dropdownWidth + 20 && spaceOnLeft > dropdownWidth + 20) {
          // Show on left side if not enough space on right
          dropdownStyle.value = {
            position: 'fixed',
            right: `${viewportWidth - rect.left + 12}px`,
            top: `${topPosition}px`,
            transform: 'none',
            zIndex: '10000'
          }
        } else {
          // Show on right side (default)
          dropdownStyle.value = {
            position: 'fixed',
            left: `${rect.left + rect.width + 12}px`,
            top: `${topPosition}px`,
            transform: 'none',
            zIndex: '10000'
          }
        }
      }
    }

    // Handle logout
    const handleLogout = () => {
      localStorage.removeItem("authToken")
      store.khrjat()
      router.push("/login")
    }

    // Update position on resize
    const handleResize = () => {
      if (showProfileDropdown.value) {
        updateDropdownPosition()
      }
    }

    // Handle click outside to close dropdown
    const handleClickOutside = (event) => {
      if (profileContainer.value && !profileContainer.value.contains(event.target)) {
        showProfileDropdown.value = false
      }
    }

    // Watch route changes to close dropdown
    watch(() => route.path, () => {
      showProfileDropdown.value = false
    })

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      // Close dropdown when clicking outside
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      navItems,
      userName,
      userRole,
      logoIcon,
      logoImage,
      profileImage,
      hasProfileImage,
      defaultAvatar,
      isActiveRoute,
      showProfileDropdown,
      dropdownStyle,
      profileContainer,
      handleProfileHover,
      handleProfileLeave,
      closeDropdown,
      handleLogout
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/base/variables';
@import '@/assets/css/base/mixins';

.floating-nav {
  position: fixed;
  left: 1rem;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @include respond-to('tablet') {
    left: 0.875rem;
    gap: 0.625rem;
    padding-top: 0.875rem;
    padding-bottom: 0.875rem;
  }

  @include respond-to('mobile') {
    left: 0.5rem;
    gap: 0.5rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    // Better positioning for mobile
    width: auto;
  }
  
  // Extra small mobile devices
  @media (max-width: 480px) {
    left: 0.375rem;
    gap: 0.4rem;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }
  
  @media (max-width: 360px) {
    left: 0.3rem;
    gap: 0.35rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

// Middle section - Navigation buttons centered vertically
.floating-nav__middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  min-height: 0; // Allow flexbox to shrink

  @include respond-to('tablet') {
    gap: 0.625rem;
  }

  @include respond-to('mobile') {
    gap: 0.5rem;
    // Ensure buttons fit on screen
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    overflow-x: visible;
    // Smooth scrolling for many buttons
    -webkit-overflow-scrolling: touch;
  }
  
  @media (max-width: 480px) {
    gap: 0.4rem;
  }
  
  @media (max-width: 360px) {
    gap: 0.35rem;
  }
}

.floating-nav__button {
  position: relative;
  width: 52px;
  height: 52px;
  min-width: 52px;
  min-height: 52px;
  border-radius: var(--border-radius-full, 50%);
  // Glassmorphism effect - modern glass button
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all var(--transition-base, 0.3s) cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  padding: 0.75rem;
  box-sizing: border-box;
  opacity: 1;
  isolation: isolate;
  animation: floatIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
  animation-delay: var(--animation-delay, 0s);

  // Logo button - same size as other buttons
  &.floating-nav__button--logo {
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;

    @include respond-to('tablet') {
      width: 48px;
      height: 48px;
      min-width: 48px;
      min-height: 48px;
    }

    @include respond-to('mobile') {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
    }
    
    @media (max-width: 480px) {
      width: 36px;
      height: 36px;
      min-width: 36px;
      min-height: 36px;
    }
    
    @media (max-width: 360px) {
      width: 34px;
      height: 34px;
      min-width: 34px;
      min-height: 34px;
    }
  }

  // Hover state
  &:hover {
    transform: translateY(-2px) scale(1.08);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px) saturate(200%);
    -webkit-backdrop-filter: blur(25px) saturate(200%);
    box-shadow: 
      0 8px 16px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      0 0 0 2px rgba(76, 175, 80, 0.2);
    border-color: rgba(76, 175, 80, 0.4);

    .floating-nav__icon {
      color: var(--primary-color, #4CAF50);
      stroke: var(--primary-color, #4CAF50);
      transform: scale(1.1);
    }

    .floating-nav__tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
      pointer-events: auto;
    }
  }

  // Active state - Glass effect with primary color
  &.is-active {
    background: rgba(46, 125, 50, 0.9);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 
      0 4px 12px rgba(46, 125, 50, 0.4),
      0 2px 6px rgba(46, 125, 50, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(46, 125, 50, 0.5);

    .floating-nav__icon {
      color: var(--bg-white, #ffffff);
      stroke: var(--bg-white, #ffffff);
    }

    &:hover {
      transform: translateY(-2px) scale(1.08);
      background: rgba(46, 125, 50, 0.95);
      backdrop-filter: blur(25px) saturate(200%);
      -webkit-backdrop-filter: blur(25px) saturate(200%);
      box-shadow: 
        0 6px 16px rgba(46, 125, 50, 0.5),
        0 2px 8px rgba(46, 125, 50, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }

  // Focus state for accessibility
  &:focus-visible {
    outline: 2px solid var(--primary-color, #4CAF50);
    outline-offset: 2px;
  }

  @include respond-to('tablet') {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
    padding: 0.625rem;
  }

  @include respond-to('mobile') {
    // Reduced size for mobile - more compact
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    padding: 0.5rem;
    // Reduce hover effects on mobile for better performance
    -webkit-tap-highlight-color: rgba(76, 175, 80, 0.2);
  }
  
  // Extra small mobile devices
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    padding: 0.375rem;
  }
  
  // Very small mobile devices
  @media (max-width: 360px) {
    width: 34px;
    height: 34px;
    min-width: 34px;
    min-height: 34px;
    padding: 0.35rem;
  }
  
  // Touch device optimizations
  @media (hover: none) and (pointer: coarse) {
    // Remove hover transform on touch devices
    &:hover {
      transform: none;
    }
    
    // Active state for touch feedback
    &:active {
      transform: scale(0.95);
      background: rgba(255, 255, 255, 0.95);
    }
    
    &.is-active:active {
      transform: scale(0.95);
      background: rgba(46, 125, 50, 0.95);
    }
  }
}

// Logo button - Modern glass effect
.floating-nav__button--logo {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  padding: 0.5rem;
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.4);

  &:hover {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(30px) saturate(220%);
    -webkit-backdrop-filter: blur(30px) saturate(220%);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 8px 16px rgba(0, 0, 0, 0.12),
      0 3px 6px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
}

// Logo container - holds both images with 3D flip effect
.floating-nav__logo-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px; // Enable 3D perspective
  transform-style: preserve-3d;
  
  // Reduce perspective on mobile for better performance
  @include respond-to('mobile') {
    perspective: 600px;
  }
  
  @media (max-width: 480px) {
    perspective: 500px;
  }
}

// Icon (edge.png) - shown normally with 3D flip effect
.floating-nav__logo-icon {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 52px;
  max-height: 52px;
  min-width: 48px;
  min-height: 48px;
  object-fit: contain;
  flex-shrink: 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: rotateY(0deg) scale(1);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  z-index: 2;

  .floating-nav__button:hover & {
    transform: rotateY(180deg) scale(0.9);
    opacity: 0;
  }

  @include respond-to('tablet') {
    max-width: 38px;
    max-height: 38px;
    min-width: 36px;
    min-height: 36px;
  }

  @include respond-to('mobile') {
    max-width: 36px;
    max-height: 36px;
    min-width: 34px;
    min-height: 34px;
  }
  
  @media (max-width: 480px) {
    max-width: 32px;
    max-height: 32px;
    min-width: 30px;
    min-height: 30px;
  }
  
  @media (max-width: 360px) {
    max-width: 30px;
    max-height: 30px;
    min-width: 28px;
    min-height: 28px;
  }
  
  // Reduce 3D effect on mobile for performance
  @media (max-width: 768px) {
    transition: transform 0.4s ease, opacity 0.4s ease;
    
    .floating-nav__button:hover & {
      transform: rotateY(90deg) scale(0.85);
    }
  }
}

// Full logo (logo2_.png) - shown on hover with 3D flip effect
.floating-nav__logo-full {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 32px;
  max-height: 32px;
  min-width: 28px;
  min-height: 28px;
  object-fit: contain;
  flex-shrink: 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: rotateY(-180deg) scale(0.8);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

  .floating-nav__button:hover & {
    opacity: 1;
    transform: rotateY(0deg) scale(1.08);
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
  }

  @include respond-to('tablet') {
    max-width: 30px;
    max-height: 30px;
    min-width: 26px;
    min-height: 26px;
  }

  @include respond-to('mobile') {
    max-width: 28px;
    max-height: 28px;
    min-width: 26px;
    min-height: 26px;
  }
  
  @media (max-width: 480px) {
    max-width: 24px;
    max-height: 24px;
    min-width: 22px;
    min-height: 22px;
  }
  
  @media (max-width: 360px) {
    max-width: 22px;
    max-height: 22px;
    min-width: 20px;
    min-height: 20px;
  }
  
  // Reduce 3D effect on mobile for performance
  @media (max-width: 768px) {
    transition: transform 0.4s ease, opacity 0.4s ease;
    
    .floating-nav__button:hover & {
      transform: rotateY(0deg) scale(1);
    }
  }
}

// Profile button - Square design at bottom
.floating-nav__button--profile {
  margin-top: auto; // Push to bottom
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  overflow: hidden;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

// Square design modifier
.floating-nav__button--square {
  border-radius: var(--border-radius-md, 8px) !important;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius-md, 8px);
    padding: 2px;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(46, 125, 50, 0.3));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity var(--transition-base, 0.3s);
  }

  &:hover::before {
    opacity: 1;
  }

  &.is-active {
    border-color: rgba(46, 125, 50, 0.5);
    background: rgba(46, 125, 50, 0.9) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);

    &::before {
      opacity: 1;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
    }
  }
}

.floating-nav__profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-md, 8px);
  flex-shrink: 0;
  transition: transform var(--transition-base, 0.3s);

  .floating-nav__button:hover & {
    transform: scale(1.05);
  }
}

// Default avatar styling
.floating-nav__default-avatar {
  // Ensure default avatar fits nicely
  object-fit: contain;
  padding: 0.25rem;
  background: transparent;
  
  .floating-nav__button:hover & {
    transform: scale(1.05);
  }
}

// Icon styling
.floating-nav__icon {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  color: var(--text-secondary, #6b7280);
  stroke: currentColor;
  stroke-width: 2;
  transition: all var(--transition-base, 0.3s) cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  @include respond-to('tablet') {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
  }

  @include respond-to('mobile') {
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    // Better visibility on mobile
    stroke-width: 2.5;
  }
  
  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    stroke-width: 2.5;
  }
  
  @media (max-width: 360px) {
    width: 13px;
    height: 13px;
    min-width: 13px;
    min-height: 13px;
    stroke-width: 2.5;
  }
}

// Tooltip - Modern glass tooltip
.floating-nav__tooltip {
  position: absolute;
  left: calc(100% + 0.875rem);
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  // Glassmorphism tooltip
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--bg-white, #ffffff);
  padding: 0.375rem 0.5rem;
  border-radius: var(--border-radius-md, 8px);
  font-size: 0.5625rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.2;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 10000;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.01em;

  // Tooltip arrow - glass effect
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 6px 6px 0;
    border-color: transparent rgba(26, 26, 26, 0.95) transparent transparent;
    filter: blur(0.5px);
  }

  // Shine effect on tooltip
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius-md, 8px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @include respond-to('mobile') {
    display: none; // Hide tooltips on mobile to save space
  }
  
  // Show tooltip on long press for mobile (accessibility)
  @media (hover: none) and (pointer: coarse) {
    .floating-nav__button:active & {
      display: block;
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
      // Position above button on mobile to avoid keyboard
      top: auto;
      bottom: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%) translateY(0);
    }
  }
}

// Animation
@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateX(-20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

// Mobile-specific optimizations
@media (max-width: 768px) {
  .floating-nav {
    // Ensure nav doesn't overlap with content
    z-index: 9998;
  }
  
  .floating-nav__button {
    // Reduce animation complexity on mobile
    animation-duration: 0.3s;
    
    // Better touch feedback
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    // Prevent text selection on tap
    -webkit-user-select: none;
    user-select: none;
  }
  
  // Reduce backdrop filter on mobile for better performance
  .floating-nav__button,
  .floating-nav__button--logo,
  .floating-nav__button--profile {
    backdrop-filter: blur(15px) saturate(150%);
    -webkit-backdrop-filter: blur(15px) saturate(150%);
  }
}

// Landscape orientation adjustments
@media (max-width: 768px) and (orientation: landscape) {
  .floating-nav {
    gap: 0.35rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .floating-nav__middle {
    gap: 0.35rem;
  }
  
  .floating-nav__button {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
    padding: 0.45rem;
  }
  
  .floating-nav__button--logo {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
  }
  
  .floating-nav__icon {
    width: 15px;
    height: 15px;
    min-width: 15px;
    min-height: 15px;
  }
}

// Profile Container - For dropdown positioning
.floating-nav__profile-container {
  position: relative;
  margin-top: auto;
  overflow: visible !important;
}

// Profile Dropdown Menu - Modern SaaS style (Reduced size)
.floating-nav__profile-dropdown {
  position: fixed;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 3px 8px rgba(0, 0, 0, 0.05);
  min-width: 180px;
  max-width: 200px;
  overflow: hidden;
  padding: 0.375rem;
  z-index: 10000;
  pointer-events: auto;
  
  // Dropdown arrow - shows on left side pointing to button (smaller)
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 20px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 6px 6px 0;
    border-color: transparent rgba(255, 255, 255, 0.98) transparent transparent;
    filter: drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.05));
  }
  
  // Arrow for left-side positioning (when dropdown appears on left)
  &[style*="right"]::before {
    right: auto;
    left: 100%;
    border-width: 6px 0 6px 6px;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.98);
    filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.05));
  }
}

// Dropdown fade transition
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) translateX(-8px) !important;
}

// Profile Dropdown Header (Reduced size)
.profile-dropdown__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(249, 250, 251, 0.5);
  border-radius: 6px;
  margin-bottom: 0.375rem;
}

.profile-dropdown__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid rgba(76, 175, 80, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-dropdown__info {
  flex: 1;
  min-width: 0;
}

.profile-dropdown__name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-dropdown__role {
  font-size: 0.6875rem;
  color: #6b7280;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Dropdown Divider
.profile-dropdown__divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.375rem 0;
}

// Dropdown Items (Reduced size)
.profile-dropdown__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  border-radius: 6px;
  font-weight: 500;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  
  i {
    color: #6b7280;
    font-size: 0.875rem;
    transition: color 0.2s ease;
    font-family: 'primeicons' !important;
  }
  
  span {
    flex: 1;
  }
  
  &:hover {
    background: rgba(76, 175, 80, 0.08);
    color: #4caf50;
    
    i {
      color: #4caf50;
    }
  }
  
  // Logout item styling
  &.profile-dropdown__item--logout {
    color: #ef4444;
    
    i {
      color: #ef4444;
    }
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      
      i {
        color: #dc2626;
      }
    }
  }
}

// Mobile adjustments for dropdown
@include respond-to('mobile') {
  .floating-nav__profile-dropdown {
    min-width: 160px;
    max-width: 180px;
    padding: 0.25rem;
    
    &::before {
      border-width: 5px 5px 5px 0;
    }
  }
  
  .profile-dropdown__header {
    padding: 0.375rem;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .profile-dropdown__avatar {
    width: 28px;
    height: 28px;
  }
  
  .profile-dropdown__name {
    font-size: 0.6875rem;
  }
  
  .profile-dropdown__role {
    font-size: 0.625rem;
  }
  
  .profile-dropdown__divider {
    margin: 0.25rem 0;
  }
  
  .profile-dropdown__item {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.375rem;
    
    i {
      font-size: 0.8125rem;
    }
  }
}
</style>
