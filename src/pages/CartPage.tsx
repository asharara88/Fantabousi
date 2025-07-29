import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  ArrowRight,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { createClient } from '@supabase/supabase-js';
import { getAllSupplements } from '../utils/supplementData';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CartItem {
  id: string;
  supplement_id: string;
  name: string;
  brand?: string;
  price_aed: number;
  quantity: number;
  image_url?: string;
  subscription?: boolean;
  subscription_discount?: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error getting current user:', error);
        setCurrentUserId(null);
      }
    };
    
    getCurrentUser();
  }, []);

  // Load cart items
  useEffect(() => {
    if (currentUserId) {
      loadCartItems();
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalCartItems();
    }
  }, [currentUserId]);

  const loadCartItems = async () => {
    if (!currentUserId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', currentUserId);

      if (error) throw error;

      // Get supplement details
      const supplements = getAllSupplements();
      const enrichedItems = data?.map(item => {
        const supplement = supplements.find(s => s.id === item.supplement_id);
        return {
          ...item,
          name: supplement?.name || 'Unknown Supplement',
          brand: supplement?.brand,
          price_aed: supplement?.price_aed || 0,
          image_url: supplement?.image_url
        };
      }) || [];

      setCartItems(enrichedItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      // Fallback to demo data
      setCartItems(getDemoCartItems());
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalCartItems = () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('biowell_cart');
      if (stored) {
        const items = JSON.parse(stored);
        setCartItems(items);
      } else {
        setCartItems(getDemoCartItems());
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
      setCartItems(getDemoCartItems());
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoCartItems = (): CartItem[] => [
    {
      id: 'demo-1',
      supplement_id: 'omega-3',
      name: 'Omega-3 Fish Oil',
      brand: 'Premium Health',
      price_aed: 89.99,
      quantity: 2,
      subscription: true,
      subscription_discount: 15
    },
    {
      id: 'demo-2',
      supplement_id: 'vitamin-d3',
      name: 'Vitamin D3 5000 IU',
      brand: 'Pure Essentials',
      price_aed: 45.50,
      quantity: 1,
      subscription: false
    },
    {
      id: 'demo-3',
      supplement_id: 'magnesium',
      name: 'Magnesium Glycinate',
      brand: 'Natural Plus',
      price_aed: 67.25,
      quantity: 1,
      subscription: true,
      subscription_discount: 10
    }
  ];

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // Update in database or localStorage
    if (currentUserId) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', itemId);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      localStorage.setItem('biowell_cart', JSON.stringify(updatedItems));
    }
  };

  const removeItem = async (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);

    // Remove from database or localStorage
    if (currentUserId) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    } else {
      localStorage.setItem('biowell_cart', JSON.stringify(updatedItems));
    }
  };

  const toggleSubscription = async (itemId: string) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, subscription: !item.subscription } : item
    );
    setCartItems(updatedItems);

    // Update in storage
    if (currentUserId) {
      const item = updatedItems.find(i => i.id === itemId);
      try {
        await supabase
          .from('cart_items')
          .update({ subscription: item?.subscription })
          .eq('id', itemId);
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    } else {
      localStorage.setItem('biowell_cart', JSON.stringify(updatedItems));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.subscription && item.subscription_discount
        ? item.price_aed * (1 - item.subscription_discount / 100)
        : item.price_aed;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((savings, item) => {
      if (item.subscription && item.subscription_discount) {
        const discount = item.price_aed * (item.subscription_discount / 100);
        return savings + (discount * item.quantity);
      }
      return savings;
    }, 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowCheckoutSuccess(true);
    setIsProcessing(false);
    
    // Clear cart after successful checkout
    setTimeout(() => {
      setCartItems([]);
      if (currentUserId) {
        supabase.from('cart_items').delete().eq('user_id', currentUserId);
      } else {
        localStorage.removeItem('biowell_cart');
      }
    }, 3000);
  };

  const subtotal = calculateSubtotal();
  const savings = calculateSavings();
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="mobile-container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="p-12 max-w-md mx-auto">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your cart is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Discover personalized supplements to optimize your health
              </p>
              <Button
                onClick={() => window.location.href = '/supplements'}
                className="gradient-primary text-white"
              >
                Browse Supplements
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          {item.brand && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              by {item.brand}
                            </p>
                          )}
                          
                          {/* Subscription Toggle */}
                          <div className="mt-2">
                            <button
                              onClick={() => toggleSubscription(item.id)}
                              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                item.subscription
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}
                            >
                              {item.subscription ? (
                                <>
                                  <CheckCircle className="w-3 h-3 inline mr-1" />
                                  Subscription ({item.subscription_discount}% off)
                                </>
                              ) : (
                                'Add Subscription'
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-1">
                            {item.subscription && item.subscription_discount ? (
                              <>
                                <p className="text-sm text-gray-500 line-through">
                                  {item.price_aed.toFixed(2)} AED
                                </p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                  {(item.price_aed * (1 - item.subscription_discount / 100)).toFixed(2)} AED
                                </p>
                              </>
                            ) : (
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {item.price_aed.toFixed(2)} AED
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="mt-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      {subtotal.toFixed(2)} AED
                    </span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Subscription Savings</span>
                      <span>-{savings.toFixed(2)} AED</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}>
                      {shipping === 0 ? 'Free' : `${shipping.toFixed(2)} AED`}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Free shipping on orders over 100 AED
                    </p>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {total.toFixed(2)} AED
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full gradient-primary text-white"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <AnimatePresence>
          {showCheckoutSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Order Confirmed!
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your supplements are on their way. You'll receive a confirmation email shortly.
                </p>
                
                <Button
                  onClick={() => setShowCheckoutSuccess(false)}
                  className="gradient-primary text-white"
                >
                  Continue Shopping
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;
