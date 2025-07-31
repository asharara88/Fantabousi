import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Info, 
  Star, 
  ShoppingCart, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Grid,
  List,
  Heart,
  Search,
  X
} from 'lucide-react';
import { supplementApi, Supplement, SupplementStack } from '../../api/supplementApi';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { cn } from '../../utils/cn';
import { cartService } from '../../utils/cartService';

// Custom toast implementation to replace react-hot-toast
const toast = {
  success: (message: string) => {
    console.log('Success:', message);
    // You can implement a custom toast notification here
  },
  error: (message: string) => {
    console.error('Error:', message);
    // You can implement a custom toast notification here
  }
};

// Helper function to get tier badge component
const getTierBadge = (tier?: string) => {
  const configs: Record<string, { bg: string; label: string }> = {
    green: { 
      bg: 'bg-green-500 dark:bg-green-500',
      label: 'Proven to work - backed by solid research'
    },
    yellow: { 
      bg: 'bg-yellow-500 dark:bg-yellow-500',
      label: 'Promising results - some good studies available'
    },
    orange: { 
      bg: 'bg-orange-500 dark:bg-orange-500',
      label: 'Early research - limited studies so far'
    }
  };
  
  const config = configs[(tier as keyof typeof configs) || 'orange'] || configs.orange;
  
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${config.bg}`} title={config.label}>
    </span>
  );
};

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SupplementRecommendationsProps {
  maxDisplayCount?: number;
  showStacks?: boolean;
  showFilters?: boolean;
  viewMode?: 'grid' | 'list';
}

const SupplementRecommendations: React.FC<SupplementRecommendationsProps> = ({
  maxDisplayCount = 6,
  showStacks = true,
  showFilters = true,
  viewMode: defaultViewMode = 'grid'
}) => {
  const [recommendations, setRecommendations] = useState<{
    supplements: Supplement[];
    stacks: SupplementStack[];
    personalized_message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());
  const [selectedStackId, setSelectedStackId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultViewMode);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
    loadUserFavorites();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      let userId = user?.id;
      
      // For demo purposes, use a fallback if no user is authenticated
      if (!userId) {
        console.warn('No authenticated user, using demo mode');
        userId = 'demo-user-id';
      }
      
      const data = await supplementApi.getPersonalizedRecommendations(userId);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load personalized recommendations. Please try again.');
      
      // Set mock data for development
      setRecommendations({
        supplements: getMockSupplements(),
        stacks: getMockStacks(),
        personalized_message: "We've curated these recommendations based on your health profile and goals. Each supplement is selected based on scientific evidence and your specific needs."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load user favorites from database
        // This would be implemented with a favorites table
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleAddToCart = async (supplement: Supplement) => {
    try {
      setAddingToCart(prev => new Set(prev).add(supplement.id));
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to add items to cart');
        return;
      }
      
      await cartService.addToCart(supplement.id, {
        id: supplement.id,
        name: supplement.name,
        price: supplement.price_aed || 0,
        image: supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
        quantity: 1,
        brand: supplement.brand || '',
        category: supplement.category || 'Supplement'
      });
      
      toast.success(`${supplement.name} added to cart!`);
      
      // Reset adding state after animation
      setTimeout(() => {
        setAddingToCart(prev => {
          const newSet = new Set(prev);
          newSet.delete(supplement.id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(supplement.id);
        return newSet;
      });
    }
  };

  const toggleFavorite = async (supplementId: string) => {
    try {
      const newFavorites = new Set(favorites);
      if (favorites.has(supplementId)) {
        newFavorites.delete(supplementId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(supplementId);
        toast.success('Added to favorites');
      }
      setFavorites(newFavorites);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // This would save to a favorites table
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredSupplements = recommendations?.supplements.filter(supplement => {
    const matchesTier = filterTier === 'all' || supplement.tier === filterTier;
    const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplement.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplement.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analyzing Your Health Profile
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing personalized supplement recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">
              Unable to Load Recommendations
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm mb-4">{error}</p>
            <Button 
              onClick={loadRecommendations} 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!recommendations || (!recommendations.supplements.length && !recommendations.stacks.length)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Recommendations Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Complete your health profile to receive personalized supplement recommendations tailored to your goals.
          </p>
          <Button as={Link} to="/onboarding" className="bg-gradient-to-r from-blue-600 to-purple-600">
            Complete Your Profile
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Message */}
      {recommendations.personalized_message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your Personalized Recommendations
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {recommendations.personalized_message}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      {showFilters && recommendations.supplements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Tier Filter */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Evidence Levels</option>
              <option value="green">Strong Evidence</option>
              <option value="yellow">Moderate Evidence</option>
              <option value="orange">Limited Evidence</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      {(searchQuery || filterTier !== 'all') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Showing {filteredSupplements.length} of {recommendations.supplements.length} supplements
          {searchQuery && ` matching "${searchQuery}"`}
          {filterTier !== 'all' && ` with ${filterTier} evidence`}
        </motion.div>
      )}

      {/* Recommended Supplements */}
      {filteredSupplements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Recommended Supplements
          </h3>
          
          <div className={cn(
            'gap-6',
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'space-y-4'
          )}>
            <AnimatePresence>
              {filteredSupplements.slice(0, maxDisplayCount).map((supplement, index) => (
                <motion.div
                  key={supplement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {viewMode === 'grid' ? (
                    <SupplementCard
                      supplement={supplement}
                      onAddToCart={() => handleAddToCart(supplement)}
                      onToggleFavorite={() => toggleFavorite(supplement.id)}
                      isAddingToCart={addingToCart.has(supplement.id)}
                      isFavorite={favorites.has(supplement.id)}
                    />
                  ) : (
                    <SupplementListItem
                      supplement={supplement}
                      onAddToCart={() => handleAddToCart(supplement)}
                      onToggleFavorite={() => toggleFavorite(supplement.id)}
                      isAddingToCart={addingToCart.has(supplement.id)}
                      isFavorite={favorites.has(supplement.id)}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredSupplements.length > maxDisplayCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <Button 
                as={Link} 
                to="/supplements" 
                variant="outline"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                View All {filteredSupplements.length} Recommendations
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* No Results */}
      {filteredSupplements.length === 0 && recommendations.supplements.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No supplements found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setFilterTier('all');
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Recommended Stacks */}
      {showStacks && recommendations.stacks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Recommended Supplement Stacks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.stacks.map((stack, index) => (
              <motion.div
                key={stack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <StackCard
                  stack={stack}
                  isSelected={selectedStackId === stack.id}
                  onSelect={() => setSelectedStackId(stack.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Component for supplement cards in grid view
interface SupplementCardProps {
  supplement: Supplement;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isAddingToCart: boolean;
  isFavorite: boolean;
}

const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  onAddToCart,
  onToggleFavorite,
  isAddingToCart,
  isFavorite
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48">
        <img 
          src={supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300'} 
          alt={supplement.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Tier Badge */}
        <div className="absolute top-3 left-3">
          {getTierBadge(supplement.tier)}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
          )}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            as={Link}
            to={`/supplements/${supplement.id}`}
            variant="outline"
            className="bg-white text-gray-900 border-white hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
            {supplement.name}
          </h4>
          {supplement.evidence_rating && (
            <div className="flex items-center space-x-1 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-gray-600 dark:text-gray-400">{supplement.evidence_rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {supplement.brand}
        </p>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
          {supplement.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {(supplement.price_aed || 0).toFixed(2)} AED
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              as={Link}
              to={`/supplements/${supplement.id}`}
              variant="outline"
              size="sm"
            >
              Details
            </Button>
            <Button
              size="sm"
              onClick={onAddToCart}
              disabled={isAddingToCart}
              className={cn(
                'relative overflow-hidden',
                isAddingToCart && 'bg-green-600 hover:bg-green-700'
              )}
            >
              <AnimatePresence mode="wait">
                {isAddingToCart ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Added!
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Component for supplement items in list view
const SupplementListItem: React.FC<SupplementCardProps> = ({
  supplement,
  onAddToCart,
  onToggleFavorite,
  isAddingToCart,
  isFavorite
}) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center space-x-6">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img 
            src={supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300'} 
            alt={supplement.name} 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {supplement.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {supplement.brand}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getTierBadge(supplement.tier)}
              <button
                onClick={onToggleFavorite}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                )}
              >
                <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {supplement.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {(supplement.price_aed || 0).toFixed(2)} AED
            </span>
            
            <div className="flex space-x-3">
              <Button
                as={Link}
                to={`/supplements/${supplement.id}`}
                variant="outline"
                size="sm"
              >
                View Details
              </Button>
              <Button
                size="sm"
                onClick={onAddToCart}
                disabled={isAddingToCart}
                className={cn(
                  isAddingToCart && 'bg-green-600 hover:bg-green-700'
                )}
              >
                {isAddingToCart ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Component for supplement stacks
interface StackCardProps {
  stack: SupplementStack;
  isSelected: boolean;
  onSelect: () => void;
}

const StackCard: React.FC<StackCardProps> = ({ stack, isSelected, onSelect }) => {
  const totalPrice = stack.components.reduce((sum, component) => {
    return sum + (typeof component.price === 'number' ? component.price : 0);
  }, 0);

  return (
    <Card 
      className={cn(
        'overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer',
        isSelected && 'ring-2 ring-blue-500'
      )}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {stack.name}
          </h4>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {stack.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {`A curated stack for ${stack.category.toLowerCase()} support.`}
        </p>
        
        <div className="space-y-2 mb-4">
          {stack.components.slice(0, 3).map((component, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {typeof component === 'string' ? component : component.name}
              </span>
              {typeof component === 'object' && component.price && (
                <span className="font-medium text-gray-900 dark:text-white">
                  {typeof component.price === 'number' ? component.price.toFixed(2) : component.price} AED
                </span>
              )}
            </div>
          ))}
          
          {stack.components.length > 3 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              +{stack.components.length - 3} more supplement{stack.components.length - 3 > 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
              {totalPrice.toFixed(2)} AED
            </span>
          </div>
          <Button size="sm" variant={isSelected ? 'default' : 'outline'}>
            {isSelected ? 'Selected' : 'Select Stack'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Mock data functions
function getMockSupplements(): Supplement[] {
  return [
    {
      id: '1',
      name: 'Vitamin D3',
      brand: 'Nature\'s Best',
      description: 'Essential for bone health and immune function. Supports calcium absorption and may help improve mood.',
      price_aed: 89.99,
      image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      tier: 'green',
      category: 'Vitamins',
      evidence_rating: 4.8
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      brand: 'Nordic Naturals',
      description: 'High-quality fish oil rich in EPA and DHA. Supports heart health, brain function, and reduces inflammation.',
      price_aed: 129.99,
      image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      tier: 'green',
      category: 'Fatty Acids',
      evidence_rating: 4.9
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      brand: 'Pure Encapsulations',
      description: 'Highly bioavailable form of magnesium. Supports muscle function, nerve health, and promotes relaxation.',
      price_aed: 79.99,
      image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      tier: 'yellow',
      category: 'Minerals',
      evidence_rating: 4.7
    },
    {
      id: '4',
      name: 'Probiotics Complex',
      brand: 'Garden of Life',
      description: 'Multi-strain probiotic formula. Supports digestive health and immune system balance.',
      price_aed: 149.99,
      image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      tier: 'yellow',
      category: 'Digestive Health',
      evidence_rating: 4.6
    }
  ];
}

function getMockStacks(): SupplementStack[] {
  return [
    {
      id: 'stack-1',
      name: 'Foundation Health Stack',
      category: 'General Health',
      total_price: 289.97,
      components: [
        { supplement_id: '1', name: 'Vitamin D3', dosage: '2000 IU', timing: 'With breakfast', price: 89.99 },
        { supplement_id: '2', name: 'Omega-3', dosage: '1000mg', timing: 'With dinner', price: 129.99 },
        { supplement_id: 'multi', name: 'Multivitamin', dosage: '1 tablet', timing: 'With breakfast', price: 69.99 }
      ]
    },
    {
      id: 'stack-2',
      name: 'Energy & Focus Stack',
      category: 'Cognitive Health',
      total_price: 229.97,
      components: [
        { supplement_id: 'b-complex', name: 'B-Complex', dosage: '1 capsule', timing: 'Morning', price: 49.99 },
        { supplement_id: '3', name: 'Magnesium', dosage: '400mg', timing: 'Evening', price: 79.99 },
        { supplement_id: 'rhodiola', name: 'Rhodiola', dosage: '300mg', timing: 'Before workout', price: 99.99 }
      ]
    }
  ];
}

export default SupplementRecommendations;
