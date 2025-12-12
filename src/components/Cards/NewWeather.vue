<template>
  <div id="weather" style="border-radius: 30px;">
    <div class="panelLeft" style="border-radius: 30px;">
      <div class="top-cal-devin" style="border-radius: 30px;">
        <p>{{time}}</p>
        <p>{{place.substr(7)}}</p>
      </div>
      <img src="https://source.unsplash.com/1600x900/?agriculture" alt style="border-radius: 30px;" />
      <div class="bottom">
        <div class="temp" v-if="this.weath.currently">
          <p>{{parseInt(this.weath.currently.temperature)}}°C</p>
          <v-row>
            <skycon :condition="this.weath.currently.icon" width="90" height="90" color="white"></skycon>

            <p
              style="font-size: 20px;margin-top: 30px; margin-left: 20px;"
            >{{this.weath.currently.summary}}</p>
          </v-row>
        </div>
      </div>
    </div>
    <div class="panelRight" style="border-radius: 30px;">
      <div class="customHeight" style="border-radius: 0% 13% 0% 0%;" v-if="weath">
        <p>Statistics</p>
       
        <ul>
          <li>
            <v-icon style="color: white; width: 40px; height: 40px;">{{icons.mdiThermometerLines}}</v-icon>
            <p>{{weath.currently.humidity}}%</p>
          </li>
          <li>
            <v-icon style="color: white; width: 40px; height: 40px;">{{icons.mdiWaterPercent}}</v-icon>
            <p>{{weath.currently.precipProbability}}%</p>
          </li>
          <li>
            <v-icon style="color: white; width: 40px; height: 40px;">{{icons.mdiWeatherWindy}}</v-icon>
            <p alt="windSpeed">{{weath.currently.windSpeed}} Km/h</p>
          </li>
        </ul>
        
      </div>
      <div class="remainingHeight" v-if="hourly">
        <ul class="forecast">
          <li>
            <span class="time">Now</span>
            <span class="temp">{{parseInt(this.weath.currently.temperature)}}°C</span>
            <span class="conditions">{{this.weath.currently.summary}}</span>
          </li>
        </ul>
        <div class="scroll" style="height: 140px; overflow: hidden;">
          <ul class="forecast" v-for="(item, index) in this.weath.hourly.data" :key="index">
            <li>
              <span class="time">{{getTime(item.time)}}h</span>
              <span class="temp">{{parseInt(item.temperature)}}°C</span>
              <span class="conditions">{{item.summary}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DD from "../../services/DateFormat";
import { mdiThermometerLines, mdiWeatherWindy, mdiWaterPercent } from "@mdi/js";
import axios from "axios";
export default {
  name: "NewWeather",
  props: ["weath", "time", "place"],
  methods: {
    getTime: time => {
      return DD.messageDate(time);
    },
    getplace() {}
  },
  data() {
    return {
      icons: { mdiThermometerLines, mdiWeatherWindy, mdiWaterPercent },
      hourly: []
    };
  }
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
#weather {
  border-radius: 25% 10%;
  z-index: 1;
  min-width: 100%;
  min-height: 300px;
  height: 433px;
  /* margin: 0; */
  position: relative;
}
*,
:after,
:before {
  box-sizing: border-box;
}
user agent stylesheet div {
  display: block;
}
#weather .panelLeft {
  background: linear-gradient(
    90deg,
    rgba(0, 77, 102, 0.4),
    rgba(204, 0, 204, 0.2)
  );
  background-blend-mode: overlay;
}
#weather .panelLeft,
#weather .panelRight {
  height: 100%;
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#weather .panelLeft {
  width: 100%;
  min-height: 400px;
  position: relative;
}
.top-cal-devin {
  top: 30px;
  left: 30px;
}
.bottom,
.top-cal-devin {
  position: absolute;
  width: 100%;
}
.bottom,
.top-cal-devin {
  position: absolute;
  width: 100%;
}

.bottom {
  bottom: 0;
}
#weather .panelLeft .bottom .temp {
  padding-left: 30px;
  padding-bottom: 20px;
}
#weather .panelLeft .bottom .temp p:first-child {
  font-size: 80px;
  margin-bottom: 0;
  font-weight: 100;
}
#weather .panelLeft .bottom .icon {
  padding-left: 30px;
  padding-top: 60px;
}

