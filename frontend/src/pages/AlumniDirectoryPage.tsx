import React, { useState, useEffect } from 'react';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AlumniCard from '../components/alumni/AlumniCard';
import AlumniFilters from '../components/alumni/AlumniFilters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { SkeletonAlumniCard } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { getAllAlumni } from '../services/alumni.service';
import type { Alumni, AlumniFilters as AlumniFilterType } from '../services/alumni.service';

const AlumniDirectoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    batches: [] as string[],
    companies: [] as string[],
    locations: [] as string[],
    domains: [] as string[],
    mentorshipAvailable: false,
    experience: '',
  });
  const itemsPerPage = 12;

  // Fetch alumni data from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filterParams: AlumniFilterType = {
          batches: filters.batches.length > 0 ? filters.batches : undefined,
          companies: filters.companies.length > 0 ? filters.companies : undefined,
          locations: filters.locations.length > 0 ? filters.locations : undefined,
          mentorshipAvailable: filters.mentorshipAvailable || undefined,
          search: searchQuery || undefined,
          sortBy: (sortBy as 'recent' | 'name-asc' | 'name-desc' | 'batch-desc' | 'batch-asc' | 'experience-desc') || 'recent',
          page: currentPage,
          limit: itemsPerPage,
        };

        const response = await getAllAlumni(filterParams);
        const alumniData = Array.isArray(response.data) ? response.data : [];
        setAlumni(alumniData);
        setTotalCount(response.total || 0);
      } catch (err: any) {
        console.error('Error fetching alumni:', err);
        setError(err.message || 'Failed to load alumni. Please try again.');
        setAlumni([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, [searchQuery, filters, sortBy, currentPage]);

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
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Alumni Directory</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8">
            Connect with {totalCount}+ BIT Sindri Civil Engineering Alumni
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-2">
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
              <Button type="submit" variant="secondary" size="lg" className="w-full sm:w-auto">
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
                className={`p-2 rounded ${viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list'
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
                {error ? (
                  <span className="text-red-600">Error: {error}</span>
                ) : (
                  <>Showing <span className="font-semibold">{(Array.isArray(alumni) ? alumni : []).length}</span> of {totalCount} alumni</>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid'
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
            ) : !Array.isArray(alumni) || alumni.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No alumni found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                  }`}>
                  {(Array.isArray(alumni) ? alumni : []).map((alum) => (
                    <AlumniCard
                      key={alum._id}
                      alumni={{
                        id: alum._id,
                        name: `${alum.firstName} ${alum.lastName}`,
                        role: alum.currentRole || '-',
                        company: alum.company || '-',
                        location: alum.location || '-',
                        batch: alum.batch || '-',
                        avatar: alum.profilePicture,
                        coverPhoto: alum.coverPhoto,
                        skills: alum.skills && alum.skills.length > 0 ? alum.skills : [],
                        mentorshipAvailable: alum.mentorshipAvailable || false,
                        experience: alum.experience || 0,
                        domain: alum.department || 'Civil Engineering',
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalCount > itemsPerPage && (
                  <div className="mt-8 flex justify-center overflow-x-auto pb-2">
                    <nav className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }).map((_, i) => {
                        const page = i + 1;
                        const totalPages = Math.ceil(totalCount / itemsPerPage);
                        const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                        if (!showPage && i > 0 && totalPages > 5 && page < currentPage - 1) {
                          return <span key={`dots-${i}`} className="px-1 sm:px-2 text-sm">...</span>;
                        }
                        return showPage ? (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 sm:px-4 py-2 text-sm rounded-lg ${currentPage === page
                                ? 'bg-primary-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        ) : null;
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
                        className="px-2 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}

                <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} alumni
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
