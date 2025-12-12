<template>
  <div class="security-settings">
    <!-- Change Password Section -->
    <div class="security-section">
      <div class="section-header">
        <div>
          <h3 class="section-title">Changer le mot de passe</h3>
          <p class="section-description">Mettez à jour votre mot de passe pour sécuriser votre compte</p>
        </div>
      </div>

      <div class="form-container">
        <div class="form-grid">
          <div class="form-field">
            <label>Mot de passe actuel</label>
            <v-text-field
              :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showCurrentPassword ? 'text' : 'password'"
              v-model="passwordForm.currentPassword"
              :error-messages="currentPasswordErrors"
              outlined
              dense
              @input="validateField('currentPassword')"
              @blur="validateField('currentPassword')"
              @click:append="showCurrentPassword = !showCurrentPassword"
              placeholder="Entrez votre mot de passe actuel"
            />
          </div>

          <div class="form-field">
            <label>Nouveau mot de passe</label>
            <v-text-field
              :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showNewPassword ? 'text' : 'password'"
              v-model="passwordForm.newPassword"
              :error-messages="newPasswordErrors"
              outlined
              dense
              @input="validateField('newPassword')"
              @blur="validateField('newPassword')"
              @click:append="showNewPassword = !showNewPassword"
                    placeholder="Exemple: A_griedge2020"
            />
            <div class="password-requirements" v-if="passwordForm.newPassword">
              <p class="requirements-title">Le mot de passe doit contenir :</p>
              <ul class="requirements-list">
                <li :class="{ valid: /[A-Z]/.test(passwordForm.newPassword) }">
                  <i :class="/[A-Z]/.test(passwordForm.newPassword) ? 'pi pi-check' : 'pi pi-times'"></i>
                  Au moins une majuscule
                </li>
                <li :class="{ valid: /[a-z]/.test(passwordForm.newPassword) }">
                  <i :class="/[a-z]/.test(passwordForm.newPassword) ? 'pi pi-check' : 'pi pi-times'"></i>
                  Au moins une minuscule
                </li>
                <li :class="{ valid: /\d/.test(passwordForm.newPassword) }">
                  <i :class="/\d/.test(passwordForm.newPassword) ? 'pi pi-check' : 'pi pi-times'"></i>
                  Au moins un chiffre
                </li>
                <li :class="{ valid: /[^a-zA-Z\d]/.test(passwordForm.newPassword) }">
                  <i :class="/[^a-zA-Z\d]/.test(passwordForm.newPassword) ? 'pi pi-check' : 'pi pi-times'"></i>
                  Au moins un caractère spécial (_, -, @, #, etc.)
                </li>
                <li :class="{ valid: passwordForm.newPassword.length >= 8 }">
                  <i :class="passwordForm.newPassword.length >= 8 ? 'pi pi-check' : 'pi pi-times'"></i>
                  Au moins 8 caractères
                </li>
              </ul>
            </div>
          </div>

          <div class="form-field">
            <label>Confirmer le nouveau mot de passe</label>
            <v-text-field
              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="passwordForm.confirmPassword"
              :error-messages="confirmPasswordErrors"
              outlined
              dense
              @input="validateField('confirmPassword')"
              @blur="validateField('confirmPassword')"
              @click:append="showConfirmPassword = !showConfirmPassword"
              placeholder="Confirmez votre nouveau mot de passe"
            />
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            class="btn-save-primary" 
            @click="handleChangePassword"
            :disabled="loading || !isPasswordFormValid"
          >
            <span v-if="loading">Enregistrement...</span>
            <span v-else>Changer le mot de passe</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Two-Factor Authentication Section -->
    <div class="security-section">
      <div class="section-header">
        <div>
          <h3 class="section-title">Authentification à deux facteurs (2FA)</h3>
          <p class="section-description">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
        </div>
        <div class="toggle-container">
          <v-switch
            v-model="twoFactorEnabled"
            :disabled="loading2FA"
            color="primary"
            @change="handleToggle2FA"
          ></v-switch>
          <span class="toggle-label">{{ twoFactorEnabled ? 'Activé' : 'Désactivé' }}</span>
        </div>
      </div>
      <div v-if="twoFactorEnabled" class="two-factor-info">
        <div class="info-box">
          <i class="pi pi-info-circle"></i>
          <p>L'authentification à deux facteurs est activée. Vous devrez entrer un code de vérification à chaque connexion.</p>
        </div>
      </div>
    </div>

    <!-- Active Sessions Section -->
    <div class="security-section">
      <div class="section-header">
        <div>
          <h3 class="section-title">Sessions actives</h3>
          <p class="section-description">Gérez les appareils connectés à votre compte</p>
        </div>
        <button class="btn-refresh" @click="loadSessions" :disabled="loadingSessions">
          <i class="pi pi-refresh" :class="{ 'pi-spin': loadingSessions }"></i>
          Actualiser
        </button>
      </div>

      <div v-if="loadingSessions" class="loading-sessions">
        <LoadingSpinner message="Chargement des sessions..." />
      </div>

      <div v-else-if="sessions.length === 0" class="no-sessions">
        <i class="pi pi-desktop"></i>
        <p>Aucune session active</p>
      </div>

      <div v-else class="sessions-list">
        <div v-for="session in sessions" :key="session.id" class="session-item">
          <div class="session-info">
            <div class="session-icon">
              <i :class="getDeviceIcon(session.device)"></i>
            </div>
            <div class="session-details">
              <div class="session-device">{{ session.device }}</div>
              <div class="session-location">{{ session.location }}</div>
              <div class="session-time">{{ formatTime(session.lastActive) }}</div>
            </div>
          </div>
          <div class="session-actions">
            <span v-if="session.isCurrent" class="current-badge">Session actuelle</span>
            <button 
              v-else
              class="btn-delete-session" 
              @click="revokeSession(session.id)"
              :disabled="loadingSessions"
            >
              <i class="pi pi-sign-out"></i>
              Déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Preferences Section -->
    <div class="security-section">
      <div class="section-header">
        <div>
          <h3 class="section-title">Préférences de sécurité</h3>
          <p class="section-description">Configurez vos paramètres de sécurité</p>
        </div>
      </div>

      <div class="preferences-list">
        <div class="preference-item">
          <div class="preference-info">
            <h4>Notifications de sécurité</h4>
            <p>Recevez des alertes par email pour les activités suspectes</p>
          </div>
          <v-switch
            v-model="preferences.securityNotifications"
            color="primary"
            @change="savePreferences"
          ></v-switch>
        </div>

        <div class="preference-item">
          <div class="preference-info">
            <h4>Connexion automatique</h4>
            <p>Rester connecté sur cet appareil</p>
          </div>
          <v-switch
            v-model="preferences.rememberMe"
            color="primary"
            @change="savePreferences"
          ></v-switch>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="error" class="message-error">
      <i class="pi pi-exclamation-circle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-if="success" class="message-success">
      <i class="pi pi-check-circle"></i>
      <span>{{ success }}</span>
    </div>
    
    <!-- Success message for password change (more prominent) -->
    <div v-if="success && success.includes('mot de passe')" class="message-success-prominent">
      <i class="pi pi-check-circle"></i>
      <div class="success-content">
        <strong>Succès !</strong>
        <p>{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import { useToast } from 'primevue/usetoast';
import { userService } from '@/services/api/userService';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

// Initialize toast - use getCurrentInstance to access global properties
// This works around the injection issue in script setup
const instance = getCurrentInstance();
const toast = instance?.appContext?.config?.globalProperties?.$toast || (() => {
  // Try useToast as fallback
  try {
    return useToast();
  } catch (e) {
    // Final fallback - show alerts
    console.warn('Toast service not available');
    return {
      add: (options) => {
        const message = options.detail || options.summary || 'Notification';
        if (options.severity === 'success') {
          alert('✅ ' + message);
        } else if (options.severity === 'error') {
          alert('❌ ' + message);
        }
        console.log('Toast:', options);
      }
    };
  }
})();

// State
const loading = ref(false);
const loading2FA = ref(false);
const loadingSessions = ref(false);
const error = ref(null);
const success = ref(null);

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordErrors = ref({
  currentPassword: [],
  newPassword: [],
  confirmPassword: []
});

// Two-factor authentication
const twoFactorEnabled = ref(false);

// Sessions
const sessions = ref([]);

// Preferences
const preferences = ref({
  securityNotifications: true,
  rememberMe: true
});

// Password validation function matching backend requirements
// Backend requires: A_griedge2020 format (uppercase, lowercase, numbers, special chars)
const validatePasswordFormat = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Le mot de passe est requis');
    return errors;
  }
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[^a-zA-Z\d]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (ex: _, -, @, #, etc.)');
  }
  
  return errors;
};

