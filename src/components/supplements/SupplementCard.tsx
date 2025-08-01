/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
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
      green: 'bg-green-500 dark:bg-green-500',
      yellow: 'bg-yellow-500 dark:bg-yellow-500',
      orange: 'bg-orange-500 dark:bg-orange-500',
      red: 'bg-red-500 dark:bg-red-500'
    };
    
    return colors[tier as keyof typeof colors] || colors.yellow;
  };
  const getTierDescription = (tier: string) => {
    switch (tier) {
      case 'green':
        return "Proven to work - backed by solid research";
      case 'yellow':
        return "Promising results - some good studies available";
      case 'orange':
        return "Early research - limited studies so far";
      case 'red':
        return "Not enough research yet - proceed with caution";
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
            className={`inline-block w-4 h-4 rounded-full ${getTierColor(tier)}`}
            title={getTierDescription(tier)}
          >
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
          <h3 className="text-lg font-semibold text mb-1 line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted mb-1">
          {brand}
        </p>
        <p className="text-sm text-light mb-2 line-clamp-2 flex-1">
          {description || use_case || 'Supports overall health and wellness.'}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${id}-${i}`}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-disabled"
                  )}
                />
              ))}
            </div>
            {reviews_count > 0 && (
              <span className="text-xs text-disabled ml-2">({reviews_count})</span>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-lg font-bold text">
                {price_aed.toFixed(2)} AED
              </span>
              {subscription_discount_percent > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400 block">
                  Subscribe & Save {subscription_discount_percent}%
                </span>
              )}
            </div>
            
            {subscription_discount_percent > 0 && (
              <span className="text-sm text-muted">
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