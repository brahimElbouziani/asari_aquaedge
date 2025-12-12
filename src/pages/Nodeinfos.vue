<template>
  <div class="container">
    <div class="row">
      <form>
        <v-row>
          <v-col>
            <v-text-field
              v-model="nodeId"
              :error-messages="ndeIdErrors"
              label="Node_ID"
              required
              @input="$v.nodeId.$touch()"
              @blur="$v.nodeId.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="fname"
              :error-messages="nameErrors"
              label="Nom de l'agriculteur"
              required
              @input="$v.fname.$touch()"
              @blur="$v.fname.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="lat"
              :error-messages="latErrors"
              label="latitude"
              required
              @input="$v.lat.$touch()"
              @blur="$v.lat.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="long"
              :error-messages="longErrors"
              label="longitude"
              required
              @input="$v.long.$touch()"
              @blur="$v.long.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="st"
              :error-messages="surfaceErrors"
              label="Total area"
              required
              @input="$v.st.$touch()"
              @blur="$v.st.$touch()"
              suffix="ha"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="is"
              :items="items"
              :error-messages="irrigationSystem"
              label="Irrigation system"
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="cult"
              :error-messages="cultErrors"
              label="Culture"
              required
              @input="$v.cult.$touch()"
              @blur="$v.cult.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>Crop Densit :</v-col>
          <v-col>
            <v-text-field
              v-model="cd1"
              :error-messages="cd1Errors"
              required
              @input="$v.cd1.$touch()"
              @blur="$v.cd1.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>X</v-col>
          <v-col>
            <v-text-field
              v-model="cd2"
              :error-messages="cd2Errors"
              required
              @input="$v.cd2.$touch()"
              @blur="$v.cd2.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="Picker without buttons"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-text-field
              v-model="rootd"
              :error-messages="rootErrors"
              label="Root depth"
              required
              @input="$v.rootd.$touch()"
              @blur="$v.rootd.$touch()"
              suffix="cm"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="frod"
              :error-messages="frodErrors"
              label="Flow rate of drippers"
              required
              @input="$v.frod.$touch()"
              @blur="$v.frod.$touch()"
              suffix="l/h"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="sod"
              :error-messages="sodErrors"
              label="Spacing of drippers"
              required
              @input="$v.sod.$touch()"
              @blur="$v.sod.$touch()"
              suffix="m"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="nor"
              :error-messages="norErrors"
              label="Number of ramps / line"
              required
              @input="$v.nor.$touch()"
              @blur="$v.nor.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="cou"
              :error-messages="couErrors"
              label="Coefficient of uniformity"
              required
              @input="$v.cou.$touch()"
              @blur="$v.cou.$touch()"
              suffix="%"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="ire"
              :error-messages="ireErrors"
              label="Irrigation efficiency"
              required
              @input="$v.ire.$touch()"
              @blur="$v.ire.$touch()"
              suffix="%"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="Soil"
              :error-messages="soilErrors"
              label="Soil texture"
              required
              @input="$v.Soil.$touch()"
              @blur="$v.Soil.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="oms"
              :error-messages="omsErrors"
              label="Organic matter steward"
              required
              @input="$v.oms.$touch()"
              @blur="$v.oms.$touch()"
              suffix="%"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="Ss"
              :error-messages="ssErrors"
              label="  Soil salinity"
              required
              @input="$v.Ss.$touch()"
              @blur="$v.Ss.$touch()"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="clay"
              :error-messages="clayErrors"
              label="Clay Content"
              required
              @input="$v.clay.$touch()"
              @blur="$v.clay.$touch()"
              suffix="%"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="Limon"
              :error-messages="limonErrors"
              label="Limon content"
              required
              @input="$v.Limon.$touch()"
              @blur="$v.Limon.$touch()"
              suffix="%"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="sand"
              :error-messages="sandErrors"
              label="Sand content"
              required
              @input="$v.sand.$touch()"
              @blur="$v.sand.$touch()"
              suffix="%"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="#4CAF50" @click="editnode">Edit</v-btn>
          </v-col>
          <v-col>
            <span v-if="errdata" style="color: green;">{{errdata}}</span>
            <span v-if="errdata" style="color: red;">{{err}}</span>
          </v-col>
        </v-row>
      </form>
    </div>
  </div>
