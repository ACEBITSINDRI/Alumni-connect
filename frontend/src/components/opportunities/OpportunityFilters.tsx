import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface Filters {
  jobTypes: string[];
  companies: string[];
  locations: string[];
  domains: string[];
  experience: string;
  salaryRange: { min: string; max: string };
  postedDate: string;
}

interface OpportunityFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({ filters, onChange, onClear }) => {
  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];

  const popularCompanies = [
    'Larsen & Toubro',
    'Tata Projects',
    'AECOM',
    'Shapoorji Pallonji',
    'National Highways Authority',
    'Other',
  ];

  const popularLocations = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Remote'];

  const domains = [
    'Construction',
    'Consulting',
    'Government',
    'Research & Development',
    'Academia',
    'IT/Software',
    'Other',
  ];

  const experienceLevels = [
    { label: 'Fresher', value: 'fresher' },
    { label: '0-2 years', value: '0-2' },
    { label: '2-5 years', value: '2-5' },
    { label: '5+ years', value: '5+' },
  ];

  const postedDateOptions = [
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last Week', value: '7d' },
    { label: 'Last Month', value: '30d' },
    { label: 'All Time', value: 'all' },
  ];

  const handleJobTypeToggle = (type: string) => {
    const newTypes = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter((t) => t !== type)
      : [...filters.jobTypes, type];
    onChange({ ...filters, jobTypes: newTypes });
  };

  const handleCompanyToggle = (company: string) => {
    const newCompanies = filters.companies.includes(company)
      ? filters.companies.filter((c) => c !== company)
      : [...filters.companies, company];
    onChange({ ...filters, companies: newCompanies });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];
    onChange({ ...filters, locations: newLocations });
  };

  const handleDomainToggle = (domain: string) => {
    const newDomains = filters.domains.includes(domain)
      ? filters.domains.filter((d) => d !== domain)
      : [...filters.domains, domain];
    onChange({ ...filters, domains: newDomains });
  };

  return (
    <Card variant="elevated" className="p-4 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {(filters.jobTypes.length > 0 ||
          filters.companies.length > 0 ||
          filters.locations.length > 0 ||
          filters.domains.length > 0 ||
          filters.experience ||
          filters.salaryRange.min ||
          filters.salaryRange.max ||
          filters.postedDate) && (
          <button
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Job Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Job Type</h4>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.jobTypes.includes(type)}
                  onChange={() => handleJobTypeToggle(type)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Company Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Company</h4>
          <div className="space-y-2">
            {popularCompanies.map((company) => (
              <label key={company} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.companies.includes(company)}
                  onChange={() => handleCompanyToggle(company)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 truncate">{company}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Location Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
          <div className="space-y-2">
            {popularLocations.map((location) => (
              <label key={location} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.locations.includes(location)}
                  onChange={() => handleLocationToggle(location)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Domain Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Domain</h4>
          <div className="space-y-2">
            {domains.map((domain) => (
              <label key={domain} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.domains.includes(domain)}
                  onChange={() => handleDomainToggle(domain)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{domain}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Experience Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Experience Required</h4>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label key={level.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  checked={filters.experience === level.value}
                  onChange={() => onChange({ ...filters, experience: level.value })}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Salary Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Salary Range (LPA)</h4>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.salaryRange.min}
              onChange={(e) =>
                onChange({
                  ...filters,
                  salaryRange: { ...filters.salaryRange, min: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.salaryRange.max}
              onChange={(e) =>
                onChange({
                  ...filters,
                  salaryRange: { ...filters.salaryRange, max: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Posted Date Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Posted Date</h4>
          <div className="space-y-2">
            {postedDateOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="postedDate"
                  checked={filters.postedDate === option.value}
                  onChange={() => onChange({ ...filters, postedDate: option.value })}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button (Mobile) */}
      <div className="mt-6 lg:hidden">
        <Button variant="primary" className="w-full">
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default OpportunityFilters;
