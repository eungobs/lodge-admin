// src/auth.js

import { auth } from './firebaseConfig'; // Ensure the correct path
import { signInWithEmailAndPassword } from "firebase/auth";

// Sign In Function
async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

// Get ID Token Function
async function getIdToken() {
  const user = auth.currentUser;
  if (user) {
    try {
      const idToken = await user.getIdToken();
      console.log('ID Token:', idToken);
      return idToken;
    } catch (error) {
      console.error('Error fetching ID token:', error);
    }
  } else {
    console.log('No user is signed in.');
    return null;
  }
}

// Export functions for use in other components
export { signInUser, getIdToken };
