import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EventCard from '../components/events/EventCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { useAuth } from '../context/AuthContext';
import { getAllEvents } from '../services/event.service';
import type { Event, EventFilters as EventFilterType } from '../services/event.service';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'registered'>('upcoming');
  const [sortBy, setSortBy] = useState('date-asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    eventTypes: [] as string[],
    mode: [] as string[],
    dateRange: '',
  });
  const itemsPerPage = 9;

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const dateRange = activeTab === 'upcoming' ? 'upcoming' : activeTab === 'past' ? 'past' : 'all';

        const filterParams: EventFilterType = {
          eventTypes: filters.eventTypes.length > 0 ? filters.eventTypes : undefined,
          mode: filters.mode.length > 0 ? filters.mode : undefined,
          dateRange: (dateRange as 'upcoming' | 'past' | 'all') || 'upcoming',
          search: searchQuery || undefined,
          sortBy: (sortBy.startsWith('date-') ? sortBy : 'date-asc') as 'date-asc' | 'date-desc' | 'recent',
          page: currentPage,
          limit: itemsPerPage,
        };

        const response = await getAllEvents(filterParams);
        setEvents(response.data || []);
        setTotalCount(response.total || 0);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events. Please try again.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery, filters, sortBy, currentPage, activeTab]);

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
    setCurrentPage(1);
  };

  const handleEventTypeToggle = (type: string) => {
    const newTypes = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter((t) => t !== type)
      : [...filters.eventTypes, type];
    setFilters({ ...filters, eventTypes: newTypes });
    setCurrentPage(1);
  };

  const handleModeToggle = (mode: string) => {
    const newModes = filters.mode.includes(mode)
      ? filters.mode.filter((m) => m !== mode)
      : [...filters.mode, mode];
    setFilters({ ...filters, mode: newModes });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      eventTypes: [],
      mode: [],
      dateRange: '',
    });
    setCurrentPage(1);
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
            {error ? (
              <span className="text-red-600">Error: {error}</span>
            ) : (
              <>Showing <span className="font-semibold">{events.length}</span> of {totalCount} events</>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={{
                      id: event._id,
                      title: event.title || '-',
                      description: event.description || '',
                      date: event.date || new Date().toISOString(),
                      startTime: event.startTime || '-',
                      endTime: event.endTime || '-',
                      duration: event.duration || '-',
                      mode: (event.mode as 'Online' | 'Offline' | 'Hybrid') || 'Online',
                      venue: event.venue || '-',
                      location: event.location || '-',
                      image: event.image?.url,
                      type: event.type || '-',
                      organizer: {
                        id: event.organizer,
                        name: event.organizerName || 'Organizer',
                        avatar: undefined,
                      },
                      registrationFee: event.registrationFee || 'Free',
                      maxParticipants: event.maxParticipants || 0,
                      registeredCount: event.registeredCount || 0,
                      registrationDeadline: event.registrationDeadline || new Date().toISOString(),
                      isRegistered: event.isRegistered || false,
                      speakers: (event.speakers || []).map(s => ({
                        name: s.name,
                        designation: s.designation || 'Speaker',
                      })),
                    }}
                  />
              ))}
            </div>

            {/* Pagination */}
            {totalCount > itemsPerPage && (
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center text-gray-600">
                  Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventsPage;
