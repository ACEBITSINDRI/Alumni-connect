import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixTickerDates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const tickerItemSchema = new mongoose.Schema({}, { strict: false });
    const TickerItem = mongoose.model('TickerItem', tickerItemSchema, 'ticker_items');

    // Get current time
    const now = new Date();
    console.log('\n🕐 Current time:', now);
    console.log('🕐 Current time (ISO):', now.toISOString());

    // Update all items to have startDate = now - 1 hour (to be safe)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const result = await TickerItem.updateMany(
      {},
      {
        $set: {
          startDate: oneHourAgo,
          isActive: true
        }
      }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} ticker items`);
    console.log(`   New startDate: ${oneHourAgo} (1 hour ago)`);

    // Verify
    const items = await TickerItem.find({ isActive: true });
    console.log(`\n✅ Active items in DB: ${items.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTickerDates();
