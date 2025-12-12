<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <!-- PrimeVue Services -->
    <Toast />
    <ConfirmDialog />
  </v-app>
</template>

<script setup>
// Vue 3 Migration - App.vue
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/store';
import { usePrimeVue } from 'primevue/config';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import isEmpty from "@/outils/isEmpty";

const router = useRouter();
const store = useMainStore();
const primevue = usePrimeVue();

onMounted(() => {
  // Configure French locale for PrimeVue
  primevue.config.locale = {
    firstDayOfWeek: 1,
    dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    monthNamesShort: ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'],
    today: 'Aujourd\'hui',
    clear: 'Effacer',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'Sem'
  };
  
  if (isEmpty(localStorage.getItem("authToken"))) {
    router.push("/login");
  } else {
    store.tk = localStorage.getItem("authToken");
    store.checktoken().then((isValid) => {
      if (!isValid) router.push("/login");
    });
  }
    //add historique
    // Node.getNodes().then((res) => {
    //   for (var i = 0; i < res.length; i++) {
    //    Node.sensor(res[i].NodeId)
    //    .then(res => { console.log(res);})
    //    .catch(er => console.log(er));
    //   }
    // });
    // get by date 
    //  Node.getNodes().then((res) => {
    //   for (var i = 0; i < res.length; i++) {
    //    Node.sensor_by_date(res[i].NodeId,"2023-01-01","2023-01-02")
    //    .then(rest => {
    //     console.log(rest);
    //     })
    //    .catch(er => console.log(er));
    //   }
    // });
    //get latest
    // Node.getNodes().then((res) => {
    //   for (var i = 0; i < res.length; i++) {
    //    Node.sensor_get_latest(res[i].NodeId)
    //    .then(rest => {
    //     console.log(rest);
    //     })
    //    .catch(er => console.log(er));
    //   }
    // });
    //get last week
    // Node.getNodes().then((res) => {
    //   for (var i = 0; i < res.length; i++) {
    //    Node.sensor_get_last_month(res[i].NodeId)
    //    .then(rest => {
    //     console.log(rest);
    //     })
    //    .catch(er => console.log(er));
    //   }
    // });
    // Node.getNodes().then((res) => {
    //   for (var i = 0; i < res.length; i++) {
    //    Node.sensor_get_last_week(res[i].NodeId)
    //    .then(rest => {
    //     console.log(rest);
    //     })
    //    .catch(er => console.log(er));
    //   }
    // });
    // Node.getNodes().then((res) => {
    //   for (var i = 0; i < res.length; i++) {
    //    Node.sensor_get_last_twoDays(res[i].NodeId)
    //    .then(rest => {
    //     console.log(rest);
    //     })
    //    .catch(er => console.log(er));
    //   }
    // });
});
</script>

<style scoped>
.y {
  width: 100%;
  height: 100%;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("./assets/img/Data-Field.jpg");
}
.y background-image {
  filter: blur(4px);
}
</style>
