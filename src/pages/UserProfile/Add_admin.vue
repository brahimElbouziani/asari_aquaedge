<template>
  <div class="content">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card
  
        class="md-layout-item md-size-100 md-large-size-100"
      >
        <md-card-header style="background-color: #4CAF50">
          <h4 class="title">Add New Admin</h4>
          <p class="category">create a new Admin</p>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('name')">
            <label for="name_company">name</label>
            <md-input
              type="text"
              name="name_company"
              id="name_company"
              v-model="form.name_company"
              :disabled="sending"
            />

            <span class="md-error" v-if="!$v.form.name_company.required"
              >The name is required</span
            >
          </md-field>
        </md-card-content>

        <md-card-content>
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.email.required"
              >The email is required</span
            >
            <span class="md-error" v-else-if="!$v.form.email.email"
              >Invalid email</span
            >
          </md-field>
        </md-card-content>

        <md-card-content>
          <md-field :class="getValidationClass('password')">
            <label>Password</label>
            <md-input
              type="password"
              name="password"
              id="password"
              v-model="form.password"
            />
            <span class="md-error" v-if="!$v.form.password.required"
              >Password is required.</span
            >
            <span class="md-error" v-if="!$v.form.password.minLength"
              >Password must have at least
              {{ $v.form.password.$params.minLength.min }} letters.</span
            >
          </md-field>
        </md-card-content>
        <md-card-content>
          <md-field>
            <label>Confirm Password</label>
            <md-input
              type="password"
              name="password"
              id="password"
              v-model="form.cpassword"
            />
            <span class="error" v-if="!$v.form.cpassword.sameAsPassword"
              >Passwords must be identical.</span
            >
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-success" @click="ft_creat()"
            >Create</md-button
          >
        </md-card-actions>
        <span>{{ t }}</span>
      </md-card>

      <md-snackbar :md-active="userSaved" @update:md-active="userSaved = $event"
        >The user {{ lastUser }} was saved with success!</md-snackbar
      >
    </form>
  </div>
</template>

<script>
// Migration vers @vuelidate/core - temporairement désactivé
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
} from '@vuelidate/validators';
import router from "@/routes";
import { authService } from "@/services/api/index";
export default {
  name: "FormValidation",
  // mixins: [validationMixin], // Temporairement désactivé
  data: () => ({
    t: null,
    form: {
      password: null,
      firstName: null,
      lastName: null,
      email: null,
      cpassword: null,
      name_company: null,
    },
    userSaved: false,
    sending: false,
    lastUser: null,
    type_user: null,
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
        form: {
          firstName: createField(),
          lastName: createField(),
          age: createField(),
          gender: createField(),
          email: createField(),
          name_company: createField(),
          password: createField(),
          cpassword: createField()
        },
        $touch: function() {},
        $invalid: false
      };
    }
  },
  created() {
    /*
      if(this.$store.state.Auth == false)
        router.push('/login')*/

    let a = localStorage.getItem("authToken");
    userService.getCurrentUser(a)
      .then((result) => {
        const res = result.data;
        if (res) {
          /*         this.olddata = res;
          this.email = res.Email;
          this.lastname = res.lastname; */
          this.type_user = res.type_user;
        }
      })
      .catch((er) => console.log(er));
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.firstName = null;
      this.form.lastName = null;
      this.form.age = null;
      this.form.gender = null;
      this.form.email = null;
    },
    saveUser() {
      this.sending = true;

      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.lastUser = `${this.form.firstName} ${this.form.lastName}`;
        this.userSaved = true;
        this.sending = false;
        this.clearForm();
      }, 1500);
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    ft_creat() {
      if (
        this.form.email.length > 6 &&
        this.form.password.length > 0 &&
        this.form.password === this.form.cpassword
      ) {
        authService.createAdmin(this.form.email, this.form.password, this.form.name_company)
          .then((result) => {
            const success = result.data;
            if (success == "Already Exist!") this.t = "Already Exist!";
            else this.t = "Done";
          })
          .catch(() => {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
