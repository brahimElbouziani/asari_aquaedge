<template>
  <div class="account-settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Paramètres du compte</h1>
    </div>

    <!-- Main Container -->
    <div class="account-settings-container">
      <!-- Left Sidebar Navigation -->
      <aside class="settings-sidebar">
        <nav class="settings-nav">
          <a 
            href="#" 
            class="nav-item"
            :class="{ active: activeTab === 'profile' }"
            @click.prevent="setActiveTab('profile')"
          >
            <i class="pi pi-user"></i>
            <span>Mon Profil</span>
          </a>
          <a 
            href="#" 
            class="nav-item"
            :class="{ active: activeTab === 'security' }"
            @click.prevent="setActiveTab('security')"
          >
            <i class="pi pi-lock"></i>
            <span>Sécurité</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="settings-content">
        <!-- Profile Tab Content -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <edit-profile-form />
        </div>

        <!-- Security Tab Content -->
        <div v-if="activeTab === 'security'" class="tab-content" key="security">
          <security-settings />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { EditProfileForm } from "@/pages";
import SecuritySettings from "./UserProfile/SecuritySettings.vue";

export default {
  name: "UserProfile",
  components: {
    EditProfileForm,
    SecuritySettings
  },
  data() {
    return {
      activeTab: 'profile'
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    }
  }
};
</script>

<style scoped lang="scss">
.account-settings-page {
  padding: 2rem;
  min-height: calc(100vh - 200px);
  background: #f9fafb;
}

.page-header {
  margin-bottom: 2rem;
  
  .page-title {
    font-size: 1.5rem; // 24px - SaaS standard for page titles
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
}

.account-settings-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.settings-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  padding: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.875rem; // 14px - SaaS standard for navigation
  font-weight: 500;
  
  i {
    font-size: 1.125rem;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background: #f3f4f6;
    color: #1a1a1a;
  }
  
  &.active {
    background: #d1fae5;
    color: #059669;
    font-weight: 600;
    
    i {
      color: #059669;
    }
  }
}

.settings-content {
  flex: 1;
  min-width: 0;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}


// Responsive Design
@media (max-width: 1200px) {
  .account-settings-container {
    gap: 1.5rem;
  }
  
  .settings-sidebar {
    width: 220px;
  }
}

@media (max-width: 1024px) {
  .account-settings-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .settings-sidebar {
    width: 100%;
    position: relative;
    top: 0;
    padding: 1rem 0;
  }
  
  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
    gap: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }
    
    .nav-item {
      white-space: nowrap;
      flex-shrink: 0;
      padding: 0.625rem 1rem;
    }
  }
  
  .tab-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .account-settings-page {
    padding: 1rem;
    min-height: calc(100vh - 150px);
  }
  
  .page-header {
    margin-bottom: 1.5rem;
    
    .page-title {
      font-size: 1.375rem; // 22px on mobile
    }
  }
  
  .settings-sidebar {
    padding: 0.75rem 0;
    border-radius: 8px;
  }
  
  .settings-nav {
    padding: 0.5rem;
    gap: 0.5rem;
    
    .nav-item {
      padding: 0.625rem 0.875rem;
      font-size: 0.875rem;
      
      i {
        font-size: 1rem;
      }
    }
  }
  
  .tab-content {
    padding: 1.25rem;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .account-settings-page {
    padding: 0.75rem;
  }
  
  .page-header {
    margin-bottom: 1rem;
    
    .page-title {
      font-size: 1.125rem; // 18px on small mobile
    }
  }
  
  .settings-sidebar {
    padding: 0.5rem 0;
  }
  
  .settings-nav {
    padding: 0.375rem;
    gap: 0.375rem;
    
    .nav-item {
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      
      span {
        display: none;
      }
      
      i {
        margin: 0;
        font-size: 1.125rem;
      }
    }
  }
  
  .tab-content {
    padding: 1rem;
  }
}
</style>
