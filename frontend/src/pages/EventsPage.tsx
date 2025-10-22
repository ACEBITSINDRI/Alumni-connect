import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EventCard from '../components/events/EventCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { useAuth } from '../context/AuthContext';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'registered'>('upcoming');
  const [sortBy, setSortBy] = useState('date-asc');
  const [filters, setFilters] = useState({
    eventTypes: [] as string[],
    mode: [] as string[],
    dateRange: '',
  });

  // Mock events data
  const mockEvents = [
    {
      id: '1',
      title: 'Civil Engineering Workshop 2024',
      description: 'Hands-on workshop on modern construction techniques and project management. Learn from industry experts.',
      date: '2024-11-25',
      startTime: '10:00 AM',
      endTime: '5:00 PM',
      duration: '7 hours',
      mode: 'Offline' as const,
      venue: 'BIT Sindri Campus, Auditorium Hall',
      location: 'Dhanbad, Jharkhand',
      image: undefined,
      type: 'Workshop',
      organizer: {
        id: 'ace1',
        name: 'ACE BIT Sindri',
        avatar: undefined,
      },
      registrationFee: 'Free',
      maxParticipants: 100,
      registeredCount: 67,
      registrationDeadline: '2024-11-20',
      isRegistered: false,
      speakers: [
        { name: 'Dr. Rajesh Gupta', designation: 'Chief Engineer, NHAI' },
        { name: 'Priya Singh', designation: 'Project Manager, L&T' },
      ],
    },
    {
      id: '2',
      title: 'Alumni Meetup 2024',
      description: 'Annual gathering of BIT Sindri Civil Engineering alumni. Network, share experiences, and reconnect with batchmates.',
      date: '2024-11-30',
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      duration: '3 hours',
      mode: 'Hybrid' as const,
      venue: 'Hotel Ashok, Dhanbad',
      location: 'Dhanbad, Jharkhand',
      image: undefined,
      type: 'Meetup',
      organizer: {
        id: 'ace1',
        name: 'ACE BIT Sindri',
        avatar: undefined,
      },
      registrationFee: '₹500',
      maxParticipants: 200,
      registeredCount: 156,
      registrationDeadline: '2024-11-25',
      isRegistered: true,
      speakers: [],
    },
    {
      id: '3',
      title: 'Webinar: Future of Infrastructure Development',
      description: 'Online webinar discussing the future trends in infrastructure development, smart cities, and sustainable construction.',
      date: '2024-12-05',
      startTime: '7:00 PM',
      endTime: '8:30 PM',
      duration: '1.5 hours',
      mode: 'Online' as const,
      venue: 'Zoom Meeting',
      location: 'Online',
      image: undefined,
      type: 'Webinar',
      organizer: {
        id: 'user1',
        name: 'Rahul Sharma',
        avatar: undefined,
      },
      registrationFee: 'Free',
      maxParticipants: 500,
      registeredCount: 234,
      registrationDeadline: '2024-12-04',
      isRegistered: false,
      speakers: [
        { name: 'Amit Kumar', designation: 'Urban Planner' },
      ],
    },
    {
      id: '4',
      title: 'Career Guidance Seminar',
      description: 'Guidance session for final year students on career opportunities, higher studies, and interview preparation.',
      date: '2024-12-10',
      startTime: '3:00 PM',
      endTime: '6:00 PM',
      duration: '3 hours',
      mode: 'Offline' as const,
      venue: 'BIT Sindri, Civil Department',
      location: 'Dhanbad, Jharkhand',
      image: undefined,
      type: 'Seminar',
      organizer: {
        id: 'ace1',
        name: 'ACE BIT Sindri',
        avatar: undefined,
      },
      registrationFee: 'Free',
      maxParticipants: 80,
      registeredCount: 45,
      registrationDeadline: '2024-12-08',
      isRegistered: false,
      speakers: [],
    },
  ];

  const sortOptions = [
    { label: 'Date (Upcoming First)', value: 'date-asc' },
    { label: 'Date (Latest First)', value: 'date-desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Recently Added', value: 'recent' },
  ];

  const eventTypeOptions = ['Workshop', 'Seminar', 'Webinar', 'Meetup', 'Conference'];
  const modeOptions = ['Online', 'Offline', 'Hybrid'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const handleEventTypeToggle = (type: string) => {
    const newTypes = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter((t) => t !== type)
      : [...filters.eventTypes, type];
    setFilters({ ...filters, eventTypes: newTypes });
  };

  const handleModeToggle = (mode: string) => {
    const newModes = filters.mode.includes(mode)
      ? filters.mode.filter((m) => m !== mode)
      : [...filters.mode, mode];
    setFilters({ ...filters, mode: newModes });
  };

  const clearFilters = () => {
    setFilters({
      eventTypes: [],
      mode: [],
      dateRange: '',
    });
  };

  const activeFilterCount = filters.eventTypes.length + filters.mode.length + (filters.dateRange ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={true}
        userRole={user?.role}
        userName={`${user?.firstName} ${user?.lastName}`}
        userAvatar={user?.profilePicture}
        unreadNotifications={3}
        unreadMessages={2}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Events</h1>
          <p className="text-xl text-gray-100 mb-8">
            Workshops, Seminars, Webinars & Networking Events
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  leftIcon={<Search size={20} />}
                  className="bg-white"
                />
              </div>
              <Button type="submit" variant="secondary" size="lg">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'registered'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Events
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Event Type */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <div className="flex flex-wrap gap-2">
                {eventTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleEventTypeToggle(type)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      filters.eventTypes.includes(type)
                        ? 'bg-primary-100 border-primary-600 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <div className="flex flex-wrap gap-2">
                {modeOptions.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeToggle(mode)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      filters.mode.includes(mode)
                        ? 'bg-primary-100 border-primary-600 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                placeholder="Sort by"
              />
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{mockEvents.length}</span> events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventsPage;
