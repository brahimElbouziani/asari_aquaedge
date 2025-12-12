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
      class="password-dialog-modal"
    >
      <template #header>
        <div class="dialog-header">
          <h3>Mettre à jour le profil</h3>
        </div>
      </template>
      <div class="dialog-body">
        <p class="dialog-text">Pour enregistrer les modifications, veuillez saisir votre mot de passe actuel</p>
        <div class="password-field">
          <v-text-field
            :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showOldPassword ? 'text' : 'password'"
            label="Mot de passe actuel"
            v-model="oldPassword"
            :error-messages="oldPasswordErrors"
            @input="validateOldPassword"
            @blur="validateOldPassword"
            required
            outlined
            dense
            @click:append="showOldPassword = !showOldPassword"
          ></v-text-field>
        </div>
      </div>
      <template #footer>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="showPasswordDialog = false">
            Annuler
          </button>
          <button type="button" class="btn-save" @click="handleSave" :disabled="loading">
            <span v-if="loading">Enregistrement...</span>
            <span v-else>Enregistrer les modifications</span>
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
            <p class="profile-role">{{ user.role || 'Utilisateur' }}</p>
            <p class="profile-location" v-if="user.location">{{ user.location }}</p>
          </div>
        </div>
        <button class="btn-edit" @click="toggleEditMode">
          <i class="pi pi-pencil"></i>
          <span>{{ editMode ? 'Annuler' : 'Modifier' }}</span>
        </button>
      </div>
    </div>

    <!-- Personal Information Section -->
    <div class="info-section" v-if="user">
      <div class="section-title-bar">
        <h3 class="section-title">Informations personnelles</h3>
        <button class="btn-edit-icon" @click="toggleEditMode" v-if="!editMode">
          <i class="pi pi-pencil"></i>
        </button>
      </div>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Prénom</label>
          <v-text-field
            v-model="formData.firstname"
            :error-messages="firstnameErrors"
            :disabled="!editMode"
            outlined
            dense
            @input="validateField('firstname')"
            @blur="validateField('firstname')"
            required
          />
        </div>
        
        <div class="form-field">
          <label>Nom</label>
          <v-text-field
            v-model="formData.lastname"
            :error-messages="lastnameErrors"
            :disabled="!editMode"
            outlined
            dense
            @input="validateField('lastname')"
            @blur="validateField('lastname')"
            required
          />
        </div>
        
        <div class="form-field">
          <label>Adresse e-mail</label>
          <v-text-field
            v-model="formData.email"
            :error-messages="emailErrors"
            :disabled="!editMode"
            type="email"
            outlined
            dense
            @input="validateField('email')"
            @blur="validateField('email')"
            required
          />
        </div>
        
        <div class="form-field">
          <label>Téléphone</label>
          <v-text-field
            v-model="formData.phone"
            :disabled="!editMode"
            outlined
            dense
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        
        <div class="form-field form-field-full">
          <label>Bio</label>
          <v-textarea
            v-model="formData.bio"
            :disabled="!editMode"
            outlined
            rows="3"
            placeholder="Décrivez-vous en quelques mots..."
          />
        </div>
      </div>
    </div>

    <!-- Address Section -->
    <div class="info-section" v-if="user">
      <div class="section-title-bar">
        <h3 class="section-title">Adresse</h3>
        <button class="btn-edit-icon" @click="toggleEditMode" v-if="!editMode">
          <i class="pi pi-pencil"></i>
        </button>
      </div>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Pays</label>
          <v-text-field
            v-model="formData.address.country"
            :disabled="!editMode"
            outlined
            dense
            placeholder="France"
          />
        </div>
        
        <div class="form-field">
          <label>Ville / Région</label>
          <v-text-field
            v-model="formData.address.city"
            :disabled="!editMode"
            outlined
            dense
            placeholder="Paris, Île-de-France"
          />
        </div>
        
        <div class="form-field">
          <label>Code postal</label>
          <v-text-field
            v-model="formData.address.postalCode"
            :disabled="!editMode"
            outlined
            dense
            placeholder="75001"
          />
        </div>
        
        <div class="form-field">
          <label>Numéro d'identification fiscale</label>
          <v-text-field
            v-model="formData.address.taxId"
            :disabled="!editMode"
            outlined
            dense
            placeholder="FR12345678901"
          />
        </div>
      </div>
    </div>

    <!-- Password Section -->
    <div class="info-section" v-if="editMode">
      <div class="section-title-bar">
        <h3 class="section-title">Changer le mot de passe</h3>
      </div>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Nouveau mot de passe</label>
          <v-text-field
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showNewPassword ? 'text' : 'password'"
            v-model="formData.newPassword"
            :error-messages="newPasswordErrors"
            outlined
            dense
            @input="validateField('newPassword')"
            @blur="validateField('newPassword')"
            @click:append="showNewPassword = !showNewPassword"
          />
        </div>
        
        <div class="form-field">
          <label>Confirmer le mot de passe</label>
          <v-text-field
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="formData.confirmPassword"
            :error-messages="confirmPasswordErrors"
            outlined
            dense
            @input="validateField('confirmPassword')"
            @blur="validateField('confirmPassword')"
            @click:append="showConfirmPassword = !showConfirmPassword"
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
      <button type="button" class="btn-cancel" @click="cancelEdit" :disabled="loading">
        Annuler
      </button>
      <button type="button" class="btn-save-primary" @click="handleUpdate" :disabled="loading || !isFormValid">
        <span v-if="loading">Enregistrement...</span>
        <span v-else>Enregistrer les modifications</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Dialog from 'primevue/dialog';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useUser } from '@/composables/useUser';
