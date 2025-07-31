import { createClient } from '@supabase/supabase-js';
import { getSupplementImage, enhanceSupplementsWithImages } from '../utils/supplementImages';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Supplement {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  price?: number;
  price_aed?: number;
  image_url?: string;
  tier?: 'green' | 'yellow' | 'orange' | 'red';
  benefits?: string[];
  dosage?: string;
  form_type?: string;
  form_image_url?: string;
  goal?: string;
  mechanism?: string;
  evidence_summary?: string;
  source_link?: string;
  nutritional_info?: string;
  stock_quantity?: number;
  is_available?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  subscription_discount_percent?: number;
  use_case?: string;
  evidence_rating?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplementStack {
  id: string;
  category: string;
  name: string;
  total_price: number;
  components: {
    supplement_id: string;
    name: string;
    dosage: string;
    timing: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string;
  supplement: Supplement;
  quantity: number;
}

export const supplementApi = {
  // Get personalized supplement recommendations
  async getPersonalizedRecommendations(userId?: string): Promise<Supplement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user && !userId) {
        // Return mock data for demo with local images
        return enhanceSupplementsWithImages([
          {
            id: 'mock-1',
            name: 'Vitamin D3',
            brand: 'Biowell',
            description: 'High-quality vitamin D3 for immune support',
            price_aed: 40.00,
            tier: 'green',
            image_url: getSupplementImage('Vitamin D3')
          },
          {
            id: 'mock-2',
            name: 'Omega-3 Fish Oil',
            brand: 'Biowell',
            description: 'Premium omega-3 for heart and brain health',
            price_aed: 65.00,
            tier: 'green',
            image_url: getSupplementImage('Omega-3 Fish Oil')
          }
        ]);
      }

      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('is_available', true)
        .eq('tier', 'green')
        .limit(10);

      if (error) throw error;
      return enhanceSupplementsWithImages(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  },

  // Create a new supplement stack
  async createSupplementStack(stackData: Omit<SupplementStack, 'id'>): Promise<SupplementStack | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Return mock data for demo
        return {
          id: 'mock-stack-1',
          ...stackData
        };
      }

      const { data, error } = await supabase
        .from('supplement_stacks')
        .insert([stackData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating supplement stack:', error);
      return null;
    }
  },

  // Add supplement to cart
  async addToCart(supplementId: string, quantity: number = 1): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // For demo mode, just return success
        return true;
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('supplement_id', supplementId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            supplement_id: supplementId,
            quantity
          }]);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  },

  // Get cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Return mock data for demo
        return [
          {
            id: '1',
            supplement: {
              id: 'supp-1',
              name: 'Vitamin D3',
              brand: 'Biowell',
              price_aed: 40.00,
              image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
              tier: 'green'
            },
            quantity: 2
          }
        ];
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id, quantity,
          supplement:supplement_id (id, name, brand, description, price_aed, image_url, tier)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  },

  // Get all supplements
  async getSupplements(): Promise<Supplement[]> {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching supplements:', error);
      return [];
    }
  },

  // Get supplement by ID
  async getSupplementById(id: string): Promise<Supplement | null> {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching supplement:', error);
      return null;
    }
  },

  // Get supplement stacks
  async getSupplementStacks(): Promise<SupplementStack[]> {
    try {
      const { data, error } = await supabase
        .from('supplement_stacks')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching supplement stacks:', error);
      return [];
    }
  }
};