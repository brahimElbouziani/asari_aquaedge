<template>
  <main>
    <Measurements
      v-if="weath.currently"
      :cloudiness="weath.currently.cloudCover"
      :windSpeed="weath.currently.windSpeed"
      :humidity="weath.currently.humidity"
      :time="time"
      :pressure="weath.currently.pressure"
      :precipIntensity="weath.currently.precipIntensity"
    ></Measurements>
    <Temperature v-if="weath.currently" :value="parseInt(weath.currently.temperature)"></Temperature>
    <Weather
      v-if="weath.currently"
      :description="this.weath.currently.summary"
      :icon="this.weath.currently.icon"
    ></Weather>
  </main>
</template>

<script>
import Weather from "./Weather";
import Temperature from "./Temperature";
import Measurements from "./Measurements";
import WeatherForecast from "@/services/WeatherForecast";

export default {
  name: "WeatherApp",
  props: ["weath", "time"],
  components: {
    Weather,
    Temperature,
    Measurements
  },

  data() {
    return {
      forecast: "new WeatherForecast()"
    };
  },
  created() {}
};
</script>

<style scoped>
main {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  /* display: flex;
    flex-direction: column;
    /* justify-content: space-around; */
  /* align-items: center;

    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22); */
}

.app--day {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url("../../assets/images/morning.jpg");
}

.app--night {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url("../../assets/images/night.jpg");
}

main {
  width: 350px;
  height: 850px;

  border-radius: 5px;
}
</style>
