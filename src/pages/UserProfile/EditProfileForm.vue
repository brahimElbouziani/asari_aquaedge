<template>
  <div class="edit-profile-form">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="loading && !user" message="Chargement du profil..." />
    
    <!-- Password Confirmation Dialog -->
    <Dialog
      v-model:visible="showPasswordDialog"
      modal
      :closable="true"
      :draggable="false"
      :style="{ width: '90%', maxWidth: '500px' }"
    >
      <template #header>
        <div class="dialog-header">
          <h3>Confirmer votre mot de passe</h3>
        </div>
      </template>
      <div class="dialog-body">
        <p class="dialog-text">Pour enregistrer les modifications, veuillez saisir votre mot de passe actuel</p>
        <div class="password-field">
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Mot de passe actuel"
            v-model="currentPassword"
            :error-messages="passwordError"
            outlined
            dense
            @click:append="showPassword = !showPassword"
            @keyup.enter="confirmAndSave"
          ></v-text-field>
        </div>
      </div>
      <template #footer>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="showPasswordDialog = false; currentPassword = ''">
            Annuler
          </button>
          <button type="button" class="btn-save" @click="confirmAndSave" :disabled="loading || !currentPassword">
            <span v-if="loading">Enregistrement...</span>
            <span v-else>Confirmer et enregistrer</span>
          </button>
        </div>
      </template>
    </Dialog>

    <!-- My Profile Section -->
    <div class="profile-section" v-if="user">
      <div class="section-header">
        <div class="profile-info">
          <div class="profile-avatar">
            <img v-if="hasProfileImage" :src="profileImage" :alt="fullName" />
            <i v-else class="pi pi-user avatar-icon"></i>
            <div class="avatar-overlay">
              <i class="pi pi-camera"></i>
            </div>
          </div>
          <div class="profile-details">
            <h3 class="profile-name">{{ fullName }}</h3>
            <p class="profile-role">{{ user?.role || userRole || 'Utilisateur' }}</p>
            <p class="profile-location" v-if="user?.location || location">{{ user?.location || location }}</p>
          </div>
        </div>
        <button class="btn-edit" @click="editMode = !editMode">
          <i class="pi pi-pencil"></i>
          <span>{{ editMode ? 'Annuler' : 'Modifier' }}</span>
        </button>
      </div>
    </div>

    <!-- Personal Information Section -->
    <div class="info-section" v-if="user">
      <div class="section-title-bar">
        <h3 class="section-title">Informations personnelles</h3>
        <button class="btn-edit-icon" @click="editMode = !editMode" v-if="!editMode">
          <i class="pi pi-pencil"></i>
        </button>
      </div>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Prénom</label>
          <v-text-field
            v-model="firstname"
            :error-messages="firstNErrors"
            :disabled="!editMode"
            outlined
            dense
            @input="$v.firstname.$touch()"
            @blur="$v.firstname.$touch()"
            required
          />
        </div>
        
        <div class="form-field">
          <label>Nom</label>
          <v-text-field
            v-model="lastname"
            :error-messages="lastNErrors"
            :disabled="!editMode"
            outlined
            dense
            @input="$v.lastname.$touch()"
            @blur="$v.lastname.$touch()"
            required
          />
        </div>
        
        <div class="form-field">
          <label>Adresse e-mail</label>
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            :disabled="!editMode"
            type="email"
            outlined
            dense
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
            required
          />
        </div>
        
              <div class="form-field">
                <label>Téléphone</label>
                <v-text-field
                  v-model="phone"
                  :disabled="!editMode"
                  outlined
                  dense
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
      </div>
    </div>

          <!-- Address Section -->
          <div class="info-section" v-if="user">
            <div class="section-title-bar">
              <h3 class="section-title">Adresse</h3>
              <button class="btn-edit-icon" @click="editMode = !editMode" v-if="!editMode">
                <i class="pi pi-pencil"></i>
              </button>
            </div>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Pays</label>
          <v-text-field
            v-model="address.country"
            :disabled="!editMode"
            outlined
            dense
            placeholder="France"
          />
        </div>
        
        <div class="form-field">
          <label>Ville / Région</label>
          <v-text-field
            v-model="address.city"
            :disabled="!editMode"
            outlined
            dense
            placeholder="Paris, Île-de-France"
          />
        </div>
        
        <div class="form-field">
          <label>Code postal</label>
          <v-text-field
            v-model="address.postalCode"
            :disabled="!editMode"
            outlined
            dense
            placeholder="75001"
          />
        </div>
        
        <div class="form-field">
          <label>Numéro d'identification fiscale</label>
          <v-text-field
            v-model="address.taxId"
            :disabled="!editMode"
            outlined
            dense
            placeholder="FR12345678901"
          />
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

    <!-- Action Buttons -->
    <div class="form-actions" v-if="editMode">
      <button type="button" class="btn-cancel" @click="cancelEdit()">
        Annuler
      </button>
      <button type="button" class="btn-save-primary" @click="ft_update()" :disabled="loading">
        <span v-if="loading">Enregistrement...</span>
        <span v-else>Enregistrer les modifications</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useUser } from '@/composables/useUser';
