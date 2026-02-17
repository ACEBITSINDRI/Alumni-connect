import { useState, useEffect } from 'react';
import { Mail, Send, Users, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { getEmailStats, type EmailStats } from '../services/emailCampaign.service';
import WelcomeEmailForm from '../components/email/WelcomeEmailForm';
import EventEmailForm from '../components/email/EventEmailForm';
import CustomEmailForm from '../components/email/CustomEmailForm';
import toast from 'react-hot-toast';

type TabType = 'welcome' | 'event' | 'custom';

const EmailCampaignsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('welcome');
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getEmailStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load email statistics');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'welcome' as TabType, label: 'Welcome Email', icon: Mail },
    { id: 'event' as TabType, label: 'Event Announcement', icon: Calendar },
    { id: 'custom' as TabType, label: 'Custom Message', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Send className="text-indigo-600" size={32} />
                Email Campaigns
              </h1>
              <p className="mt-2 text-gray-600">
                Send professional emails to alumni and students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Users className="text-indigo-600" size={24} />
                </div>
              </div>
            </div>

            {/* Students */}
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.studentCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            {/* Alumni */}
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alumni</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.alumniCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm
                      transition-colors
                      ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'welcome' && <WelcomeEmailForm stats={stats} />}
            {activeTab === 'event' && <EventEmailForm stats={stats} />}
            {activeTab === 'custom' && <CustomEmailForm stats={stats} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignsPage;
