/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { CheckCircle, AlertCircle, Info, Loader2, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { supplementApi } from '../api/supplementApi';
import StackBuilderModal from '../components/supplements/StackBuilderModal';
import { getAllSupplements, getUniqueCategories, searchSupplements, ProcessedSupplement } from '../utils/supplementData';
import cartService from '../utils/cartService';

// Add type definition for stack data
interface StackData {
  name: string;
  description?: string;
  supplements: Array<{
    id: string;
    quantity?: number;
  }>;
  [key: string]: any; // Allow additional properties
}

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

function formatAED(price: number | string): string {
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

  const handleAddToCart = async (suppId: string) => {
    setAddingToCart(suppId);
    try {
      const success = await cartService.addToCart(suppId, 1);
      if (success) {
        // Show success feedback (could add a toast notification here)
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    }
  };

  const handleAddToStack = (supplementId: string) => {
    setSelectedSupplementId(supplementId);
    setShowStackBuilder(true);
  };

  const handleSaveStack = async (stackData: StackData) => {
    try {
      // Find supplement details to create proper component structure
      const supplementComponents = await Promise.all(
        stackData.supplements.map(async (supp) => {
          const supplement = supplements.find(s => s.id === supp.id);
          if (!supplement) {
            throw new Error(`Supplement with id ${supp.id} not found`);
          }
          return {
            supplement_id: supp.id,
            name: supplement.name,
            dosage: supplement.dosage || "As directed",
            timing: "As directed",
            price: parseFloat(supplement.price_aed?.toString() || "0")
          };
        })
      );

      const supplementStackData = {
        name: stackData.name,
        description: stackData.description || '',
        category: 'Custom',
        total_price: supplementComponents.reduce((total, comp) => total + comp.price, 0),
        components: supplementComponents
      };
      
      await supplementApi.createSupplementStack(supplementStackData);
    } catch (error) {
      console.error('Error saving stack:', error);
      throw error;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading supplements...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mobile-container">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Supplement Store</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse our evidence-based supplements by tier ({supplements.length} supplements available)</p>
        </div>

        {/* Tier Information */}
        <div className="mb-6">
          <button 
            onClick={() => setShowTierInfo(!showTierInfo)}
            className="flex items-center font-medium text-primary hover:text-primary-dark"
          >
            <Info className="w-5 h-5 mr-2" />
            {showTierInfo ? 'Hide' : 'Show'} Evidence Tier Information
          </button>
          
          {showTierInfo && (
            <div className="p-4 mt-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Evidence Tier Definitions</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-3 mt-0.5">Green</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Strong evidence – Supported by multiple high-quality human clinical trials and major scientific consensus (e.g., creatine, vitamin D).</p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 mr-3 mt-0.5">Yellow</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Moderate/emerging evidence – Some supporting studies, but either limited in scale, mixed results, or moderate scientific consensus (e.g., ashwagandha, beta-alanine). Also includes preliminary evidence from early-stage research (e.g., tongkat ali, shilajit).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Filter & Search Supplements</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
              className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          {/* Filters */}
          <div className="space-y-4">
            {/* Tier Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Evidence Tier:</span>
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
              <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
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
          
          <div className="p-4 mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
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

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
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
            const price = parseFloat((supp.price_aed || "100").toString());

            return (
              <Card key={supp.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="relative flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800">
                  {/* Always show an image even if it's a placeholder */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={supp.image_url || "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300"} 
                      alt={supp.name} 
                      className="object-cover w-full h-full"
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
                  <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    {supp.name}
                  </h3>
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    {supp.brand} • {supp.category}
                  </p>
                  <p className="mb-2 text-xs text-green-600 dark:text-green-400">
                    {supp.evidence_quality} Evidence • {supp.dosage}
                  </p>
                  <p className="flex-1 mb-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
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
          <div className="py-12 text-center col-span-full">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
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