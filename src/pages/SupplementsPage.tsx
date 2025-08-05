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

function formatAED(price) {
  return `${parseFloat(price).toFixed(2)} AED`;
}

export default function SupplementStorePage() {
  const [supplements, setSupplements] = useState<ProcessedSupplement[]>([]);
  const [tierFilter, setTierFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showStackBuilder, setShowStackBuilder] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState(null);
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
      console.error("Error loading supplements:", err);
      setError("Failed to load supplements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from loaded supplements
  const categories = useMemo(() => {
    return getUniqueCategories();
  }, []);

  // Filter supplements based on current filters
  const filteredSupplements = useMemo(() => {
    let filtered = supplements;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchSupplements(searchQuery);
    }

    // Apply tier filter
    if (tierFilter !== "all") {
      filtered = filtered.filter(s => s.tier === tierFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }

    return filtered;
  }, [supplements, tierFilter, categoryFilter, searchQuery]);

  const handleAddToCart = (suppId) => {
    setAddingToCart(suppId);
    // Simulate adding to cart
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  const handleAddToStack = (supplementId) => {
    setSelectedSupplementId(supplementId);
    setShowStackBuilder(true);
  };

  const handleSaveStack = async (stackData) => {
    try {
      await supplementApi.createSupplementStack(stackData);
    } catch (error) {
      console.error('Error saving stack:', error);
      throw error;
    }
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
            <button 
              onClick={() => setShowTierInfo(!showTierInfo)}
              className="flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              {showTierInfo ? 'Hide' : 'Show'} Evidence Tier Information
            </button>
            
            {showTierInfo && (
              <GlassCard variant="elevated" className="mt-4 p-6">
                <h3 className="text-lg font-semibold mb-3 text-text">Evidence Tier Definitions</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium glass-panel bg-green-500/20 text-green-400 mr-3 mt-0.5">Green</span>
                    <p className="text-text-light text-sm">Proven to work - backed by solid research and widely recommended by experts.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium glass-panel bg-yellow-500/20 text-yellow-400 mr-3 mt-0.5">Yellow</span>
                    <p className="text-text-light text-sm">Promising results - some good studies available, but more research needed.</p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

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
            
            {/* Filters */}
            <div className="space-y-4">
              {/* Tier Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-text mr-2">Evidence Tier:</span>
                <GlassButton
                  variant={tierFilter === "all" ? "primary" : "default"}
                  onClick={() => setTierFilter("all")}
                  size="sm"
                >
                  All Tiers
                </GlassButton>
                
                <GlassButton
                  variant={tierFilter === "green" ? "primary" : "default"}
                  onClick={() => setTierFilter("green")}
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  {TIER_ICONS.green} Strong Evidence
                </GlassButton>
                
                <GlassButton
                  variant={tierFilter === "yellow" ? "primary" : "default"}
                  onClick={() => setTierFilter("yellow")}
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  {TIER_ICONS.yellow} Moderate Evidence
                </GlassButton>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-text mr-2">Category:</span>
                <GlassButton
                  variant={categoryFilter === "all" ? "primary" : "default"}
                  onClick={() => setCategoryFilter("all")}
                  size="sm"
                >
                  All Categories
                </GlassButton>
                {categories.slice(0, 8).map(category => (
                  <GlassButton
                    key={category}
                    variant={categoryFilter === category ? "primary" : "default"}
                    onClick={() => setCategoryFilter(category)}
                    size="sm"
                    className="text-xs"
                  >
                    {category}
                  </GlassButton>
                ))}
              </div>
            </div>
            
            <GlassCard variant="frosted" className="mt-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {TIER_ICONS.green}
                  <span className="font-medium text-text">Tier 1:</span>
                  <span className="text-text-light">Multiple clinical trials</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {TIER_ICONS.yellow}
                  <span className="font-medium text-text">Tier 2:</span>
                  <span className="text-text-light">Some studies & early research</span>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSupplements.map((supp) => {
                // Calculate discount price if available
                const discount = supp.subscription_discount_percent || 0;
                const price = parseFloat(supp.price_aed || 100);
                const _discountedPrice = discount > 0 ? Math.round((price * (1 - discount / 100)) * 100) / 100 : price;

                return (
                  <Card key={supp.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {/* Always show an image even if it's a placeholder */}
                      <div className="w-full h-full relative overflow-hidden">
                        <img 
                          src={supp.image_url || "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300"} 
                          alt={supp.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="absolute top-2 left-2">
                        <div 
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg border font-semibold ${TIER_COLORS[supp.tier]}`} 
                          title={TIER_LABELS[supp.tier]}
                        >
                          <span className="flex items-center gap-1">
                            {TIER_ICONS[supp.tier]}
                            {supp.tier.charAt(0).toUpperCase() + supp.tier.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {supp.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {supp.brand} • {supp.category}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                        {supp.evidence_quality} Evidence • {supp.dosage}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                        {supp.description}
                      </p>
                      
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="font-bold text-lg text-primary dark:text-primary-light">
                          {formatAED(supp.discounted_price_aed || price)}
                        </span>
                        {discount > 0 && (
                          <span className="line-through text-gray-400 text-xs">
                            {formatAED(price)}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded px-2 py-0.5 text-xs font-semibold">
                            {discount}% off Premium Users
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            if (typeof handleAddToStack === 'function') {
                              handleAddToStack(supp.id);
                            } else {
                              console.warn("handleAddToStack is not defined");
                            }
                          }}
                        >
                          Add to Stack
                        </Button>
                        
                        <Button
                          className="flex-1"
                          onClick={() => handleAddToCart(supp.id)}
                          disabled={addingToCart === supp.id}
                        >
                          {addingToCart === supp.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Added
                            </>
                          ) : (
                            "Buy Now"
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