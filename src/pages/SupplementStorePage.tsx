import { useEffect, useState, useMemo } from "react";
import { CheckCircle, AlertCircle, Info, Loader2, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { supplementApi } from '../api/supplementApi';
import StackBuilderModal from '../components/supplements/StackBuilderModal';
import { getAllSupplements, getUniqueCategories, searchSupplements, ProcessedSupplement } from '../utils/supplementData';

const TIER_COLORS = {
  green: "bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700"
};

const TIER_LABELS = {
  green: "Strong evidence – Supported by multiple high-quality human clinical trials and major scientific consensus.",
  yellow: "Moderate/emerging evidence – Some supporting studies, but either limited in scale, mixed results, or moderate scientific consensus. Also includes preliminary evidence from early-stage research."
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mobile-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Supplement Store</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse our evidence-based supplements by tier ({supplements.length} supplements available)</p>
        </div>

        {/* Tier Information */}
        <div className="mb-6">
          <button 
            onClick={() => setShowTierInfo(!showTierInfo)}
            className="flex items-center text-primary hover:text-primary-dark font-medium"
          >
            <Info className="w-5 h-5 mr-2" />
            {showTierInfo ? 'Hide' : 'Show'} Evidence Tier Information
          </button>
          
          {showTierInfo && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Evidence Tier Definitions</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-3 mt-0.5">Green</span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Strong evidence – Supported by multiple high-quality human clinical trials and major scientific consensus (e.g., creatine, vitamin D).</p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 mr-3 mt-0.5">Yellow</span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Moderate/emerging evidence – Some supporting studies, but either limited in scale, mixed results, or moderate scientific consensus (e.g., ashwagandha, beta-alanine). Also includes preliminary evidence from early-stage research (e.g., tongkat ali, shilajit).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter & Search Supplements</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Supplements are categorized by the strength of scientific evidence supporting their efficacy
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search supplements by name, category, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          {/* Filters */}
          <div className="space-y-4">
            {/* Tier Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Evidence Tier:</span>
              <Button
                variant={tierFilter === "all" ? "default" : "outline"}
                onClick={() => setTierFilter("all")}
                className="px-4 py-2"
              >
                All Tiers
              </Button>
              
              <Button
                variant={tierFilter === "green" ? "default" : "outline"}
                onClick={() => setTierFilter("green")}
                className="px-4 py-2 flex items-center gap-1.5"
              >
                {TIER_ICONS.green} Strong Evidence
              </Button>
              
              <Button
                variant={tierFilter === "yellow" ? "default" : "outline"}
                onClick={() => setTierFilter("yellow")}
                className="px-4 py-2 flex items-center gap-1.5"
              >
                {TIER_ICONS.yellow} Moderate Evidence
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Category:</span>
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                onClick={() => setCategoryFilter("all")}
                className="px-4 py-2"
              >
                All Categories
              </Button>
              {categories.slice(0, 8).map(category => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  onClick={() => setCategoryFilter(category)}
                  className="px-4 py-2 text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-1">
                {TIER_ICONS.green}
                <span className="font-medium text-gray-800 dark:text-gray-200">Tier 1:</span>
                <span className="text-gray-600 dark:text-gray-400">Multiple clinical trials</span>
              </div>
              
              <div className="flex items-center gap-1">
                {TIER_ICONS.yellow}
                <span className="font-medium text-gray-800 dark:text-gray-200">Tier 2:</span>
                <span className="text-gray-600 dark:text-gray-400">Some studies & early research</span>
              </div>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading supplements...</span>
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredSupplements.length} of {supplements.length} supplements
                {searchQuery && ` for "${searchQuery}"`}
                {tierFilter !== "all" && ` in ${tierFilter} tier`}
                {categoryFilter !== "all" && ` in ${categoryFilter} category`}
              </p>
              {(searchQuery || tierFilter !== "all" || categoryFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setTierFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSupplements.map((supp) => {
                // Calculate discount price if available
                const discount = supp.subscription_discount_percent || 0;
                const price = parseFloat(supp.price_aed || 100);
                const discounted = discount > 0 ? Math.round((price * (1 - discount / 100)) * 100) / 100 : price;

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
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No supplements found matching your criteria.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setTierFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Stack Builder Modal */}
      <StackBuilderModal
        isOpen={showStackBuilder}
        onClose={() => setShowStackBuilder(false)}
        initialSupplementId={selectedSupplementId || undefined}
        onSaveStack={handleSaveStack}
      />
    </div>
  );
}