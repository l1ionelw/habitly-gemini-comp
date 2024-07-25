import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, connectAuthEmulator} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let db;
export let auth;
export let analytics;

if (import.meta.env.VITE_FIRESTORE_EMULATOR) {
    db = getFirestore();
    connectFirestoreEmulator(db, '127.0.0.1', 9098);
    auth = getAuth();
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
} else {
    auth = getAuth(app);
    db = getFirestore(app);
    analytics = getAnalytics(app);
}

