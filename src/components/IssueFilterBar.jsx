import React from 'react'; // Removed useState, we will receive props
import { Search, ChevronDown, Layers, ArrowUpDown, X } from 'lucide-react';

const categories = ["All Categories", "Plumbing", "Electrical", "Wifi", "Furniture", "Cleanliness"];

// 1. Map readable labels to API values
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Urgency (High -> Low)", value: "priority" }, // <--- NEW OPTION
  { label: "Most Upvoted", value: "most_upvoted" },
  { label: "Oldest First", value: "oldest" },
];

// 2. Accept Props for State Management
export default function IssueFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedSort, 
  setSelectedSort 
}) {
  
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-4">
      <div className="flex flex-col lg:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues by title, hostel..." 
            className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-row w-full lg:w-auto gap-2">
          
          {/* Category Dropdown */}
          <div className="relative flex-1 lg:flex-none group">
            <button className="w-full flex items-center justify-between space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span className="truncate max-w-[100px]">{selectedCategory}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" />
            </button>
            
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 hidden group-hover:block animate-in fade-in zoom-in duration-150">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${selectedCategory === cat ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 lg:flex-none group">
            <button className="w-full flex items-center justify-between space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                {/* Find the label for the current value */}
                <span>{sortOptions.find(o => o.value === selectedSort)?.label || "Sort"}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 hidden group-hover:block animate-in fade-in zoom-in duration-150">
              {sortOptions.map((option) => (
                <button 
                  key={option.value}
                  onClick={() => setSelectedSort(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${selectedSort === option.value ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-gray-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}