// Computed
const isPasswordFormValid = computed(() => {
  // Check all fields are filled
  if (!passwordForm.value.currentPassword || 
      !passwordForm.value.newPassword || 
      !passwordForm.value.confirmPassword) {
    return false;
  }
  
  // Check passwords match
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    return false;
  }
  
  // Check password format (backend requirements)
  const formatErrors = validatePasswordFormat(passwordForm.value.newPassword);
  if (formatErrors.length > 0) {
    return false;
  }
  
  // Check passwords are different
  if (passwordForm.value.newPassword === passwordForm.value.currentPassword) {
    return false;
  }
  
  // Check no validation errors
  return passwordErrors.value.currentPassword.length === 0 &&
         passwordErrors.value.newPassword.length === 0 &&
         passwordErrors.value.confirmPassword.length === 0;
});

const currentPasswordErrors = computed(() => passwordErrors.value.currentPassword);
const newPasswordErrors = computed(() => passwordErrors.value.newPassword);
const confirmPasswordErrors = computed(() => passwordErrors.value.confirmPassword);

// Methods
const validateField = (field) => {
  passwordErrors.value[field] = [];
  
  switch (field) {
    case 'currentPassword':
      if (!passwordForm.value.currentPassword) {
        passwordErrors.value.currentPassword.push('Le mot de passe actuel est requis');
      }
      break;
    case 'newPassword':
      if (!passwordForm.value.newPassword) {
        passwordErrors.value.newPassword.push('Le nouveau mot de passe est requis');
      } else {
        // Validate password format (backend requirements)
        const formatErrors = validatePasswordFormat(passwordForm.value.newPassword);
        passwordErrors.value.newPassword.push(...formatErrors);
        
        // Additional validations
        if (passwordForm.value.newPassword === passwordForm.value.currentPassword) {
          passwordErrors.value.newPassword.push('Le nouveau mot de passe doit être différent de l\'actuel');
        }
      }
      break;
    case 'confirmPassword':
      if (!passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword.push('La confirmation est requise');
      } else if (passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
        passwordErrors.value.confirmPassword.push('Les mots de passe ne correspondent pas');
      }
      break;
  }
};

