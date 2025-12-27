import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get service account credentials
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Production: Use environment variable (for Render, Vercel, etc.)
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('✅ Firebase Admin: Using service account from environment variable');
  } catch (error) {
    console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
  }
} else {
  // Development: Use service account file
  const serviceAccountPath = join(__dirname, '../../alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json');

  if (!existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account file not found at ${serviceAccountPath}. ` +
      'Either add the file or set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.'
    );
  }

  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  console.log('✅ Firebase Admin: Using service account from file');
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'alumni-connect-84d49.firebasestorage.app',
    projectId: 'alumni-connect-84d49',
  });
  console.log('✅ Firebase Admin initialized successfully');
}

// Export Firebase services
export const auth = admin.auth();
export const storage = admin.storage();
export const firestore = admin.firestore();

export default admin;
