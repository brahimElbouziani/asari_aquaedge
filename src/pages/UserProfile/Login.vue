<template>
  <div class="login-page">
    <!-- Split Layout Container -->
    <div class="login-split-container">
      <!-- Left Side - Form Section -->
      <div class="login-form-side">
        <div class="form-wrapper">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logos-container">
              <img :src="imgLogo" alt="Logo" class="main-logo" />
              <div class="logo-divider"></div>
              <img :src="partnersLogo" alt="Partners Logo" class="partners-logo" />
            </div>
            <p class="brand-tagline">Valorise chaque goutte d'eau de votre irrigation</p>
          </div>

          <!-- Login Form -->
          <div v-if="showLoginForm && !showForgotPassword" class="auth-form login-form-wrapper">
            <div class="form-header-section">
              <h2 class="form-title">Authentification</h2>
             </div>

            <form @submit.prevent="signin()" class="auth-form-content">
              <!-- Email Input -->
              <div class="input-group">
                <label for="email" class="input-label">
                  <i class="pi pi-envelope"></i>
                  <span>Adresse email</span>
                </label>
                <InputText
                  id="email"
                  type="email"
                  v-model="form.email"
                  :disabled="sending"
                  placeholder="exemple@email.com"
                  class="modern-input"
                  :class="{ 'input-error': err && err.includes('email') }"
                />
                <transition name="fade">
                  <span v-if="err && err.includes('email')" class="error-message">
                    <i class="pi pi-exclamation-circle"></i>
                    {{ err }}
                  </span>
                </transition>
              </div>

              <!-- Password Input -->
              <div class="input-group">
                <label for="password" class="input-label">
                  <i class="pi pi-lock"></i>
                  <span>Mot de passe</span>
                </label>
                <Password
                  id="password"
                  v-model="form.password"
                  placeholder="Entrez votre mot de passe"
                  :feedback="false"
                  toggleMask
                  class="modern-password"
                  inputClass="modern-input"
                  :class="{ 'input-error': err && err.includes('password') }"
                />
                <transition name="fade">
                  <span v-if="err && err.includes('password')" class="error-message">
                    <i class="pi pi-exclamation-circle"></i>
                    {{ err }}
                  </span>
                </transition>
                <!-- Forgot Password Link -->
                <div class="forgot-password-link">
                  <a href="#" @click.prevent="showForgotPassword = true" class="forgot-link">
                    <i class="pi pi-question-circle"></i>
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <!-- General Error Message -->
              <transition name="fade">
                <Message 
                  v-if="err && !err.includes('email') && !err.includes('password')" 
                  severity="error" 
                  :closable="false" 
                  class="form-message"
                >
                  {{ err }}
                </Message>
              </transition>

              <!-- Submit Button -->
              <Button
                type="submit"
                :label="sending ? 'Connexion...' : 'Se connecter'"
                :icon="sending ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
                iconPos="right"
                :loading="sending"
                :disabled="sending || !form.email || !form.password"
                class="primary-button"
              />

              <!-- Form Divider -->
              <div class="form-divider">
                <span>ou</span>
              </div>

              <!-- Switch to Register Button -->
              <Button
                label="Créer un compte"
                icon="pi pi-user-plus"
                iconPos="right"
                class="secondary-button"
                @click="showLoginForm = false"
              />
            </form>
          </div>

          <!-- Forgot Password Form -->
          <div v-if="showForgotPassword" class="auth-form forgot-password-wrapper">
            <div class="form-header-section">
              <button @click="resetForgotPassword" class="back-button">
                <i class="pi pi-arrow-left"></i>
              </button>
              <h2 class="form-title">Réinitialiser le mot de passe</h2>
              <p class="form-subtitle">Suivez les étapes pour réinitialiser votre mot de passe</p>
            </div>

            <!-- Step 1: Enter Email -->
            <div v-if="forgotPasswordStep === 1" class="forgot-password-content">
              <div class="step-indicator">
                <div class="step active">
                  <div class="step-number">1</div>
                  <div class="step-label">Email</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-label">Code</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-label">Nouveau mot de passe</div>
                </div>
              </div>

              <form @submit.prevent="requestPasswordReset" class="auth-form-content">
                <div class="input-group">
                  <label for="reset-email" class="input-label">
                    <i class="pi pi-envelope"></i>
                    <span>Adresse email</span>
                  </label>
                  <InputText
                    id="reset-email"
                    type="email"
                    v-model="forgotPasswordData.email"
                    :disabled="sending"
                    placeholder="exemple@email.com"
                    class="modern-input"
                    :class="{ 'input-error': forgotPasswordError && forgotPasswordError.includes('email') }"
                  />
                  <transition name="fade">
                    <span v-if="forgotPasswordError && forgotPasswordError.includes('email')" class="error-message">
                      <i class="pi pi-exclamation-circle"></i>
                      {{ forgotPasswordError }}
                    </span>
                  </transition>
                </div>

                <transition name="fade">
                  <Message 
                    v-if="forgotPasswordError && !forgotPasswordError.includes('email')" 
                    severity="error" 
                    :closable="false" 
                    class="form-message"
                  >
                    {{ forgotPasswordError }}
                  </Message>
                </transition>

                <transition name="fade">
                  <Message 
                    v-if="forgotPasswordSuccess" 
                    severity="success" 
                    :closable="false" 
                    class="form-message"
                  >
                    {{ forgotPasswordSuccess }}
                  </Message>
                </transition>

                <Button
                  type="submit"
                  :label="sending ? 'Envoi...' : 'Envoyer le code'"
                  :icon="sending ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
                  iconPos="right"
                  :loading="sending"
                  :disabled="sending || !forgotPasswordData.email"
                  class="primary-button"
                />
              </form>
            </div>

            <!-- Step 2: Enter Verification Code -->
            <div v-if="forgotPasswordStep === 2" class="forgot-password-content">
              <div class="step-indicator">
                <div class="step completed">
                  <div class="step-number"><i class="pi pi-check"></i></div>
                  <div class="step-label">Email</div>
                </div>
                <div class="step-line active"></div>
                <div class="step active">
                  <div class="step-number">2</div>
                  <div class="step-label">Code</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-label">Nouveau mot de passe</div>
                </div>
              </div>

              <form @submit.prevent="verifyResetCode" class="auth-form-content">
                <div class="info-box">
                  <i class="pi pi-info-circle"></i>
                  <p>Un code de vérification a été envoyé à <strong>{{ forgotPasswordData.email }}</strong></p>
                </div>

                <div class="input-group">
                  <label for="reset-code" class="input-label">
                    <i class="pi pi-key"></i>
                    <span>Code de vérification</span>
                  </label>
                  <InputText
                    id="reset-code"
                    v-model="forgotPasswordData.code"
                    :disabled="sending"
                    placeholder="Entrez le code à 6 chiffres"
                    class="modern-input"
                    maxlength="6"
                    :class="{ 'input-error': forgotPasswordError && forgotPasswordError.includes('code') }"
                  />
                  <transition name="fade">
                    <span v-if="forgotPasswordError && forgotPasswordError.includes('code')" class="error-message">
                      <i class="pi pi-exclamation-circle"></i>
                      {{ forgotPasswordError }}
                    </span>
                  </transition>
                </div>

                <div class="resend-code">
                  <span>Vous n'avez pas reçu le code ?</span>
                  <a href="#" @click.prevent="requestPasswordReset" :disabled="sending" class="resend-link">
                    Renvoyer le code
                  </a>
                </div>

                <transition name="fade">
                  <Message 
                    v-if="forgotPasswordError && !forgotPasswordError.includes('code')" 
                    severity="error" 
                    :closable="false" 
                    class="form-message"
                  >
                    {{ forgotPasswordError }}
                  </Message>
                </transition>

                <Button
                  type="submit"
                  :label="sending ? 'Vérification...' : 'Vérifier le code'"
                  :icon="sending ? 'pi pi-spin pi-spinner' : 'pi pi-check-circle'"
                  iconPos="right"
                  :loading="sending"
                  :disabled="sending || !forgotPasswordData.code || forgotPasswordData.code.length !== 6"
                  class="primary-button"
                />
              </form>
            </div>

            <!-- Step 3: Enter New Password -->
            <div v-if="forgotPasswordStep === 3" class="forgot-password-content">
              <div class="step-indicator">
                <div class="step completed">
                  <div class="step-number"><i class="pi pi-check"></i></div>
                  <div class="step-label">Email</div>
                </div>
                <div class="step-line active"></div>
                <div class="step completed">
                  <div class="step-number"><i class="pi pi-check"></i></div>
                  <div class="step-label">Code</div>
                </div>
                <div class="step-line active"></div>
                <div class="step active">
                  <div class="step-number">3</div>
                  <div class="step-label">Nouveau mot de passe</div>
                </div>
              </div>

              <form @submit.prevent="resetPassword" class="auth-form-content">
                <div class="input-group">
                  <label for="new-password" class="input-label">
                    <i class="pi pi-lock"></i>
                    <span>Nouveau mot de passe</span>
                  </label>
                  <Password
                    id="new-password"
                    v-model="forgotPasswordData.newPassword"
                    placeholder="Exemple: A_griedge2020"
                    :feedback="true"
                    toggleMask
                    class="modern-password"
                    inputClass="modern-input"
                    :class="{ 'input-error': forgotPasswordError && forgotPasswordError.includes('password') }"
                  />
                  <div class="password-hint">
                    <i class="pi pi-info-circle"></i>
                    <span>Minimum 8 caractères, majuscule, minuscule, chiffre et caractère spécial</span>
                  </div>
                  <transition name="fade">
                    <span v-if="forgotPasswordError && forgotPasswordError.includes('password')" class="error-message">
                      <i class="pi pi-exclamation-circle"></i>
                      {{ forgotPasswordError }}
                    </span>
                  </transition>
                </div>

                <div class="input-group">
                  <label for="confirm-new-password" class="input-label">
                    <i class="pi pi-lock"></i>
                    <span>Confirmer le nouveau mot de passe</span>
                  </label>
                  <Password
                    id="confirm-new-password"
                    v-model="forgotPasswordData.confirmPassword"
                    placeholder="Confirmez votre nouveau mot de passe"
                    :feedback="false"
                    toggleMask
                    class="modern-password"
                    inputClass="modern-input"
                    :class="{ 'input-error': forgotPasswordError && forgotPasswordError.includes('confirmer') }"
                  />
                  <transition name="fade">
                    <span v-if="forgotPasswordError && forgotPasswordError.includes('confirmer')" class="error-message">
                      <i class="pi pi-exclamation-circle"></i>
                      {{ forgotPasswordError }}
                    </span>
                  </transition>
                </div>

                <transition name="fade">
                  <Message 
                    v-if="forgotPasswordError && !forgotPasswordError.includes('password') && !forgotPasswordError.includes('confirmer')" 
                    severity="error" 
                    :closable="false" 
                    class="form-message"
                  >
                    {{ forgotPasswordError }}
                  </Message>
                </transition>

                <transition name="fade">
                  <Message 
                    v-if="forgotPasswordSuccess" 
                    severity="success" 
                    :closable="false" 
                    class="form-message"
                  >
                    {{ forgotPasswordSuccess }}
                  </Message>
                </transition>

                <Button
                  type="submit"
                  :label="sending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'"
                  :icon="sending ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
                  iconPos="right"
                  :loading="sending"
                  :disabled="sending || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword"
                  class="primary-button"
                />
              </form>
            </div>
          </div>

          <!-- Register Form -->
          <div v-else-if="!showLoginForm && !showForgotPassword" class="auth-form register-form-wrapper">
            <div class="form-header-section">
              <h1 class="form-title">Inscription</h1>
              <p class="form-subtitle">Créez votre compte pour commencer</p>
            </div>

            <form @submit.prevent="registerUser" class="auth-form-content">
              <!-- Email Input -->
              <div class="input-group">
                <label for="register-email" class="input-label">
                  <i class="pi pi-envelope"></i>
                  <span>Adresse email</span>
                </label>
                <InputText
                  id="register-email"
                  type="email"
                  v-model="user.email"
                  :disabled="sending"
                  placeholder="exemple@email.com"
                  class="modern-input"
                  :class="{ 'input-error': registerError && registerError.includes('email') }"
                />
                <transition name="fade">
                  <span v-if="registerError && registerError.includes('email')" class="error-message">
                    <i class="pi pi-exclamation-circle"></i>
                    {{ registerError }}
                  </span>
                </transition>
              </div>

              <!-- Password Input -->
              <div class="input-group">
                <label for="register-password" class="input-label">
                  <i class="pi pi-lock"></i>
                  <span>Mot de passe</span>
                </label>
                <Password
                  id="register-password"
                  v-model="user.password"
                  placeholder="Exemple: A_griedge2020"
                  :feedback="false"
                  toggleMask
                  class="modern-password"
                  inputClass="modern-input"
                  :class="{ 'input-error': registerError && registerError.includes('password') }"
                />
                <!-- Custom Password Validation -->
                <div v-if="user.password" class="password-validation">
                  <div class="password-strength" :class="passwordStrengthClass">
                    <div class="strength-bar" :style="{ width: passwordStrengthPercentage + '%' }"></div>
                  </div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                  <ul class="password-requirements">
                    <li :class="{ 'met': passwordRequirements.minChars }">
                      <i :class="passwordRequirements.minChars ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                      Minimum 8 caractères
                    </li>
                    <li :class="{ 'met': passwordRequirements.uppercase }">
                      <i :class="passwordRequirements.uppercase ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                      Au moins une majuscule
                    </li>
                    <li :class="{ 'met': passwordRequirements.lowercase }">
                      <i :class="passwordRequirements.lowercase ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                      Au moins une minuscule
                    </li>
                    <li :class="{ 'met': passwordRequirements.number }">
                      <i :class="passwordRequirements.number ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                      Au moins un chiffre
                    </li>
                    <li :class="{ 'met': passwordRequirements.specialChar }">
                      <i :class="passwordRequirements.specialChar ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                      Au moins un caractère spécial
                    </li>
                  </ul>
                </div>
                <div v-else class="password-hint">
                  <i class="pi pi-info-circle"></i>
                  <span>Minimum 8 caractères, majuscule, minuscule, chiffre et caractère spécial</span>
                </div>
                <transition name="fade">
                  <span v-if="registerError && registerError.includes('password')" class="error-message">
                    <i class="pi pi-exclamation-circle"></i>
                    {{ registerError }}
                  </span>
                </transition>
              </div>

              <!-- Confirm Password Input -->
              <div class="input-group">
                <label for="confirmPassword" class="input-label">
                  <i class="pi pi-lock"></i>
                  <span>Confirmer le mot de passe</span>
                </label>
                <Password
                  id="confirmPassword"
                  v-model="user.confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  :feedback="false"
                  toggleMask
                  class="modern-password"
                  inputClass="modern-input"
                  :class="{ 'input-error': registerError && registerError.includes('confirmer') }"
                />
                <transition name="fade">
                  <span v-if="registerError && registerError.includes('confirmer')" class="error-message">
                    <i class="pi pi-exclamation-circle"></i>
                    {{ registerError }}
                  </span>
                </transition>
              </div>

              <!-- Registration Error Message -->
              <transition name="fade">
                <Message 
                  v-if="registerError && !registerError.includes('email') && !registerError.includes('password') && !registerError.includes('confirmer')" 
                  severity="error" 
                  :closable="false" 
                  class="form-message"
                >
                  {{ registerError }}
                </Message>
              </transition>

              <!-- Registration Success Message -->
              <transition name="fade">
                <Message 
                  v-if="registerSuccess" 
                  severity="success" 
                  :closable="false" 
                  class="form-message"
                >
                  {{ registerSuccess }}
                </Message>
              </transition>

              <!-- Submit Button -->
              <Button
                type="submit"
                :label="sending ? 'Inscription...' : 'Créer mon compte'"
                :icon="sending ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'"
                iconPos="right"
                :loading="sending"
                :disabled="sending || !user.email || !user.password || !user.confirmPassword || !isPasswordValid || user.password !== user.confirmPassword"
                class="primary-button"
              />

              <!-- Form Divider -->
              <div class="form-divider">
                <span>ou</span>
              </div>

              <!-- Switch to Login Button -->
              <Button
                label="J'ai déjà un compte"
                icon="pi pi-sign-in"
                iconPos="right"
                class="secondary-button"
                @click="showLoginForm = true"
              />
            </form>
          </div>
        </div>
      </div>

      <!-- Right Side - Image Section -->
      <div class="login-image-side" :style="{ backgroundImage: `url(${backgroundImage})` }">
      </div>
    </div>

  </div>
