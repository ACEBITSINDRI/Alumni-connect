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
    { id: 'event' as TabType, label: 'Event Email', icon: Calendar },
    { id: 'custom' as TabType, label: 'Custom Email', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-indigo-100 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Send className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Email Campaigns
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
                Professional email management for alumni and students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-5 sm:p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Total Users */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-indigo-100">Total Recipients</p>
                  <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="text-white" size={24} />
                </div>
              </div>
            </div>

            {/* Students */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-100">Students</p>
                  <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                    {stats.studentCount}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
            </div>

            {/* Alumni */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-100">Alumni</p>
                  <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                    {stats.alumniCount}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mt-5 sm:mt-6 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Mobile: Dropdown Select */}
          <div className="sm:hidden border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabType)}
              className="w-full px-4 py-3.5 text-base font-medium text-gray-900 bg-transparent border-0 focus:ring-2 focus:ring-indigo-500 rounded-t-2xl"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop: Tab Buttons */}
          <div className="hidden sm:block border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2.5 py-4 px-4 
                      border-b-3 font-semibold text-sm lg:text-base transition-all duration-200
                      ${activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                        : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-white/50'
                      }
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white via-gray-50 to-indigo-50/30">
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
