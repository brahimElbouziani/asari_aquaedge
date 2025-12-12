<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-wrapper">
      <div class="modal-header">
        <div class="modal-header-one">
          <h3>Ajouter Parcelle Details</h3>
        </div>
        
        <button class="close-button" @click="close">&times;</button>
      </div>
      <!-- Step Indicator -->
      <div class="step-indicator-container">
        <ul class="step-indicator">
          <li v-for="step in totalSteps" :key="step" :class="{ 'active': currentStep >= step }">
            <div class="step-index">{{ step }}</div>
            <div v-if="step < totalSteps" class="step-line"></div>
          </li>
        </ul>
      </div>
      <div class="modal-body">

        <div v-if="currentStep === 1">
          <div class="input-row">
            <div class="input-group">
              <label for="name">Nom de parcelle</label>
              <v-text-field @blur="$v.formData.name.$touch()" @input="$v.formData.name.$touch()" :error-messages="nameErrors" v-model="formData.name" type="text" id="name" placeholder="Nom"/>
            </div>
            <div class="input-group">
              <label for="crop">Culture</label>
              <v-text-field @blur="$v.formData.crop.$touch()" @input="$v.formData.crop.$touch()" :error-messages="cropErrors"  v-model="formData.crop" type="text" id="crop" placeholder="Entrez Culture"/>
            </div>
          </div>
          <div class="input-row">
            <div class="input-group">
              <label for="farmer">Nom de l'agriculteur</label>
              <v-text-field @blur="$v.formData.agriculteur.$touch()" @input="$v.formData.agriculteur.$touch()" :error-messages="agriculteurErrors" v-model="formData.agriculteur" type="text" id="farmer" placeholder="Entrez le nom"/>
            </div>
            <div class="input-group">
              <label for="area">Total area</label>
              <v-text-field @blur="$v.formData.area.$touch()" @input="$v.formData.area.$touch()" :error-messages="areaErrors"  v-model="formData.area" type="text" id="area" placeholder="Entrez total area"/>
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label for="plantingDate">Date de plantation</label>
              <v-text-field @blur="$v.formData.plantingDate.$touch()" @input="$v.formData.plantingDate.$touch()" :error-messages="plantingDateErrors"  v-model="formData.plantingDate" type="date" id="plantingDate" placeholder="Entrez planting date"/>
            </div>
            <div class="input-group">
              <label for="demarrageDate">Demarrage du cycle</label>
              <v-text-field @blur="$v.formData.cycle.$touch()" @input="$v.formData.cycle.$touch()" :error-messages="cycleErrors"  v-model="formData.cycle" type="date" id="demarrageDate" placeholder="Entrez Demarrage du cycle"/>
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label for="dens1">Densite (m * m)</label>
              <div class="input-row">
                <div class="input-group">
                  <v-text-field @blur="$v.formData.densite1.$touch()" @input="$v.formData.densite1.$touch()" :error-messages="densite1Errors"  v-model="formData.densite1" type="text" id="dens1" placeholder="m"/>
                </div>
                <div class="input-group">
                  <v-text-field @blur="$v.formData.densite2.$touch()" @input="$v.formData.densite2.$touch()" :error-messages="densite2Errors"  v-model="formData.densite2" type="text" id="dens2" placeholder="m"/>
                </div>
              </div>
            </div>
            <div class="input-group capteur">
              <label></label>
              <div class="radio-buttons">
                <label for="option1">Image satellitaires</label>
                <input type="radio" id="option1" name="option" @click="(()=>{this.totalSteps = 2;})" value=1 v-model="formData.capteurChoice" />
                
                <label for="option2">Capteur</label>
                <input type="radio" id="option2" name="option" @click="(()=>{this.totalSteps = 3;})" value=0 v-model="formData.capteurChoice" />
                
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2">

          <div class="input-row">
            <div class="input-group">
              <label for="org">Matiere organique %</label>
              <v-text-field @blur="$v.formData.organ.$touch()" @input="$v.formData.organ.$touch()" :error-messages="organErrors"  v-model="formData.organ" type="text" id="org" placeholder="%" />
            </div>
            <div class="input-group">
              <label for="arg">Argile %</label>
              <v-text-field @blur="$v.formData.argl.$touch()" @input="$v.formData.argl.$touch()" :error-messages="arglErrors"  v-model="formData.argl" type="text" id="arg" placeholder="%" />
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label for="limon">Limon %</label>
              <v-text-field @blur="$v.formData.limon.$touch()" @input="$v.formData.limon.$touch()" :error-messages="limonErrors"  v-model="formData.limon" type="text" id="limon" placeholder="%" />
            </div>
            <div class="input-group">
              <label for="sable">Sable %</label>
              <v-text-field @blur="$v.formData.sable.$touch()" @input="$v.formData.sable.$touch()" :error-messages="sableErrors"  v-model="formData.sable" type="text" id="sable" placeholder="%" />
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label for="sand">Sand %</label>
              <v-text-field @blur="$v.formData.sand.$touch()" @input="$v.formData.sand.$touch()" :error-messages="sandErrors"  v-model="formData.sand" type="text" id="sand" placeholder="%" />
            </div>
            <div class="input-group">
              <label for="clay">Clay %</label>
              <v-text-field @blur="$v.formData.clay.$touch()" @input="$v.formData.clay.$touch()" :error-messages="clayErrors"  v-model="formData.clay" type="text" id="clay" placeholder="%" />
            </div>
          </div>

        </div>

        <div v-if="currentStep === 3 ">
          
          <div class="input-row">
            <div class="input-group">
              <label for="id">ID Capteur</label>
              <v-text-field @blur="$v.formData.id.$touch()" @input="$v.formData.id.$touch()" :error-messages="idErrors"  v-model="formData.id" type="text" id="id" placeholder="Entrez Capteur ID" />
            </div>
            <div  class="input-group ">
              <label for="prof">Profondeurs</label>
                <v-text-field @input="$v.formData.profd.$touch()" v-model="formData.profd" type="text" id="prof" placeholder="" />
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label for="vmin">Valeur minimale</label>
              <v-text-field @blur="$v.formData.vmin.$touch()" @input="$v.formData.vmin.$touch()" :error-messages="vminErrors"  v-model="formData.vmin" type="text" id="vmin" placeholder="" />
            </div>
            <div class="input-group">
              <label for="vmax">Valeur maximal</label>
              <v-text-field @blur="$v.formData.vmax.$touch()" @input="$v.formData.vmax.$touch()" :error-messages="vmaxErrors"  v-model="formData.vmax" type="text" id="vmax" placeholder="" />
            </div>
          </div>

          <!-- <div class="input-row">
            <div class="input-group">
              <label for="lat">Latitude</label>
              <v-text-field @blur="$v.formData.lat.$touch()" @input="$v.formData.lat.$touch()" :error-messages="latErrors"  v-model="formData.lat" type="text" id="lat" placeholder="Entrez Latitude" />
            </div>
            <div class="input-group">
              <label for="lng">Longitude</label>
              <v-text-field @blur="$v.formData.lng.$touch()" @input="$v.formData.lng.$touch()" :error-messages="lngErrors"  v-model="formData.lng" type="text" id="lng" placeholder="Entrez Longitude" />
            </div>
          </div> -->

          <div class="input-row">
            <!-- <div class="input-group capteur">
              <label></label>
              <div class="radio-buttons">
                <label for="profd1">2 Profondeurs</label>
                <input  type="radio" id="profd1" name="profd"  value=1 v-model="formData.profd"/>
                
                <label for="option2">4 Profondeurs</label>
                <input  type="radio" id="profd2" name="profd"  value=0 v-model="formData.profd"/>
              </div>
            </div> -->
            <div v-if="(formData.id != undefined && (formData.id[0] == 'Z' || formData.id[0] == 'z'))" class="input-group">
              <v-select 
                  v-model="formData.nmbr"
                  :items="nmbr_port"
                  label="Number port"
                  required
                ></v-select>
            </div>
          </div>

          <div v-if="(formData.id != undefined && (formData.id[0] == 'Z' || formData.id[0] == 'z'))" class="input-row">
            <div class="input-group">
              <label for="p1">Port 1</label>
              <input  v-model="formData.port1" type="text" id="p1" placeholder="" />
            </div>
            <div class="input-group">
              <label for="p2">Port 2</label>
              <input v-model="formData.port2" type="text" id="p2" placeholder="" />
            </div>
          </div>

          <div v-if="(formData.id != undefined && (formData.id[0] == 'Z' || formData.id[0] == 'z')) && formData.nmbr > 2" class="input-row">
            <div  class="input-group">
              <label for="p3">Port 3</label>
              <input v-model="formData.port3" type="text" id="p3" placeholder="" />
            </div>
            <div v-if="formData.nmbr > 3" class="input-group">
              <label for="p4">Port 4</label>
              <input v-model="formData.port4" type="text" id="p4" placeholder="" />
            </div>
          </div>

          <div v-if="(formData.id != undefined && (formData.id[0] == 'Z' || formData.id[0] == 'z')) && formData.nmbr > 4" class="input-row">
            <div  class="input-group">
              <label for="p5">Port 5</label>
              <input v-model="formData.port5" type="text" id="p5" placeholder="" />
            </div>
            <div v-if="formData.nmbr > 5" class="input-group">
              <label for="p6">Port 6</label>
              <input v-model="formData.port6" type="text" id="p6" placeholder="" />
            </div>
          </div>

        </div>

      </div>
      <div class="modal-footer">
        <button v-if="currentStep > 1" @click="previousStep">Previous</button>
        <button v-if="currentStep < totalSteps" @click="nextStep">Next</button>
        <button v-if="currentStep === totalSteps" @click="save">Save</button>
      </div>
        <span style="color: red;"
          >{{ this.errdata }}</span
        >
    </div>
  </div>
