/**
 * Convert Firebase Service Account JSON to Single-Line String for Render
 *
 * Usage:
 * node convert-firebase-json.js
 *
 * This will output a single-line JSON string that you can copy-paste
 * into Render's FIREBASE_SERVICE_ACCOUNT_KEY environment variable
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Read the Firebase service account file
  const filePath = join(__dirname, 'alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json');

  console.log('📖 Reading Firebase service account file...\n');

  const fileContent = readFileSync(filePath, 'utf8');
  const jsonObject = JSON.parse(fileContent);

  // Convert to single-line string
  const singleLineJson = JSON.stringify(jsonObject);

  console.log('✅ SUCCESS! Copy the text below (entire line):\n');
  console.log('=' .repeat(80));
  console.log(singleLineJson);
  console.log('=' .repeat(80));

  console.log('\n📋 Instructions:');
  console.log('1. Copy the ENTIRE line above (from { to })');
  console.log('2. Go to Render Dashboard → Your Backend Service → Environment');
  console.log('3. Add a new environment variable:');
  console.log('   Key: FIREBASE_SERVICE_ACCOUNT_KEY');
  console.log('   Value: (paste the copied line)');
  console.log('4. Click "Save Changes"');
  console.log('5. Render will automatically redeploy\n');

  console.log('✅ Your backend will then use this environment variable instead of the file!\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\nMake sure the Firebase service account file exists at:');
  console.log('backend/alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json');
  process.exit(1);
}
