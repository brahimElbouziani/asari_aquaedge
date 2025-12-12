import Api from '@/services/Api'
import NodeData from '@/services/NodeData'

export default {
  AddParcel (position,data,admin) {
    return new Promise((resolve, reject) => {
      Api()
        .post('/Home/addparcel', {polygon: position,data:data,id_admin:admin},{headers: {
          "Access-Control-Allow-Origin": "*",}})
        .then(res => {
          // if (res.status == 200 && !isEmpty(res.data) && isEmpty(res.data.err))
          // {
            // console.log(res.data);
            // localStorage.setItem('authToken', res.data.token);
            // localStorage.setItem('Type', res.data.type);
            // localStorage.setItem('Logo', res.data.logo);
            resolve(res.data);
          // }
          // else
          //   reject('Error Try Again')
        })
        .catch(err => reject(err))
    })
  },
   getParcel() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn('No auth token available for getParcel request');
        resolve([]);
        return;
      }
      
      // Créer la requête avec le token dans le body (comme getNodes)
      const requestData = {
        id_admin: token
      };
      
      // Essayer l'endpoint principal
      Api()
      .post('/Home/getParcel', requestData)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          console.log(`✅ Successfully loaded ${res.data.length} parcels from /Home/getParcel`);
          resolve(res.data);
        } else {
          console.warn('⚠️ Invalid response format from getParcel:', res.data);
          resolve([]);
        }
      })
      .catch((err) => {
        // Si 404, essayer d'utiliser getNodes comme fallback (les nodes peuvent contenir les parcelles)
        if (err.response?.status === 404) {
          console.warn('❌ Endpoint /Home/getParcel not found (404).');
          console.warn('🔄 Trying fallback: using getNodes instead...');
          
          // Utiliser getNodes comme fallback (les nodes peuvent contenir les parcelles)
          NodeData.getNodes()
            .then((nodes) => {
              if (Array.isArray(nodes) && nodes.length > 0) {
                console.log(`✅ Fallback: Loaded ${nodes.length} nodes (may contain parcel data)`);
                // Convertir les nodes en format parcelle si nécessaire
                resolve(nodes);
              } else {
                console.warn('⚠️ Fallback also returned empty data');
                resolve([]);
              }
            })
            .catch((fallbackErr) => {
              console.error('❌ Fallback also failed:', fallbackErr);
              console.warn('💡 Solution: Verify the correct endpoint name with your backend team.');
              console.warn('💡 The token is being sent correctly in the request body as "id_admin".');
              resolve([]);
            });
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn('🔒 Unauthorized access to getParcel. Token may be invalid or expired.');
          console.warn('💡 Try logging out and logging back in to refresh your token.');
          resolve([]);
        } else {
          console.error('❌ Error fetching parcels:', {
            status: err.response?.status,
            message: err.message,
            url: err.config?.url
          });
          resolve([]);
        }
      });
    })
  },

}