#weather .panelLeft .bottom .icon {
  margin-top: 90px;
  margin-bottom: 30;
}
#weather .panelLeft .bottom .temp p {
  color: hsla(0, 0%, 100%, 0.8);
}
p {
  margin: 0 0 10px;
}
#weather .panelLeft .bottom .temp p:nth-child(2) {
  font-weight: 300;
  padding-left: 8px;
}
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.top-cal-devin p {
  color: #fff;
  letter-spacing: 3px;
}
#weather .panelRight {
  float: right;
}
#weather .panelRight {
  width: 45%;
  position: absolute;
  top: 0;
  right: 0;
}

#weather .panelLeft,
#weather .panelRight {
  height: 100%;
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#weather .panelRight .customHeight {
  width: 100%;
  background: rgba(50, 170, 250, 0.5);
  color: hsla(0, 0%, 100%, 0.7);
}
#weather .panelRight > * {
  padding: 15px 30px;
}
#weather .panelRight .customHeight {
  width: 100%;
  background: rgba(50, 170, 250, 0.5);
  color: hsla(0, 0%, 100%, 0.7);
}
#weather .panelRight .customHeight hr {
  background: hsla(0, 0%, 100%, 0.4);
  height: 1px;
  border: transparent;
}
hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eee;
}
#weather .panelRight .customHeight ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
}
ol,
ul {
  margin-top: 0;
  margin-bottom: 10px;
}
user agent stylesheet ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
#weather .panelRight .customHeight ul li {
  display: inline-block;
  margin-right: 10px;
}
#weather .panelRight .customHeight ul li i {
  width: 35px;
  height: 35px;
  font-size: 26px;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.wi {
  display: inline-block;
  font-family: weathericons;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#weather .panelRight .customHeight ul li p {
  text-align: center;
  font-size: 11px;
  font-weight: 400;
}

#weather .panelRight .remainingHeight {
  background: hsla(0, 0%, 100%, 0.9);
}
#weather .panelRight > * {
  padding: 10px 30px;
}
#weather .panelRight .remainingHeight ul.inline {
  border-bottom: 1px solid hsla(0, 0%, 80%, 0.8);
  list-style: none;
  padding: 0 0 15px;
}
.inline {
  display: inline;
}
#weather .panelRight .remainingHeight ul.inline li.active,
#weather .panelRight .remainingHeight ul.inline li:hover {
  color: rgba(0, 0, 0, 0.9);
}
#weather .panelRight .remainingHeight ul.inline li {
  display: inline-block;
  padding-bottom: 15px;
  margin-right: 15px;
  position: relative;
  text-align: center;
  transition: all 0.5s;
}
#weather .panelRight .remainingHeight ul.inline li {
  display: inline-block;
  padding-bottom: 15px;
  margin-right: 15px;
  position: relative;
  text-align: center;
  transition: all 0.5s;
}
#weather .panelRight .remainingHeight ul.forecast {
  list-style: none;
  padding: 0;
  margin: 0;
}
#weather .panelRight .remainingHeight ul.forecast li {
  min-height: 46px;
  width: 100%;
  position: relative;
  padding-top: 18px;
}
#weather .panelRight .remainingHeight ul.forecast li .time {
  float: left;
  color: hsla(0, 0%, 53%, 0.9);
}
#weather .panelRight .remainingHeight ul.forecast li .temp {
  float: right;
  right: 0;
  position: absolute;
  top: 10px;
}
#weather .panelRight .remainingHeight ul.forecast li .conditions {
  color: hsla(0, 0%, 67%, 0.9);
  float: right;
  font-size: 0.8rem;
  right: 0;
  position: absolute;
  top: 28px;
}
#weather .panelLeft img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px 0 0 4px;
  z-index: -1;
}

img {
  vertical-align: middle;
}
img {
  border: 0;
}
.top-cal-devin {
  top: 30px;
  left: 30px;
}
.bottom,
.top-cal-devin {
  position: absolute;
  width: 100%;
}
</style>