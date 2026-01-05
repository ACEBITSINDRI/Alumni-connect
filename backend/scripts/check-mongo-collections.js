import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkCollections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📊 Total Collections: ${collections.length}\n`);

    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`   ${coll.name.padEnd(30)} - ${count} documents`);
    }

    // Check specifically for ticker items
    console.log('\n🎫 Checking ticker_items collection:');
    const tickerItems = await db.collection('ticker_items').find({}).toArray();
    console.log(`   Total items: ${tickerItems.length}`);

    if (tickerItems.length > 0) {
      console.log('\n   Items:');
      tickerItems.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.title}`);
        console.log(`      Active: ${item.isActive}, Priority: ${item.priority}`);
        console.log(`      StartDate: ${item.startDate}`);
      });
    }

    // Check if there's a different ticker collection
    const tickerItemsAlt = await db.collection('tickeritems').find({}).toArray();
    if (tickerItemsAlt.length > 0) {
      console.log(`\n⚠️  Found items in 'tickeritems' collection: ${tickerItemsAlt.length}`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCollections();
