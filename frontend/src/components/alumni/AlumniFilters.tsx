import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface Filters {
  batches: string[];
  companies: string[];
  locations: string[];
  domains: string[];
  mentorshipAvailable: boolean;
  experience: string;
}

interface AlumniFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

const AlumniFilters: React.FC<AlumniFiltersProps> = ({ filters, onChange, onClear }) => {
  const batchYears = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());

  const popularCompanies = [
    'Larsen & Toubro',
    'Tata Projects',
    'AECOM',
    'Shapoorji Pallonji',
    'National Highways Authority',
    'IIT Bombay',
    'Other',
  ];

  const popularLocations = [
    'Mumbai',
    'Bangalore',
    'Delhi',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Other',
  ];

  const domains = [
    'Construction',
    'Consulting',
    'Government',
    'Research & Development',
    'Academia',
    'IT/Software',
    'Startup/Entrepreneurship',
    'Other',
  ];

  const experienceRanges = [
    { label: '0-2 years', value: '0-2' },
    { label: '2-5 years', value: '2-5' },
    { label: '5-10 years', value: '5-10' },
    { label: '10+ years', value: '10+' },
  ];

  const handleBatchToggle = (batch: string) => {
    const newBatches = filters.batches.includes(batch)
      ? filters.batches.filter((b) => b !== batch)
      : [...filters.batches, batch];
    onChange({ ...filters, batches: newBatches });
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
        {(filters.batches.length > 0 ||
          filters.companies.length > 0 ||
          filters.locations.length > 0 ||
          filters.domains.length > 0 ||
          filters.mentorshipAvailable ||
          filters.experience) && (
          <button
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Batch/Year Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Batch Year</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {batchYears.map((year) => (
              <label key={year} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.batches.includes(year)}
                  onChange={() => handleBatchToggle(year)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{year}</span>
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

        {/* Job Domain Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Job Domain</h4>
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
          <h4 className="text-sm font-medium text-gray-900 mb-3">Experience</h4>
          <div className="space-y-2">
            {experienceRanges.map((range) => (
              <label key={range.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  checked={filters.experience === range.value}
                  onChange={() => onChange({ ...filters, experience: range.value })}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Mentorship Availability */}
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.mentorshipAvailable}
              onChange={(e) =>
                onChange({ ...filters, mentorshipAvailable: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Available for Mentorship
            </span>
          </label>
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

export default AlumniFilters;
