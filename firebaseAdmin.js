// Import the Firebase Admin SDK
const admin = require('firebase-admin');

// Path to your Firebase service account key
const serviceAccount = require('./src/firebase-service-account.json');

// Initialize the Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to set custom claims for a user
async function setCustomClaims(uid, claims) {
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`Successfully set custom claims for user with UID: ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error.message);
  }
}

// Function to verify an ID token and check its claims
async function verifyToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verified. Decoded token:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw error;
  }
}

// Function to set the admin role for a user
async function setAdminRole(uid) {
  try {
    await setCustomClaims(uid, { admin: true });
    console.log(`Successfully set admin role for user with UID: ${uid}`);
  } catch (error) {
    console.error('Error setting admin role:', error.message);
  }
}

// Export the functions for use in other files
module.exports = {
  admin,
  setCustomClaims,
  verifyToken,
  setAdminRole,
};