</template>


<script>
// Migration vers @vuelidate/core - temporairement désactivé
import { required, alpha, alphaNum, decimal } from '@vuelidate/validators';
import { parcelService } from "@/services/api/index";
export default {
  props: ['show','polygonData'],
  // mixins: [validationMixin], // Temporairement désactivé
  computed: {
    $v() {
      const createField = () => ({
        $error: false,
        $dirty: false,
        $touch: function() { this.$dirty = true; }
      });
      return {
        formData: {
          name: createField(),
          crop: createField(),
          agriculteur: createField(),
          area: createField(),
          plantingDate: createField(),
          cycle: createField(),
          densite1: createField(),
          densite2: createField(),
          organ: createField(),
          limon: createField(),
          argl: createField(),
          sand: createField(),
          clay: createField(),
          sable: createField(),
          id: createField(),
          vmin: createField(),
          vmax: createField(),
          port1: createField(),
          port2: createField(),
          port3: createField(),
          port4: createField(),
          port5: createField(),
          port6: createField()
        },
        $touch: function() {},
        $invalid: false
      };
    }
  },
  data() {
    return {
      errdata: "",
      positions:[],
      nmbr_port: ["2","3", "4","5", "6"],

      type: localStorage.getItem('Type'),
      currentStep: 1,
      totalSteps: 2, // Update this as needed
      formData: {
        name: '',
        crop: '',
        nmbr : "2",
        agriculteur: '',
        area: '',
        plantingDate: new Date().toISOString().substr(0, 10),
        cycle: new Date().toISOString().substr(0, 10),
        densite1: '',
        densite2: '', 
        capteurChoice: 1,
        organ: '',
        argl: '',
        limon: '',
        sand: '',
        clay: '',
        sable: '',
        id: '',
        vmin: '',
        vmax: '',
        lat: '',
        lng: '',
        profd: '',
        port1:'Port 1',
        port2:'Port 2',
        port3:'Port 3',
        port4:'Port 4',
        port5:'Port 5',
        port6:'Port 6',
        description: '',// Add more fields as required for each step
      }
    };
  },
  methods: {
   async close() {

     await this.clearData();
      this.$emit('close');
    },
    clearData() {
      this.positions = [];
      this.formData = {
        name: '',
        crop: '',
        nmbr: "2",
        agriculteur: '',
        area: '',
        plantingDate: new Date().toISOString().substr(0, 10),
        cycle: new Date().toISOString().substr(0, 10),
        densite1: '',
        densite2: '',
        capteurChoice: 1,
        organ: '',
        argl: '',
        limon: '',
        sable: '',
        sand: '',
        clay: '',
        id: '',
        vmin: '',
        vmax: '',
        lat: '',
        lng: '',
        profd: '',
        port1: 'Port 1',
        port2: 'Port 2',
        port3: 'Port 3',
        port4: 'Port 4',
        port5: 'Port 5',
        port6: 'Port 6',
        description: '',
      };
      this.currentStep = 1;
      this.totalSteps = 2;
    },
    
    nextStep() {
      if(this.currentStep == 1)
      {
        this.$v.formData.name.$touch();
        this.$v.formData.crop.$touch();
        this.$v.formData.agriculteur.$touch();
        this.$v.formData.area.$touch();
        this.$v.formData.plantingDate.$touch();
        this.$v.formData.densite1.$touch();
        this.$v.formData.densite2.$touch();
        if(!this.$v.formData.name.$error && !this.$v.formData.crop.$error && !this.$v.formData.agriculteur.$error && !this.$v.formData.area.$error && !this.$v.formData.plantingDate.$error && !this.$v.formData.densite1.$error && !this.$v.formData.densite2.$error)
        {
          if (this.currentStep < this.totalSteps) {
            this.currentStep++;
          }
        }
      }
      if(this.currentStep == 2)
      {
        this.$v.formData.organ.$touch();
        this.$v.formData.argl.$touch();
        this.$v.formData.limon.$touch();
        this.$v.formData.sable.$touch();
        this.$v.formData.sand.$touch();
        this.$v.formData.clay.$touch();
        if(!this.$v.formData.organ.$error && !this.$v.formData.argl.$error && !this.$v.formData.limon.$error && !this.$v.formData.sable.$error && !this.$v.formData.sand.$error && !this.$v.formData.clay.$error)
        {
          if (this.currentStep < this.totalSteps) {
            this.currentStep++;
          }
        }
      }
    },
    previousStep() {
        this.currentStep--;
    },
    getPolygonCenter(coords) {
      let totalLat = 0;
      let totalLng = 0;

      for (const coord of coords) {
        totalLat += coord.lat;
        totalLng += coord.lng;
      }

      return { lat: totalLat / coords.length, lng: totalLng / coords.length };
    },
    async save() {
      this.positions = await this.polygonData.map(item => {
        return {
          lat: item.position.lat,
          lng: item.position.lng
        };
      });
      let center = await this.getPolygonCenter(this.positions);
      this.formData.lat = center.lat;
      this.formData.lng = center.lng;
      parcelService.addParcel(this.positions,this.formData,localStorage.getItem("authToken")).then((result) => {
        const data = result.data || result;
        console.log("#####################################");
        console.log(data);
        window.location.reload();
      }).catch((error) => {
        console.error("Error adding parcel:", error);
      });
      // const polygonDetails = {
      //   ...this.formData,
      // };
      // this.$emit('save', polygonDetails);
      // this.close();
    },

  },
  // beforeUnmount(){
  //   if(this.positions.length == 0)
  //   {
  //     console.log(".................");
  //     console.log(this.polygonData);
  //     this.positions = this.polygonData.map(item => {
  //       return {
  //         lat: item.position.lat,
  //         lng: item.position.lng
  //       };
  //     });
  //   }

  // },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.formData.name.$dirty) return errors;
      // !this.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.formData.name.required && errors.push("This Content  is required");
      return errors;
    },
    cropErrors() {
      const errors = [];
      if (!this.$v.formData.crop.$dirty) return errors;
      // !this.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.formData.crop.required && errors.push("This Content  is required");
      return errors;
    },
    agriculteurErrors() {
      const errors = [];
      if (!this.$v.formData.agriculteur.$dirty) return errors;
      // !this.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.formData.agriculteur.required && errors.push("This Content  is required");
      return errors;
    },
    areaErrors() {
      const errors = [];
      if (!this.$v.formData.area.$dirty) return errors;
      !this.$v.formData.area.decimal && errors.push('This Content must be Number')
      !this.$v.formData.area.required && errors.push("This Content  is required");
      return errors;
    },
    plantingDateErrors() {
      const errors = [];
      if (!this.$v.formData.plantingDate.$dirty) return errors;
      // !this.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.formData.plantingDate.required && errors.push("This Content  is required");
      return errors;
    },
    cycleErrors() {
      const errors = [];
      if (!this.$v.formData.cycle.$dirty) return errors;
      // !this.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.formData.cycle.required && errors.push("This Content  is required");
      return errors;
    },
    densite1Errors() {
      const errors = [];
      if (!this.$v.formData.densite1.$dirty) return errors;
      !this.$v.formData.densite1.decimal && errors.push('This Content must be Number')
      !this.$v.formData.densite1.required && errors.push("This Content  is required");
      return errors;
    },
    densite2Errors() {
      const errors = [];
      if (!this.$v.formData.densite2.$dirty) return errors;
      !this.$v.formData.densite2.decimal && errors.push('This Content must be Number')
      !this.$v.formData.densite2.required && errors.push("This Content  is required");
      return errors;
    },
    capteurChoiceErrors() {
      const errors = [];
      if (!this.$v.formData.capteurChoice.$dirty) return errors;
      // !this.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.formData.capteurChoice.required && errors.push("This Content  is required");
      return errors;
    },
    organErrors() {
      const errors = [];
      if (!this.$v.formData.organ.$dirty) return errors;
      !this.$v.formData.organ.decimal && errors.push('This Content must be Number');
      !this.$v.formData.organ.required && errors.push("This Content  is required");
      return errors;
    },
    arglErrors() {
      const errors = [];
      if (!this.$v.formData.argl.$dirty) return errors;
      !this.$v.formData.argl.decimal && errors.push('This Content must be Number');
      !this.$v.formData.argl.required && errors.push("This Content is required");
      return errors;
    },
    limonErrors() {
      const errors = [];
      if (!this.$v.formData.limon.$dirty) return errors;
      !this.$v.formData.limon.decimal && errors.push('This Content must be Number');
      !this.$v.formData.limon.required && errors.push("This Content is required");
      return errors;
    },
    sandErrors() {
      const errors = [];
      if (!this.$v.formData.sand.$dirty) return errors;
      !this.$v.formData.sand.decimal && errors.push('This Content must be Number');
      !this.$v.formData.sand.required && errors.push("This Content is required");
      return errors;
    },
    clayErrors() {
      const errors = [];
      if (!this.$v.formData.clay.$dirty) return errors;
      !this.$v.formData.clay.decimal && errors.push('This Content must be Number');
      !this.$v.formData.clay.required && errors.push("This Content is required");
      return errors;
    },
    sableErrors() {
      const errors = [];
      if (!this.$v.formData.sable.$dirty) return errors;
      !this.$v.formData.sable.decimal && errors.push('This Content must be Number');
      !this.$v.formData.sable.required && errors.push("This Content is required");
      return errors;
    },
    idErrors() {
      const errors = [];
      if (!this.$v.formData.id.$dirty) return errors;
      !this.$v.formData.id.required && errors.push("This Content is required");
      return errors;
    },
    vminErrors() {
      const errors = [];
      if (!this.$v.formData.vmin.$dirty) return errors;
      !this.$v.formData.vmin.decimal && errors.push('This Content must be Number');
      !this.$v.formData.vmin.required && errors.push("This Content is required");
      return errors;
    },
    vmaxErrors() {
      const errors = [];
      if (!this.$v.formData.vmax.$dirty) return errors;
      !this.$v.formData.vmax.decimal && errors.push('This Content must be Number');
      !this.$v.formData.vmax.required && errors.push("This Content is required");
      return errors;
    },
    latErrors() {
      const errors = [];
      if (!this.$v.formData.lat.$dirty) return errors;
      !this.$v.formData.lat.decimal && errors.push('This Content must be Number');
      !this.$v.formData.lat.required && errors.push("This Content is required");
      return errors;
    },
    lngErrors() {
      const errors = [];
      if (!this.$v.formData.lng.$dirty) return errors;
      !this.$v.formData.lng.decimal && errors.push('This Content must be Number');
      !this.$v.formData.lng.required && errors.push("This Content is required");
      return errors;
    },
    profdErrors() {
      const errors = [];
      if (!this.$v.formData.profd.$dirty) return errors;
      !this.$v.formData.profd.decimal && errors.push('This Content must be Number');
      !this.$v.formData.profd.required && errors.push("This Content is required");
      return errors;
    },

  }
};
</script>


