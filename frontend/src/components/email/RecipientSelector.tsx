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
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Filter className="text-indigo-600" size={18} />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Select Recipients</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Filter by Role
          </label>
          <select
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all"
          >
            <option value="">All Users</option>
            <option value="student">Students Only</option>
            <option value="alumni">Alumni Only</option>
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Filter by Batch
          </label>
          <select
            value={filters.batch || ''}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all"
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Filter by Department
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all"
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-md">
              <Users className="text-white" size={18} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Estimated Recipients:
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{recipientCount}</span>
        </div>
        {recipientCount === 0 && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <span className="text-lg">⚠️</span>
            No recipients match the selected filters
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
