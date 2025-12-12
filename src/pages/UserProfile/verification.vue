<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <button @click="closeModal">Close</button>
            <div class="verification-container">
                <div ref="recaptchaContainer" id="recaptcha-container"></div>
                <div v-if="displayPhone" class="verification-code-input" >

                    <div class="phone-number-input">
                        <label for="phoneNumber">Phone Number:</label>
                        <!-- <input id="phoneNumber" v-model="phoneNumber" type="tel" placeholder="Enter your phone number" /> -->
                    </div>
                    <button class="send-code-btn" @click="sendVerificationCode">Send Verification Code</button>
                </div>
                <div v-else class="verification-code-input">
                    <label for="verificationCode">Enter the code received</label>
                        <otp-input
                            ref="otpInput"
                            v-model="verificationCode"
                            separator="-"
                            :num-inputs="3"
                            :should-auto-focus="true"
                            input-type="number"
                            placeholder="_"
                        />
                    <!-- <input id="verificationCode" v-model="verificationCode" type="text" placeholder="Enter the code received" /> -->
                </div>
                <button v-if="!displayPhone" class="verify-code-btn" @click="verifyCode" >Verify Code</button>
            </div>

        </div>
    </div>
</template>
  
  <script>
  import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/firebase';
  import OtpInput from '@/components/OtpInput.vue';
  export default {
    components: {
        OtpInput,
    },
    props: {
      isVisible: Boolean,
      phoneNumber:String
    },
    data() {
      return {
        // phoneNumber: '',
        verificationCode: '',
        confirmationResult: null,
        displayPhone:true
      };
    },
    methods: {
        closeModal() {
            console.log("**********************");
            this.$emit('close')
            // this.$emit('update:isVisible', false);
        },
        sendVerificationCode() {
            console.log(this.props.phoneNumber);
            // if (!window.recaptchaVerifier) {
            //     console.error("Recaptcha Verifier is not initialized.");
            //     return;
            // }

            // const appVerifier = window.recaptchaVerifier;
            // signInWithPhoneNumber(auth, this.phoneNumber, appVerifier)
            // .then((confirmationResult) => {
            //     this.confirmationResult = confirmationResult;
            //     this.displayPhone = !this.displayPhone;
            // })
            // .catch((error) => {
            //     console.error("SMS not sent", error);
            // });
        },

      verifyCode() {
        this.confirmationResult.confirm(this.verificationCode)
          .then((result) => {
            const user = result.user;
            console.log("User is verified", user);
          }).catch((error) => {
            console.error("Wrong verification code", error);
          });
      }
    },
    mounted() {
    console.log("Mounting component, initializing RecaptchaVerifier");
    
    // Ensure that the reCAPTCHA container is empty before initializing
    const recaptchaContainer = document.getElementById("recaptcha-container");
    while (recaptchaContainer.firstChild) {
        recaptchaContainer.removeChild(recaptchaContainer.firstChild);
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth,
        "recaptcha-container",
        {
            size: "invisible",
            callback: (response) => {
                console.log("reCAPTCHA solved");
            },
        },
        auth
    );
    
    console.log("RecaptchaVerifier initialized:", window.recaptchaVerifier);
},
  };
  </script>
  <style scoped>
  .otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    /* Add more styling as per your requirement */
  }
.verification-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  
  .phone-number-input, .verification-code-input {
    margin-bottom: 20px;
  }
  
  input[type="tel"], input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .send-code-btn, .verify-code-btn {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .send-code-btn:hover, .verify-code-btn:hover {
    background-color: #45a049;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  </style>