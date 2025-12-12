<template>
  <section>
  
      <div>
        <div>
          <span style="color: white; font-size: 25px;">{{time}}</span>
        </div>
      </div>
   
<!--   
      <div>
        <div class="cloudiness" style="color:white; font-size: 19px;"> 
          <img src="../../assets/icons/cloud.svg" alt="cloudiness"/>
          <span class="cloudiness__value" >{{ cloudiness }}</span>&percnt;
        </div>
        <div class="wind-speed" style="color:white; font-size: 19px;">
          <img src="../../assets/icons/wind.svg" alt="wind speed" />
          <span class="wind__value">{{ parseInt(windSpeed) }}</span> k/h
        </div>
        <div class="humidity" style="color:white; font-size: 19px;">
          <img src="../../assets/icons/humidity.svg" alt="humidity" />
          <span class="humidity__value">{{ humidity }}</span>&percnt;
        </div>
      </div>
      <div>
        <div class="pressure" style="color:white; font-size: 19px;">
          <img src="../../assets/icons/pressure.svg" alt="pressure" />
          <span class="cloudiness__value">{{ pressure }}</span> mb
        </div>
        <div class="humidity" style="color:white; font-size: 19px;"> 
          <img src="../../assets/icons/water.svg" alt="pressure" />
          <span class="wind__value">{{ precipIntensity }}</span> &percnt;
        </div>
      </div> -->
   
  </section>
</template>
 

<script>
export default {
  name: "Measurements",

  props: {
    cloudiness: {
      type: Number,
      required: true
    },
    windSpeed: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    },

    precipIntensity: {
      type: Number,
      required: true
    },
    pressure: {
      type: Number,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
section {
  width: 100%;
  padding-top: 25px;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.cloudiness img {
  width: 48px;
  height: 48px;
  vertical-align: middle;
  color: white;
}

.wind-speed img {
  width: 48px;
  height: 48px;
  vertical-align: middle;
}

.humidity img {
  width: 48px;
  height: 48px;
  vertical-align: middle;
}
.pressure img {
  width: 48px;
  height: 48px;
  vertical-align: middle;
}
</style>