const handleChangePassword = async () => {
  // Validate all fields
  ['currentPassword', 'newPassword', 'confirmPassword'].forEach(field => validateField(field));
  
  if (!isPasswordFormValid.value) {
    toast.add({ 
      severity: 'error', 
      summary: 'Erreur', 
      detail: 'Veuillez corriger les erreurs du formulaire', 
      life: 3000 
    });
    return;
  }
  
  loading.value = true;
  error.value = null;
  success.value = null;
  
  try {
    // Get current user data for oldData
    const { data: userData } = await userService.getCurrentUser();
    const oldData = userData?.data || userData;
    
    const { data: responseData, error: apiError } = await userService.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
      oldData
    );
    
    if (apiError) {
      error.value = apiError;
      toast.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: apiError, 
        life: 3000 
      });
    } else {
      // Success - password changed
      success.value = 'Mot de passe modifié avec succès';
      toast.add({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Mot de passe modifié avec succès', 
        life: 5000 
      });
      
      // Reset form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      passwordErrors.value = {
        currentPassword: [],
        newPassword: [],
        confirmPassword: []
      };
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        success.value = null;
      }, 5000);
    }
  } catch (err) {
    error.value = err.message || 'Une erreur s\'est produite';
    toast.add({ 
      severity: 'error', 
      summary: 'Erreur', 
      detail: error.value, 
      life: 3000 
    });
  } finally {
    loading.value = false;
    setTimeout(() => {
      error.value = null;
      success.value = null;
    }, 3000);
  }
};

