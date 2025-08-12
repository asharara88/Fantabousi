import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import cartService from '../../utils/cartService';

interface CartCounterProps {
  className?: string;
  showZero?: boolean;
}

const CartCounter: React.FC<CartCounterProps> = ({ 
  className = '',
  showZero = false
}) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initialize cart count
    cartService.initializeCartCount();

    // Subscribe to cart count changes
    const unsubscribe = cartService.onCartCountChange((newCount) => {
      if (newCount !== count) {
        setIsAnimating(true);
        setCount(newCount);
        setTimeout(() => setIsAnimating(false), 300);
      }
    });

    return unsubscribe;
  }, [count]);

  if (count === 0 && !showZero) {
    return (
      <ShoppingCart className={className} />
    );
  }

  return (
    <div className="relative">
      <ShoppingCart className={className} />
      <AnimatePresence>
        {(count > 0 || showZero) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isAnimating ? [1, 1.2, 1] : 1, 
              opacity: 1 
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: isAnimating ? 0.3 : 0.2,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg"
          >
            {count > 99 ? '99+' : count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartCounter;
