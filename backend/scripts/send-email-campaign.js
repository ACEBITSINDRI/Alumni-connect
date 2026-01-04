import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  sendWelcomeEmail,
  sendEventAnnouncement,
  sendCustomAnnouncement,
  sendTestEmail,
  getEmailStats,
} from '../src/services/emailCampaignService.js';

dotenv.config();

const CAMPAIGN_TYPES = {
  stats: 'Show email campaign statistics',
  test: 'Send a test email',
  welcome: 'Send welcome email to all users',
  event: 'Send event announcement',
  custom: 'Send custom announcement',
};

async function main() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const args = process.argv.slice(2);
    const campaignType = args[0];

    if (!campaignType || !CAMPAIGN_TYPES[campaignType]) {
      console.log('📧 Alumni Connect - Email Campaign Tool\n');
      console.log('Usage: node send-email-campaign.js <type> [options]\n');
      console.log('Available campaign types:');
      Object.entries(CAMPAIGN_TYPES).forEach(([key, desc]) => {
        console.log(`  ${key.padEnd(12)} - ${desc}`);
      });
      console.log('\nExamples:');
      console.log('  node send-email-campaign.js stats');
      console.log('  node send-email-campaign.js test your-email@example.com');
      console.log('  node send-email-campaign.js welcome');
      console.log('  node send-email-campaign.js event');
      console.log('  node send-email-campaign.js custom');
      process.exit(0);
    }

    switch (campaignType) {
      case 'stats': {
        const stats = await getEmailStats();
        console.log('📊 Email Campaign Statistics\n');
        console.log(`Total Users (Verified):     ${stats.totalUsers}`);
        console.log(`Students:                   ${stats.studentCount}`);
        console.log(`Alumni:                     ${stats.alumniCount}`);
        console.log(`\nBatches (${stats.batches.length}):`, stats.batches.join(', ') || 'None');
        console.log(`\nDepartments (${stats.departments.length}):`, stats.departments.join(', ') || 'None');
        break;
      }

      case 'test': {
        const testEmail = args[1] || process.env.EMAIL_USER;
        if (!testEmail) {
          console.error('❌ Please provide recipient email: node send-email-campaign.js test your-email@example.com');
          process.exit(1);
        }

        console.log(`📧 Sending test email to: ${testEmail}\n`);

        const result = await sendTestEmail(testEmail, 'welcome', {
          subject: 'Test Email from Alumni Connect',
        });

        if (result.success) {
          console.log('✅ Test email sent successfully!');
        } else {
          console.error('❌ Failed to send test email:', result.error);
        }
        break;
      }

      case 'welcome': {
        console.log('📧 Sending Welcome Email Campaign\n');
        console.log('⚠️  This will send emails to ALL verified users!');
        console.log('Continue? (Press Enter to continue, Ctrl+C to cancel)');

        // Wait for user confirmation
        await new Promise(resolve => {
          process.stdin.once('data', resolve);
        });

        const result = await sendWelcomeEmail();
        console.log(`\n✅ ${result.message}`);
        console.log(`   Sent: ${result.results.sent}`);
        console.log(`   Failed: ${result.results.failed}`);
        break;
      }

      case 'event': {
        console.log('📧 Sending Event Announcement\n');

        const eventData = {
          eventTitle: 'Alumni Meetup 2026',
          eventDate: 'January 15, 2026',
          eventTime: '6:00 PM IST',
          venue: 'Virtual (Zoom)',
          eventType: 'Networking Event',
          organizer: 'Alumni Connect Team',
          description:
            'Join us for an exciting virtual meetup where alumni share their experiences, network with peers, and discuss career opportunities.',
          customMessage:
            "We're thrilled to invite you to our first alumni meetup of the year!",
          ctaText: 'Register Now',
        };

        console.log('Event Details:');
        console.log(`  Title: ${eventData.eventTitle}`);
        console.log(`  Date: ${eventData.eventDate} at ${eventData.eventTime}`);
        console.log(`  Venue: ${eventData.venue}\n`);

        console.log('⚠️  This will send emails to ALL verified users!');
        console.log('Continue? (Press Enter to continue, Ctrl+C to cancel)');

        await new Promise(resolve => {
          process.stdin.once('data', resolve);
        });

        const result = await sendEventAnnouncement(eventData);
        console.log(`\n✅ ${result.message}`);
        console.log(`   Sent: ${result.results.sent}`);
        console.log(`   Failed: ${result.results.failed}`);
        break;
      }

      case 'custom': {
        console.log('📧 Sending Custom Announcement\n');

        const announcementData = {
          subject: '🚀 Platform Updates - Alumni Connect',
          title: 'Exciting New Features Released!',
          badge: '🎉 NEW',
          headerStyle: 'success',
          preMessage: 'We have some exciting news to share with you!',
          message:
            'We\'ve just launched several new features including:\n\n' +
            '✨ Enhanced Alumni Directory with advanced search\n' +
            '💼 Improved job opportunity matching\n' +
            '📅 Better event management and RSVP system\n' +
            '📱 Mobile-responsive design improvements\n\n' +
            'Check them out on the platform!',
          postMessage: 'We hope you enjoy these new features and find them useful.',
          ctaText: 'Explore Now',
          ctaUrl: 'https://alumniconnect.acebits.in/dashboard',
          additionalInfo: 'Have feedback? Reply to this email - we\'d love to hear from you!',
        };

        console.log('Announcement:');
        console.log(`  Subject: ${announcementData.subject}`);
        console.log(`  Title: ${announcementData.title}\n`);

        console.log('⚠️  This will send emails to ALL verified users!');
        console.log('Continue? (Press Enter to continue, Ctrl+C to cancel)');

        await new Promise(resolve => {
          process.stdin.once('data', resolve);
        });

        const result = await sendCustomAnnouncement(announcementData);
        console.log(`\n✅ ${result.message}`);
        console.log(`   Sent: ${result.results.sent}`);
        console.log(`   Failed: ${result.results.failed}`);
        break;
      }

      default:
        console.error('❌ Unknown campaign type:', campaignType);
        process.exit(1);
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
