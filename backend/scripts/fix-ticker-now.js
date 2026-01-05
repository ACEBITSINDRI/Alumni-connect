import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixTickerNow() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ALUMNI-CONNECT',
    });
    console.log('✅ Connected to MongoDB (Database: ALUMNI-CONNECT)');

    const tickerItemSchema = new mongoose.Schema({}, { strict: false });
    const TickerItem = mongoose.model('TickerItem', tickerItemSchema, 'ticker_items');

    // Get current server time
    const now = new Date();
    console.log('\n🕐 Current Server Time:', now.toISOString());
    console.log('🕐 Current Server Time (Local):', now.toString());

    // Set to 2 days ago to be absolutely safe
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    console.log('🕐 Setting startDate to:', twoDaysAgo.toISOString());

    // Update ALL ticker items
    const updateResult = await TickerItem.updateMany(
      {},
      {
        $set: {
          startDate: twoDaysAgo,
          endDate: null,
          isActive: true,
        },
      }
    );

    console.log(`\n✅ Updated ${updateResult.modifiedCount} ticker items`);

    // Verify with exact query from controller
    const verifyQuery = {
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    };

    console.log('\n📋 Testing controller query:', JSON.stringify(verifyQuery, null, 2));

    const items = await TickerItem.find(verifyQuery)
      .sort({ priority: -1, startDate: -1 })
      .limit(10);

    console.log(`\n✅ Items found: ${items.length}`);
    items.forEach((item, i) => {
      console.log(`${i + 1}. ${item.title}`);
      console.log(`   Priority: ${item.priority}, Active: ${item.isActive}`);
      console.log(`   StartDate: ${item.startDate}`);
      console.log(`   EndDate: ${item.endDate || 'null'}`);
    });

    // Show all items in DB
    const allItems = await TickerItem.find({});
    console.log(`\n📊 Total items in ticker_items collection: ${allItems.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTickerNow();
