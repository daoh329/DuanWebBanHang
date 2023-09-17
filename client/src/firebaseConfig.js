// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_Mc5HUZALFdiGrriD1Et4quA9KcA0EgU",
  authDomain: "otp-banhangdientu.firebaseapp.com",
  projectId: "otp-banhangdientu",
  storageBucket: "otp-banhangdientu.appspot.com",
  messagingSenderId: "661825743630",
  appId: "1:661825743630:web:f0fe4d46ec4a83e2fdc55f",
  measurementId: "G-VVMDWW88WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
export { auth,storage };