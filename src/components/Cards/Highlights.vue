<template>
  <div class="custom-content-card content-card" style="background-color: #606876;">
    <div class="card-body pb-0">
      <div class="content-header h4 text-center pt-2 pb-3" style="color: white;">Highlights</div>
      <div class="row">
        <uv-index :highlights="highlights"></uv-index>
        <visibility :highlights="highlights"></visibility>
        <wind-status :highlights="highlights"></wind-status>
      </div>
      <div class="row">
        <Cloud :highlights="highlights"></Cloud>
        <humidity :highlights="highlights"></humidity>
        <temp-var :highlights="highlights" />
      </div>
      <div class="row"></div>
    </div>
  </div>
</template>

<script>
import UVIndex from "./UVIndex.vue";
import Visibility from "./Visibility.vue";
import WindStatus from "./WindStatus.vue";
import CloudStatus from "./Cloud.vue";
import Humidity from "./Humidity.vue";
import Temp from "./TempChart.vue";
export default {
  props: ["highlights"],
  components: {
    "uv-index": UVIndex,
    visibility: Visibility,
    "wind-status": WindStatus,
    Cloud: CloudStatus,
    humidity: Humidity,
    "temp-var": Temp
  }
};
</script>