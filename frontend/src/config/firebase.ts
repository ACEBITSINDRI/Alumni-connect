import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU",
  authDomain: "alumni-connect-84d49.firebaseapp.com",
  projectId: "alumni-connect-84d49",
  storageBucket: "alumni-connect-84d49.firebasestorage.app",
  messagingSenderId: "697354232724",
  appId: "1:697354232724:web:88f010a874a283f36ba581",
  measurementId: "G-XNQPN39KKF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Messaging (FCM) - only if supported
export let messaging: ReturnType<typeof getMessaging> | null = null;

isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

export default app;
