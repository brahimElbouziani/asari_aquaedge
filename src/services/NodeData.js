import Api from '@/services/Api'
/* eslint-disable */
import axios from "axios";

const axiosInstanceaqua = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'https://agriedge.ca/asari_platfomr/',
});

export default 
{
  addnewone(Node) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/addnewone', Node)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  getNodes() {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/getNodes',{id_admin:localStorage.getItem("authToken")})
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  getNodesAquaedge() {
    return new Promise((resolve, reject) => {
      axiosInstanceaqua
        .get("/Home/getNodesApp/DQRd8rRrG2Tzl6p2i56Fxzqp2q42")
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err));
    });
  },
  // edit poly in node
  editPolynode(id, details) {
    return new Promise((resolve, reject) => {
      axiosInstanceaqua
        .post("/Home/editenode/", { id: id, details: details })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  },
  
  getnodedata(id, dates ,datee ) {
    return new Promise((resolve, reject) => {
      Api()
        .get(`/Home/getnodeData/${id}/${dates}/${datee}`)
        .then(data => 
        {
            resolve(data);
        })
        .catch(err => reject(err))
    })
  },
  getNodeDetails(id) {
    return new Promise((resolve, reject) => {
      Api().get(`/Home/getNodedetails/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  get_calcul(S1, S4, bool_hamza) {

    return new Promise((resolve, reject) => {
      Api().get(`/Home/correct_meteo/${S1}/${S4}/${bool_hamza}`)
        .then((data) => {
          resolve(data.data)
        })
        .catch(err => reject(err))
    })
  },
  getET0(idParcel, dated, datef) {
    return new Promise((resolve, reject) => {
      Api()
        .get(`/Home/eto_node/${idParcel}/${dated}/${datef}`)
        .then((data) => {
          console.log("==================");
          console.log(data.data);
          resolve(data.data);
        })
        .catch((err) => reject(err));
    });
  },

  getSoilMoisture(id, n_days, date) {
    return new Promise((resolve, reject) => {
      Api()
        .get(`/Home/getImageSatelliteDates/${id}`)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => reject(err));
    });
  },

  getWeatherData(lat, long) {
    return new Promise((resolve, reject) => {
      Api().get(`/Home/getWeatherData/${lat}/${long}`)
        .then((data) => {
          resolve(data.data)
        })
        .catch(err => reject(err))
    })
  },
  
  export_data(id, start, end , value_check,nbr_port,prf,p1,p2,p3,p4,p5,p6) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/getnodeData/', {id: id, start: start, end: end , value_check:value_check,nbr_port:nbr_port,prf:prf,p1:p1,p2:p2,p3:p3,p4:p4,p5:p5,p6:p6})
        .then(data => 
        {
          resolve(data)
        })
        .catch(err => reject(err))
    })
  },
  check_data(id, start, end , value_check) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/checkData/', { id: id, start: start, end: end , value_check:value_check})
        .then(data => 
        {
          resolve(data)
        })
        .catch(err => reject(err))
    })
  },
  download(id) {
    return new Promise((resolve, reject) => {
      Api()
        .get(`/Home/nodefile/${id}`)
        .then((res) => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  editnode(id, details) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/editenode/', { id: id, details: details })
        .then(data => {
          resolve(data)
        })
        .catch(err => reject(err))
    })
  },
  sensor(id) {
    
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/sensor_historique',{id:id})
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  sensor_by_date(id,start,end) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/sensor_get_by_dates',{id:id,start:start,end:end})
        .then(res => { 
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  sensor_get_latest(id) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/sensor_get_latest',{id:id})
        .then(res => { 
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // sensor_get_last_month(id) {
  //   return new Promise((resolve, reject) => {
  //     Api()
  //       .post('/Home/sensor_get_last_month',{id:id})
  //       .then(res => { 
  //         console.log("##############################################");
  //         resolve(res.data)
  //       })
  //       .catch(err => reject(err))
  //   })
  // },
  // sensor_get_last_week(id) {
  //   return new Promise((resolve, reject) => {
  //     Api()
  //       .post('/Home/sensor_get_last_week',{id:id})
  //       .then(res => { 
         
  //         resolve(res.data)
  //       })
  //       .catch(err => reject(err))
  //   })
  // },
  sensor_get_dates_fixed(id,days,type) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/sensor_get_dates_fixed',{id:id,days:days,type:type})
        .then(res => { 
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
}
