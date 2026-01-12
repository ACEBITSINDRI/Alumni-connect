const admin = require('firebase-admin');
const fs = require('fs');

// Load service account
const serviceAccount = JSON.parse(
  fs.readFileSync('alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Email to delete
const emailToDelete = process.argv[2];

if (!emailToDelete) {
  console.error('❌ Please provide email: node delete-firebase-user.js user@example.com');
  process.exit(1);
}

console.log(`🔍 Searching for user: ${emailToDelete}`);

admin.auth().getUserByEmail(emailToDelete)
  .then(user => {
    console.log('✅ Found user:', user.uid, user.email);
    return admin.auth().deleteUser(user.uid);
  })
  .then(() => {
    console.log('✅ User deleted successfully from Firebase!');
    process.exit(0);
  })
  .catch(error => {
    if (error.code === 'auth/user-not-found') {
      console.log('✅ User not found in Firebase (already deleted)');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  });
