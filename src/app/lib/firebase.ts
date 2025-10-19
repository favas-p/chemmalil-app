// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDNn-n3VWZ4tO9U76APjaXu2eqdylYFKJ0",
  authDomain: "chemmalil-app.firebaseapp.com",
  projectId: "chemmalil-app",
  storageBucket: "chemmalil-app.firebasestorage.app",
  messagingSenderId: "1067760207221",
  appId: "1:1067760207221:web:4062e3eef4c1751d207f3c",
  measurementId: "G-RJTPJCQS7P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
