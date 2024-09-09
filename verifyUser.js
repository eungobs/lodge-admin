// Import functions from firebaseAdmin.js
const { verifyToken, setAdminRole } = require('./firebaseAdmin');

// User ID token and UID
const userIdToken = ''; // Example token
const userUid = 'lHr2h3txjuOkxlX3QHwEHucz3R53'; // Example UID

// Verify the token
verifyToken(userIdToken).then(decodedToken => {
  console.log('Decoded Token:', decodedToken);
}).catch(error => {
  console.error('Error verifying token:', error);
});

// Set admin role for a user
setAdminRole(userUid).then(() => {
  console.log('Admin role set successfully.');
}).catch(error => {
  console.error('Error setting admin role:', error);
});