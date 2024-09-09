const { setAdminRole, verifyToken } = require('./firebaseAdmin');

// Example of setting admin role for a user
const userUid = 'lHr2h3txjuOkxlX3QHwEHucz3R53';  // Replace with actual UID
setAdminRole(userUid);

// Example of verifying an ID token
const idToken = 'yourIdTokenHere';  // Replace with actual ID token from user
verifyToken(idToken).then(decodedToken => {
  console.log('Token verified:', decodedToken);
}).catch(error => {
  console.error('Failed to verify token:', error);
});
