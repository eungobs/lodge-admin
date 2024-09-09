// setAdminRole.js
const { setAdminRole } = require('./firebaseAdmin');

// Replace with the actual UID of the user you want to set as an admin
const userUid = 'USER_UID_HERE';

setAdminRole(userUid)
  .then(() => console.log('Admin role set successfully.'))
  .catch(error => console.error('Error setting admin role:', error));
