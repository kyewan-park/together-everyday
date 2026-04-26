import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6H44-SF0Tu5OcnxJSUbaHx8SwhvILKpo",
  authDomain: "together-v2-b8158.firebaseapp.com",
  projectId: "together-v2-b8158",
  storageBucket: "together-v2-b8158.firebasestorage.app",
  messagingSenderId: "844739935671",
  appId: "1:844739935671:web:5f253bcfbd5abbd0dafc32"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
