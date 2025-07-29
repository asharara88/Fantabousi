/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Filter, Shield } from 'lucide-react';
import SupplementCard from './SupplementCard';
import { Button } from '../ui/Button';

interface Supplement {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  tier?: 'green' | 'yellow' | 'orange' | 'red';
  use_case?: string;
  price_aed: number;
  subscription_discount_percent?: number;
  image_url?: string;
  is_bestseller?: boolean;
  is_featured?: boolean;
}

interface SupplementGridProps {
  supplements: Supplement[];
  loading?: boolean;
  error?: string | null;
  onAddToCart: (id: string) => void;
  onAddToStack?: (id: string) => void;
}

const SupplementGrid: React.FC<SupplementGridProps> = ({
  supplements,
  loading = false,
  error = null,
  onAddToCart,
  onAddToStack
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 'green' | 'yellow' | 'orange'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  // Get unique categories
  const categories = ['all', ...new Set(supplements.map(s => s.use_case || s.category || '').filter(Boolean))];
  
  // Filter supplements
  const filteredSupplements = supplements.filter(s => {
    const matchesTier = tierFilter === 'all' || s.tier === tierFilter;
    const matchesCategory = categoryFilter === 'all' || (s.use_case || s.category) === categoryFilter;
    return matchesTier && matchesCategory;
  });
  
  // Handle adding to cart
  const handleAddToCart = (id: string) => {
    setAddingToCart(id);
    onAddToCart(id);
    setTimeout(() => {
      setAddingToCart(null);
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <h3 className="text-sm font-medium mb-2">Evidence Tier</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={tierFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTierFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={tierFilter === 'green' ? 'default' : 'outline'}
              className={tierFilter === 'green' ? 
                "bg-green-600 hover:bg-green-700 text-white" : 
                "text-green-800 dark:text-green-300 hover:bg-green-100/50 dark:hover:bg-green-900/30"}
              onClick={() => setTierFilter('green')}
            >
              <Shield className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
              Strong Evidence
            </Button>
            <Button
              size="sm"
              variant={tierFilter === 'yellow' ? 'default' : 'outline'}
              className={tierFilter === 'yellow' ? 
                "bg-yellow-500 hover:bg-yellow-600 text-white" : 
                "text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/30"}
              onClick={() => setTierFilter('yellow')}
            >
              <Shield className="w-4 h-4 mr-1.5 text-yellow-600 dark:text-yellow-400" />
              Moderate Evidence
            </Button>
            <Button
              size="sm"
              variant={tierFilter === 'orange' ? 'default' : 'outline'}
              className={tierFilter === 'orange' ? 
                "bg-orange-500 hover:bg-orange-600 text-white" : 
                "text-orange-800 dark:text-orange-300 hover:bg-orange-100/50 dark:hover:bg-orange-900/30"}
              onClick={() => setTierFilter('orange')}
            >
              <Shield className="w-4 h-4 mr-1.5 text-orange-600 dark:text-orange-400" />
              Limited Evidence
            </Button>
          </div>
        </div>
        
        {categories.length > 1 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Grid */}
      {filteredSupplements.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No supplements found with the selected filters.
          </p>
          <Button onClick={() => {
            setTierFilter('all');
            setCategoryFilter('all');
          }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSupplements.map(supplement => (
            <SupplementCard
              key={supplement.id}
              supplement={supplement}
              onAddToCart={handleAddToCart}
              onAddToStack={onAddToStack}
              isAddingToCart={addingToCart === supplement.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplementGrid;