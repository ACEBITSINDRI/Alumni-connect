import React, { useState } from 'react';
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock, Bookmark } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import OpportunityFilters from '../components/opportunities/OpportunityFilters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

const OpportunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    companies: [] as string[],
    locations: [] as string[],
    domains: [] as string[],
    experience: '',
    salaryRange: { min: '', max: '' },
    postedDate: '',
  });

  // Mock opportunities data
  const mockOpportunities = [
    {
      id: '1',
      title: 'Senior Civil Engineer',
      company: 'Larsen & Toubro',
      companyLogo: undefined,
      location: 'Mumbai, Maharashtra',
      jobType: 'Full-time',
      experienceRequired: '5-8 years',
      salary: '₹12-18 LPA',
      description: 'We are looking for experienced civil engineers for our metro rail project in Mumbai. The role involves structural design, quality control, and site supervision.',
      requirements: ['B.Tech in Civil Engineering', '5+ years experience', 'Knowledge of STAAD Pro', 'Metro/Bridge projects experience'],
      skills: ['Structural Design', 'STAAD Pro', 'Project Management', 'Quality Control'],
      postedBy: {
        id: 'user1',
        name: 'Rahul Sharma',
        avatar: undefined,
      },
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      deadline: '2024-11-30',
      applicants: 24,
      isSaved: false,
    },
    {
      id: '2',
      title: 'Structural Design Intern',
      company: 'AECOM',
      companyLogo: undefined,
      location: 'Bangalore, Karnataka',
      jobType: 'Internship',
      experienceRequired: 'Fresher',
      salary: '₹15,000-25,000/month',
      description: 'Summer internship opportunity for civil engineering students. Work on real-world structural design projects.',
      requirements: ['Currently pursuing B.Tech in Civil Engineering', 'Knowledge of AutoCAD', 'Good academic record'],
      skills: ['AutoCAD', 'Structural Analysis', 'Communication'],
      postedBy: {
        id: 'user2',
        name: 'Priya Singh',
        avatar: undefined,
      },
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      deadline: '2024-11-15',
      applicants: 89,
      isSaved: true,
    },
    {
      id: '3',
      title: 'Project Engineer - Highways',
      company: 'National Highways Authority of India',
      companyLogo: undefined,
      location: 'Delhi, India',
      jobType: 'Full-time',
      experienceRequired: '2-4 years',
      salary: '₹8-12 LPA',
      description: 'Opportunity to work on national highway development projects. Role involves project planning, execution, and quality monitoring.',
      requirements: ['B.Tech in Civil Engineering', 'Experience in highway projects', 'Knowledge of IRC codes'],
      skills: ['Highway Design', 'Project Planning', 'Quality Control'],
      postedBy: {
        id: 'user3',
        name: 'Amit Kumar',
        avatar: undefined,
      },
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      deadline: '2024-11-20',
      applicants: 156,
      isSaved: false,
    },
    {
      id: '4',
      title: 'Site Engineer',
      company: 'Shapoorji Pallonji',
      companyLogo: undefined,
      location: 'Pune, Maharashtra',
      jobType: 'Full-time',
      experienceRequired: '1-3 years',
      salary: '₹5-8 LPA',
      description: 'Looking for site engineers for residential and commercial construction projects in Pune.',
      requirements: ['B.Tech in Civil Engineering', 'Site supervision experience', 'Knowledge of construction methods'],
      skills: ['Site Management', 'Construction', 'Safety Management'],
      postedBy: {
        id: 'user4',
        name: 'Vikram Reddy',
        avatar: undefined,
      },
      postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      deadline: '2024-11-25',
      applicants: 67,
      isSaved: false,
    },
  ];

  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Deadline Approaching', value: 'deadline' },
    { label: 'Highest Salary', value: 'salary-desc' },
    { label: 'Most Applied', value: 'popular' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
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
                Showing <span className="font-semibold">{mockOpportunities.length}</span> opportunities
              </p>
              <div className="flex gap-2">
                <Badge variant="success">{mockOpportunities.filter(o => o.jobType === 'Full-time').length} Jobs</Badge>
                <Badge variant="info">{mockOpportunities.filter(o => o.jobType === 'Internship').length} Internships</Badge>
              </div>
            </div>

            <div className="space-y-6">
              {mockOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load More Opportunities
              </Button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