</template>

<script>
// ============================================
// IMPORTS
// ============================================
// Router
import router from "@/routes";

// Store
import { useMainStore } from '@/store';

// PrimeVue Components
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

// Services
import { authService } from '@/services/api/authService';

export default {
  name: "LoginPage",
  
  // ============================================
  // COMPONENTS
  // ============================================
  components: {
    InputText,
    Password,
    Button,
    Message
  },

  // ============================================
  // PROPS
  // ============================================
  props: {
    title: {
      type: String,
      default: "Vue MD"
    },
    sidebarBackgroundImage: {
      type: String,
      default: require("@/assets/img/sidebar-2.jpg")
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/logo2_agriedge.png")
    },
    sidebarItemColor: {
      type: String,
      default: "green",
      validator: value => {
        let acceptedValues = ["", "purple", "blue", "green", "orange", "red"];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },

  // ============================================
  // SETUP
  // ============================================
  setup() {
    const store = useMainStore();
    return { store };
  },

  // ============================================
  // DATA
  // ============================================
  data() {
    return {
      store: useMainStore(),
      
      // Form State
      showLoginForm: true,
      sending: false,
      showForgotPassword: false,
      forgotPasswordStep: 1, // 1: email, 2: code, 3: new password
      forgotPasswordData: {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      forgotPasswordError: '',
      forgotPasswordSuccess: '',
      
      // Login Form Data
      form: {
        email: null,
        password: null,
        firstName: null,
        lastName: null,
        gender: null,
        age: null
      },
      
      // Register Form Data
      user: {
        email: null,
        password: null,
        confirmPassword: null,
      },
      
      // Error States
      err: "",
      registerError: '',
      registerSuccess: '',
    };
  },

  // ============================================
  // COMPUTED
  // ============================================
  computed: {
    backgroundImage() {
      return require('@/assets/img/optimized_image.jpg');
    },
    
    partnersLogo() {
      return require('@/assets/img/partners-logo.png');
    },
    
    // Password validation for registration
    passwordRequirements() {
      const password = this.user.password || '';
      return {
        minChars: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[^a-zA-Z\d]/.test(password)
      };
    },
    
    passwordStrengthClass() {
      const req = this.passwordRequirements;
      const metCount = Object.values(req).filter(Boolean).length;
      
      if (metCount <= 2) return 'weak';
      if (metCount <= 3) return 'medium';
      return 'strong';
    },
    
    passwordStrengthPercentage() {
      const req = this.passwordRequirements;
      const metCount = Object.values(req).filter(Boolean).length;
      return (metCount / 5) * 100;
    },
    
    passwordStrengthText() {
      const req = this.passwordRequirements;
      const metCount = Object.values(req).filter(Boolean).length;
      
      if (metCount === 5) return 'Fort';
      if (metCount >= 3) return 'Moyen';
      return 'Faible';
    },
    
    isPasswordValid() {
      const password = this.user.password || '';
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password);
    },
    
    // Mock validation object (for compatibility)
    $v() {
      if (!this.form || !this.user) {
        const createField = () => ({
          $error: false,
          $dirty: false,
          $touch: function() { this.$dirty = true; },
          required: false,
          email: false
        });
        return {
          form: {
            email: createField(),
            password: createField()
          },
          user: {
            email: createField(),
            password: createField(),
            confirmPassword: createField()
          },
          $touch: function() {},
          $invalid: false
        };
      }
      
      const createField = () => ({
        $error: false,
        $dirty: false,
        $touch: function() { this.$dirty = true; },
        required: false,
        email: false
      });
      
      return {
        form: {
          firstName: createField(),
          lastName: createField(),
          age: createField(),
          gender: createField(),
          email: createField(),
          password: createField()
        },
        user: {
          name: createField(),
          email: createField(),
          phone: createField(),
          password: createField(),
          confirmPassword: createField()
        },
        $touch: function() {},
        $invalid: false
      };
    },
    
    phoneNumberError() {
      if (!this.$v || !this.$v.user || !this.$v.user.phone) {
        return '';
      }
      if (!this.$v.user.phone.required) {
        return 'The phone number is required';
      } else if (!this.user.phoneCorrect) {
        return 'Invalid phone number';
      }
      return '';
    }
  },

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================
  created() {
    // Check authentication state and redirect if already logged in
    this.$nextTick(() => {
      const token = localStorage.getItem('authToken');
      if (token && this.store.isAuthenticated) {
        router.push("/");
      }
    });
  },

  mounted() {
    // Initialize random number for background
    let totalCount = 6;
    this.num = Math.ceil(Math.random() * totalCount);
  },

  // ============================================
  // METHODS
  // ============================================
  methods: {
    // ============================================
    // Form Management Methods
    // ============================================
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
    },

    clearForm() {
      this.form = {
        password: null,
        firstName: null,
        lastName: null,
        gender: null,
        age: null,
        email: null
      };
    },

    validateUser() {
      if (this.$v && this.$v.$touch) {
        this.$v.$touch();
      }
      if (this.$v && !this.$v.$invalid) {
        this.saveUser();
      }
    },

    saveUser() {
      this.sending = true;
      window.setTimeout(() => {
        this.lastUser = `${this.form.firstName} ${this.form.lastName}`;
        this.userSaved = true;
        this.sending = false;
        this.clearForm();
      }, 1500);
    },

    // ============================================
    // Authentication Methods
    // ============================================
    /**
     * Format error message from backend to user-friendly message
     * @param {string} error - Raw error message from backend
     * @returns {string} - Formatted error message
     */
    formatErrorMessage(error) {
      if (!error) return 'Une erreur s\'est produite. Veuillez réessayer.';
      
      const errorStr = String(error).toLowerCase();
      
      // Clean up debug messages
      if (errorStr.includes('no nodes found') || errorStr.includes('uidapp') || errorStr.includes('here login')) {
        return 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
      }
      
      // Handle 500 Internal Server Error
      if (errorStr.includes('500') || errorStr.includes('internal server error') || errorStr.includes('erreur s\'est produite lors de la création')) {
        return 'Erreur serveur lors de la création du compte. Veuillez vérifier que tous les champs sont corrects et réessayer. Si le problème persiste, contactez le support.';
      }
      
      // Map common backend errors to user-friendly messages
      if (errorStr.includes('wrong password') || errorStr.includes('mot de passe incorrect')) {
        return 'Mot de passe incorrect. Veuillez réessayer.';
      }
      
      if (errorStr.includes('wrong email') || errorStr.includes('email incorrect') || errorStr.includes('user not found')) {
        return 'Aucun compte trouvé avec cet email.';
      }
      
      if (errorStr.includes('invalid') || errorStr.includes('invalide')) {
        return 'Email ou mot de passe invalide.';
      }
      
      if (errorStr.includes('unauthorized') || errorStr.includes('non autorisé')) {
        return 'Accès non autorisé. Veuillez vérifier vos identifiants.';
      }
      
      if (errorStr.includes('network') || errorStr.includes('timeout') || errorStr.includes('connection')) {
        return 'Problème de connexion. Vérifiez votre connexion internet.';
      }
      
      // If error contains email or password keywords, return generic auth error
      if (errorStr.includes('email') || errorStr.includes('password') || errorStr.includes('login')) {
        return 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
      }
      
      // Return cleaned error message (remove debug info)
      // Remove common debug patterns
      let cleaned = error
        .replace(/no nodes found with valid uidapp/gi, '')
        .replace(/here login\s*\d*/gi, '')
        .replace(/null/gi, '')
        .trim();
      
      // If cleaned message is too short or contains only debug info, return generic message
      if (cleaned.length < 5 || cleaned.match(/^(here|login|null|\d+)$/i)) {
        return 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
      }
      
      // Capitalize first letter
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    },
    
    async signin() {
      // Basic validation
      if (this.form.email && this.form.email.length >= 6 && this.form.password && this.form.password.length > 0) {
        this.sending = true;
        this.err = '';
        
        try {
          const result = await authService.login(this.form.email, this.form.password);
          
          if (result.data) {
            // Save token and user data
            const token = result.data.token || localStorage.getItem('authToken');
            if (token) {
              localStorage.setItem('authToken', token);
              if (result.data.type) localStorage.setItem('Type', result.data.type);
              if (result.data.logo) localStorage.setItem('Logo', result.data.logo);
              this.store.dkhlat(token);
              this.store.setToken(token);
            } else {
              this.store.dkhlat();
            }
            
            // Redirect to home
            router.push("/");
          } else {
            // Format error message for user
            this.err = this.formatErrorMessage(result.error);
            console.log('Login error (raw):', result.error);
            console.log('Login error (formatted):', this.err);
            this.store.khrjat();
          }
        } catch (er) {
          // Format error message for user
          this.err = this.formatErrorMessage(er.message || er.error || er);
          console.log('Login exception:', er);
          this.store.khrjat();
        } finally {
          this.sending = false;
        }
      } else {
        this.err = "Veuillez remplir tous les champs";
      }
    },

    // ============================================
    // Forgot Password Methods
    // ============================================
    resetForgotPassword() {
      this.showForgotPassword = false;
      this.showLoginForm = true;
      this.forgotPasswordStep = 1;
      this.forgotPasswordData = {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.forgotPasswordError = '';
      this.forgotPasswordSuccess = '';
    },

    async requestPasswordReset() {
      if (!this.forgotPasswordData.email) {
        this.forgotPasswordError = 'Veuillez entrer votre adresse email';
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.forgotPasswordData.email)) {
        this.forgotPasswordError = 'Format d\'email invalide';
        return;
      }

      this.sending = true;
      this.forgotPasswordError = '';
      this.forgotPasswordSuccess = '';

      try {
        const result = await authService.requestPasswordReset(this.forgotPasswordData.email);
        
        // Backend returns { message: "...", success: true } on success
        if (result.data && (result.data.success || result.data.message)) {
          this.forgotPasswordSuccess = result.data.message || 'Un code de vérification a été envoyé à votre adresse email.';
          this.forgotPasswordStep = 2;
          // Clear success message after 5 seconds
          setTimeout(() => {
            this.forgotPasswordSuccess = '';
          }, 5000);
        } else {
          this.forgotPasswordError = this.formatErrorMessage(result.error) || 'Impossible d\'envoyer le code. Veuillez réessayer.';
        }
      } catch (er) {
        this.forgotPasswordError = this.formatErrorMessage(er.message || er.error || er) || 'Une erreur s\'est produite. Veuillez réessayer.';
      } finally {
        this.sending = false;
      }
    },

    async verifyResetCode() {
      if (!this.forgotPasswordData.code || this.forgotPasswordData.code.length !== 6) {
        this.forgotPasswordError = 'Veuillez entrer un code de vérification à 6 chiffres';
        return;
      }

      this.sending = true;
      this.forgotPasswordError = '';
      this.forgotPasswordSuccess = '';

      try {
        const result = await authService.verifyResetCode(this.forgotPasswordData.email, this.forgotPasswordData.code);
        
        // Backend returns { message: "...", success: true } on success
        if (result.data && (result.data.success || result.data.message)) {
          this.forgotPasswordStep = 3;
          this.forgotPasswordSuccess = result.data.message || 'Code vérifié avec succès. Veuillez entrer votre nouveau mot de passe.';
          setTimeout(() => {
            this.forgotPasswordSuccess = '';
          }, 3000);
        } else {
          this.forgotPasswordError = this.formatErrorMessage(result.error) || 'Code de vérification invalide. Veuillez réessayer.';
        }
      } catch (er) {
        this.forgotPasswordError = this.formatErrorMessage(er.message || er.error || er) || 'Une erreur s\'est produite. Veuillez réessayer.';
      } finally {
        this.sending = false;
      }
    },

    async resetPassword() {
      // Validate password
      if (!this.forgotPasswordData.newPassword) {
        this.forgotPasswordError = 'Veuillez entrer un nouveau mot de passe';
        return;
      }

      // Validate password format (same as backend requirements)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
      if (!passwordRegex.test(this.forgotPasswordData.newPassword)) {
        this.forgotPasswordError = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
        return;
      }

      if (!this.forgotPasswordData.confirmPassword) {
        this.forgotPasswordError = 'Veuillez confirmer votre nouveau mot de passe';
        return;
      }

      if (this.forgotPasswordData.newPassword !== this.forgotPasswordData.confirmPassword) {
        this.forgotPasswordError = 'Les mots de passe ne correspondent pas';
        return;
      }

      this.sending = true;
      this.forgotPasswordError = '';
      this.forgotPasswordSuccess = '';

      try {
        const result = await authService.resetPassword(
          this.forgotPasswordData.email,
          this.forgotPasswordData.code,
          this.forgotPasswordData.newPassword
        );
        
        // Backend returns { message: "...", success: true } on success
        if (result.data && (result.data.success || result.data.message)) {
          this.forgotPasswordSuccess = result.data.message || 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.resetForgotPassword();
            this.showLoginForm = true;
          }, 3000);
        } else {
          this.forgotPasswordError = this.formatErrorMessage(result.error) || 'Impossible de réinitialiser le mot de passe. Veuillez réessayer.';
        }
      } catch (er) {
        this.forgotPasswordError = this.formatErrorMessage(er.message || er.error || er) || 'Une erreur s\'est produite. Veuillez réessayer.';
      } finally {
        this.sending = false;
      }
    },

    // ============================================
    // Registration Methods
    // ============================================
    async registerUser() {
      // Validation
      if (!this.user.email || !this.user.password || !this.user.confirmPassword) {
        this.registerError = 'Veuillez remplir tous les champs';
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.registerError = 'Format d\'email invalide';
        return;
      }
      
      // Validate password format (same as backend requirements)
      // Utiliser la même validation que l'indicateur visuel
      if (!this.isPasswordValid) {
        this.registerError = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (exemple: A_griedge2020)';
        return;
      }
      
      // Validate password confirmation
      if (this.user.password !== this.user.confirmPassword) {
        this.registerError = 'Les mots de passe ne correspondent pas';
        return;
      }
      
      this.sending = true;
      this.registerError = '';
      this.registerSuccess = '';
      
      try {
        // Use authService.createAdmin - it requires email, password, and nameCompany
        // We'll use email prefix as company name for simplicity
        const result = await authService.createAdmin(
          this.user.email,
          this.user.password,
          this.user.email.split('@')[0] // Use email prefix as company name
        );
        
        // Backend returns "User Add" as string on success, or "Already Exist!" if email exists
        // apiRequest wraps it in { data: response.data, error: null }
        const responseData = result.data;
        
        if (responseData === "User Add" || responseData === "Done") {
          this.registerSuccess = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
          
          // Clear form
          this.user = {
            email: null,
            password: null,
            confirmPassword: null
          };
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.showLoginForm = true;
            this.registerSuccess = '';
          }, 2000);
        } else if (responseData === "Already Exist!" || result.error === "Already Exist!" || result.error?.includes('existe') || result.error?.includes('Already')) {
          this.registerError = 'Cet email est déjà utilisé. Veuillez vous connecter.';
        } else if (result.error) {
          // Améliorer le message d'erreur pour les erreurs 500
          let errorMsg = this.formatErrorMessage(result.error);
          
          // Si c'est une erreur 500, donner plus de détails
          if (result.error.includes('500') || result.error.includes('Internal Server Error') || result.error.includes('erreur s\'est produite lors de la création')) {
            errorMsg = 'Erreur serveur lors de la création du compte. Veuillez vérifier que tous les champs sont corrects et réessayer. Si le problème persiste, contactez le support.';
          }
          
          this.registerError = errorMsg || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        } else {
          // Fallback si la réponse n'est pas reconnue
          this.registerError = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      } catch (error) {
        // Gestion améliorée des erreurs 500
        let errorMsg = this.formatErrorMessage(error.message || error.error || error);
        
        if (error.response?.status === 500 || error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
          errorMsg = 'Erreur serveur lors de la création du compte. Veuillez vérifier que tous les champs sont corrects et réessayer. Si le problème persiste, contactez le support.';
        }
        
        this.registerError = errorMsg || 'Une erreur s\'est produite. Veuillez réessayer.';
        console.error('Registration error:', error);
      } finally {
        this.sending = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// ============================================
// CSS VARIABLES
// ============================================
:root {
  --primary-color: #4CAF50;
  --primary-hover: #45a049;
  --primary-dark: #3d8b40;
  --error-color: #ef4444;
  --error-light: #fef2f2;
  --text-primary: #1a1a1a;
  --text-secondary: #6c757d;
  --text-muted: #9ca3af;
  --border-color: #e5e7eb;
  --border-hover: #d1d5db;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-input: #fafafa;
  --bg-disabled: #f3f4f6;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 6px 20px rgba(0, 0, 0, 0.1);
  --shadow-primary: 0 4px 12px rgba(22, 101, 52, 0.3);
  --shadow-primary-hover: 0 6px 20px rgba(22, 101, 52, 0.4);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 2.5rem;
  
  // PrimeVue button variables override - Set to invalid value to force direct background override
  --p-button-primary-background: none;
  --p-button-primary-border-color: transparent;
  --p-primary-color: rgba(22,101,52,.9);
  --p-primary-500: rgba(22,101,52,.9);
  --p-primary-600: rgba(22,101,52,1);
  --p-primary-400: rgba(132,204,22,.8);
}

// ============================================
// MAIN CONTAINER
// ============================================
.login-page {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden; // Prevent horizontal scroll
  overflow-y: auto;
  background: var(--bg-secondary);
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
  
  @media (max-width: 768px) {
    overflow-y: auto;
  }
}

.login-split-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
}

// ============================================
// FORM SIDE
// ============================================
.login-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--spacing-xl);
  overflow-y: auto;
  min-height: 100vh;
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
  
  @media (max-width: 1400px) {
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  @media (max-width: 1200px) {
    padding: var(--spacing-lg);
  }
  
  @media (max-width: 1024px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
    min-height: 100vh;
    align-items: flex-start;
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
  }
  
  @media (max-width: 576px) {
    padding: var(--spacing-md) var(--spacing-sm);
    padding-top: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
  }
  
  @media (max-width: 480px) {
    padding: var(--spacing-sm);
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
  }
  
  @media (max-width: 360px) {
    padding: var(--spacing-xs);
    padding-top: var(--spacing-sm);
  }
}

