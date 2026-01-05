import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Sample ticker items
const sampleTickerItems = [
  {
    title: '🎉 Welcome to Alumni Connect - Your Professional Network!',
    message: 'Join thousands of alumni connecting, sharing opportunities, and building their careers together',
    type: 'announcement',
    variant: 'success',
    priority: 5,
    actionUrl: '/dashboard',
    actionLabel: 'Get Started',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '💼 Explore Career Opportunities',
    message: 'Browse latest job openings posted by alumni and top companies - Your next career move awaits!',
    type: 'job',
    variant: 'info',
    priority: 5,
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
    title: '📅 Upcoming Alumni Events',
    message: 'Join networking meetups, workshops, and reunions - Stay connected with your batch mates!',
    type: 'event',
    variant: 'info',
    priority: 4,
    actionUrl: '/events',
    actionLabel: 'View Events',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '👥 Connect with Alumni Directory',
    message: 'Find alumni from your department, batch, and company - Expand your professional network',
    type: 'announcement',
    variant: 'info',
    priority: 4,
    actionUrl: '/alumni',
    actionLabel: 'Browse Alumni',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '🏆 Celebrating Alumni Success Stories',
    message: 'From startups to Fortune 500 - Our alumni are making an impact worldwide!',
    type: 'achievement',
    variant: 'success',
    priority: 3,
    actionUrl: '/alumni',
    actionLabel: 'Read Stories',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '📢 Share Your Knowledge - Create a Post',
    message: 'Share your experiences, tips, and insights with the community. Your story matters!',
    type: 'announcement',
    variant: 'info',
    priority: 3,
    actionUrl: '/dashboard',
    actionLabel: 'Post Now',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '🔔 Get Real-time Notifications',
    message: 'Never miss important updates - Enable notifications for posts, events, and opportunities',
    type: 'announcement',
    variant: 'warning',
    priority: 2,
    actionUrl: '/settings',
    actionLabel: 'Enable',
    isActive: true,
    source: 'manual',
    startDate: new Date(),
    endDate: null,
    viewCount: 0,
    clickCount: 0,
  },
  {
    title: '🌟 Alumni Connect - Built by Students, For Alumni',
    message: 'A platform to bridge the gap between students and alumni. Together we grow stronger!',
    type: 'news',
    variant: 'success',
    priority: 2,
    actionUrl: '/',
    actionLabel: 'Learn More',
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
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ALUMNI-CONNECT',
    });
    console.log('✅ Connected to MongoDB (Database: ALUMNI-CONNECT)');

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
