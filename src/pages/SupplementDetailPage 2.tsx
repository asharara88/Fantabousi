/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Shield, Award, ArrowLeft, Info, Check, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Supplement {
  id: string;
  name: string;
  brand: string;
  description: string;
  detailed_description?: string;
  tier: 'green' | 'yellow' | 'orange';
  use_case: string;
  price_aed: number;
  subscription_discount_percent: number;
  image_url: string;
  benefits?: string[];
  ingredients?: string;
  dosage?: string;
  certifications?: string[];
  rating?: number;
  reviews?: number;
}

const SupplementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [supplement, setSupplement] = useState<Supplement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSupplement(id);
    }
  }, [id]);

  const fetchSupplement = async (supplementId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('id', supplementId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Parse benefits from string if needed
        const parsedBenefits = data.benefits 
          ? (typeof data.benefits === 'string' ? data.benefits.split(',') : data.benefits) 
          : generateMockBenefits(data.name);
        
        // Parse certifications from string if needed
        const parsedCertifications = data.certifications 
          ? (typeof data.certifications === 'string' ? data.certifications.split(',') : data.certifications) 
          : ['Third-party tested', 'GMP certified', 'Non-GMO'];
        
        setSupplement({
          ...data,
          benefits: parsedBenefits,
          certifications: parsedCertifications,
          rating: data.rating || 4.8,
          reviews: data.reviews || Math.floor(Math.random() * 200) + 50
        });
      }
    } catch (err) {
      console.error('Error fetching supplement:', err);
      setError('Failed to load supplement details. Please try again.');
      
      // Fallback to mock data
      if (id) {
        const mockSupplement = getMockSupplement(id);
        if (mockSupplement) {
          setSupplement(mockSupplement);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    return price - (price * (discountPercent / 100));
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case 'green':
        return <ShieldCheck className="w-4 h-4 mr-2" />;
      case 'yellow':
        return <AlertCircle className="w-4 h-4 mr-2" />;
      case 'orange':
        return <Info className="w-4 h-4 mr-2" />;
      case 'red':
        return <X className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };
  const getTierDescription = (tier?: string) => {
    switch (tier) {
      case 'green':
        return "Strong evidence – Supported by multiple high-quality human clinical trials and major scientific consensus (e.g., creatine, vitamin D).";
      case 'yellow':
        return "Moderate/emerging evidence – Some supporting studies, but either limited in scale, mixed results, or moderate scientific consensus (e.g., ashwagandha, beta-alanine).";
      case 'orange':
        return "Limited/preliminary evidence – Mostly early-stage or animal/lab-based research, few or low-quality human trials, or anecdotal support (e.g., tongkat ali, shilajit).";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !supplement) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Supplement not found'}</p>
            <Link
              to="/supplements"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Supplements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = isSubscription 
    ? calculateDiscountedPrice(supplement.price_aed, supplement.subscription_discount_percent || 0) 
    : supplement.price_aed;
  
  const totalPrice = finalPrice * quantity;

  const handleAddToCart = () => {
    // In a real app, this would call an API to add to cart
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/supplements"
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Supplements
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={supplement.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {/* Evidence Tier */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTierColor(supplement.tier)}`}>
                    {getTierIcon(supplement.tier)}
                    <span>{supplement.tier.charAt(0).toUpperCase() + supplement.tier.slice(1)} Tier</span>
                  </span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Show tier information"
                    onClick={() => alert(getTierDescription(supplement.tier))}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTierDescription(supplement.tier)}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {supplement.name}
                </h1>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {supplement.brand}
              </p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(supplement.rating || 4.5)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {supplement.rating} ({supplement.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Use Case</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {supplement.use_case}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {supplement.detailed_description || supplement.description || `${supplement.name} is a dietary supplement that supports overall health and wellness.`}
                </p>
                
                {supplement.evidence_summary && (
                  <div className="mt-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Evidence Summary</h3>
                    <div className={`p-4 rounded-lg ${
                      supplement.tier === 'green' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                      supplement.tier === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                      'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                    }`}>
                      <div className="flex items-start">
                        {getTierIcon(supplement.tier)}
                        <p className="text-gray-700 dark:text-gray-300">{supplement.evidence_summary}</p>
                      </div>
                      {supplement.source_link && (
                        <a 
                          href={supplement.source_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark text-sm mt-2 inline-block"
                        >
                          View Source Research
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Section */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Regular Price</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {supplement.price_aed.toFixed(2)} AED
                    </p>
                  </div>
                  
                  {supplement.subscription_discount_percent > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subscription Price</p>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">
                        {calculateDiscountedPrice(
                          supplement.price_aed, 
                          supplement.subscription_discount_percent
                        ).toFixed(2)} AED
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Save {supplement.subscription_discount_percent}%
                      </p>
                    </div>
                  )}
                </div>
                
                {supplement.subscription_discount_percent > 0 && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSubscription}
                        onChange={() => setIsSubscription(!isSubscription)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Subscribe & save {supplement.subscription_discount_percent}%
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-5">
                      Receive this product monthly and save. Cancel anytime.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <label className="text-gray-700 dark:text-gray-300 mr-3">Quantity:</label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Total:</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {totalPrice.toFixed(2)} AED
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 flex items-center justify-center"
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="px-4">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-6">
                {supplement.certifications?.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {supplement.benefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Usage & Ingredients */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Usage & Ingredients
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dosage</h4>
                      <p className="text-gray-700 dark:text-gray-300">{supplement.dosage || 'Take 1 capsule daily with food'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ingredients</h4>
                      <p className="text-gray-700 dark:text-gray-300">{supplement.ingredients || `${supplement.name} (active ingredient), Microcrystalline Cellulose, Vegetable Magnesium Stearate`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data function for development and fallback
function getMockSupplement(id: string): Supplement | null {
  const supplements = getMockSupplements();
  return supplements.find(s => s.id === id) || null;
}

function getMockSupplements(): Supplement[] {
  return [
    {
      id: '1',
      name: 'Creatine Monohydrate',
      brand: 'Biowell',
      description: 'Increases intramuscular phosphocreatine for rapid ATP regeneration, enhancing strength and power output during high-intensity exercise.',
      tier: 'green',
      use_case: 'Muscle strength & power',
      price_aed: 85.00,
      subscription_discount_percent: 15,
      image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      reviews: 156,
      benefits: [
        'Increases strength and power output',
        'Enhances high-intensity exercise performance',
        'Supports muscle growth when combined with resistance training',
        'Improves recovery between sets'
      ],
      ingredients: 'Creatine Monohydrate 5g, Microcrystalline Cellulose',
      dosage: 'Take 5g daily with water. Loading phase optional: 20g daily for 5-7 days, split into 4 doses.',
      certifications: ['Third-party tested', 'GMP certified', 'Non-GMO']
    },
    {
      id: '2',
      name: 'Vitamin D3',
      brand: 'Biowell',
      description: 'Essential fat-soluble vitamin that supports immune function, bone health, and mood regulation.',
      tier: 'green',
      use_case: 'Immune & bone health',
      price_aed: 40.00,
      subscription_discount_percent: 10,
      image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      reviews: 132,
      benefits: [
        'Supports immune system function',
        'Promotes calcium absorption for bone health',
        'May improve mood and reduce depression risk',
        'Supports muscle function and cardiovascular health'
      ],
      ingredients: 'Vitamin D3 (Cholecalciferol) 5000 IU, MCT Oil, Softgel Capsule (Gelatin, Glycerin, Water)',
      dosage: 'Take 1 softgel daily with a meal containing fat for optimal absorption.',
      certifications: ['Third-party tested', 'GMP certified', 'Non-GMO']
    }
  ];
}

function generateMockBenefits(name: string): string[] {
  // Generate some generic benefits based on the supplement name
  return [
    `Supports overall ${name.toLowerCase()} function`,
    'Promotes general wellbeing',
    'May help with daily health maintenance',
    'Supports natural body processes'
  ];
}

export default SupplementDetailPage;