.form-wrapper {
  width: 100%;
  max-width: 480px;
  animation: fadeInLeft 0.6s ease-out;
  
  @media (max-width: 1400px) {
    max-width: 460px;
  }
  
  @media (max-width: 1200px) {
    max-width: 450px;
  }
  
  @media (max-width: 1024px) {
    max-width: 420px;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0;
    animation: fadeInUp 0.5s ease-out;
  }
  
  @media (max-width: 576px) {
    max-width: 100%;
    padding: 0;
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
    padding: 0;
  }
}

// ============================================
// IMAGE SIDE
// ============================================
.login-image-side {
  flex: 1;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  @media (max-width: 992px) {
    display: none;
  }
}

// ============================================
// LOGO SECTION
// ============================================
.logo-section {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 1024px) {
    margin-bottom: var(--spacing-xl);
  }
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-lg);
  }
  
  @media (max-width: 576px) {
    margin-bottom: var(--spacing-md);
  }
  
  @media (max-width: 480px) {
    margin-bottom: var(--spacing-sm);
  }
  
  .logos-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-sm);
    }
    
    @media (max-width: 576px) {
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xs);
    }
    
    @media (max-width: 480px) {
      gap: var(--spacing-xs);
    }
  }
  
  .main-logo,
  .partners-logo {
    width: 180px;
    height: 100px;
    object-fit: contain;
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-md);
    transition: transform 0.3s ease;
    flex-shrink: 0;
    
    &:hover {
      transform: scale(1.05);
    }
    
    @media (max-width: 1024px) {
      width: 160px;
      height: 90px;
      padding: var(--spacing-sm);
    }
    
    @media (max-width: 768px) {
      width: 140px;
      height: 80px;
      padding: var(--spacing-sm);
    }
    
    @media (max-width: 576px) {
      width: 120px;
      height: 70px;
      padding: var(--spacing-xs);
    }
    
    @media (max-width: 480px) {
      width: 100px;
      height: 60px;
      padding: var(--spacing-xs);
    }
  }
  
  .logo-divider {
    width: 2px;
    height: 60px;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--border-color),
      transparent
    );
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      height: 55px;
      width: 1.5px;
    }
    
    @media (max-width: 576px) {
      height: 50px;
      width: 1.5px;
    }
    
    @media (max-width: 480px) {
      height: 40px;
      width: 1px;
    }
  }
  
  .brand-name {
    font-size: 1.5rem; // 24px - Standard SaaS
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: -0.5px;
  }
  
  .brand-tagline {
    font-size: 0.875rem; // 14px - Standard SaaS
    color: var(--text-secondary);
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-xl);
    
    .main-logo {
      width: 90px;
      height: 90px;
      padding: 0.875rem;
    }
  }
  
  @media (max-width: 576px) {
    margin-bottom: var(--spacing-lg);
    
    .main-logo {
      width: 80px;
      height: 80px;
      padding: 0.75rem;
    }
    
    .brand-name {
      font-size: 1.375rem; // 22px
    }
    
    .brand-tagline {
      font-size: 0.8125rem; // 13px
    }
  }
}