<style scoped>
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}.modal-wrapper {
  background-color: #fff;
  padding: 20px;
  width: 90%;
  max-width: 50%;
  border-radius: 8px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
  background-color: #4CAF50;
  border-radius: 5px;
  color: #fff;
}

.modal-body {
  padding: 20px 0;
}
.modal-footer {
  text-align: right;
}
.close-button {
  background: none;
  border: none;
  font-size: 2.5rem;
  color: #ffffff;
}
.save-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.save-button:hover {
  background-color: #45a049;
}
input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
label {
  display: block;
  margin-bottom: 5px;
}

.modal-footer button {
  margin-right: 10px;
  color: #4CAF50;
}

/* Style the Previous/Next buttons */
.modal-footer button {
  padding: 8px 15px;
  margin: 5px;
  background-color: #eee;
  color: #4CAF50;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: medium;
  font-weight:bold;
}

.modal-footer button:hover {
  background-color: #ddd;
}

/* Textarea styles */
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical; /* Allows the user to vertically resize the textarea (not horizontally) */
}
.step-indicator-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
}

.step-indicator {
  width: 100%;
  display: flex;
  padding: 0;
  margin: 0;
  list-style-type: none;
  justify-content: space-between;
}

.step-indicator li {
  display: flex;
  align-items: center;
}

