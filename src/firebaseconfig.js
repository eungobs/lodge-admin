// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

// Your web app's Firebase configuration
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

// Initialize Firestore, Storage, and Authentication
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Authentication

// Export the instances
export { firestore, storage, auth };



