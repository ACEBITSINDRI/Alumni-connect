import { useState } from 'react';
import { Send, Loader2, Mail } from 'lucide-react';
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

      if (result.success && result.data) {
        // Check if any emails failed
        if (result.data.failed > 0) {
          toast.error(
            `⚠️ Sent: ${result.data.sent}, Failed: ${result.data.failed}. Check browser console (F12) for error details.`,
            { duration: 8000 }
          );
          console.error('❌ Email sending errors:', result.data.errors);
          console.error('📊 Summary:', {
            total: result.data.total,
            sent: result.data.sent,
            failed: result.data.failed
          });
          // Show first error as example
          if (result.data.errors && result.data.errors.length > 0) {
            console.error('🔍 First error example:', result.data.errors[0]);
          }
        } else {
          toast.success(`✅ Successfully sent ${result.data.sent} emails!`);
        }
      } else if (result.success) {
        toast.success(result.message);
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
    <div className="space-y-5 sm:space-y-6">
      {/* Template Preview */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 sm:p-6 border-2 border-indigo-200 shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Mail className="text-white" size={20} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Welcome Email Template
          </h3>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
          This email welcomes new users to Alumni Connect and highlights key platform features.
        </p>
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-indigo-200 shadow-sm">
          <p className="font-bold text-indigo-700 mb-3 text-sm sm:text-base flex items-center gap-2">
            <span>📋</span> Email Includes:
          </p>
          <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
            <li className="flex items-start gap-2.5">
              <span className="text-indigo-600 font-bold mt-0.5">•</span>
              <span>Personalized greeting with user's name</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Platform feature highlights (Jobs, Events, Directory)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-pink-600 font-bold mt-0.5">•</span>
              <span>Call-to-action button to explore dashboard</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Professional Alumni Connect branding</span>
            </li>
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
      <div className="flex flex-col gap-4 pt-5 border-t-2 border-indigo-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <p className="text-sm sm:text-base text-gray-700 text-center font-medium">
            📧 This will send a personalized welcome email to all selected recipients
          </p>
        </div>
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
        >
          {sending ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span>Sending Emails...</span>
            </>
          ) : (
            <>
              <Send size={22} />
              <span>Send Welcome Emails</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WelcomeEmailForm;
