import React, { useState } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AlumniCard from '../components/alumni/AlumniCard';
import AlumniFilters from '../components/alumni/AlumniFilters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { SkeletonAlumniCard } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';

const AlumniDirectoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    batches: [] as string[],
    companies: [] as string[],
    locations: [] as string[],
    domains: [] as string[],
    mentorshipAvailable: false,
    experience: '',
  });

  // Mock alumni data - replace with actual API call
  const mockAlumni = [
    {
      id: '1',
      name: 'Rahul Sharma',
      role: 'Senior Engineer',
      company: 'Larsen & Toubro',
      location: 'Mumbai, Maharashtra',
      batch: '2015',
      avatar: undefined,
      coverPhoto: undefined,
      skills: ['Structural Design', 'Project Management', 'AutoCAD'],
      mentorshipAvailable: true,
      experience: 9,
      domain: 'Construction',
    },
    {
      id: '2',
      name: 'Priya Singh',
      role: 'Project Manager',
      company: 'Tata Projects',
      location: 'Bangalore, Karnataka',
      batch: '2012',
      avatar: undefined,
      coverPhoto: undefined,
      skills: ['Infrastructure', 'Cost Estimation', 'Site Management'],
      mentorshipAvailable: true,
      experience: 12,
      domain: 'Consulting',
    },
    {
      id: '3',
      name: 'Amit Kumar',
      role: 'Assistant Engineer',
      company: 'National Highways Authority',
      location: 'Delhi, India',
      batch: '2018',
      avatar: undefined,
      coverPhoto: undefined,
      skills: ['Highway Design', 'Quality Control', 'Contract Management'],
      mentorshipAvailable: false,
      experience: 6,
      domain: 'Government',
    },
    {
      id: '4',
      name: 'Sneha Patel',
      role: 'Structural Engineer',
      company: 'AECOM',
      location: 'Pune, Maharashtra',
      batch: '2016',
      avatar: undefined,
      coverPhoto: undefined,
      skills: ['Steel Design', 'STAAD Pro', 'Seismic Analysis'],
      mentorshipAvailable: true,
      experience: 8,
      domain: 'Consulting',
    },
    {
      id: '5',
      name: 'Vikram Reddy',
      role: 'Site Engineer',
      company: 'Shapoorji Pallonji',
      location: 'Hyderabad, Telangana',
      batch: '2019',
      avatar: undefined,
      coverPhoto: undefined,
      skills: ['Construction Management', 'Safety', 'Supervision'],
      mentorshipAvailable: false,
      experience: 5,
      domain: 'Construction',
    },
    {
      id: '6',
      name: 'Anjali Mehta',
      role: 'Design Engineer',
      company: 'IIT Bombay (Research)',
      location: 'Mumbai, Maharashtra',
      batch: '2013',
      avatar: undefined,
      coverPhoto: undefined,
      skills: ['Research', 'Concrete Technology', 'FEM Analysis'],
      mentorshipAvailable: true,
      experience: 11,
      domain: 'Academia',
    },
  ];

  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Batch (Recent First)', value: 'batch-desc' },
    { label: 'Batch (Oldest First)', value: 'batch-asc' },
    { label: 'Experience (High to Low)', value: 'experience-desc' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log('Search:', searchQuery);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // TODO: Apply filters
  };

  const clearFilters = () => {
    setFilters({
      batches: [],
      companies: [],
      locations: [],
      domains: [],
      mentorshipAvailable: false,
      experience: '',
    });
  };

  const activeFilterCount =
    filters.batches.length +
    filters.companies.length +
    filters.locations.length +
    filters.domains.length +
    (filters.mentorshipAvailable ? 1 : 0) +
    (filters.experience ? 1 : 0);

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

      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Alumni Directory</h1>
          <p className="text-xl text-gray-100 mb-8">
            Connect with {mockAlumni.length}+ BIT Sindri Civil Engineering Alumni
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, company, or skills..."
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
        {/* Filters and Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <div className="flex-1 sm:flex-initial sm:w-48">
              <Dropdown
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                placeholder="Sort by"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <AlumniFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            </aside>
          )}

          {/* Alumni Grid/List */}
          <main className="flex-1">
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{mockAlumni.length}</span> alumni
              </p>
            </div>

            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                <SkeletonAlumniCard />
                <SkeletonAlumniCard />
                <SkeletonAlumniCard />
                <SkeletonAlumniCard />
                <SkeletonAlumniCard />
                <SkeletonAlumniCard />
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {mockAlumni.map((alumni) => (
                    <AlumniCard
                      key={alumni.id}
                      alumni={alumni}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                      1
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      3
                    </button>
                    <span className="px-2">...</span>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      10
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Showing 1-6 of {mockAlumni.length} alumni
                </p>
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AlumniDirectoryPage;
