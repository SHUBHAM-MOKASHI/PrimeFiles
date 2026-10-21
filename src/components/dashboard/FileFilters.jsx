import React from 'react';
import { Search, X, LayoutList, LayoutGrid } from 'lucide-react';

export default function FileFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
}) {
  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'documents', label: 'Documents' },
    { id: 'images', label: 'Images' },
    { id: 'archives', label: 'Archives' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Bar & View Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Layout toggle (List / Grid) */}
        <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shadow-xs">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Table View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