const handleToggle2FA = async () => {
  loading2FA.value = true;
  try {
    const { data, error: apiError } = await userService.toggle2FA(twoFactorEnabled.value);
    
    if (apiError) {
      // Revert toggle on error
      twoFactorEnabled.value = !twoFactorEnabled.value;
      toast.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: apiError || 'Impossible de modifier les paramètres 2FA', 
        life: 3000 
      });
    } else {
      toast.add({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: `Authentification à deux facteurs ${twoFactorEnabled.value ? 'activée' : 'désactivée'}`, 
        life: 3000 
      });
    }
  } catch (err) {
    // Revert toggle on error
    twoFactorEnabled.value = !twoFactorEnabled.value;
    toast.add({ 
      severity: 'error', 
      summary: 'Erreur', 
      detail: err.message || 'Impossible de modifier les paramètres 2FA', 
      life: 3000 
    });
  } finally {
    loading2FA.value = false;
  }
};

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let device = 'Unknown Device';
  let browser = 'Unknown Browser';
  
  // Detect device
  if (/iPhone|iPad|iPod/.test(ua)) {
    device = 'iPhone';
  } else if (/Android/.test(ua)) {
    device = 'Android';
  } else if (/Mac/.test(ua)) {
    device = 'Mac';
  } else if (/Windows/.test(ua)) {
    device = 'Windows';
  } else if (/Linux/.test(ua)) {
    device = 'Linux';
  }
  
  // Detect browser
  if (/Chrome/.test(ua) && !/Edge|Edg/.test(ua)) {
    browser = 'Chrome';
  } else if (/Firefox/.test(ua)) {
    browser = 'Firefox';
  } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    browser = 'Safari';
  } else if (/Edge|Edg/.test(ua)) {
    browser = 'Edge';
  }
  
  return `${device} - ${browser}`;
};

const loadSessions = async () => {
  loadingSessions.value = true;
  try {
    const { data, error: apiError } = await userService.getActiveSessions();
    
    if (apiError) {
      // Fallback: Show current session only if API fails
      const currentSession = {
        id: 'current-' + Date.now(),
        device: getDeviceInfo(),
        location: 'Session actuelle',
        lastActive: new Date(),
        isCurrent: true
      };
      sessions.value = [currentSession];
      
      toast.add({ 
        severity: 'warn', 
        summary: 'Information', 
        detail: 'Affichage de la session actuelle uniquement. Impossible de charger les sessions depuis le serveur.', 
        life: 3000 
      });
    } else {
      // Use backend data if available
      const sessionsData = data?.data || data || [];
      
      if (sessionsData.length > 0) {
        // Convert date strings to Date objects if needed
        sessions.value = sessionsData.map(session => ({
          ...session,
          lastActive: session.lastActive ? new Date(session.lastActive) : new Date()
        }));
      } else {
        // Fallback: Show current session if no sessions from backend
        const currentSession = {
          id: 'current-' + Date.now(),
          device: getDeviceInfo(),
          location: 'Session actuelle',
          lastActive: new Date(),
          isCurrent: true
        };
        sessions.value = [currentSession];
      }
    }
  } catch (err) {
    // Fallback: Show current session on error
    const currentSession = {
      id: 'current-' + Date.now(),
      device: getDeviceInfo(),
      location: 'Session actuelle',
      lastActive: new Date(),
      isCurrent: true
    };
    sessions.value = [currentSession];
    
    toast.add({ 
      severity: 'error', 
      summary: 'Erreur', 
      detail: 'Impossible de charger les sessions', 
      life: 3000 
    });
  } finally {
    loadingSessions.value = false;
  }
};

const revokeSession = async (sessionId) => {
  try {
    const { data, error: apiError } = await userService.revokeSession(sessionId);
    
    if (apiError) {
      toast.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: apiError || 'Impossible de déconnecter la session', 
        life: 3000 
      });
    } else {
      // Remove session from list
      sessions.value = sessions.value.filter(s => s.id !== sessionId);
      toast.add({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Session déconnectée avec succès', 
        life: 3000 
      });
    }
  } catch (err) {
    toast.add({ 
      severity: 'error', 
      summary: 'Erreur', 
      detail: err.message || 'Impossible de déconnecter la session', 
      life: 3000 
    });
  }
};

const savePreferences = async () => {
  try {
    const { data, error: apiError } = await userService.updateSecurityPreferences(preferences.value);
    
    if (apiError) {
      toast.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: apiError || 'Impossible d\'enregistrer les préférences', 
        life: 3000 
      });
    } else {
      toast.add({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Préférences enregistrées', 
        life: 2000 
      });
    }
  } catch (err) {
    toast.add({ 
      severity: 'error', 
      summary: 'Erreur', 
      detail: err.message || 'Impossible d\'enregistrer les préférences', 
      life: 3000 
    });
  }
};

