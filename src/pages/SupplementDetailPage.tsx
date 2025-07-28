import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Shield, 
  Star,
  Check,
  Info
} from 'lucide-react';
import { getSupplementById } from '../utils/supplementData';
import type { ProcessedSupplement } from '../utils/supplementData';

export default function SupplementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplement, setSupplement] = useState<ProcessedSupplement | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [subscription, setSubscription] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      const supplementData = getSupplementById(id);
      setSupplement(supplementData || null);
    }
    setLoading(false);
  }, [id]);

  const getTierColor = (tier: string) => {
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

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'green':
        return <Shield className="w-4 h-4 mr-2" />;
      case 'yellow':
        return <Info className="w-4 h-4 mr-2" />;
      case 'orange':
        return <Info className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const getTierDescription = (tier: string) => {
    switch (tier) {
      case 'green':
        return 'Strong evidence – Supported by multiple high-quality human clinical trials and major scientific consensus.';
      case 'yellow':
        return 'Moderate/emerging evidence – Some supporting studies, but either limited in scale, mixed results, or moderate scientific consensus.';
      case 'orange':
        return 'Limited/preliminary evidence – Mostly early-stage or animal/lab-based research, few or low-quality human trials.';
      default:
        return '';
    }
  };

  const calculatePrice = () => {
    if (!supplement) return 0;
    
    const basePrice = supplement.price_aed;
    const discount = subscription && supplement.subscription_discount_percent 
      ? supplement.subscription_discount_percent 
      : 0;
    
    return basePrice * (1 - discount / 100) * quantity;
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      setAddingToCart(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">Supplement not found</p>
            <Button onClick={() => navigate('/supplements/store')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const finalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/supplements/store')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>

        {/* Product Details */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={supplement.image_url}
                alt={supplement.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {/* Evidence Tier */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTierColor(supplement.tier)}`}>
                    {getTierIcon(supplement.tier)}
                    <span>{supplement.tier.charAt(0).toUpperCase() + supplement.tier.slice(1)} Evidence</span>
                  </span>
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

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    4.8 (127 reviews)
                  </span>
                </div>
              </div>

              {/* Use Case */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Use Case
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {supplement.use_case}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {supplement.description}
                </p>
              </div>

              {/* Dosage */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Recommended Dosage
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {supplement.dosage}
                </p>
              </div>

              {/* Purchase Options */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Regular Price</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {supplement.price_aed.toFixed(2)} AED
                    </p>
                  </div>
                  {supplement.subscription_discount_percent && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subscription Price</p>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">
                        {supplement.discounted_price_aed?.toFixed(2)} AED
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Save {supplement.subscription_discount_percent}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Subscription Toggle */}
                {supplement.subscription_discount_percent && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subscription}
                        onChange={() => setSubscription(!subscription)}
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

                {/* Quantity */}
                <div className="flex items-center mb-4">
                  <label className="text-gray-700 dark:text-gray-300 mr-3">Quantity:</label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Total:</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {finalPrice.toFixed(2)} AED
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    className="flex-1 flex items-center justify-center"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
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
              {supplement.certifications && (
                <div className="flex flex-wrap gap-2">
                  {supplement.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Benefits Section */}
          {supplement.benefits && supplement.benefits.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplement.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
