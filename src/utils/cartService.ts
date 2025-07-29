import { createClient } from '@supabase/supabase-js';
import { getAllSupplements } from './supplementData';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CartItem {
  id: string;
  supplement_id: string;
  name: string;
  brand?: string;
  price_aed: number;
  quantity: number;
  image_url?: string;
  subscription?: boolean;
  subscription_discount?: number;
  user_id?: string;
}

class CartService {
  private static instance: CartService;
  private cartChangeListeners: ((items: CartItem[]) => void)[] = [];
  private cartCount = 0;
  private cartCountListeners: ((count: number) => void)[] = [];

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  // Subscribe to cart changes
  onCartChange(callback: (items: CartItem[]) => void) {
    this.cartChangeListeners.push(callback);
    return () => {
      this.cartChangeListeners = this.cartChangeListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to cart count changes
  onCartCountChange(callback: (count: number) => void) {
    this.cartCountListeners.push(callback);
    return () => {
      this.cartCountListeners = this.cartCountListeners.filter(cb => cb !== callback);
    };
  }

  private notifyCartChange(items: CartItem[]) {
    this.cartChangeListeners.forEach(callback => callback(items));
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalCount !== this.cartCount) {
      this.cartCount = totalCount;
      this.cartCountListeners.forEach(callback => callback(totalCount));
    }
  }

  // Get current user
  private async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Add item to cart
  async addToCart(supplementId: string, quantity: number = 1): Promise<boolean> {
    try {
      const userId = await this.getCurrentUser();
      const supplements = getAllSupplements();
      const supplement = supplements.find(s => s.id === supplementId);
      
      if (!supplement) {
        throw new Error('Supplement not found');
      }

      if (userId) {
        // User is authenticated - use database
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId)
          .eq('supplement_id', supplementId)
          .single();

        if (existingItem) {
          // Update quantity
          await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({
              user_id: userId,
              supplement_id: supplementId,
              quantity: quantity,
              subscription: false
            });
        }
      } else {
        // User not authenticated - use localStorage
        const stored = localStorage.getItem('biowell_cart');
        const cartItems: CartItem[] = stored ? JSON.parse(stored) : [];
        
        const existingItemIndex = cartItems.findIndex(item => item.supplement_id === supplementId);
        
        if (existingItemIndex >= 0) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          const newItem: CartItem = {
            id: `local-${Date.now()}-${Math.random()}`,
            supplement_id: supplementId,
            name: supplement.name,
            brand: supplement.brand,
            price_aed: supplement.price_aed,
            quantity: quantity,
            image_url: supplement.image_url,
            subscription: false,
            subscription_discount: supplement.subscription_discount_percent
          };
          cartItems.push(newItem);
        }
        
        localStorage.setItem('biowell_cart', JSON.stringify(cartItems));
      }

      // Refresh cart and notify listeners
      const updatedItems = await this.getCartItems();
      this.notifyCartChange(updatedItems);
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  // Get cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const userId = await this.getCurrentUser();
      
      if (userId) {
        // User is authenticated - get from database
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;

        // Enrich with supplement details
        const supplements = getAllSupplements();
        const enrichedItems = data?.map(item => {
          const supplement = supplements.find(s => s.id === item.supplement_id);
          return {
            ...item,
            name: supplement?.name || 'Unknown Supplement',
            brand: supplement?.brand,
            price_aed: supplement?.price_aed || 0,
            image_url: supplement?.image_url,
            subscription_discount: supplement?.subscription_discount_percent
          };
        }) || [];

        return enrichedItems;
      } else {
        // User not authenticated - get from localStorage
        const stored = localStorage.getItem('biowell_cart');
        return stored ? JSON.parse(stored) : [];
      }
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  // Update cart item quantity
  async updateQuantity(itemId: string, newQuantity: number): Promise<boolean> {
    try {
      if (newQuantity < 1) {
        return this.removeItem(itemId);
      }

      const userId = await this.getCurrentUser();

      if (userId) {
        // Update in database
        await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', itemId);
      } else {
        // Update in localStorage
        const stored = localStorage.getItem('biowell_cart');
        const cartItems: CartItem[] = stored ? JSON.parse(stored) : [];
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        
        if (itemIndex >= 0) {
          cartItems[itemIndex].quantity = newQuantity;
          localStorage.setItem('biowell_cart', JSON.stringify(cartItems));
        }
      }

      const updatedItems = await this.getCartItems();
      this.notifyCartChange(updatedItems);
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  // Remove item from cart
  async removeItem(itemId: string): Promise<boolean> {
    try {
      const userId = await this.getCurrentUser();

      if (userId) {
        // Remove from database
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
      } else {
        // Remove from localStorage
        const stored = localStorage.getItem('biowell_cart');
        const cartItems: CartItem[] = stored ? JSON.parse(stored) : [];
        const filteredItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('biowell_cart', JSON.stringify(filteredItems));
      }

      const updatedItems = await this.getCartItems();
      this.notifyCartChange(updatedItems);
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  }

  // Toggle subscription for item
  async toggleSubscription(itemId: string): Promise<boolean> {
    try {
      const userId = await this.getCurrentUser();
      
      if (userId) {
        // Get current item
        const { data: item } = await supabase
          .from('cart_items')
          .select('subscription')
          .eq('id', itemId)
          .single();

        if (item) {
          await supabase
            .from('cart_items')
            .update({ subscription: !item.subscription })
            .eq('id', itemId);
        }
      } else {
        // Update in localStorage
        const stored = localStorage.getItem('biowell_cart');
        const cartItems: CartItem[] = stored ? JSON.parse(stored) : [];
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        
        if (itemIndex >= 0) {
          cartItems[itemIndex].subscription = !cartItems[itemIndex].subscription;
          localStorage.setItem('biowell_cart', JSON.stringify(cartItems));
        }
      }

      const updatedItems = await this.getCartItems();
      this.notifyCartChange(updatedItems);
      return true;
    } catch (error) {
      console.error('Error toggling subscription:', error);
      return false;
    }
  }

  // Clear entire cart
  async clearCart(): Promise<boolean> {
    try {
      const userId = await this.getCurrentUser();

      if (userId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
      } else {
        localStorage.removeItem('biowell_cart');
      }

      this.notifyCartChange([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Get cart count
  async getCartCount(): Promise<number> {
    const items = await this.getCartItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Initialize cart count on app load
  async initializeCartCount() {
    const count = await this.getCartCount();
    this.cartCount = count;
    this.cartCountListeners.forEach(callback => callback(count));
  }
}

export const cartService = CartService.getInstance();
export default cartService;
