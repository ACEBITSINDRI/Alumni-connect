import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { sendWelcomeEmail, type EmailStats, type EmailFilters } from '../../services/emailCampaign.service';
import toast from 'react-hot-toast';
import RecipientSelector from './RecipientSelector';

interface Props {
  stats: EmailStats | null;
}

const WelcomeEmailForm = ({ stats }: Props) => {
  const [filters, setFilters] = useState<EmailFilters>({});
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!window.confirm('Are you sure you want to send welcome emails to selected recipients?')) {
      return;
    }

    try {
      setSending(true);
      const result = await sendWelcomeEmail(filters);

      if (result.success) {
        toast.success(result.message);
        if (result.data) {
          toast.success(`Sent: ${result.data.sent}, Failed: ${result.data.failed}`);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Failed to send welcome emails:', error);
      toast.error(error.response?.data?.message || 'Failed to send welcome emails');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Preview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Welcome Email Template
        </h3>
        <p className="text-gray-600 mb-4">
          This email welcomes new users to Alumni Connect and highlights key platform features.
        </p>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm">
          <p className="font-semibold text-indigo-600 mb-2">Email Includes:</p>
          <ul className="space-y-1 text-gray-700">
            <li>• Personalized greeting with user's name</li>
            <li>• Platform feature highlights (Jobs, Events, Directory)</li>
            <li>• Call-to-action button to explore dashboard</li>
            <li>• Professional Alumni Connect branding</li>
          </ul>
        </div>
      </div>

      {/* Recipient Selection */}
      <RecipientSelector
        stats={stats}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Send Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          This will send a welcome email to all selected recipients
        </p>
        <button
          onClick={handleSend}
          disabled={sending}
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
              Send Welcome Emails
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WelcomeEmailForm;
