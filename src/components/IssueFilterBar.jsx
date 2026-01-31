import React from 'react';
import { Search, ChevronDown, Layers, ArrowUpDown, X, Sparkles } from 'lucide-react';

const categories = ["All Categories", "Plumbing", "Electrical", "Wifi", "Furniture", "Cleanliness"];

const sortOptions = [
  { label: "Newest First", value: "newest", icon: "🆕" },
  { label: "Urgency (High → Low)", value: "priority", icon: "🔥" },
  { label: "Most Upvoted", value: "most_upvoted", icon: "👍" },
  { label: "Oldest First", value: "oldest", icon: "📅" },
];

// Category emoji mapping
const categoryIcons = {
  "All Categories": "📋",
  "Plumbing": "🔧",
  "Electrical": "⚡",
  "Wifi": "📶",
  "Furniture": "🪑",
  "Cleanliness": "✨",
};

export default function IssueFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedSort, 
  setSelectedSort 
}) {
  
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md mb-6 relative">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex flex-col lg:flex-row items-center gap-3">
        
        {/* Enhanced Search Input */}
        <div className="relative w-full lg:flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues by title, hostel..." 
            className="
              w-full pl-10 pr-10 py-3 
              bg-gradient-to-r from-gray-50 to-blue-50/30
              border-2 border-gray-200 
              rounded-xl text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:bg-white
              transition-all duration-200
              placeholder:text-gray-400
            "
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="
                absolute right-3 top-1/2 -translate-y-1/2 
                text-gray-400 hover:text-red-500 
                bg-gray-100 hover:bg-red-50
                rounded-full p-1
                transition-all
              "
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex flex-row w-full lg:w-auto gap-3">
          
          {/* Enhanced Category Dropdown */}
          <div className="relative flex-1 lg:w-52 group z-50">
            <button className="
              w-full flex items-center justify-between gap-2 
              px-4 py-3 
              border-2 border-gray-200 
              rounded-xl text-sm font-semibold 
              text-gray-700 
              bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
              hover:border-blue-300
              transition-all duration-200
              shadow-sm hover:shadow-md
            ">
              <div className="flex items-center gap-2">
                <span className="text-base">{categoryIcons[selectedCategory]}</span>
                <span className="truncate max-w-[120px]">{selectedCategory}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200 flex-shrink-0" />
            </button>
            
            <div className="
              absolute left-0 mt-2 w-64 
              bg-white border-2 border-gray-200 
              rounded-xl shadow-2xl 
              py-2 z-[100]
              hidden group-hover:block 
              animate-in fade-in zoom-in-95 duration-150
            ">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Filter by Category
              </div>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm font-medium
                    hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                    transition-all duration-150
                    flex items-center gap-3
                    ${selectedCategory === cat 
                      ? 'text-blue-600 font-bold bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' 
                      : 'text-gray-700'
                    }
                  `}
                >
                  <span className="text-lg">{categoryIcons[cat]}</span>
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Sort Dropdown */}
          <div className="relative flex-1 lg:w-56 group z-40">
            <button className="
              w-full flex items-center justify-between gap-2 
              px-4 py-3 
              border-2 border-gray-200 
              rounded-xl text-sm font-semibold 
              text-gray-700 
              bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50
              hover:border-purple-300
              transition-all duration-200
              shadow-sm hover:shadow-md
            ">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-purple-500" />
                <span className="truncate">
                  {sortOptions.find(o => o.value === selectedSort)?.icon}{' '}
                  {sortOptions.find(o => o.value === selectedSort)?.label || "Sort"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200 flex-shrink-0" />
            </button>
            
            <div className="
              absolute right-0 mt-2 w-56 
              bg-white border-2 border-gray-200 
              rounded-xl shadow-2xl 
              py-2 z-[100]
              hidden group-hover:block 
              animate-in fade-in zoom-in-95 duration-150
            ">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Sort Issues By
              </div>
              {sortOptions.map((option) => (
                <button 
                  key={option.value}
                  onClick={() => setSelectedSort(option.value)}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm font-medium
                    hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50
                    transition-all duration-150
                    flex items-center gap-3
                    ${selectedSort === option.value 
                      ? 'text-purple-600 font-bold bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500' 
                      : 'text-gray-700'
                    }
                  `}
                >
                  <span className="text-base">{option.icon}</span>
                  <span>{option.label}</span>
                  {selectedSort === option.value && (
                    <span className="ml-auto text-purple-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== "All Categories" || selectedSort !== "newest") && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">Active Filters:</span>
          
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {selectedCategory !== "All Categories" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
              {categoryIcons[selectedCategory]} {selectedCategory}
              <button onClick={() => setSelectedCategory("All Categories")} className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {selectedSort !== "newest" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium">
              {sortOptions.find(o => o.value === selectedSort)?.icon} {sortOptions.find(o => o.value === selectedSort)?.label}
              <button onClick={() => setSelectedSort("newest")} className="hover:text-pink-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          <button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Categories");
              setSelectedSort("newest");
            }}
            className="ml-auto text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}