// ============================================
// FORM CONTAINER
// ============================================
.auth-form {
  width: 100%;
}

.form-header-section {
  text-align: left;
  margin-bottom: var(--spacing-xl);
  position: relative;
  
  .form-title {
    font-size: 1.875rem; // 30px - Standard SaaS
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  
  .form-subtitle {
    font-size: 0.9375rem; // 15px - Standard SaaS
    color: var(--text-secondary);
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
  }
  
  @media (max-width: 1024px) {
    margin-bottom: var(--spacing-lg);
    
    .form-title {
      font-size: 1.75rem; // 28px
    }
    
    .form-subtitle {
      font-size: 0.875rem; // 14px
    }
  }
  
  @media (max-width: 768px) {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    
    .form-title {
      font-size: 1.5rem; // 24px
    }
    
    .form-subtitle {
      font-size: 0.875rem; // 14px
    }
  }
  
  @media (max-width: 576px) {
    margin-bottom: var(--spacing-md);
    
    .form-title {
      font-size: 1.375rem; // 22px
      margin-bottom: var(--spacing-xs);
    }
    
    .form-subtitle {
      font-size: 0.8125rem; // 13px
      line-height: 1.5;
    }
  }
  
  @media (max-width: 480px) {
    .form-title {
      font-size: 1.25rem; // 20px
    }
    
    .form-subtitle {
      font-size: 0.75rem; // 12px
    }
  }
}

.auth-form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    gap: var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    gap: var(--spacing-md);
  }
  
  @media (max-width: 576px) {
    gap: var(--spacing-sm);
  }
  
  @media (max-width: 480px) {
    gap: var(--spacing-xs);
  }
}

