import { Users, Filter } from 'lucide-react';
import type { EmailStats, EmailFilters } from '../../services/emailCampaign.service';

interface Props {
  stats: EmailStats | null;
  filters: EmailFilters;
  onFiltersChange: (filters: EmailFilters) => void;
}

const RecipientSelector = ({ stats, filters, onFiltersChange }: Props) => {
  const handleFilterChange = (key: keyof EmailFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  // Calculate recipient count based on filters
  const getRecipientCount = () => {
    if (!stats) return 0;

    let count = stats.totalUsers;

    if (filters.role === 'student') count = stats.studentCount;
    else if (filters.role === 'alumni') count = stats.alumniCount;

    return count;
  };

  const recipientCount = getRecipientCount();

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-indigo-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Select Recipients</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Role
          </label>
          <select
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="">All Users</option>
            <option value="student">Students Only</option>
            <option value="alumni">Alumni Only</option>
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Batch
          </label>
          <select
            value={filters.batch || ''}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="">All Batches</option>
            {stats?.batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Department
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="">All Departments</option>
            {stats?.departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipient Count */}
      <div className="bg-white rounded-lg p-4 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-600" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Estimated Recipients:
            </span>
          </div>
          <span className="text-2xl font-bold text-indigo-600">{recipientCount}</span>
        </div>
        {recipientCount === 0 && (
          <p className="text-sm text-red-600 mt-2">
            No recipients match the selected filters
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