</template>

<script>
import router from "@/routes";
// Migration vers @vuelidate/core - temporairement désactivé
import { required, alpha, alphaNum, decimal } from '@vuelidate/validators';
import isEmpty from "@/outils/isEmpty";
import { nodeService } from "@/services/api/index";
export default {
  // mixins: [validationMixin], // Temporairement désactivé
  computed: {
    $v() {
      const createField = () => ({
        $error: false,
        $dirty: false,
        $touch: function() { this.$dirty = true; }
      });
      return {
        clay: createField(),
        Limon: createField(),
        sand: createField(),
        fname: createField(),
        nodeId: createField(),
        oms: createField(),
        Ss: createField(),
        Soil: createField(),
        st: createField(),
        is: createField(),
        lat: createField(),
        long: createField(),
        cult: createField(),
        cd1: createField(),
        cd2: createField(),
        rootd: createField(),
        frod: createField(),
        sod: createField(),
        nor: createField(),
        cou: createField(),
        ire: createField(),
        $touch: function() {},
        $invalid: false
      };
    }
  },
  data() {
    return {
      err: null,
      errdata: "",
      select: null,
      items: ["Drip irrigation", "Sprinkler irrigation", "Surface irrigation"],
      clay: "",
      Limon: "",
      sand: "",
      fname: "",
      nodeId: "",
      lat: "",
      cult: "",
      long: "",
      st: "",
      // ws: "",
      is: null,
      // isn: "",
      cd1: "",
      cd2: "",
      rootd: "",
      frod: "",
      sod: "",
      nor: "",
      cou: "",
      ire: "",
      Ss: "",
      oms: "",
      Soil: "",
      e1: 1,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false
    };
  },
  created() {
    let get = this.$route.query;
    nodeService.getNodeDetails(get.id)
      .then((result) => {
        const res = result.data;
        if (!res || isEmpty(res)) router.push("/tables");
        console.log(res);
        (this.clay = res.Clay),
          (this.Limon = res.Limon),
          (this.sand = res.Sand),
          (this.fname = res.FarmerName),
          (this.nodeId = res.NodeId),
          (this.lat = res.latitude),
          (this.cult = res.Culture),
          (this.long = res.longitude),
          (this.st = res.Totalarea),
          (this.is = res.IrrigationSystem),
          (this.cd1 = res.CropDensit1),
          (this.cd2 = res.CropDensit2),
          (this.rootd = res.depthroot),
          (this.frod = res.DripppersFlowrate),
          (this.sod = res.DrippersSpaces),
          (this.nor = res.Numberramps),
          (this.cou = res.Cofficientuinf),
          (this.ire = res.Irrigationefficiency),
          (this.Ss = res.Soilsalinity),
          (this.oms = res.OrganicMatter),
          (this.Soil = res.Soiltextue),
          (this.e1 = 1),
          (this.date = res.Date.substr(0, 10));
      })
      .catch(er => console.log(er));
  },
  computed: {
    sandErrors() {
      const errors = [];
      if (!this.$v.sand.$dirty) return errors;
      // !this.$v.sand.decimal && errors.push('Sand Content must be Number')
      !this.$v.sand.required && errors.push("Sand Content  is required");
      return errors;
    },
    limonErrors() {
      const errors = [];
      if (!this.$v.Limon.$dirty) return errors;
      // !this.$v.Limon.decimal && errors.push('Limon Content must be Number')
      !this.$v.Limon.required && errors.push("Limon Content is required");
      return errors;
    },
    clayErrors() {
      const errors = [];
      if (!this.$v.clay.$dirty) return errors;
      // !this.$v.clay.decimal && errors.push('Clay Content must be Number')
      !this.$v.clay.required && errors.push("Clay Content is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.fname.$dirty) return errors;
      // !this.$v.fname.alphaNum && errors.push('Farmer Name must be String')
      !this.$v.fname.required && errors.push("Nom de l'agriculteur  is required");
      return errors;
    },
    ndeIdErrors() {
      const errors = [];
      if (!this.$v.nodeId.$dirty) return errors;
      // !this.$v.ire.decimal && errors.push('Culture must be String')
      !this.$v.nodeId.required && errors.push("Capteur ID  is required");
      return errors;
    },
    soilErrors() {
      const errors = [];
      if (!this.$v.Soil.$dirty) return errors;
      // !this.$v.ire.decimal && errors.push('Culture must be String')
      !this.$v.Soil.required && errors.push("Culutre Source is required");
      return errors;
    },
    omsErrors() {
      const errors = [];
      if (!this.$v.oms.$dirty) return errors;
      // !this.$v.ire.decimal && errors.push('Culture must be String')
      !this.$v.oms.required && errors.push("Soil Source is required");
      return errors;
    },
    ssErrors() {
      const errors = [];
      if (!this.$v.Ss.$dirty) return errors;
      // !this.$v.ire.decimal && errors.push('Culture must be String')
      !this.$v.Ss.required && errors.push("Culutre Source is required");
      return errors;
    },
    ireErrors() {
      const errors = [];
      if (!this.$v.ire.$dirty) return errors;
      !this.$v.ire.decimal && errors.push("Culture must be Number");
      !this.$v.ire.required && errors.push("Culutre Source is required");
      return errors;
    },
    couErrors() {
      const errors = [];
      if (!this.$v.cou.$dirty) return errors;
      !this.$v.cou.decimal && errors.push("Culture must be Number");
      !this.$v.cou.required && errors.push("Culutre Source is required");
      return errors;
    },
    norErrors() {
      const errors = [];
      if (!this.$v.nor.$dirty) return errors;
      !this.$v.nor.decimal && errors.push("Culture must be Number");
      !this.$v.nor.required && errors.push("Culutre Source is required");
      return errors;
    },
    sodErrors() {
      const errors = [];
      if (!this.$v.sod.$dirty) return errors;
      !this.$v.sod.decimal && errors.push("Culture must be Number");
      !this.$v.sod.required && errors.push("Culutre Source is required");
      return errors;
    },
    frodErrors() {
      const errors = [];
      if (!this.$v.frod.$dirty) return errors;
      !this.$v.frod.decimal &&
        errors.push("Flow rate of drippers must be Number");
      !this.$v.frod.required &&
        errors.push("Flow rate of drippers is required");
      return errors;
    },
    rootErrors() {
      const errors = [];
      if (!this.$v.rootd.$dirty) return errors;
      !this.$v.rootd.decimal && errors.push("Root depth must be Number");
      !this.$v.rootd.required && errors.push("Root depth is required");
      return errors;
    },
    cd2Errors() {
      const errors = [];
      if (!this.$v.cd2.$dirty) return errors;
      !this.$v.cd2.decimal && errors.push("Culture must be Number");
      !this.$v.cd2.required && errors.push("Culutre Source is required");
      return errors;
    },
    cd1Errors() {
      const errors = [];
      if (!this.$v.cd1.$dirty) return errors;
      !this.$v.cd1.decimal && errors.push("Culture must be Number");
      !this.$v.cd1.required && errors.push("Culutre Source is required");
      return errors;
    },
    cultErrors() {
      const errors = [];
      if (!this.$v.cult.$dirty) return errors;
      // !this.$v.cult.alpha && errors.push("Culture must be String");
      !this.$v.cult.required && errors.push("Culutre Source is required");
      return errors;
    },
    latErrors() {
      const errors = [];
      if (!this.$v.lat.$dirty) return errors;
      !this.$v.lat.decimal && errors.push("Latitude must be Float");
      !this.$v.lat.required && errors.push("Latitude is required.");
      return errors;
    },
    longErrors() {
      const errors = [];
      if (!this.$v.long.$dirty) return errors;
      !this.$v.long.decimal && errors.push("Longitude must be Float");
      !this.$v.long.required && errors.push("Longitude is required.");
      return errors;
    },
    surfaceErrors() {
      const errors = [];
      if (!this.$v.st.$dirty) return errors;
      !this.$v.st.decimal && errors.push("Total Area must be number");
      !this.$v.st.required && errors.push("Total Area is required");
      return errors;
    },
    irrigationSystem() {
      const errors = [];
      if (!this.$v.is.$dirty) return errors;
      // !this.$v.is.alpha && errors.push("Irrigation System must be String");
      !this.$v.is.required && errors.push("Irrigation System is required");
      return errors;
    }
    // waterErrors() {
    //   const errors = [];
    //   if (!this.$v.ws.$dirty) return errors;
    //   // !this.$v.ws.alpha && errors.push("Water Source must be String");
    //   !this.$v.ws.required && errors.push("Water Source is required");
    //   return errors;
    // },
    // irrigationSystemNumber() {
    //   const errors = [];
    //   if (!this.$v.isn.$dirty) return errors;
    //   !this.$v.isn.decimal &&
    //     errors.push("Irrigation System Number must be number");
    //   !this.$v.isn.required &&
    //     errors.push("Irrigation System Number is required");
    //   return errors;
    // }
  },

  methods: {
    editnode() {
      let get = this.$route.query;
      let d = {
        Clay: this.clay,
        Limon: this.Limon,
        Sand: this.sand,
        FarmerName: this.fname,
        NodeId: this.nodeId,
        latitude: this.lat,
        Culture: this.cult,
        longitude: this.long,
        Totalarea: this.st,
        IrrigationSystem: this.is,
        CropDensit1: this.cd1,
        CropDensit2: this.cd2,
        depthroot: this.rootd,
        DripppersFlowrate: this.frod,
        DrippersSpaces: this.sod,
        Numberramps: this.nor,
        Cofficientuinf: this.cou,
        Irrigationefficiency: this.ire,
        Soilsalinity: this.Ss,
        OrganicMatter: this.oms,
        Soiltextue: this.Soil,
        Date: this.date.substr(0, 10)
      };
      nodeService.editNode(get.id, d)
        .then((result) => {
          if (result.data) {
            this.errdata = "Updated";
          } else {
            this.err = result.error || "Check the fields and try again";
          }
        })
        .catch(() => (this.err = "Check the fields and try again"));
    },
    clear() {
      (this.clay = ""),
        (this.Limon = ""),
        (this.sand = ""),
        (this.fname = ""),
        (this.nodeId = ""),
        (this.lat = ""),
        (this.cult = ""),
        (this.long = ""),
        (this.st = ""),
        (this.is = ""),
        (this.cd1 = ""),
        (this.cd2 = ""),
        (this.rootd = ""),
        (this.frod = ""),
        (this.sod = ""),
        (this.nor = ""),
        (this.cou = ""),
        (this.ire = ""),
        (this.Ss = ""),
        (this.oms = ""),
        (this.Soil = "");
    },
    submit() {
      this.$v.nodeId.$touch();
      this.$v.fname.$touch();
      this.$v.lat.$touch();
      this.$v.long.$touch();
      this.$v.st.$touch();
      // this.$v.ws.$touch();
      this.$v.is.$touch();
      // this.$v.isn.$touch();

      console.log("dkhlaaaat");
      console.log(this.e1);
      if (
        !this.$v.nodeId.$error &&
        !this.$v.lat.$error &&
        !this.$v.long.$error &&
        !this.$v.st.$error &&
        !this.$v.is.$error &&
        !this.$v.fname.$error
      ) {
        console.log("dkhlaaat bla error");
        console.log(this.e1);
        this.e1 = 2;
        console.log(this.e1);
      }
    },
    submitII() {
      this.$v.ire.$touch();
      this.$v.cou.$touch();
      this.$v.nor.$touch();
      this.$v.sod.$touch();
      this.$v.frod.$touch();
      this.$v.rootd.$touch();
      this.$v.cd2.$touch();
      this.$v.cd1.$touch();
      this.$v.cult.$touch();
      if (
        !this.$v.ire.$error &&
        !this.$v.cou.$error &&
        !this.$v.nor.$error &&
        !this.$v.rootd.$error &&
        !this.$v.frod.$error &&
        !this.$v.sod.$error &&
        !this.$v.cd2.$error &&
        !this.$v.cd1.$error &&
        !this.$v.cult.$error
      ) {
        this.e1 = 3;
        console.log(this.e1);
      }
    }
  }
};
</script>