// ============================================
// INPUT GROUPS
// ============================================
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  
  @media (max-width: 1024px) {
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
  }
  
  @media (max-width: 768px) {
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
  }
  
  @media (max-width: 576px) {
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
  }
  
  @media (max-width: 480px) {
    gap: 0.375rem;
    margin-bottom: 0.375rem;
  }
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem; // 14px - Standard SaaS
  margin-bottom: var(--spacing-xs);
  line-height: 1.5;
  
  i {
    color: var(--primary-color);
    font-size: 0.875rem; // 14px - Aligned with label
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
  }
  
  span {
    display: inline-block;
    line-height: 1.5;
  }
  
  @media (max-width: 576px) {
    font-size: 0.8125rem; // 13px
    
    i {
      font-size: 0.8125rem; // 13px
      width: 16px;
      height: 16px;
    }
  }
}

// ============================================
// INPUT STYLES
// ============================================
:deep(.modern-input) {
  width: 100%;
  padding: 0.875rem var(--spacing-md);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem; // 16px - Standard SaaS
  background: var(--bg-input);
  line-height: 1.5;
  -webkit-appearance: none; // Remove iOS default styling
  touch-action: manipulation; // Better touch handling
  
  &:focus {
    border-color: var(--primary-color);
    background: var(--bg-primary);
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
    outline: none;
    transform: translateY(-1px);
  }
  
  &:hover:not(:disabled):not(:focus) {
    border-color: var(--border-hover);
    background: var(--bg-primary);
  }
  
  &::placeholder {
    color: var(--text-muted);
    opacity: 0.7;
    font-size: 0.9375rem; // 15px
  }
  
  &:disabled {
    background: var(--bg-disabled);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  @media (max-width: 1024px) {
    padding: 0.8125rem var(--spacing-sm);
    font-size: 0.9375rem; // 15px
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem var(--spacing-sm); // Larger touch target
    font-size: 1rem; // 16px - Better readability on tablets
    min-height: 48px; // Minimum touch target size
  }
  
  @media (max-width: 576px) {
    padding: 0.8125rem var(--spacing-sm);
    font-size: 0.9375rem; // 15px
    border-width: 1.5px;
    min-height: 46px;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem var(--spacing-sm);
    font-size: 0.875rem; // 14px
    min-height: 44px;
  }
  
  @media (max-width: 360px) {
    padding: 0.6875rem var(--spacing-xs);
    font-size: 0.8125rem; // 13px
    min-height: 42px;
  }
}

.input-error {
  :deep(.modern-input) {
    border-color: var(--error-color);
    background: var(--error-light);
    
    &:focus {
      border-color: var(--error-color);
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
  }
}

:deep(.modern-password) {
  width: 100%;
  
  .p-password-input {
    width: 100%;
    padding: 0.875rem var(--spacing-md);
    border-radius: var(--radius-md);
    border: 2px solid var(--border-color);
    transition: var(--transition);
    font-size: 1rem; // 16px - Standard SaaS
    background: var(--bg-input);
    
    &:focus {
      border-color: var(--primary-color);
      background: var(--bg-primary);
      box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
      outline: none;
    }
    
    &:hover:not(:disabled) {
      border-color: var(--border-hover);
      background: var(--bg-primary);
    }
    
    &::placeholder {
      color: var(--text-muted);
      font-size: 0.9375rem; // 15px
    }
    
    &:disabled {
      background: var(--bg-disabled);
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    @media (max-width: 576px) {
      padding: 0.75rem var(--spacing-sm);
      font-size: 0.875rem; // 14px
    }
  }
  
  .p-password-toggle {
    color: var(--text-secondary);
    
    &:hover {
      color: var(--primary-color);
    }
  }
}

// ============================================
// ERROR MESSAGES
// ============================================
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--error-color);
  font-size: 0.8125rem; // 13px - Standard SaaS
  font-weight: 500;
  margin-top: var(--spacing-xs);
  line-height: 1.5;
  
  i {
    font-size: 0.8125rem; // 13px - Aligned with text
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }
  
  @media (max-width: 576px) {
    font-size: 0.75rem; // 12px
    
    i {
      font-size: 0.8125rem;
    }
  }
}

.form-message {
  margin: 0;
  
  :deep(.p-message-content) {
    padding: 0.875rem var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: 0.875rem; // 14px - Standard SaaS
    
    @media (max-width: 576px) {
      padding: 0.75rem var(--spacing-sm);
      font-size: 0.8125rem; // 13px
    }
  }
}

// ============================================
// BUTTONS
// ============================================
// Global PrimeVue button override for primary buttons - Disable CSS variable usage
:deep(.primary-button.p-button),
:deep(.primary-button .p-button),
:deep(.primary-button),
:deep(.primary-button *) {
  --p-button-primary-background: none !important;
  --p-button-primary-border-color: transparent !important;
  --p-button-primary-border: none !important;
  --p-button-primary-hover-background: none !important;
  --p-button-primary-active-background: none !important;
}

.primary-button {
  width: 100%;
  margin-top: var(--spacing-md);
  
  @media (max-width: 768px) {
    margin-top: var(--spacing-sm);
  }
  
  @media (max-width: 480px) {
    margin-top: var(--spacing-xs);
  }
  
  :deep(.p-button),
  :deep(.p-button.p-component),
  :deep(.p-button.p-button-primary),
  :deep(button.p-button),
  :deep(button.p-button.p-component),
  :deep(button.p-button.p-button-primary) {
    width: 100% !important;
    padding: var(--spacing-md) var(--spacing-lg) !important;
    border-radius: var(--radius-md) !important;
    font-weight: 600 !important;
    font-size: 0.9375rem !important; // 15px - Standard SaaS
    border: none !important;
    border-width: 0 !important;
    border-color: transparent !important;
    border-style: none !important;
    background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
    background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
    background-color: transparent !important;
    background-clip: padding-box !important;
    color: white !important;
    --p-button-primary-background: none !important;
    --p-button-primary-border: none !important;
    --p-button-primary-hover-background: none !important;
    --p-button-primary-active-background: none !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-primary);
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
    touch-action: manipulation; // Better touch handling
    -webkit-tap-highlight-color: transparent; // Remove tap highlight
    
    // Fix icon positioning - icon should be AFTER label when iconPos="right"
    .p-button-label {
      order: 1;
      font-weight: 600;
      font-size: 0.9375rem !important; // 15px - Explicit size for consistency
      letter-spacing: 0.3px;
      display: inline-flex;
      align-items: center;
      line-height: 1.5;
    }
    
    .p-button-icon {
      order: 2;
      font-size: 0.9375rem; // 15px - Aligned with button text
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      margin: 0 !important;
      flex-shrink: 0;
    }
    
    // When iconPos="left" (default), reverse the order
    &.p-button-icon-left {
      .p-button-label {
        order: 2;
      }
      .p-button-icon {
        order: 1;
        margin-right: 0.5rem !important;
        margin-left: 0 !important;
      }
    }
    
    // Loading state
    .p-button-loading-icon {
      order: 1;
      margin-right: 0.5rem;
    }
    
    &:hover:not(:disabled),
    &:hover:not(:disabled).p-component,
    &:hover:not(:disabled).p-button-primary {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(22, 101, 52, 0.4) !important;
      background: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
      background-image: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
      background-color: transparent !important;
      background-clip: padding-box !important;
      border: none !important;
      border-width: 0 !important;
      border-color: transparent !important;
    }
    
    &:active:not(:disabled),
    &:focus:not(:disabled),
    &:active:not(:disabled).p-component,
    &:focus:not(:disabled).p-component {
      transform: translateY(0) !important;
      box-shadow: var(--shadow-primary) !important;
      background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
      background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
      background-color: transparent !important;
      border: none !important;
      border-color: transparent !important;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      background: var(--bg-disabled) !important;
      background-color: var(--bg-disabled) !important;
    }
    
    @media (max-width: 768px) {
      padding: 0.875rem var(--spacing-md);
      font-size: 0.875rem; // 14px
      min-height: 50px;
      gap: 0.375rem;
      
      .p-button-icon {
        font-size: 0.875rem; // 14px
      }
    }
    
    @media (max-width: 576px) {
      padding: 0.8125rem var(--spacing-sm);
      font-size: 0.8125rem; // 13px
      min-height: 48px;
      gap: 0.375rem;
      
      .p-button-icon {
        font-size: 0.8125rem; // 13px
      }
      
      .p-button-label {
        font-size: 0.8125rem; // 13px
      }
    }
  }
}

