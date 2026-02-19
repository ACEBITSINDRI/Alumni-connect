import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function setTickerDates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const tickerItemSchema = new mongoose.Schema({}, { strict: false });
    const TickerItem = mongoose.model('TickerItem', tickerItemSchema, 'ticker_items');

    // Set startDate to yesterday to be absolutely sure they show
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await TickerItem.updateMany(
      {},
      {
        $set: {
          startDate: yesterday,
          endDate: null,
          isActive: true
        }
      }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} ticker items`);
    console.log(`   StartDate set to: ${yesterday.toISOString()}`);

    // Verify with the same query the controller uses
    const now = new Date();
    const items = await TickerItem.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    }).sort({ priority: -1, startDate: -1 });

    console.log(`\n📊 Items matching controller query: ${items.length}`);
    items.forEach((item, i) => {
      console.log(`${i + 1}. ${item.title} (Priority: ${item.priority})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setTickerDates();
