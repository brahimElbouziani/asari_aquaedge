<template>
  <CChartLine :datasets="defaultDatasets" :labels="label"/>
</template>

<script>
import CChartLine from "@/components/CChartLine.vue";
import DateFo from "../../services/DateFormat";
export default {
  name: "Pressure",
  props: ["lab"],
  data() {
    return {
      label: [],
      check: []
    };
  },
  components: { CChartLine },
  computed: {
    defaultDatasets() {
      return [
        {
          label: "Pressure / hPa",
          backgroundColor: "#b9a26c",
          data: this.check
        }
      ];
    }
  },
  created() {
    for (var i = 0; i < 10; i++) {
      this.label.push(DateFo.messageDate(this.lab.hourly.data[i].time));
      this.check.push(this.lab.hourly.data[i].pressure)
    }
  }
};
</script>