.secondary-button {
  width: 100%;
  
  :deep(.p-button),
  :deep(.p-button.p-component),
  :deep(.p-button.p-button-primary) {
    width: 100%;
    padding: 0.875rem var(--spacing-lg);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9375rem; // 15px - Standard SaaS
    border: none !important;
    border-width: 0 !important;
    border-color: transparent !important;
    border-style: none !important;
    background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
    background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
    background-color: transparent !important;
    color: white !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    --p-button-primary-background: none !important;
    --p-button-primary-border: none !important;
    
    .p-button-label {
      order: 1;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      line-height: 1.5;
    }
    
    .p-button-icon {
      order: 2;
      font-size: 0.9375rem; // 15px - Aligned with button text
      margin: 0 !important;
      color: white !important;
      display: inline-flex;
      align-items: center;
      line-height: 1;
      flex-shrink: 0;
    }
    
    &.p-button-icon-left {
      .p-button-label {
        order: 2;
      }
      .p-button-icon {
        order: 1;
        margin-right: 0.5rem !important;
        margin-left: 0 !important;
      }
    }
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
      background-image: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
      background-color: transparent !important;
      border: none !important;
      border-width: 0 !important;
      border-color: transparent !important;
      color: white !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(22, 101, 52, 0.4);
      --p-button-primary-hover-background: none !important;
      --p-button-primary-background: none !important;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    @media (max-width: 576px) {
      padding: 0.75rem var(--spacing-md);
      font-size: 0.875rem; // 14px
      min-height: 44px;
    }
  }
}

