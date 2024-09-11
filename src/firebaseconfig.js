// Import the required functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Firebase Authentication

// Firebase configuration for your web app
const firebaseConfig = {
  apiKey: 'AIzaSyBgPxKTtYKIqADa6IYRQRJTWNcLGFQjCRI',
  authDomain: 'sunset-heaven-lodge.firebaseapp.com',
  projectId: 'sunset-heaven-lodge',
  storageBucket: 'sunset-heaven-lodge.appspot.com',
  messagingSenderId: '962621175424',
  appId: '1:962621175424:web:08cec9632036b7a6285865',
  measurementId: 'G-BWHSRZB1YD',
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Storage, and Authentication services
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Authentication

// Export initialized Firebase services for use in other parts of the app
export { firestore, storage, auth };