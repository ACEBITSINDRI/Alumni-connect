import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read service account key
const serviceAccountPath = join(__dirname, '../../alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'alumni-connect-84d49.firebasestorage.app',
    projectId: 'alumni-connect-84d49',
  });
}

// Export Firebase services
export const auth = admin.auth();
export const storage = admin.storage();
export const firestore = admin.firestore();

export default admin;