// ============================================
// FORM DIVIDER
// ============================================
.form-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: var(--spacing-sm) 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-color);
  }
  
  span {
    padding: 0 var(--spacing-md);
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  @media (max-width: 576px) {
    margin: var(--spacing-xs) 0;
    
    span {
      font-size: 0.8125rem;
      padding: 0 var(--spacing-sm);
    }
  }
}

// ============================================
// PHONE INPUT
// ============================================
.phone-input-wrapper {
  :deep(.vue-phone-number-input) {
    .input-phone-number {
      width: 100%;
      padding: 0.875rem var(--spacing-md);
      border-radius: var(--radius-md);
      border: 2px solid var(--border-color);
      transition: var(--transition);
      font-size: 1rem; // 16px - Standard SaaS
      background: var(--bg-input);
      
      &:focus {
        border-color: var(--primary-color);
        background: var(--bg-primary);
        box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
        outline: none;
      }
      
      &:hover:not(:disabled) {
        border-color: var(--border-hover);
        background: var(--bg-primary);
      }
      
      &::placeholder {
        color: var(--text-muted);
      }
      
      &:disabled {
        background: var(--bg-disabled);
        cursor: not-allowed;
        opacity: 0.6;
      }
      
      @media (max-width: 576px) {
        padding: 0.75rem var(--spacing-sm);
        font-size: 0.9rem;
      }
    }
  }
}

// ============================================
// ANIMATIONS
// ============================================
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================
// Extra small devices (phones, 576px and down)
@media (max-width: 576px) {
  .login-form-side {
    padding: var(--spacing-md) var(--spacing-sm);
  }
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) and (max-width: 768px) {
  .form-wrapper {
    max-width: 420px;
  }
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) and (max-width: 992px) {
  .login-form-side {
    padding: var(--spacing-xl);
  }
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  .login-split-container {
    flex-direction: row;
  }
}
// ============================================
// FORGOT PASSWORD STYLES
// ============================================
.forgot-password-link {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-xs);
  
  .forgot-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--primary-color);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    
    i {
      font-size: 0.875rem;
      transition: transform 0.2s ease;
    }
    
    &:hover {
      color: var(--primary-hover);
      background: rgba(76, 175, 80, 0.1);
      text-decoration: none;
      
      i {
        transform: translateX(2px);
      }
    }
    
    &:active {
      transform: scale(0.98);
    }
    
    @media (max-width: 1024px) {
      font-size: 0.8125rem;
      padding: 0.2rem 0.4rem;
    }
    
    @media (max-width: 768px) {
      font-size: 0.8125rem;
      gap: 0.3125rem;
      
      i {
        font-size: 0.8125rem;
      }
    }
    
    @media (max-width: 576px) {
      font-size: 0.75rem;
      padding: 0.1875rem 0.375rem;
      
      i {
        font-size: 0.75rem;
      }
    }
  }
}

.forgot-password-wrapper {
  animation: slideIn 0.3s ease-out;
  
  .form-header-section {
    position: relative;
    padding-left: 0;
    padding-top: 3rem;
    
    .back-button {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--border-color);
      background: var(--bg-primary);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
      
      i {
        font-size: 1rem;
      }
      
      &:hover {
        border-color: rgba(22,101,52,.9);
        color: rgba(22,101,52,.9);
        background: rgba(22, 101, 52, 0.1);
        transform: translateX(-2px);
      }
      
      &:active {
        transform: translateX(-4px);
      }
    }
    
    .form-title {
      margin-top: 0;
      padding-right: 0;
    }
    
    .form-subtitle {
      padding-right: 0;
    }
    
    @media (max-width: 768px) {
      padding-top: 2.75rem;
      text-align: center;
      
      .back-button {
        width: 36px;
        height: 36px;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        
        i {
          font-size: 0.9375rem;
        }
        
        &:hover {
          transform: translateX(-50%) translateX(-2px);
        }
        
        &:active {
          transform: translateX(-50%) translateX(-4px);
        }
      }
      
      .form-title,
      .form-subtitle {
        text-align: center;
      }
    }
    
    @media (max-width: 576px) {
      padding-top: 2.5rem;
      
      .back-button {
        width: 32px;
        height: 32px;
        
        i {
          font-size: 0.875rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      padding-top: 2.25rem;
      
      .back-button {
        width: 28px;
        height: 28px;
        
        i {
          font-size: 0.8125rem;
        }
      }
    }
  }
}

.forgot-password-content {
  animation: fadeIn 0.3s ease-out;
}

// Step Indicator
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md) 0;
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    flex: 1;
    position: relative;
    
    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem; // 14px - Standard SaaS
      background: var(--bg-disabled);
      color: var(--text-muted);
      border: 2px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      i {
        font-size: 0.875rem; // 14px - Aligned with text
        color: white;
      }
    }
    
    .step-label {
      font-size: 0.8125rem; // 13px - Standard SaaS
      color: var(--text-muted);
      text-align: center;
      font-weight: 500;
      max-width: 80px;
      line-height: 1.3;
      transition: all 0.3s ease;
    }
    
    &.active {
      .step-number {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
        color: white;
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        transform: scale(1.1);
      }
      
      .step-label {
        color: var(--primary-color);
        font-weight: 600;
      }
    }
    
    &.completed {
      .step-number {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
        color: white;
        border-color: var(--primary-color);
      }
      
      .step-label {
        color: var(--text-primary);
      }
    }
  }
  
  .step-line {
    flex: 1;
    height: 2px;
    background: var(--border-color);
    margin: 0 var(--spacing-sm);
    transition: all 0.3s ease;
    border-radius: 2px;
    
    &.active {
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-hover) 100%);
      box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
    }
  }
  
  @media (max-width: 1024px) {
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-sm) 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-sm) 0;
    
    .step {
      .step-number {
        width: 36px;
        height: 36px;
        font-size: 0.875rem;
      }
      
      .step-label {
        font-size: 0.75rem; // 12px
        max-width: 70px;
      }
    }
    
    .step-line {
      margin: 0 var(--spacing-xs);
    }
  }
  
  @media (max-width: 576px) {
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-xs) 0;
    
    .step {
      .step-number {
        width: 32px;
        height: 32px;
        font-size: 0.8125rem; // 13px
      }
      
      .step-label {
        font-size: 0.6875rem; // 11px
        max-width: 50px;
        line-height: 1.2;
      }
    }
    
    .step-line {
      margin: 0 var(--spacing-xs);
      height: 1.5px;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: var(--spacing-xs);
    padding: var(--spacing-xs) 0;
    
    .step {
      .step-number {
        width: 28px;
        height: 28px;
        font-size: 0.75rem;
      }
      
      .step-label {
        font-size: 0.5625rem;
        max-width: 45px;
      }
    }
  }
}

