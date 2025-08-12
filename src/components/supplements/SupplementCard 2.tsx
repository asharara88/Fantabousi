/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ShoppingCart, Info, Star, Check, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface SupplementCardProps {
  supplement: {
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
    rating?: number;
    reviews_count?: number;
  };
  onAddToCart: (id: string) => void;
  onAddToStack?: (id: string) => void;
  isAddingToCart?: boolean;
}

const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  onAddToCart,
  onAddToStack,
  isAddingToCart = false,
}) => {
  const {
    id,
    name,
    brand = 'Biowell',
    description,
    tier = 'yellow',
    use_case,
    price_aed,
    subscription_discount_percent = 0,
    image_url,
    is_bestseller,
    rating = 4.5,
    reviews_count = 0,
  } = supplement;

  const discountedPrice = subscription_discount_percent > 0
    ? price_aed * (1 - subscription_discount_percent / 100)
    : price_aed;

  const getTierColor = (tier: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return colors[tier as keyof typeof colors] || colors.yellow;
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'green':
        return <Shield className="w-3.5 h-3.5 mr-1" />;
      case 'yellow':
        return <Shield className="w-3.5 h-3.5 mr-1" />;
      case 'orange':
        return <Shield className="w-3.5 h-3.5 mr-1" />;
      case 'red':
        return <Shield className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };
  const getTierDescription = (tier: string) => {
    switch (tier) {
      case 'green':
        return "Strong evidence – Multiple high-quality human trials";
      case 'yellow':
        return "Moderate evidence – Some supporting studies";
      case 'orange':
        return "Limited evidence – Early research or anecdotal support";
      case 'red':
        return "Insufficient evidence – Not recommended";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link to={`/supplements/${id}`} className="block relative h-48">
        <img
          src={image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(tier)}`}
            title={getTierDescription(tier)}
          >
            {getTierIcon()}
            {getTierIcon()}
            <span>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
          </span>
        </div>
        
        {is_bestseller && (
          <div className="absolute top-2 left-2">
            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Bestseller
            </span>
          </div>
        )}
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/supplements/${id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {brand}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2 flex-1">
          {description || use_case || 'Supports overall health and wellness.'}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            {reviews_count > 0 && (
              <span className="text-xs text-gray-500 ml-2">({reviews_count})</span>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {price_aed.toFixed(2)} AED
              </span>
              {subscription_discount_percent > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400 block">
                  Subscribe & Save {subscription_discount_percent}%
                </span>
              )}
            </div>
            
            {subscription_discount_percent > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {discountedPrice.toFixed(2)} AED
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm" 
              className="flex-1"
              onClick={() => onAddToStack && onAddToStack(id)}
              aria-label={`Add ${name} to stack`}
            >
              Add to Stack
            </Button>
            <Button
              size="sm"
              className="flex-1 flex items-center justify-center"
              onClick={() => onAddToCart(id)}
              disabled={isAddingToCart}
              aria-label={`Add ${name} to cart`}
            >
              {isAddingToCart ? (
                <Check className="w-4 h-4 mr-1" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-1" />
              )}
              {isAddingToCart ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SupplementCard;