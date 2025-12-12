import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier ,signInWithPhoneNumber} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBHTGyA0QAzO3gHocNPnkXesicfijhON9M",
    authDomain: "irrig-a7fd5.firebaseapp.com",
    databaseURL: "https://irrig-a7fd5.firebaseio.com",
    projectId: "irrig-a7fd5",
    storageBucket: "irrig-a7fd5.appspot.com",
    messagingSenderId: "729031097299",
    appId: "1:729031097299:web:de13426929e93bbac2cd26",
    measurementId: "G-JVW0M6JQ81"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, RecaptchaVerifier,signInWithPhoneNumber,firebaseConfig };
