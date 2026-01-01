import cron from 'node-cron';
import { generateAllWeeklyDigests } from './notificationService.js';
import Event from '../models/Event.js';
import { sendEventReminderNotification } from './notificationService.js';

/**
 * Cron Job Service for Automated Tasks
 * - Weekly Digest (Every Sunday at 9:00 AM)
 * - Event Reminders (Every hour, checks for upcoming events)
 */

/**
 * Initialize all cron jobs
 */
export const initializeCronJobs = () => {
  console.log('🕐 Initializing cron jobs...');

  // Weekly Digest - Every Sunday at 9:00 AM
  cron.schedule('0 9 * * 0', async () => {
    console.log('📊 Running weekly digest cron job...');
    try {
      const result = await generateAllWeeklyDigests();
      console.log('✅ Weekly digest cron completed:', result);
    } catch (error) {
      console.error('❌ Weekly digest cron error:', error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Event Reminders - Every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Checking for upcoming events...');
    try {
      await checkAndSendEventReminders();
    } catch (error) {
      console.error('❌ Event reminder cron error:', error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Event Reminders - 1 day before (runs at 9:00 AM daily)
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Sending 1-day event reminders...');
    try {
      await send1DayEventReminders();
    } catch (error) {
      console.error('❌ 1-day reminder error:', error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('✅ Cron jobs initialized successfully!');
};

/**
 * Check for upcoming events and send reminders
 * Sends reminders:
 * - 1 hour before event
 * - 3 hours before event
 */
const checkAndSendEventReminders = async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    // Find events happening in 1 hour
    const eventsIn1Hour = await Event.find({
      date: {
        $gte: now,
        $lte: oneHourLater,
      },
      reminderSent1Hour: { $ne: true },
    }).populate('attendees');

    // Find events happening in 3 hours
    const eventsIn3Hours = await Event.find({
      date: {
        $gte: oneHourLater,
        $lte: threeHoursLater,
      },
      reminderSent3Hours: { $ne: true },
    }).populate('attendees');

    // Send 1-hour reminders
    for (const event of eventsIn1Hour) {
      if (event.attendees && event.attendees.length > 0) {
        await sendEventReminderNotification({
          eventId: event._id,
          eventName: event.title || event.name,
          eventDate: event.date,
          participants: event.attendees.map(a => a._id),
          timeUntil: '1 hour',
        });

        // Mark reminder as sent
        event.reminderSent1Hour = true;
        await event.save();
      }
    }

    // Send 3-hour reminders
    for (const event of eventsIn3Hours) {
      if (event.attendees && event.attendees.length > 0) {
        await sendEventReminderNotification({
          eventId: event._id,
          eventName: event.title || event.name,
          eventDate: event.date,
          participants: event.attendees.map(a => a._id),
          timeUntil: '3 hours',
        });

        // Mark reminder as sent
        event.reminderSent3Hours = true;
        await event.save();
      }
    }

    console.log(`✅ Sent reminders for ${eventsIn1Hour.length + eventsIn3Hours.length} events`);
  } catch (error) {
    console.error('❌ Error in checkAndSendEventReminders:', error);
  }
};

/**
 * Send 1-day event reminders
 * Runs daily at 9:00 AM
 */
const send1DayEventReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Find events happening tomorrow
    const eventsIn1Day = await Event.find({
      date: {
        $gte: tomorrow,
        $lte: dayAfterTomorrow,
      },
      reminderSent1Day: { $ne: true },
    }).populate('attendees');

    // Send reminders
    for (const event of eventsIn1Day) {
      if (event.attendees && event.attendees.length > 0) {
        await sendEventReminderNotification({
          eventId: event._id,
          eventName: event.title || event.name,
          eventDate: event.date,
          participants: event.attendees.map(a => a._id),
          timeUntil: '1 day',
        });

        // Mark reminder as sent
        event.reminderSent1Day = true;
        await event.save();
      }
    }

    console.log(`✅ Sent 1-day reminders for ${eventsIn1Day.length} events`);
  } catch (error) {
    console.error('❌ Error in send1DayEventReminders:', error);
  }
};

/**
 * Manual trigger for testing
 */
export const triggerWeeklyDigest = async () => {
  console.log('📊 Manually triggering weekly digest...');
  return await generateAllWeeklyDigests();
};

/**
 * Manual trigger for event reminders
 */
export const triggerEventReminders = async () => {
  console.log('⏰ Manually triggering event reminders...');
  await checkAndSendEventReminders();
  await send1DayEventReminders();
};

export default {
  initializeCronJobs,
  triggerWeeklyDigest,
  triggerEventReminders,
};
