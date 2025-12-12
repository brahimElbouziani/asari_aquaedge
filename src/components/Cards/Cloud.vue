<template>

  <div
    class="highlights-item col-md-4 col-sm-6 col-xs-12 border-top"
    style="background-color: #606876;"
  >
    <div>
      <fusioncharts
        type="line"
        width="100%"
        height="100%"
        data-format="json"
        data-empty-message="i-https://i.postimg.cc/R0QCk9vV/Rolling-0-9s-99px.gif"
        :dataEmptyMessageImageScale="dataEmptyMessageImageScale"
        :dataSource="tempChartData"
      ></fusioncharts>
    </div>
    <!-- <div class="chart-container" >
  <Chart />
</div> -->
  </div>
</template>

<script>
import DateFo from "@/services/DateFormat";
import Chart from "@/components/Charts/LineMarker";
export default {
  props: ["highlights"],
  // components: {Chart},
  data() {
    return {
      dataEmptyMessageImageScale: 39,
      tempChartData: {
        chart: {
          caption: "cloudCover",
          captionFontBold: "0",
          captionFontColor: "#000000",
          captionPadding: "30",
          baseFont: "Roboto",
          chartTopMargin: "30",
          showHoverEffect: "1",
          theme: "fusion",
          showaxislines: "1",
          numberSuffix: "%",
          anchorBgColor: "#6297d9",
          paletteColors: "#6297d9",
          drawCrossLine: "1",
          plotToolText: "$label<br><hr><b>$dataValue</b>",
          showAxisLines: "0",
          showYAxisValues: "0",
          anchorRadius: "4",
          divLineAlpha: "0",
          labelFontSize: "13",
          labelAlpha: "65",
          labelFontBold: "0",
          rotateLabels: "1",
          slantLabels: "1",
          canvasPadding: "20"
        },
        data: []
      }
    };
  },
  methods: {
    setChartData: function() {
      var data = [];
      for (var i = 0; i < 10; i++) {
        var dataObject = {
          label: DateFo.messageDate(this.highlights.hourly.data[i].time),
          value: this.highlights.hourly.data[i].cloudCover
        };
        data.push(dataObject);
      }
      this.tempChartData.data = data;
    }
  },
  mounted: function() {
    console.log(this.highlights);
    this.setChartData();
  },
  watch: {
    highlights: {
      handler: function() {
        this.setChartData();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
:root {
  font-size: 62.5%;
}

body {
  font-family: Roboto;
  font-weight: 400;
  width: 100%;
  margin: 0;
  font-size: 1.6rem;
}

#sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(-180deg, #80b6db 0%, #7da7e2 100%);
}

#search {
  text-align: center;
  height: 20vh;
  position: relative;
}

#location-input {
  height: 42px;
  width: 100%;
  opacity: 1;
  border: 0;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-top: 16px;
  padding-left: 16px;
  color: #ffffff;
  font-size: 1.8rem;
  line-height: 21px;
}

#location-input:focus {
  outline: none;
}

::placeholder {
  color: #ffffff;
  opacity: 0.6;
}

#current-weather {
  color: #ffffff;
  font-size: 8rem;
  line-height: 106px;
  position: relative;
}

#current-weather > span {
  color: #ffffff;
  font-size: 3.6rem;
  line-height: 42px;
  vertical-align: super;
  opacity: 0.8;
  top: 15px;
  position: absolute;
}

#weather-desc {
  font-size: 2rem;
  color: #ffffff;
  font-weight: 500;
  line-height: 24px;
}

#possibility {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
}

#max-detail,
#min-detail {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 500;
  line-height: 24px;
}

#max-detail > i,
#min-detail > i {
  font-style: normal;
  height: 13.27px;
  width: 16.5px;
  opacity: 0.4;
}

#max-detail > span,
#min-detail > span {
  color: #ffffff;
  font-family: Roboto;
  font-size: 1.2rem;
  line-height: 10px;
  vertical-align: super;
}

#max-summary,
#min-summary {
  opacity: 0.9;
  color: #ffffff;
  font-size: 1.4rem;
  line-height: 16px;
  margin-top: 2px;
  opacity: 0.7;
}

#search-btn {
  position: absolute;
  right: 0;
  top: 16px;
  padding: 2px;
  z-index: 999;
  height: 42px;
  width: 45px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
}

#dashboard-content {
  text-align: center;
  height: 100vh;
}

#date-desc,
#location-desc {
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 19px;
  margin-bottom: 15px;
}

#date-desc > img {
  top: -3px;
  position: relative;
  margin-right: 10px;
}

#location-desc > img {
  top: -3px;
  position: relative;
  margin-left: 5px;
  margin-right: 15px;
}

#location-detail {
  opacity: 0.7;
  color: #ffffff;
  font-size: 1.4rem;
  line-height: 20px;
  margin-left: 35px;
}

.centered {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.max-desc {
  width: 80px;
  float: left;
  margin-right: 28px;
}

.temp-max-min {
  margin-top: 40px;
}

#dashboard-content {
  background-color: #f7f7f7;
}

.custom-card {
  background-color: #ffffff !important;
  border: 0 !important;
  margin-top: 16px !important;
  margin-bottom: 20px !important;
}

.custom-content-card {
  background-color: #ffffff !important;
  border: 0 !important;
  margin-top: 16px !important;
  margin-bottom: 0px !important;
}

.header-card {
  height: 50vh;
}

.content-card {
  height: 43vh;
}

.card-divider {
  margin-top: 0;
}

.content-header {
  color: #8786a4;
  font-size: 1.4rem;
  line-height: 16px;
  font-weight: 500;
  padding: 15px 10px 5px 15px;
}

.highlights-item {
  min-height: 37vh;
  max-height: 38vh;
  background-color: #ffffff;
}

.card-heading {
  color: rgb(33, 34, 68);
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
}

.card-sub-heading {
  color: #73748c;
  font-size: 1.6rem;
  line-height: 19px;
}

.card-value {
  color: #000000;
  font-size: 1.8rem;
  line-height: 21px;
}

span text {
  font-weight: 500 !important;
}

hr {
  padding-top: 1.5px;
  padding-bottom: 1px;
  margin-bottom: 0;
  margin-top: 0;
  line-height: 0.5px;
}

@media only screen and (min-width: 768px) {
  #sidebar {
    height: 100vh;
  }

  #info {
    position: fixed;
    bottom: 50px;
    width: 100%;
    padding-left: 15px;
  }

  .wrapper-right {
    margin-top: 80px;
  }
}

@media only screen and (min-width: 1440px) {
  #sidebar {
    width: 350px;
    max-width: 350px;
    flex: auto;
  }
  #dashboard-content {
    width: calc(100% - 350px);
    max-width: calc(100% - 350px);
    flex: auto;
  }
}
</style>