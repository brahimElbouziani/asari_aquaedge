<template>
    <div
      class="t"
      :style="{'background-image': `url('https://source.unsplash.com/1600x900/?agriculture')`}"
    >
      <form novalidate class="md-layout" @submit.prevent="registerUser" style="border-radius: 30px;">
        <CContainer>
          <CRow>
            <CCol>
              <CCardGroup>
                <CCard class="p-4">
                  <CCardBody>
                    <h1>Register</h1>
                    <p class="text-muted">Create your account</p>
                    <md-card-content>
                      <md-field :class="getValidationClass('email')">
                        <label for="email">Email</label>
                        <md-input
                          type="email"
                          name="email"
                          id="email"
                          autocomplete="email"
                          v-model="user.email"
                          :disabled="sending"
                          required
                        />
                        <span class="md-error" v-if="!$v.user.email.required">The email is required</span>
                        <span class="md-error" v-else-if="!$v.user.email">Invalid email</span>
                      </md-field>
                      <md-field :class="getValidationClass('password')">
                        <label for="password">Password</label>
                        <md-input
                          type="password"
                          name="password"
                          id="password"
                          autocomplete="new-password"
                          v-model="user.password"
                          required
                        />
                        <span class="md-error" v-if="!$v.user.password.required">The password is required</span>
                      </md-field>
                      <md-field :class="getValidationClass('confirmPassword')">
                        <label for="confirmPassword">Confirm Password</label>
                        <md-input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          autocomplete="new-password"
                          v-model="user.confirmPassword"
                          required
                        />
                        <span class="md-error" v-if="!$v.user.confirmPassword.required">Please confirm your password</span>
                        <span class="md-error" v-if="user.password !== user.confirmPassword">Passwords do not match</span>
                      </md-field>
                    </md-card-content>
                    <CRow>
                      <CCol col="6" class="text-left">
                        <md-button type="submit" class="md-primary">Register</md-button>
                      </CCol>
                      <CCol col="6" class="text-right">
                        <CButton color="link" class="px-0">Already have an account?</CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
                <CCard
                  color="white"
                  text-color="white"
                  class="text-center py-12 d-sm-down-none"
                  style="justify-content: center;"
                  body-wrapper
                >
                  <img
                    :src="imgLogo"
                    alt
                    width="400"
                    height="400"
                    style="justify-content: center; margin-top:20px;"
                  />
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </form>
    </div>
  </template>
  
  <script>
  import { validationMixin } from "vuelidate";
  import {
    required,
    email,
    minLength,
    maxLength
  } from "vuelidate/lib/validators";
  import { userService } from "@/services/api/index";
  import router from "@/routes";
  export default {
    name: "FormValidation",
    // mixins: [validationMixin], // Temporairement désactivé
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
    data: () => ({
      num: 1,
      user: {
        email: null,
        password: null,
        confirmPassword: null
      },
      err: "",
      userSaved: false,
      sending: false,
      lastemail: null
    }),
    // Temporaire: objet $v minimal
    computed: {
      $v() {
        const createField = () => ({
          $error: false,
          $dirty: false,
          $touch: function() { this.$dirty = true; }
        });
        return {
          user: {
            email: createField(),
            password: createField(),
            confirmPassword: createField()
          },
          $touch: function() {},
          $invalid: false
        };
      }
    },
    methods: {
        registerUser() {
            this.$v.user.$touch();
            if (!this.$v.user.$invalid) {
                this.sending = true;
                userService.addMobileUser({
                  email: this.user.email,
                  password: this.user.password,
                  // Add other required fields
                }).then((result) => {
                    if (result.data) {
                      this.sending = false;
                      // Redirect to login or dashboard page after successful registration
                      router.push('/login');
                    } else {
                      this.sending = false;
                      console.error('Registration failed:', result.error);
                    }
                }).catch(error => {
                    this.sending = false;
                    // Handle registration error, e.g., show error message
                    this.err = error.message;
                });
            }
        },

        getValidationClass(fieldName) {
            const field = this.$v.user[fieldName];

            if (field) {
                return {
                "md-invalid": field.$invalid && field.$dirty
                };
            }
        },
     
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
  .test {
    width: 490px;
    height: 360px;
    // display: flex ;
    // justify-content: center;
    // height: 200px;
    // align-items: center;
  }
  .t {
    width: 100%;
    height: 100%;
    background-position: center;
    background-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
    // background-image: url("../../assets/img/3.jpg");
    // position: absolute;
    display: grid;
    justify-content: center;
  
    align-items: center;
    align-content: center;
    // box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  }
  </style>
  