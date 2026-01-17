import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import OpportunityFilters from '../components/opportunities/OpportunityFilters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { getAllOpportunities } from '../services/opportunity.service';
import type { Opportunity, OpportunityFilters as OpportunityFilterType } from '../services/opportunity.service';

const OpportunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    companies: [] as string[],
    locations: [] as string[],
    domains: [] as string[],
    experience: '',
    salaryRange: { min: '', max: '' },
    postedDate: '',
  });
  const itemsPerPage = 10;

  // Fetch opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filterParams: OpportunityFilterType = {
          jobTypes: filters.jobTypes.length > 0 ? filters.jobTypes : undefined,
          companies: filters.companies.length > 0 ? filters.companies : undefined,
          locations: filters.locations.length > 0 ? filters.locations : undefined,
          search: searchQuery || undefined,
          sortBy: (sortBy === 'recent' ? 'recent' : sortBy === 'salary-desc' ? 'salary-high' : 'salary-low') as 'recent' | 'salary-high' | 'salary-low',
          page: currentPage,
          limit: itemsPerPage,
        };

        const response = await getAllOpportunities(filterParams);
        setOpportunities(response.data || []);
        setTotalCount(response.total || 0);
      } catch (err: any) {
        console.error('Error fetching opportunities:', err);
        setError(err.message || 'Failed to load opportunities. Please try again.');
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [searchQuery, filters, sortBy, currentPage]);

  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Deadline Approaching', value: 'deadline' },
    { label: 'Highest Salary', value: 'salary-desc' },
    { label: 'Most Applied', value: 'popular' },
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
      jobTypes: [],
      companies: [],
      locations: [],
      domains: [],
      experience: '',
      salaryRange: { min: '', max: '' },
      postedDate: '',
    });
  };

  const activeFilterCount =
    filters.jobTypes.length +
    filters.companies.length +
    filters.locations.length +
    filters.domains.length +
    (filters.experience ? 1 : 0) +
    (filters.salaryRange.min || filters.salaryRange.max ? 1 : 0) +
    (filters.postedDate ? 1 : 0);

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
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Opportunities</h1>
          <p className="text-xl text-gray-100 mb-8">
            Find jobs and internships posted by alumni
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company, or skills..."
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
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Opportunities
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bookmark size={16} className="inline mr-1" />
            Saved Opportunities
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter size={20} className="mr-2" />
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

          <div className="w-full sm:w-48">
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              placeholder="Sort by"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <OpportunityFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            </aside>
          )}

          {/* Opportunities List */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {error ? (
                  <span className="text-red-600">Error: {error}</span>
                ) : (
                  <>Showing <span className="font-semibold">{opportunities.length}</span> of {totalCount} opportunities</>
                )}
              </p>
              <div className="flex gap-2">
                <Badge variant="success">{opportunities.filter(o => o.type === 'Full-time').length} Jobs</Badge>
                <Badge variant="info">{opportunities.filter(o => o.type === 'Internship').length} Internships</Badge>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No opportunities found matching your criteria.</p>
                </div>
              ) : (
                opportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity._id} opportunity={{
                    id: opportunity._id,
                    title: opportunity.title,
                    company: opportunity.company || '-',
                    companyLogo: undefined,
                    location: opportunity.location || '-',
                    jobType: opportunity.type || '-',
                    experienceRequired: opportunity.experience ? `${opportunity.experience.min || 0}-${opportunity.experience.max || opportunity.experience.min || 0} years` : '-',
                    salary: opportunity.salary ? (typeof opportunity.salary === 'string' ? opportunity.salary : (opportunity.salary.min ? `₹${opportunity.salary.min}-${opportunity.salary.max} ${opportunity.salary.period}` : 'Competitive')) : 'Competitive',
                    description: opportunity.description || '',
                    requirements: opportunity.qualifications && opportunity.qualifications.length > 0 ? opportunity.qualifications : [],
                    skills: opportunity.skills && opportunity.skills.length > 0 ? opportunity.skills : [],
                    postedBy: {
                      id: opportunity.postedBy || 'unknown',
                      name: 'Alumni',
                      avatar: undefined,
                    },
                    postedDate: new Date(opportunity.postedDate || new Date()),
                    deadline: opportunity.deadline || new Date().toISOString(),
                    applicants: opportunity.applicants || 0,
                    isSaved: false,
                  }} />
                ))
              )}
            </div>

            {/* Load More / Pagination */}
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
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
