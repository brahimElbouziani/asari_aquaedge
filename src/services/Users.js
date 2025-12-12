import Api from '@/services/Api'
import axios from 'axios'
import isEmpty from '@/outils/isEmpty'
export default {
  login (email, pass) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/Login', {email: email, password: pass},{headers: {
          "Access-Control-Allow-Origin": "*",}})
        .then(res => {
          if (res.status == 200 && !isEmpty(res.data) && isEmpty(res.data.err))
          {
            
            console.log(res.data);
            localStorage.setItem('authToken', res.data.token);
            localStorage.setItem('Type', res.data.type);
            localStorage.setItem('Logo', res.data.logo);
            resolve(res)
          }
          else
            reject('Error Try Again')
        })
        .catch(err => reject(err))
    })
  },
  AddAdmin (email, pass , name) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/Creat', {email: email, password: pass ,name_company :name})
        .then((r) => {
          resolve(r)
        })
        .catch(err => {
          console.log(err)
          reject(err)}
        )
    })
  },
  checktoken(token){
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/token', {token: token})
        .then(res => {
          if(res.status == 403) {
            localStorage.removeItem("authToken");
            reject('res')
          }else
            resolve(res)
        })
        .catch((err) => {
          localStorage.removeItem("authToken");
          reject(err)
        })
  })
 },
 GetUser(token){
  return new Promise((resolve, reject) => {
    Api()
      .post('/Home/User', {token: token})
      .then(res => {
        resolve(res)
      })
      .catch((er) => reject(er))
  })
  },
  Updatedetails(data, old){
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/Update', {data: data, d: old})
        .then(res => {
          if (res.data.err)
            reject(res.data.err)
          resolve(res)
        })
        .catch((er) => reject(er))
   })
  },
  getNotifs(){
    return new Promise((resolve, reject) => {
      Api()
        .get('/Home/getNotifs')
        .then(res => {
          resolve(res)
        })
        .catch((er) => reject(er))
   })
  },
  Register(){
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/addnewUser')
        .then(res => {
          resolve(res)
        })
        .catch((er) => reject(er))
   })
  },
  checkUser(phone,email){
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/checkUser', {phone: phone,email: email})
        .then(res => {
          console.log(res);
          if (res.data.status == 200)
          {
            // console.log("==============");
            resolve(res)
          }
          else
          {
            // console.log("------------------");
            resolve(res);
          }
            
        })
        .catch((err) => {
          reject(err)
        })
  })
 },
 AddUser(name,email,phone,password){
  return new Promise((resolve, reject) => {
    Api()
      .post('/Home/addnewUser',{name:name,email:email,phone:phone,password:password})
      .then(res => {
        resolve(res)
      })
      .catch((er) => reject(er))
 })
},
 
}