import { userService } from '@/services/api/userService';
import Dialog from 'primevue/dialog';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: "edit-profile-form",
  components: {
    Dialog,
    LoadingSpinner
  },
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  setup() {
    // Use composable
    const { 
      user, 
      loading, 
      error, 
      success, 
      fullName, 
      hasProfileImage, 
      profileImage, 
      fetchUser, 
      updateProfile 
    } = useUser();

    // State
    const editMode = ref(false);
    const showPasswordDialog = ref(false);
    const showPassword = ref(false);
    const currentPassword = ref("");
    const passwordError = ref("");
    
    // Form data
    const firstname = ref("");
    const lastname = ref("");
    const email = ref("");
    const phone = ref("");
    const userRole = ref("");
    const location = ref("");
    const address = ref({
      country: "",
      city: "",
      postalCode: "",
      taxId: ""
    });
    
    const olddata = ref(null);
    const originalData = ref({});
    const rawUserData = ref(null); // Store raw API response

    // Validation errors
    const validationErrors = ref({
      firstname: [],
      lastname: [],
      email: []
    });

    // Computed
    const $v = computed(() => {
      const createField = () => ({
        $error: false,
        $dirty: false,
        $touch: function() { this.$dirty = true; }
      });
      return {
        firstname: createField(),
        lastname: createField(),
        email: createField(),
        $touch: function() {},
        $invalid: false
      };
    });

    // Watch user data and sync to form
    watch(user, (newUser) => {
      if (newUser) {
        email.value = newUser.email || "";
        firstname.value = newUser.firstname || "";
        lastname.value = newUser.lastname || "";
        phone.value = newUser.phone || "";
        userRole.value = newUser.role || "";
        location.value = newUser.location || "";
        address.value = { ...newUser.address } || {
          country: "",
          city: "",
          postalCode: "",
          taxId: ""
        };
        
        originalData.value = {
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          phone: phone.value,
          address: { ...address.value }
        };
      }
    }, { immediate: true });

    // Load user on mount
    onMounted(async () => {
      const { data } = await userService.getCurrentUser();
      if (data) {
        // Store raw API response for update
        rawUserData.value = data?.data || data;
        olddata.value = rawUserData.value;
        
        // Also fetch user to populate the form
        await fetchUser();
      }
    });

    // Methods
    function ft_update() {
      // Validate before showing password dialog
      $v.value.$touch();
      if ($v.value.$invalid) {
        return;
      }
      
      // Show password dialog to confirm identity
      showPasswordDialog.value = true;
      currentPassword.value = "";
      passwordError.value = "";
    }
    
    async function confirmAndSave() {
      if (!currentPassword.value) {
        passwordError.value = "Le mot de passe est requis";
        return;
      }
      
      passwordError.value = "";
      
      // Save profile with password confirmation (backend requires it)
      const profileData = {
        email: email.value,
        lastname: lastname.value,
        firstname: firstname.value,
        phone: phone.value,
        address: address.value,
        oldPassword: currentPassword.value // Backend requires old password for security
      };
      
      const successResult = await updateProfile(profileData, olddata.value);
      
      if (successResult) {
        showPasswordDialog.value = false;
        currentPassword.value = "";
        editMode.value = false;
      } else {
        // If update failed, it might be wrong password
        passwordError.value = "Mot de passe incorrect";
      }
    }
    
    function cancelEdit() {
      // Restore original data
      if (originalData.value) {
        firstname.value = originalData.value.firstname || "";
        lastname.value = originalData.value.lastname || "";
        email.value = originalData.value.email || "";
        phone.value = originalData.value.phone || "";
        address.value = { ...originalData.value.address } || { 
          country: "", 
          city: "", 
          postalCode: "", 
          taxId: "" 
        };
      }
      showPasswordDialog.value = false;
      currentPassword.value = "";
      passwordError.value = "";
      editMode.value = false;
      $v.value.$reset();
    }
    
    // Computed errors
    const emailErrors = computed(() => {
      const errors = [];
      if (!$v.value.email.$dirty) return errors;
      // Basic email validation
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.push("L'e-mail doit être valide");
      }
      if (!email.value) {
        errors.push("L'e-mail est requis");
      }
      return errors;
    });
    
    const firstNErrors = computed(() => {
      const errors = [];
      if (!$v.value.firstname.$dirty) return errors;
      if (firstname.value && firstname.value.length > 10) {
        errors.push("Le prénom doit contenir au maximum 10 caractères");
      }
      if (!firstname.value) {
        errors.push("Le prénom est requis");
      }
      return errors;
    });
    
    const lastNErrors = computed(() => {
      const errors = [];
      if (!$v.value.lastname.$dirty) return errors;
      if (lastname.value && lastname.value.length > 10) {
        errors.push("Le nom doit contenir au maximum 10 caractères");
      }
      if (!lastname.value) {
        errors.push("Le nom est requis");
      }
      return errors;
    });
    
    
    return {
      // User composable
      user,
      loading,
      error,
      success,
      fullName,
      hasProfileImage,
      profileImage,
      
      // State
      editMode,
      showPasswordDialog,
      showPassword,
      currentPassword,
      passwordError,
      
      // Form data
      firstname,
      lastname,
      email,
      phone,
      userRole,
      location,
      address,
      
      // Data
      olddata,
      originalData,
      
      // Validation
      validationErrors,
      $v,
      
      // Methods
      ft_update,
      confirmAndSave,
      cancelEdit,
      
      // Computed errors
      emailErrors,
      firstNErrors,
      lastNErrors
    };
  }
};
</script>

