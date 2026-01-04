import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Sample ticker items
const sampleTickerItems = [
  {
    title: '🎉 Welcome to Alumni Connect!',
    message: 'Connect with alumni, explore job opportunities, and join exciting events',
    type: 'announcement',
    variant: 'success',
    priority: 5,
    actionUrl: '/events',
    actionLabel: 'Explore',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '📢 New Feature: Alumni Directory',
    message: 'Find and connect with alumni from your batch and department',
    type: 'announcement',
    variant: 'info',
    priority: 4,
    actionUrl: '/alumni',
    actionLabel: 'Browse',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '💼 Career Opportunities Available',
    message: 'Check out latest job postings from top companies',
    type: 'job',
    variant: 'info',
    priority: 4,
    actionUrl: '/opportunities',
    actionLabel: 'View Jobs',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '🏆 Alumni Achievement',
    message: 'Congratulations to our alumni for their outstanding contributions!',
    type: 'achievement',
    variant: 'success',
    priority: 3,
    actionUrl: '/alumni',
    actionLabel: 'Read More',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
];

async function addTickerItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define schema (same as TickerItem model)
    const tickerItemSchema = new mongoose.Schema({
      title: String,
      message: String,
      type: String,
      variant: String,
      priority: Number,
      actionUrl: String,
      actionLabel: String,
      isActive: Boolean,
      source: String,
      startDate: Date,
      endDate: Date,
      viewCount: Number,
      clickCount: Number,
    });

    const TickerItem = mongoose.model('TickerItem', tickerItemSchema, 'ticker_items');

    // Clear existing items (optional)
    await TickerItem.deleteMany({});
    console.log('🗑️  Cleared existing ticker items');

    // Insert sample items
    const result = await TickerItem.insertMany(sampleTickerItems);
    console.log(`✅ Added ${result.length} ticker items successfully!`);

    // Display added items
    console.log('\n📋 Added Ticker Items:');
    result.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTickerItems();
