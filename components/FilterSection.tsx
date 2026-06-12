'use client';

import { useState } from 'react';

export interface FilterOptions {
  jobType: string[];
  branches: string[];
  openToNonEngineering: boolean;
  sortBy: 'recent' | 'deadline' | 'salary';
}

interface FilterSectionProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const BRANCHES = [
  'CSE',
  'ECE',
  'ME',
  'CIVIL',
  'CHEMICAL',
  'PRODUCTION',
  'METALLURGY',
  'MINING',
];

export function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: [],
    branches: [],
    openToNonEngineering: false,
    sortBy: 'recent',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleJobTypeChange = (type: string) => {
    const newJobTypes = filters.jobType.includes(type)
      ? filters.jobType.filter((t) => t !== type)
      : [...filters.jobType, type];

    const newFilters = { ...filters, jobType: newJobTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBranchChange = (branch: string) => {
    const newBranches = filters.branches.includes(branch)
      ? filters.branches.filter((b) => b !== branch)
      : [...filters.branches, branch];

    const newFilters = { ...filters, branches: newBranches };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleNonEngineeringChange = () => {
    const newFilters = { ...filters, openToNonEngineering: !filters.openToNonEngineering };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, sortBy: e.target.value as any };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterOptions = {
      jobType: [],
      branches: [],
      openToNonEngineering: false,
      sortBy: 'recent',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <section id="filters" className="w-full bg-muted/50 border-b border-border sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Toggle */}
        <button
          className="md:hidden w-full mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>🔍 Filters & Sort</span>
          <span className="text-xl">{isExpanded ? '−' : '+'}</span>
        </button>

        {/* Filters Container */}
        <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Job Type */}
            <div>
              <h3 className="font-bold text-primary mb-3 text-sm md:text-base">Job Type</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.jobType.includes('GATE')}
                    onChange={() => handleJobTypeChange('GATE')}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">GATE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.jobType.includes('NON_GATE')}
                    onChange={() => handleJobTypeChange('NON_GATE')}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Non-GATE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={filters.jobType.includes('MIXED')}
                    onChange={() => handleJobTypeChange('MIXED')}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Mixed</span>
                </label>
              </div>
            </div>

            {/* Branches */}
            <div>
              <h3 className="font-bold text-primary mb-3 text-sm md:text-base">Branches</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {BRANCHES.map((branch) => (
                  <label key={branch} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={filters.branches.includes(branch)}
                      onChange={() => handleBranchChange(branch)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Non-Engineering */}
            <div>
              <h3 className="font-bold text-primary mb-3 text-sm md:text-base">Eligibility</h3>
              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.openToNonEngineering}
                  onChange={handleNonEngineeringChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Open to Non-Engineers</span>
              </label>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-bold text-primary mb-3 text-sm md:text-base">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="recent">Most Recent</option>
                <option value="deadline">Deadline Soon</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-semibold"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  );
}