<style scoped lang="scss">
.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Password Dialog Styles
.dialog-header {
  h3 {
    font-size: 1.125rem; // 18px - SaaS standard for dialog headers
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
}

.dialog-body {
  .dialog-text {
    color: #6b7280;
    margin-bottom: 1.5rem;
    font-size: 0.875rem; // 14px - standard for dialog body text
  }
  
  .password-field {
    width: 100%;
  }
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
}

.btn-save {
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

// Profile Section
.profile-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-icon {
    font-size: 2.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
    
    i {
      color: white;
      font-size: 1.25rem;
    }
  }
  
  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.profile-details {
  h3.profile-name {
    font-size: 1.25rem; // 20px - SaaS standard for profile names
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.25rem 0;
  }
  
  .profile-role {
    color: #6b7280;
    font-size: 0.875rem; // 14px - slightly smaller for secondary info
    margin: 0 0 0.25rem 0;
  }
  
  .profile-location {
    color: #9ca3af;
    font-size: 0.8125rem; // 13px - smaller for tertiary info
    margin: 0;
  }
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  i {
    font-size: 1rem;
  }
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
}

// Info Sections
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .section-title {
    font-size: 1rem; // 16px - SaaS standard for section titles
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
  
  .btn-edit-icon {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s;
    
    i {
      font-size: 1rem;
    }
    
    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  .form-field-full {
    grid-column: 1 / -1;
  }
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

// Action Buttons
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
}

.btn-save,
.btn-save-primary {
  padding: 0.625rem 1.25rem;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #1d4ed8;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-section {
    .section-header {
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .profile-info {
      flex: 1;
      min-width: 0;
    }
  }
}

@media (max-width: 768px) {
  .edit-profile-form {
    gap: 1.5rem;
  }
  
  .profile-section {
    padding-bottom: 1.5rem;
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .profile-info {
      width: 100%;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }
    
    .profile-avatar {
      width: 100px;
      height: 100px;
      
      .avatar-icon {
        font-size: 3rem;
      }
    }
    
    .profile-details {
      width: 100%;
      
      .profile-name {
        font-size: 1.125rem; // 18px on mobile
      }
    }
    
    .btn-edit {
      width: 100%;
      justify-content: center;
    }
  }
  
  .info-section {
    gap: 1rem;
    
    .section-title-bar {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
    
    button {
      width: 100%;
    }
  }
  
  .dialog-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
    
    button {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .profile-section {
    .profile-avatar {
      width: 80px;
      height: 80px;
      
      .avatar-icon {
        font-size: 2.5rem;
      }
    }
    
    .profile-details {
      .profile-name {
        font-size: 1.125rem;
      }
      
      .profile-role,
      .profile-location {
        font-size: 0.875rem;
      }
    }
  }
  
  .section-title {
    font-size: 0.9375rem; // 15px on mobile
  }
  
  .form-field {
    label {
      font-size: 0.8125rem;
    }
  }
}
</style>
