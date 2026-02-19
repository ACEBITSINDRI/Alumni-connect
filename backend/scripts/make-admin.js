import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Alumni Schema (simplified)
const alumniSchema = new mongoose.Schema({
  email: String,
  role: String,
  firstName: String,
  lastName: String,
});

// Student Schema (simplified)
const studentSchema = new mongoose.Schema({
  email: String,
  role: String,
  firstName: String,
  lastName: String,
});

const Alumni = mongoose.model('Alumni', alumniSchema, 'alumni');
const Student = mongoose.model('StudentData', studentSchema, 'student_data');

async function makeUserAdmin(email) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ALUMNI-CONNECT',
    });
    console.log('✅ Connected to MongoDB\n');

    // Check in Alumni collection
    console.log(`🔍 Searching for user: ${email} in Alumni collection...`);
    const alumniUser = await Alumni.findOne({ email });

    if (alumniUser) {
      console.log('✅ User found in Alumni collection!');
      console.log(`   Name: ${alumniUser.firstName} ${alumniUser.lastName}`);
      console.log(`   Current Role: ${alumniUser.role || 'Not set'}`);

      // Update role to admin
      alumniUser.role = 'admin';
      await alumniUser.save();

      console.log('✅ User role updated to ADMIN successfully!\n');
      console.log('📧 User Details:');
      console.log(`   Email: ${alumniUser.email}`);
      console.log(`   Name: ${alumniUser.firstName} ${alumniUser.lastName}`);
      console.log(`   Role: ${alumniUser.role}`);
      console.log('\n🎉 User is now an admin! They can access /admin/email-campaigns');
      return;
    }

    // Check in Student collection
    console.log(`🔍 Searching for user: ${email} in Student collection...`);
    const studentUser = await Student.findOne({ email });

    if (studentUser) {
      console.log('✅ User found in Student collection!');
      console.log(`   Name: ${studentUser.firstName} ${studentUser.lastName}`);
      console.log(`   Current Role: ${studentUser.role || 'Not set'}`);

      // Update role to admin
      studentUser.role = 'admin';
      await studentUser.save();

      console.log('✅ User role updated to ADMIN successfully!\n');
      console.log('📧 User Details:');
      console.log(`   Email: ${studentUser.email}`);
      console.log(`   Name: ${studentUser.firstName} ${studentUser.lastName}`);
      console.log(`   Role: ${studentUser.role}`);
      console.log('\n🎉 User is now an admin! They can access /admin/email-campaigns');
      return;
    }

    // User not found
    console.log('❌ User not found in any collection!');
    console.log('\n💡 Suggestions:');
    console.log('   1. Check if the email is correct');
    console.log('   2. Make sure the user has registered on the platform');
    console.log('   3. Check the database connection');

  } catch (error) {
    console.error('❌ Error making user admin:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address!');
  console.log('\n📖 Usage:');
  console.log('   node scripts/make-admin.js your-email@example.com');
  console.log('\n📝 Example:');
  console.log('   node scripts/make-admin.js admin@acebitsindri.ac.in');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.log('❌ Invalid email format!');
  console.log('   Please provide a valid email address');
  process.exit(1);
}

// Run the function
makeUserAdmin(email)
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
