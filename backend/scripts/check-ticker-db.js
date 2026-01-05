import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkTickerItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const tickerItemSchema = new mongoose.Schema({}, { strict: false });
    const TickerItem = mongoose.model('TickerItem', tickerItemSchema, 'ticker_items');

    // Get all ticker items
    const allItems = await TickerItem.find({});
    console.log(`\n📊 Total ticker items in database: ${allItems.length}\n`);

    // Show each item
    allItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   - ID: ${item._id}`);
      console.log(`   - Active: ${item.isActive}`);
      console.log(`   - Priority: ${item.priority}`);
      console.log(`   - StartDate: ${item.startDate}`);
      console.log(`   - EndDate: ${item.endDate || 'null'}`);
      console.log('');
    });

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTickerItems();
