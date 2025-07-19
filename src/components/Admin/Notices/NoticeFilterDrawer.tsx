import { X, Filter } from "lucide-react";
import { useState } from "react";

interface NoticeFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: string;
    searchTerm: string;
    category: string;
    priority: string;
    dateRange: string;
  };
  onApplyFilters: (filters: {
    status: string;
    searchTerm: string;
    category: string;
    priority: string;
    dateRange: string;
  }) => void;
  onClearFilters: () => void;
}

const NoticeFilterDrawer: React.FC<NoticeFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({
      status: "",
      searchTerm: "",
      category: "",
      priority: "",
      dateRange: "",
    });
    onClearFilters();
  };
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "graduate", label: "Graduate" },
    { value: "faculty", label: "Faculty" },
    { value: "staff", label: "Staff" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const dateRangeOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed -top-5 right-0 h-screen w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={localFilters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={localFilters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 space-y-3 flex-shrink-0">
            <button
              onClick={handleApply}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeFilterDrawer;
