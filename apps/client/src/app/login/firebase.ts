// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAuuSLDSWS5oIxhJhXwP9w_1fhOb68-GR8",
    authDomain: "komuna-2025.firebaseapp.com",
    projectId: "komuna-2025",
    storageBucket: "komuna-2025.firebasestorage.app",
    messagingSenderId: "843705847350",
    appId: "1:843705847350:web:06c2e780f11fce25929297",
    measurementId: "G-KZ030JX461"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
