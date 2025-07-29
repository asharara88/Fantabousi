import React from 'react';
import { motion } from 'framer-motion';

// Simple performance tracking - works without complex stores
function trackPerformance(componentName: string) {
  if (typeof window !== 'undefined') {
    console.log(`${componentName} rendered at ${performance.now()}`);
  }
}

// Enhanced supplement card component
export function EnhancedSupplementCard({ 
  supplement, 
  onClick, 
  className = '' 
}: {
  supplement: {
    id: string;
    name: string;
    image?: string;
    category: string;
    description?: string;
    price?: number;
    rating?: number;
  };
  onClick?: () => void;
  className?: string;
}) {
  React.useEffect(() => trackPerformance('SupplementCard'), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl 
                  transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={supplement.image || '/placeholder-supplement.jpg'}
          alt={supplement.name}
          className="object-cover w-full h-48"
          loading="lazy"
        />
        <div className="absolute px-2 py-1 rounded-full top-2 right-2 bg-black/20 backdrop-blur-sm">
          <span className="text-xs font-medium text-white">
            {supplement.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-gray-900">
          {supplement.name}
        </h3>
        
        {supplement.description && (
          <p className="mb-3 text-sm text-gray-600">
            {supplement.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {supplement.price && (
            <span className="text-lg font-bold text-green-600">
              ${supplement.price.toFixed(2)}
            </span>
          )}
          
          {supplement.rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">
                {supplement.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced grid component
export function EnhancedSupplementGrid({ 
  supplements, 
  onSupplementClick 
}: {
  supplements: any[];
  onSupplementClick: (supplement: any) => void;
}) {
  React.useEffect(() => trackPerformance('SupplementGrid'), []);
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {supplements.map((supplement, index) => (
        <EnhancedSupplementCard
          key={supplement.id || index}
          supplement={supplement}
          onClick={() => onSupplementClick(supplement)}
          className="w-full"
        />
      ))}
    </div>
  );
}

// Enhanced search component
export function EnhancedSearch({
  onSearch,
  placeholder = "Search supplements...",
  className = ""
}: {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        placeholder={placeholder}
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute text-gray-400 right-2 top-2 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
}

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
        placeholder={placeholder}
      />
      
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg 
            className="w-5 h-5 text-gray-400 hover:text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}
