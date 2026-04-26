import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7PXTrDuJKzHg7zHEXoa0EObtLD1mR4lU",
  authDomain: "kyewan-6d220.firebaseapp.com",
  projectId: "kyewan-6d220",
  storageBucket: "kyewan-6d220.firebasestorage.app",
  messagingSenderId: "901184321541",
  appId: "1:901184321541:web:cc79042d3606b2320e446c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
