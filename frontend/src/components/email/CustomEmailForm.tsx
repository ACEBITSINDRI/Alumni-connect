import { useState } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import {
  sendCustomEmail,
  type EmailStats,
  type EmailFilters,
  type CustomEmailData,
} from '../../services/emailCampaign.service';
import toast from 'react-hot-toast';
import RecipientSelector from './RecipientSelector';

interface Props {
  stats: EmailStats | null;
}

const CustomEmailForm = ({ stats }: Props) => {
  const [filters, setFilters] = useState<EmailFilters>({});
  const [sending, setSending] = useState(false);
  const [customData, setCustomData] = useState<CustomEmailData>({
    subject: '',
    title: '',
    badge: '',
    headerStyle: 'info',
    preMessage: '',
    message: '',
    postMessage: '',
    ctaText: '',
    ctaUrl: '',
    additionalInfo: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setCustomData({
      ...customData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSend = async () => {
    // Validation
    if (!customData.title || !customData.message) {
      toast.error('Title and message are required');
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to send this custom announcement to selected recipients?'
      )
    ) {
      return;
    }

    try {
      setSending(true);
      const result = await sendCustomEmail(customData, filters);

      if (result.success) {
        toast.success(result.message);
        if (result.data) {
          toast.success(`Sent: ${result.data.sent}, Failed: ${result.data.failed}`);
        }
        // Reset form
        setCustomData({
          subject: '',
          title: '',
          badge: '',
          headerStyle: 'info',
          preMessage: '',
          message: '',
          postMessage: '',
          ctaText: '',
          ctaUrl: '',
          additionalInfo: '',
        });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Failed to send custom emails:', error);
      toast.error(error.response?.data?.message || 'Failed to send custom emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom Message Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-indigo-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Custom Announcement</h3>
        </div>

        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              name="subject"
              value={customData.subject}
              onChange={handleInputChange}
              placeholder="e.g., Important Announcement - Alumni Connect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title/Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={customData.title}
              onChange={handleInputChange}
              placeholder="e.g., New Features Released!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Badge and Header Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge (Optional)
              </label>
              <input
                type="text"
                name="badge"
                value={customData.badge}
                onChange={handleInputChange}
                placeholder="e.g., NEW, URGENT, UPDATE"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Style
              </label>
              <select
                name="headerStyle"
                value={customData.headerStyle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Yellow)</option>
              </select>
            </div>
          </div>

          {/* Pre Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Message (Optional)
            </label>
            <textarea
              name="preMessage"
              value={customData.preMessage}
              onChange={handleInputChange}
              rows={2}
              placeholder="Text that appears before the main message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Main Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={customData.message}
              onChange={handleInputChange}
              rows={6}
              placeholder="Your main announcement message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use \n for line breaks in your message
            </p>
          </div>

          {/* Post Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closing Message (Optional)
            </label>
            <textarea
              name="postMessage"
              value={customData.postMessage}
              onChange={handleInputChange}
              rows={2}
              placeholder="Text that appears after the main message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Call to Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text (Optional)
              </label>
              <input
                type="text"
                name="ctaText"
                value={customData.ctaText}
                onChange={handleInputChange}
                placeholder="e.g., Learn More"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button URL (Optional)
              </label>
              <input
                type="url"
                name="ctaUrl"
                value={customData.ctaUrl}
                onChange={handleInputChange}
                placeholder="https://alumniconnect.acebits.in/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Note (Optional)
            </label>
            <input
              type="text"
              name="additionalInfo"
              value={customData.additionalInfo}
              onChange={handleInputChange}
              placeholder="e.g., Have questions? Reply to this email!"
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
          Ensure your message is clear and professional before sending
        </p>
        <button
          onClick={handleSend}
          disabled={sending || !customData.title || !customData.message}
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
              Send Custom Emails
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomEmailForm;
