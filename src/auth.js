// src/auth.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBgPxKTtYKIqADa6IYRQRJTWNcLGFQjCRI',
  authDomain: 'sunset-heaven-lodge.firebaseapp.com',
  projectId: 'sunset-heaven-lodge',
  storageBucket: 'sunset-heaven-lodge.appspot.com',
  messagingSenderId: '962621175424',
  appId: '1:962621175424:web:08cec9632036b7a6285865',
  measurementId: 'G-BWHSRZB1YD',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};
