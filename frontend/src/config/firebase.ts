// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, type Messaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU",
  authDomain: "alumni-connect-84d49.firebaseapp.com",
  databaseURL: "https://alumni-connect-84d49-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alumni-connect-84d49",
  storageBucket: "alumni-connect-84d49.firebasestorage.app",
  messagingSenderId: "697354232724",
  appId: "1:697354232724:web:88f010a874a283f36ba581",
  measurementId: "G-XNQPN39KKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize auth (required)
const auth = getAuth(app);

// Initialize messaging (optional, only works in HTTPS and with service worker)
let messaging: Messaging | null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.warn('Firebase Messaging not supported in this browser/environment:', error);
  messaging = null;
}

export { app, analytics, messaging, auth };
export default app;
