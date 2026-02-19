import { useState } from 'react';
import { Send, Loader2, Calendar } from 'lucide-react';
import {
  sendEventEmail,
  type EmailStats,
  type EmailFilters,
  type EventEmailData,
} from '../../services/emailCampaign.service';
import toast from 'react-hot-toast';
import RecipientSelector from './RecipientSelector';

interface Props {
  stats: EmailStats | null;
}

const EventEmailForm = ({ stats }: Props) => {
  const [filters, setFilters] = useState<EmailFilters>({});
  const [sending, setSending] = useState(false);
  const [eventData, setEventData] = useState<EventEmailData>({
    eventTitle: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    eventType: '',
    organizer: '',
    registrationDeadline: '',
    description: '',
    customMessage: '',
    eventUrl: '',
    ctaText: 'Register Now',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSend = async () => {
    // Validation
    if (!eventData.eventTitle || !eventData.eventDate) {
      toast.error('Event title and date are required');
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to send this event announcement to selected recipients?'
      )
    ) {
      return;
    }

    try {
      setSending(true);
      const result = await sendEventEmail(eventData, filters);

      if (result.success) {
        toast.success(result.message);
        if (result.data) {
          toast.success(`Sent: ${result.data.sent}, Failed: ${result.data.failed}`);
        }
        // Reset form
        setEventData({
          eventTitle: '',
          eventDate: '',
          eventTime: '',
          venue: '',
          eventType: '',
          organizer: '',
          registrationDeadline: '',
          description: '',
          customMessage: '',
          eventUrl: '',
          ctaText: 'Register Now',
        });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Failed to send event emails:', error);
      toast.error(error.response?.data?.message || 'Failed to send event emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Details Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-indigo-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Event Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventTitle"
              value={eventData.eventTitle}
              onChange={handleInputChange}
              placeholder="e.g., Alumni Meetup 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventDate"
              value={eventData.eventDate}
              onChange={handleInputChange}
              placeholder="e.g., January 15, 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Event Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Time
            </label>
            <input
              type="text"
              name="eventTime"
              value={eventData.eventTime}
              onChange={handleInputChange}
              placeholder="e.g., 6:00 PM IST"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input
              type="text"
              name="venue"
              value={eventData.venue}
              onChange={handleInputChange}
              placeholder="e.g., College Auditorium"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <input
              type="text"
              name="eventType"
              value={eventData.eventType}
              onChange={handleInputChange}
              placeholder="e.g., Networking Event"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organized By
            </label>
            <input
              type="text"
              name="organizer"
              value={eventData.organizer}
              onChange={handleInputChange}
              placeholder="e.g., Alumni Association"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Deadline
            </label>
            <input
              type="text"
              name="registrationDeadline"
              value={eventData.registrationDeadline}
              onChange={handleInputChange}
              placeholder="e.g., January 10, 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Event URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event URL
            </label>
            <input
              type="url"
              name="eventUrl"
              value={eventData.eventUrl}
              onChange={handleInputChange}
              placeholder="https://alumniconnect.acebits.in/events/123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of the event..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Custom Message */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Message (Optional)
            </label>
            <textarea
              name="customMessage"
              value={eventData.customMessage}
              onChange={handleInputChange}
              rows={2}
              placeholder="e.g., We're thrilled to invite you to our first meetup of the year!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={eventData.ctaText}
              onChange={handleInputChange}
              placeholder="Register Now"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Recipient Selection */}
      <RecipientSelector stats={stats} filters={filters} onFiltersChange={setFilters} />

      {/* Send Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Review all details before sending the event announcement
        </p>
        <button
          onClick={handleSend}
          disabled={sending || !eventData.eventTitle || !eventData.eventDate}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Event Emails
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EventEmailForm;
