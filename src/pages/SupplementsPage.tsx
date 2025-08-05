import { useEffect, useState, useMemo } from "react";
import { CheckCircle, AlertCircle, Info, Loader2, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { supplementApi } from '../api/supplementApi';
import StackBuilderModal from '../components/supplements/StackBuilderModal';
import { getAllSupplements, getUniqueCategories, searchSupplements, ProcessedSupplement } from '../utils/supplementData';
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop';
import { GlassSection, GlassCard, GlassButton, GlassInput } from '../components/ui/GlassComponents';

const TIER_COLORS = {
  green: "bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700"
};

const TIER_LABELS = {
  green: "Proven to work - backed by solid research and widely recommended by experts.",
  yellow: "Promising results - some good studies available, but more research needed."
};

const TIER_ICONS = {
  green: <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />,
  yellow: <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
  orange: <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
};

function formatAED(price: string | number): string {
  return `${parseFloat(price.toString()).toFixed(2)} AED`;
}

export default function SupplementStorePage() {
  const [supplements, setSupplements] = useState<ProcessedSupplement[]>([]);
  const [tierFilter, setTierFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [showStackBuilder, setShowStackBuilder] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState<string | null>(null);
  const [showTierInfo, setShowTierInfo] = useState(false);

  useEffect(() => {
    loadSupplements();
  }, []);

  const loadSupplements = () => {
    setLoading(true);
    try {
      const supplementData = getAllSupplements();
      setSupplements(supplementData);
      setError(null);
    } catch (err) {
      console.error('Error loading supplements:', err);
      setError("Failed to load supplements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => getUniqueCategories(), []);

  const filteredSupplements = useMemo(() => {
    let filtered = supplements;

    if (searchQuery) {
      filtered = searchSupplements(filtered, searchQuery);
    }

    if (tierFilter !== "all") {
      filtered = filtered.filter(supp => supp.tier === tierFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(supp => supp.category === categoryFilter);
    }

    return filtered;
  }, [supplements, searchQuery, tierFilter, categoryFilter]);

  const handleAddToCart = (suppId: string) => {
    setAddingToCart(suppId);
    console.log('Adding to cart:', suppId);
    setTimeout(() => setAddingToCart(null), 1000);
  };

  const handleAddToStack = (supplementId: string) => {
    setSelectedSupplementId(supplementId);
    setShowStackBuilder(true);
  };

  const handleSaveStack = async (stackData: any) => {
    console.log('Saving stack:', stackData);
    setShowStackBuilder(false);
    setSelectedSupplementId(null);
  };

  return (
    <AdaptiveBackdrop animationSpeed="medium">
      <GlassSection padding="lg" background="gradient">
        <div className="mobile-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Supplement Store</h1>
            <p className="text-text-light">Browse our evidence-based supplements by tier ({supplements.length} supplements available)</p>
          </div>

          {/* Tier Information */}
          <div className="mb-6">
            <GlassButton 
              variant="secondary" 
              size="sm" 
              onClick={() => setShowTierInfo(!showTierInfo)}
              className="mb-4"
            >
              <Info className="w-4 h-4 mr-2" />
              {showTierInfo ? 'Hide' : 'Show'} Tier Information
            </GlassButton>
            
            {showTierInfo && (
              <GlassCard variant="frosted" className="p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Evidence Tiers Explained</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {TIER_ICONS.green}
                    <span className="font-medium text-text">Tier 1:</span>
                    <span className="text-text-light">Strong evidence & widely recommended</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {TIER_ICONS.yellow}
                    <span className="font-medium text-text">Tier 2:</span>
                    <span className="text-text-light">Some studies & early research</span>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Filters */}
          <GlassCard variant="strong" className="p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text mb-2">Filter & Search Supplements</h2>
                <p className="text-sm text-text-light mt-1">
                  Supplements are categorized by the strength of scientific evidence supporting their efficacy
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <GlassInput
                type="text"
                placeholder="Search supplements by name, category, or use case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Evidence Tier</label>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Tiers</option>
                  <option value="green">Tier 1 (Strong Evidence)</option>
                  <option value="yellow">Tier 2 (Moderate Evidence)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          {loading ? (
            <GlassCard variant="elevated" className="p-12 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <span className="text-lg text-text-light">Loading supplements...</span>
            </GlassCard>
          ) : error ? (
            <GlassCard variant="elevated" className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 mb-4">{error}</p>
              <GlassButton onClick={() => window.location.reload()}>
                Try Again
              </GlassButton>
            </GlassCard>
          ) : (
            <>
              {/* Available Supplements Section */}
              <section>
                <h2 className="text-2xl font-semibold text-text mb-6">Available Supplements</h2>
                
                {/* Results Summary */}
                <GlassCard variant="frosted" className="mb-6 p-4 flex items-center justify-between">
                  <p className="text-sm text-text-light">
                    Showing {filteredSupplements.length} of {supplements.length} supplements
                    {searchQuery && ` for "${searchQuery}"`}
                    {tierFilter !== "all" && ` in ${tierFilter} tier`}
                    {categoryFilter !== "all" && ` in ${categoryFilter} category`}
                  </p>
                  {(searchQuery || tierFilter !== "all" || categoryFilter !== "all") && (
                    <GlassButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setTierFilter("all");
                        setCategoryFilter("all");
                      }}
                    >
                      Clear Filters
                    </GlassButton>
                  )}
                </GlassCard>

                {/* Supplements Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSupplements.map((supp) => {
                    const tierColor = TIER_COLORS[supp.tier as keyof typeof TIER_COLORS] || TIER_COLORS.yellow;
                    const price = parseFloat(supp.price_aed || '100');
                    
                    return (
                      <Card key={supp.id} className="p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-text text-lg leading-tight">{supp.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColor}`}>
                            Tier {supp.tier === 'green' ? '1' : '2'}
                          </span>
                        </div>
                        
                        <p className="text-text-light text-sm mb-3 line-clamp-2">{supp.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{formatAED(price)}</span>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToStack(supp.id)}
                            >
                              Add to Stack
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(supp.id)}
                              disabled={addingToCart === supp.id}
                            >
                              {addingToCart === supp.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Adding...
                                </>
                              ) : (
                                'Add to Cart'
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                
                {filteredSupplements.length === 0 && (
                  <GlassCard variant="elevated" className="col-span-full text-center py-12">
                    <p className="text-text-light mb-4">
                      No supplements found matching your criteria.
                    </p>
                    <GlassButton 
                      onClick={() => {
                        setSearchQuery("");
                        setTierFilter("all");
                        setCategoryFilter("all");
                      }}
                    >
                      Clear All Filters
                    </GlassButton>
                  </GlassCard>
                )}
              </section>
            </>
          )}
        </div>
      </GlassSection>
      
      {/* Stack Builder Modal */}
      <StackBuilderModal
        isOpen={showStackBuilder}
        onClose={() => setShowStackBuilder(false)}
        initialSupplementId={selectedSupplementId || undefined}
        onSaveStack={handleSaveStack}
      />
    </AdaptiveBackdrop>
  );
}
