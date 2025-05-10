import React from 'react';
import { Search } from 'lucide-react';

const ServiceFilters = ({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  sortByName,
  setSortByName,
  sortByPrice,
  setSortByPrice,
}) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Beauty & Wellness', label: 'Beauty & Wellness' },
    { value: 'Car Rental', label: 'Car Rental' },
    { value: 'Tuition', label: 'Tuition' },
    { value: 'Housekeeping', label: 'Housekeeping' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrician', label: 'Electrician' }
  ];

  const sortNameOptions = [
    { value: '', label: 'Sort by Name' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  const sortPriceOptions = [
    { value: '', label: 'Sort by Price' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            className="pl-10 form-input w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input w-full"
          >
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by Name */}
        <div>
          <select
            value={sortByName}
            onChange={(e) => setSortByName(e.target.value)}
            className="form-input w-full"
          >
            {sortNameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by Price */}
        <div>
          <select
            value={sortByPrice}
            onChange={(e) => setSortByPrice(e.target.value)}
            className="form-input w-full"
          >
            {sortPriceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilters;
