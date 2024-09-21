// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBgPxKTtYKIqADa6IYRQRJTWNcLGFQjCRI',
  authDomain: 'sunset-heaven-lodge.firebaseapp.com',
  projectId: 'sunset-heaven-lodge',
  storageBucket: 'sunset-heaven-lodge.appspot.com',
  messagingSenderId: '962621175424',
  appId: '1:962621175424:web:08cec9632036b7a6285865',
  measurementId: 'G-BWHSRZB1YD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