const getDeviceIcon = (device) => {
  if (device.includes('iPhone') || device.includes('Android')) {
    return 'pi pi-mobile';
  } else if (device.includes('iPad')) {
    return 'pi pi-tablet';
  } else {
    return 'pi pi-desktop';
  }
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};

onMounted(async () => {
  // Load sessions
  loadSessions();
  
  // Load user data to get 2FA status and preferences
  try {
    const { data } = await userService.getCurrentUser();
    const userData = data?.data || data;
    
    if (userData) {
      // Set 2FA status
      if (userData.twoFactorEnabled !== undefined) {
        twoFactorEnabled.value = userData.twoFactorEnabled;
      }
      
      // Set security preferences
      if (userData.securityPreferences) {
        preferences.value = {
          securityNotifications: userData.securityPreferences.securityNotifications ?? true,
          rememberMe: userData.securityPreferences.rememberMe ?? true
        };
      }
    }
  } catch (err) {
    console.error('Error loading user security settings:', err);
  }
});
</script>

<style scoped lang="scss">
.security-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.security-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  .section-title {
    font-size: 1rem; // 16px - SaaS standard for section titles
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
  }
  
  .section-description {
    color: #6b7280;
    font-size: 0.875rem; // 14px - standard for descriptions
    margin: 0;
  }
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .toggle-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
}

.form-container {
  margin-top: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
}

.password-requirements {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  
  .requirements-title {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }
  
  .requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    
    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #6b7280;
      transition: color 0.2s;
      
      i {
        font-size: 0.875rem;
        width: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .pi-times {
        color: #ef4444;
      }
      
      .pi-check {
        color: #10b981;
      }
      
      &.valid {
        color: #059669;
        font-weight: 500;
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-save-primary {
  padding: 0.625rem 1.25rem;
  background: #059669;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #047857;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.two-factor-info {
  margin-top: 1rem;
  
  .info-box {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: #d1fae5;
    border-radius: 8px;
    border: 1px solid #6ee7b7;
    
    i {
      color: #059669;
      font-size: 1.25rem;
      margin-top: 0.125rem;
    }
    
    p {
      color: #047857;
      font-size: 0.875rem;
      margin: 0;
    }
  }
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  i.pi-spin {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-sessions,
.no-sessions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #9ca3af;
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: 0.9375rem;
  }
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.session-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
  
  i {
    font-size: 1.25rem;
    color: #6b7280;
  }
}

.session-details {
  .session-device {
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }
  
  .session-location {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .session-time {
    font-size: 0.75rem;
    color: #9ca3af;
  }
}

.session-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-badge {
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  color: #047857;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.btn-delete-session {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #fca5a5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.preference-info {
  flex: 1;
  
  h4 {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0 0 0.25rem 0;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
}

// Messages
.message-error,
.message-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  
  i {
    font-size: 1rem;
  }
}

.message-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.message-success-prominent {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 2px solid #10b981;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
  margin-top: 1rem;
  animation: slideIn 0.3s ease-out;
  
  i {
    font-size: 1.5rem;
    color: #10b981;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .success-content {
    flex: 1;
    
    strong {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #065f46;
    }
    
    p {
      margin: 0;
      font-size: 0.9375rem;
      color: #047857;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .preferences-list {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .security-settings {
    gap: 1.5rem;
  }
  
  .security-section {
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    
    .toggle-container {
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .form-container {
    margin-top: 1rem;
  }
  
  .form-grid {
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
  
  .session-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  
  .session-info {
    width: 100%;
  }
  
  .session-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    
    .preference-info {
      width: 100%;
    }
  }
  
  .btn-refresh {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .security-settings {
    gap: 1rem;
  }
  
  .security-section {
    padding: 1rem;
  }
  
  .section-header {
    .section-title {
      font-size: 0.9375rem; // 15px on mobile
    }
    
    .section-description {
      font-size: 0.8125rem; // 13px on mobile
    }
  }
  
  .session-item {
    padding: 0.75rem;
  }
  
  .session-icon {
    width: 36px;
    height: 36px;
    
    i {
      font-size: 1.125rem;
    }
  }
  
  .session-details {
    .session-device {
      font-size: 0.9375rem;
    }
    
    .session-location,
    .session-time {
      font-size: 0.8125rem;
    }
  }
  
  .preference-item {
    padding: 0.75rem;
    
    .preference-info {
      h4 {
        font-size: 0.875rem;
      }
      
      p {
        font-size: 0.8125rem;
      }
    }
  }
}
</style>

