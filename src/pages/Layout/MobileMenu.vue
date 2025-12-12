<template>
  <ul class="nav nav-mobile-menu">
    <!-- <li>
      <md-field>
        <label>Search</label>
        <md-input v-model="search" type="text"></md-input>
      </md-field>
    </li>--> 
 
    <!-- <li>
      <a href="#" data-toggle="dropdown" class="dropdown-toggle"
        ><i class="material-icons">person</i>
        <p>Profile</p></a
      >
    </li> -->
  </ul>
</template>
<script>
import router from "@/routes";
import { useMainStore } from '@/store';

export default {
  setup() {
    const store = useMainStore();
    return { store };
  },
  data() {
    return {
      search: null,
      selectedEmployee: null,
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone"
      ]
    };
  },
  methods:{
    logout () {
      // Clear auth using store
      this.store.khrjat();
      router.push('/login');
    }, 
  }
};
</script>