// Info Box
.info-box {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  animation: fadeIn 0.3s ease-out;
  
  i {
    color: var(--primary-color);
    font-size: 1.25rem;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.6;
    
    strong {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
  
  @media (max-width: 1024px) {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
    
    i {
      font-size: 1.125rem;
    }
    
    p {
      font-size: 0.8125rem;
      line-height: 1.5;
    }
  }
  
  @media (max-width: 576px) {
    padding: var(--spacing-xs) var(--spacing-sm);
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
    
    i {
      font-size: 1rem;
      margin-top: 0.0625rem;
    }
    
    p {
      font-size: 0.75rem;
      line-height: 1.4;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    i {
      margin-top: 0;
    }
  }
}

// Resend Code
.resend-code {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: calc(-1 * var(--spacing-md));
  
  .resend-link {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    
    &:hover:not(:disabled) {
      color: var(--primary-hover);
      text-decoration: underline;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  @media (max-width: 576px) {
    font-size: 0.8125rem;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

// Password Validation
.password-validation {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  
  @media (max-width: 576px) {
    padding: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
  
  .password-strength {
    height: 6px;
    background: var(--bg-disabled);
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: var(--spacing-xs);
    position: relative;
    
    .strength-bar {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      border-radius: var(--radius-sm);
    }
    
    &.weak .strength-bar {
      background: #ef4444;
    }
    
    &.medium .strength-bar {
      background: #f59e0b;
    }
    
    &.strong .strength-bar {
      background: #10b981;
    }
  }
  
  .strength-text {
    display: block;
    font-size: 0.8125rem; // 13px - Standard SaaS
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
  }
  
  .password-strength.weak ~ .strength-text {
    color: #ef4444;
  }
  
  .password-strength.medium ~ .strength-text {
    color: #f59e0b;
  }
  
  .password-strength.strong ~ .strength-text {
    color: #10b981;
  }
  
  .password-requirements {
    list-style: none;
    padding: 0;
    margin: var(--spacing-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    
    @media (max-width: 480px) {
      gap: 0.375rem;
    }
    
    li {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.8125rem; // 13px - Standard SaaS
      color: var(--text-secondary);
      transition: color 0.2s ease;
      
      @media (max-width: 480px) {
        font-size: 0.75rem; // 12px
        gap: 0.375rem;
      }
      
      i {
        font-size: 0.8125rem; // 13px - Aligned with text
        transition: color 0.2s ease;
        
        @media (max-width: 480px) {
          font-size: 0.75rem; // 12px
        }
      }
      
      &.met {
        color: #10b981;
        
        i {
          color: #10b981;
        }
      }
      
      &:not(.met) {
        color: #6b7280;
        
        i {
          color: #ef4444;
        }
      }
    }
  }
}

// Password Hint
.password-hint {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(59, 130, 246, 0.1);
  border-radius: var(--radius-sm);
  
  i {
    color: #3b82f6;
    font-size: 0.8125rem; // 13px - Standard SaaS
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
  
  span {
    color: #1e40af;
    font-size: 0.8125rem; // 13px - Standard SaaS
    line-height: 1.4;
  }
  
  @media (max-width: 576px) {
    span {
      font-size: 0.75rem; // 12px
    }
    
    i {
      font-size: 0.75rem; // 12px
    }
  }
}

// Animations
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>

<style>
/* Unscoped styles to override PrimeVue button variables and styles - Maximum specificity */
button.primary-button.p-button,
button.primary-button .p-button,
.primary-button button.p-button,
.primary-button button.p-button.p-component,
.primary-button.p-button,
.primary-button .p-button,
.primary-button.p-button.p-component,
.primary-button .p-button.p-component,
.primary-button.p-button.p-button-primary,
.primary-button .p-button.p-button-primary,
.primary-button.p-button.p-component.p-button-primary,
.primary-button .p-button.p-component.p-button-primary {
  /* Disable all PrimeVue CSS variables for background */
  --p-button-primary-background: none !important;
  --p-button-primary-border: none !important;
  --p-button-primary-hover-background: none !important;
  --p-button-primary-active-background: none !important;
  /* Force gradient directly */
  background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
  color: white !important;
}

button.primary-button.p-button:hover:not(:disabled),
button.primary-button .p-button:hover:not(:disabled),
.primary-button button.p-button:hover:not(:disabled),
.primary-button button.p-button.p-component:hover:not(:disabled),
.primary-button.p-button:hover:not(:disabled),
.primary-button .p-button:hover:not(:disabled),
.primary-button.p-button.p-component:hover:not(:disabled),
.primary-button .p-button.p-component:hover:not(:disabled),
.primary-button.p-button.p-button-primary:hover:not(:disabled),
.primary-button .p-button.p-button-primary:hover:not(:disabled),
.primary-button.p-button.p-component.p-button-primary:hover:not(:disabled),
.primary-button .p-button.p-component.p-button-primary:hover:not(:disabled) {
  /* Disable PrimeVue hover variable */
  --p-button-primary-hover-background: none !important;
  --p-button-primary-background: none !important;
  --p-button-primary-border: none !important;
  /* Force hover gradient directly */
  background: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
}

button.primary-button.p-button:active:not(:disabled),
button.primary-button.p-button:focus:not(:disabled),
button.primary-button .p-button:active:not(:disabled),
button.primary-button .p-button:focus:not(:disabled),
.primary-button button.p-button:active:not(:disabled),
.primary-button button.p-button:focus:not(:disabled),
.primary-button button.p-button.p-component:active:not(:disabled),
.primary-button button.p-button.p-component:focus:not(:disabled),
.primary-button.p-button:active:not(:disabled),
.primary-button.p-button:focus:not(:disabled),
.primary-button .p-button:active:not(:disabled),
.primary-button .p-button:focus:not(:disabled),
.primary-button.p-button.p-component:active:not(:disabled),
.primary-button.p-button.p-component:focus:not(:disabled),
.primary-button .p-button.p-component:active:not(:disabled),
.primary-button .p-button.p-component:focus:not(:disabled),
.primary-button.p-button.p-button-primary:active:not(:disabled),
.primary-button.p-button.p-button-primary:focus:not(:disabled),
.primary-button .p-button.p-button-primary:active:not(:disabled),
.primary-button .p-button.p-button-primary:focus:not(:disabled) {
  /* Disable PrimeVue active/focus variables */
  --p-button-primary-active-background: none !important;
  --p-button-primary-background: none !important;
  --p-button-primary-border: none !important;
  /* Force active/focus gradient directly */
  background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
}

button.primary-button.p-button:disabled,
button.primary-button .p-button:disabled,
.primary-button button.p-button:disabled,
.primary-button button.p-button.p-component:disabled,
.primary-button.p-button:disabled,
.primary-button .p-button:disabled,
.primary-button.p-button.p-component:disabled,
.primary-button .p-button.p-component:disabled {
  background: linear-gradient(135deg, rgba(22,101,52,.5) 0%, rgba(132,204,22,.4) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.5) 0%, rgba(132,204,22,.4) 100%) !important;
  background-color: transparent !important;
  opacity: 0.6 !important;
  --p-button-primary-background: none !important;
}

/* Additional override for any PrimeVue button with primary-button class */
.login-page .primary-button,
.login-page .primary-button * {
  --p-button-primary-background: none !important;
}

.login-page .primary-button button,
.login-page .primary-button .p-button {
  --p-button-primary-background: none !important;
  --p-button-primary-border: none !important;
  --p-button-primary-hover-background: none !important;
  --p-button-primary-active-background: none !important;
  background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
}

/* Override PrimeVue's use of CSS variables by setting background directly */
.login-page .primary-button button[style*="--p-button-primary-background"],
.login-page .primary-button .p-button[style*="--p-button-primary-background"],
.login-page .primary-button button[style*="background"],
.login-page .primary-button .p-button[style*="background"] {
  background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
}

/* Universal override - target any element with primary-button class and p-button */
* .primary-button.p-button,
* .primary-button .p-button {
  background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
}

* .primary-button.p-button:hover:not(:disabled),
* .primary-button .p-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
}

/* Override secondary-button to also use the gradient */
.secondary-button.p-button,
.secondary-button .p-button,
.secondary-button.p-button.p-component,
.secondary-button .p-button.p-component,
* .secondary-button.p-button,
* .secondary-button .p-button {
  --p-button-primary-background: none !important;
  --p-button-primary-border: none !important;
  background: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,.9) 0%, rgba(132,204,22,.8) 100%) !important;
  border: none !important;
  color: white !important;
}

.secondary-button.p-button:hover:not(:disabled),
.secondary-button .p-button:hover:not(:disabled),
* .secondary-button.p-button:hover:not(:disabled),
* .secondary-button .p-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
  background-image: linear-gradient(135deg, rgba(22,101,52,1) 0%, rgba(132,204,22,.95) 100%) !important;
  border: none !important;
  color: white !important;
}
</style>