.step-index {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 2px solid #aaa;
  border-radius: 50%;
  text-align: center;
  background: white;
  color: #aaa;
  font-weight: bold;
}

.step-indicator li.active .step-index {
  background-color: #5cb85c;
  border-color: #5cb85c;
  color: white;
}

.step-line {
  flex-grow: 1;
  height: 2px;
  background-color: #aaa;
  margin: 0 10px;
}

/* Adjust the margin of the separator line to make it connect properly */
.separator-line {
  height: 20px;
  background-color: #5a5a5a6c;
  position: relative;
  flex-grow: 1;
}
.input-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px; /* Adjust as needed */
}


.input-group {
  display: flex;
  flex-direction: column;
  flex-basis: 48%; /* Adjust the width as needed */
}

.radio-buttons {
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: medium;
}

.radio-buttons input[type="radio"] {
  accent-color: #5cb85c; /* Your desired color */
  -webkit-transform: scale(1.7); /* Safari and Chrome */
  -moz-transform: scale(1.7); /* Firefox */
  -ms-transform: scale(1.7); /* IE 9 */
  -o-transform: scale(1.7); /* Opera */
  transform: scale(1.7); /* Standard Property */
  margin-right: 10px; /*

}

.input-group {
  margin-bottom: 10px; /* Spacing between input groups */
}

.input-group label {
  margin-bottom: 5px; /* Spacing between label and input/radio */
}
.radio-buttons label {
  margin-left: 10%; 
  white-space: nowrap; 
  text-overflow: ellipsis; /* Add an ellipsis if the text overflows */
  display: flex; /* Use flexbox for alignment */
  align-items: center; 
  cursor: pointer;
}
.capteur {
  margin-top: 2%;
}
</style>