import { useToast } from 'primevue/usetoast';

// Composables
const { user, loading, error, success, fullName, hasProfileImage, profileImage, fetchUser, updateProfile } = useUser();
const toast = useToast();

// State
const editMode = ref(false);
const showPasswordDialog = ref(false);
const oldPassword = ref('');
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const originalData = ref(null);
const formData = ref({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  bio: '',
  newPassword: '',
  confirmPassword: '',
  address: {
    country: '',
    city: '',
    postalCode: '',
    taxId: ''
  }
});

// Validation state
const validationErrors = ref({
  firstname: [],
  lastname: [],
  email: [],
  newPassword: [],
  confirmPassword: [],
  oldPassword: []
});

// Computed
const isFormValid = computed(() => {
  return formData.value.firstname && 
         formData.value.lastname && 
         formData.value.email &&
         (!formData.value.newPassword || formData.value.newPassword === formData.value.confirmPassword);
});

const emailErrors = computed(() => validationErrors.value.email);
const firstnameErrors = computed(() => validationErrors.value.firstname);
const lastnameErrors = computed(() => validationErrors.value.lastname);
const newPasswordErrors = computed(() => validationErrors.value.newPassword);
const confirmPasswordErrors = computed(() => validationErrors.value.confirmPassword);
const oldPasswordErrors = computed(() => validationErrors.value.oldPassword);

// Methods
const validateField = (field) => {
  validationErrors.value[field] = [];
  
  switch (field) {
    case 'email':
      if (!formData.value.email) {
        validationErrors.value.email.push("L'e-mail est requis");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        validationErrors.value.email.push("L'e-mail doit être valide");
      }
      break;
    case 'firstname':
      if (!formData.value.firstname) {
        validationErrors.value.firstname.push("Le prénom est requis");
      } else if (formData.value.firstname.length > 10) {
        validationErrors.value.firstname.push("Le prénom doit contenir au maximum 10 caractères");
      }
      break;
    case 'lastname':
      if (!formData.value.lastname) {
        validationErrors.value.lastname.push("Le nom est requis");
      } else if (formData.value.lastname.length > 10) {
        validationErrors.value.lastname.push("Le nom doit contenir au maximum 10 caractères");
      }
      break;
    case 'newPassword':
      if (formData.value.newPassword && formData.value.newPassword.length < 6) {
        validationErrors.value.newPassword.push("Le mot de passe doit contenir au moins 6 caractères");
      }
      break;
    case 'confirmPassword':
      if (formData.value.newPassword && formData.value.confirmPassword !== formData.value.newPassword) {
        validationErrors.value.confirmPassword.push("Les mots de passe doivent être identiques");
      }
      break;
  }
};

const validateOldPassword = () => {
  validationErrors.value.oldPassword = [];
  if (!oldPassword.value) {
    validationErrors.value.oldPassword.push("Le mot de passe est requis");
  } else if (oldPassword.value.length < 6) {
    validationErrors.value.oldPassword.push("Le mot de passe doit contenir au moins 6 caractères");
  }
};

const toggleEditMode = () => {
  if (editMode.value) {
    cancelEdit();
  } else {
    editMode.value = true;
    originalData.value = JSON.parse(JSON.stringify(formData.value));
  }
};

const cancelEdit = () => {
  if (originalData.value) {
    formData.value = JSON.parse(JSON.stringify(originalData.value));
  }
  formData.value.newPassword = '';
  formData.value.confirmPassword = '';
  editMode.value = false;
  validationErrors.value = {
    firstname: [],
    lastname: [],
    email: [],
    newPassword: [],
    confirmPassword: [],
    oldPassword: []
  };
};

const handleUpdate = () => {
  // Validate all fields
  ['firstname', 'lastname', 'email'].forEach(field => validateField(field));
  
  if (formData.value.newPassword) {
    validateField('newPassword');
    validateField('confirmPassword');
  }
  
  if (!isFormValid.value) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez corriger les erreurs du formulaire', life: 3000 });
    return;
  }
  
  showPasswordDialog.value = true;
};

const handleSave = async () => {
  validateOldPassword();
  
  if (validationErrors.value.oldPassword.length > 0) {
    return;
  }
  
  showPasswordDialog.value = false;
  
  const profileData = {
    email: formData.value.email,
    firstname: formData.value.firstname,
    lastname: formData.value.lastname,
    phone: formData.value.phone,
    bio: formData.value.bio,
    address: formData.value.address,
    newPassword: formData.value.newPassword || undefined,
    oldPassword: oldPassword.value
  };
  
  const oldData = originalData.value;
  
  const success = await updateProfile(profileData, oldData);
  
  if (success) {
    editMode.value = false;
    formData.value.newPassword = '';
    formData.value.confirmPassword = '';
    oldPassword.value = '';
    toast.add({ 
      severity: 'success', 
      summary: 'Succès', 
      detail: 'Profil mis à jour avec succès', 
      life: 3000 
    });
  }
};

// Watch user data and update form
watch(user, (newUser) => {
  if (newUser) {
    formData.value = {
      firstname: newUser.firstname || '',
      lastname: newUser.lastname || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      bio: newUser.bio || '',
      newPassword: '',
      confirmPassword: '',
      address: { ...newUser.address }
    };
    originalData.value = JSON.parse(JSON.stringify(formData.value));
  }
}, { immediate: true });

// Load user data on mount
onMounted(async () => {
  await fetchUser();
});
</script>

<style scoped lang="scss">
// Styles are the same as EditProfileForm.vue
// Copy the styles from the original file or keep them here
// For now, we'll reference the original styles
</style>

