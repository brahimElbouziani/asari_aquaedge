<template>
  <CChartLine :datasets="defaultDatasets" :labels="label" :options="{ maintainAspectRatio: true }" />
</template>

<script>
import CChartLine from "@/components/CChartLine.vue";
import DateFo from "../../services/DateFormat";
export default {
  name: "CChartLineExample",
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
          label: "Humidity / %",
          backgroundColor: "#b9a26c",
          data: this.check
        }
      ];
    }
  },
  created() {

    for (var i = 0; i < 10; i++) {
      this.label.push(DateFo.messageDate(this.lab.hourly.data[i].time));
      this.check.push(this.lab.hourly.data[i].humidity)
    }
  }
};
</script>
