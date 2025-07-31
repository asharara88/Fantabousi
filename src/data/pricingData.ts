/**
 * Pricing Data and Subscription Plans for Biowell
 * 
 * Comprehensive pricing structure for supplements, coaching, and subscription plans
 */

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    savings?: number; // percentage saved with yearly
  };
  features: string[];
  popular?: boolean;
  cta: string;
  badge?: string;
}

export interface SupplementPricing {
  id: string;
  name: string;
  category: string;
  tier: 'basic' | 'premium' | 'elite';
  pricing: {
    retail: number;
    subscription: number;
    bulk?: {
      quantity: number;
      price: number;
      savings: number;
    }[];
  };
  unit: string; // "per bottle", "per serving", etc.
  servingsPerContainer?: number;
  pricePerServing?: number;
}

export interface CoachingPricing {
  id: string;
  name: string;
  type: 'ai' | 'human' | 'hybrid';
  duration: number; // in minutes
  price: number;
  description: string;
  features: string[];
}

// Subscription Plans
export const subscriptionPlans: PricingTier[] = [
  {
    id: 'free',
    name: 'Biowell Free',
    description: 'Essential health tracking and basic AI coaching',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      'Basic health metrics tracking',
      'Limited AI coach interactions (5/day)',
      'Community recipe access',
      'Basic supplement recommendations',
      'Health score tracking',
      'Mobile app access'
    ],
    cta: 'Get Started Free',
    badge: 'Most Popular'
  },
  {
    id: 'plus',
    name: 'Biowell Plus',
    description: 'Advanced AI coaching with personalized recommendations',
    price: {
      monthly: 19.99,
      yearly: 199.99,
      savings: 17
    },
    features: [
      'Everything in Free',
      'Unlimited AI coach conversations',
      'Personalized supplement stacks',
      'Advanced health analytics',
      'Custom meal planning',
      'Sleep & stress optimization',
      'Priority customer support',
      '10% off all supplements',
      'Bioclock™ circadian optimization',
      'Goal tracking & progress reports'
    ],
    popular: true,
    cta: 'Start Plus Trial',
    badge: 'Best Value'
  },
  {
    id: 'pro',
    name: 'Biowell Pro',
    description: 'Complete wellness platform with human coaching',
    price: {
      monthly: 49.99,
      yearly: 499.99,
      savings: 17
    },
    features: [
      'Everything in Plus',
      'Monthly 1-on-1 human coaching session',
      'Quarterly health assessments',
      'Lab result analysis & recommendations',
      'Custom supplement formulations',
      '20% off all supplements',
      'Family sharing (up to 4 members)',
      'Advanced biomarker tracking',
      'Personalized longevity protocols',
      'White-glove onboarding',
      'Direct coach messaging'
    ],
    cta: 'Upgrade to Pro',
    badge: 'Premium'
  },
  {
    id: 'elite',
    name: 'Biowell Elite',
    description: 'Ultimate personalized health optimization',
    price: {
      monthly: 149.99,
      yearly: 1499.99,
      savings: 17
    },
    features: [
      'Everything in Pro',
      'Weekly 1-on-1 coaching sessions',
      'Dedicated health optimization team',
      'Custom lab testing & analysis',
      'Precision supplement manufacturing',
      '30% off all supplements',
      'Family sharing (unlimited)',
      'Concierge health services',
      'Genomic analysis integration',
      'Hormone optimization protocols',
      '24/7 health support hotline',
      'Annual in-person health retreat'
    ],
    cta: 'Contact Sales',
    badge: 'Executive'
  }
];

// Supplement Pricing Database
export const supplementPricing: SupplementPricing[] = [
  // Basic Tier Supplements
  {
    id: 'vitamin-d3',
    name: 'Vitamin D3 + K2',
    category: 'Vitamins',
    tier: 'basic',
    pricing: {
      retail: 24.99,
      subscription: 19.99,
      bulk: [
        { quantity: 3, price: 18.99, savings: 24 },
        { quantity: 6, price: 17.99, savings: 28 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 60,
    pricePerServing: 0.33
  },
  {
    id: 'omega-3',
    name: 'Triple Strength Omega-3',
    category: 'Essential Fatty Acids',
    tier: 'basic',
    pricing: {
      retail: 34.99,
      subscription: 27.99,
      bulk: [
        { quantity: 3, price: 26.99, savings: 23 },
        { quantity: 6, price: 24.99, savings: 29 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 30,
    pricePerServing: 0.93
  },
  {
    id: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    category: 'Minerals',
    tier: 'basic',
    pricing: {
      retail: 29.99,
      subscription: 23.99,
      bulk: [
        { quantity: 3, price: 22.99, savings: 23 },
        { quantity: 6, price: 20.99, savings: 30 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 120,
    pricePerServing: 0.20
  },

  // Premium Tier Supplements
  {
    id: 'nad-precursor',
    name: 'NAD+ Precursor Complex',
    category: 'Longevity',
    tier: 'premium',
    pricing: {
      retail: 89.99,
      subscription: 71.99,
      bulk: [
        { quantity: 3, price: 67.99, savings: 24 },
        { quantity: 6, price: 62.99, savings: 30 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 30,
    pricePerServing: 2.40
  },
  {
    id: 'adaptogen-complex',
    name: 'Advanced Adaptogen Complex',
    category: 'Stress & Recovery',
    tier: 'premium',
    pricing: {
      retail: 54.99,
      subscription: 43.99,
      bulk: [
        { quantity: 3, price: 41.99, savings: 24 },
        { quantity: 6, price: 38.99, savings: 29 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 60,
    pricePerServing: 0.73
  },
  {
    id: 'cognitive-enhancer',
    name: 'Cognitive Performance Stack',
    category: 'Brain Health',
    tier: 'premium',
    pricing: {
      retail: 74.99,
      subscription: 59.99,
      bulk: [
        { quantity: 3, price: 56.99, savings: 24 },
        { quantity: 6, price: 52.99, savings: 29 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 30,
    pricePerServing: 2.00
  },

  // Elite Tier Supplements
  {
    id: 'longevity-formula',
    name: 'Ultimate Longevity Formula',
    category: 'Longevity',
    tier: 'elite',
    pricing: {
      retail: 149.99,
      subscription: 119.99,
      bulk: [
        { quantity: 3, price: 112.99, savings: 25 },
        { quantity: 6, price: 104.99, savings: 30 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 30,
    pricePerServing: 4.00
  },
  {
    id: 'peptide-complex',
    name: 'Bioactive Peptide Complex',
    category: 'Recovery & Performance',
    tier: 'elite',
    pricing: {
      retail: 199.99,
      subscription: 159.99,
      bulk: [
        { quantity: 3, price: 149.99, savings: 25 },
        { quantity: 6, price: 139.99, savings: 30 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 30,
    pricePerServing: 5.33
  },
  {
    id: 'mitochondrial-optimizer',
    name: 'Mitochondrial Optimizer Pro',
    category: 'Cellular Health',
    tier: 'elite',
    pricing: {
      retail: 124.99,
      subscription: 99.99,
      bulk: [
        { quantity: 3, price: 94.99, savings: 24 },
        { quantity: 6, price: 87.99, savings: 30 }
      ]
    },
    unit: 'per bottle',
    servingsPerContainer: 60,
    pricePerServing: 1.67
  }
];

// Coaching Services Pricing
export const coachingPricing: CoachingPricing[] = [
  {
    id: 'ai-quick-check',
    name: 'AI Quick Health Check',
    type: 'ai',
    duration: 10,
    price: 0,
    description: 'Quick AI-powered health assessment and recommendations',
    features: [
      'Instant health score',
      'Basic recommendations',
      'Progress tracking'
    ]
  },
  {
    id: 'ai-deep-dive',
    name: 'AI Deep Dive Consultation',
    type: 'ai',
    duration: 30,
    price: 19.99,
    description: 'Comprehensive AI analysis with detailed action plan',
    features: [
      'Complete health analysis',
      'Personalized action plan',
      'Supplement recommendations',
      'Lifestyle optimization'
    ]
  },
  {
    id: 'human-consultation',
    name: 'Human Coach Consultation',
    type: 'human',
    duration: 45,
    price: 89.99,
    description: 'One-on-one session with certified health coach',
    features: [
      'Personalized guidance',
      'Goal setting & tracking',
      'Accountability support',
      'Follow-up plan'
    ]
  },
  {
    id: 'hybrid-intensive',
    name: 'Hybrid Intensive Session',
    type: 'hybrid',
    duration: 60,
    price: 149.99,
    description: 'AI analysis + human coach interpretation and planning',
    features: [
      'AI data analysis',
      'Human coach interpretation',
      'Comprehensive action plan',
      '30-day follow-up support'
    ]
  }
];

// Subscription Discounts by Plan
export const subscriptionDiscounts = {
  free: 0,
  plus: 10,
  pro: 20,
  elite: 30
};

// Helper Functions
export const calculateSupplementPrice = (
  supplement: SupplementPricing,
  subscription: boolean = false,
  quantity: number = 1,
  userPlan: keyof typeof subscriptionDiscounts = 'free'
): number => {
  let basePrice = subscription ? supplement.pricing.subscription : supplement.pricing.retail;
  
  // Apply bulk pricing if available
  if (quantity > 1 && supplement.pricing.bulk) {
    const bulkTier = supplement.pricing.bulk
      .filter(bulk => quantity >= bulk.quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];
    
    if (bulkTier) {
      basePrice = bulkTier.price;
    }
  }
  
  // Apply subscription plan discount
  const planDiscount = subscriptionDiscounts[userPlan];
  const finalPrice = basePrice * (1 - planDiscount / 100);
  
  return Math.round(finalPrice * 100) / 100;
};

export const calculateYearlySavings = (plan: PricingTier): number => {
  const monthlyTotal = plan.price.monthly * 12;
  const savings = monthlyTotal - plan.price.yearly;
  return Math.round(savings * 100) / 100;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Stack Bundles (Popular Combinations)
export const stackBundles = [
  {
    id: 'essential-stack',
    name: 'Essential Wellness Stack',
    description: 'Perfect starter combination for overall health',
    supplements: ['vitamin-d3', 'omega-3', 'magnesium-glycinate'],
    originalPrice: 89.97,
    bundlePrice: 69.99,
    savings: 22
  },
  {
    id: 'performance-stack',
    name: 'Peak Performance Stack',
    description: 'Optimize energy, focus, and recovery',
    supplements: ['nad-precursor', 'cognitive-enhancer', 'adaptogen-complex'],
    originalPrice: 219.97,
    bundlePrice: 179.99,
    savings: 18
  },
  {
    id: 'longevity-stack',
    name: 'Ultimate Longevity Stack',
    description: 'Comprehensive anti-aging and cellular health',
    supplements: ['longevity-formula', 'mitochondrial-optimizer', 'peptide-complex'],
    originalPrice: 474.97,
    bundlePrice: 399.99,
    savings: 16
  }
];

export default {
  subscriptionPlans,
  supplementPricing,
  coachingPricing,
  subscriptionDiscounts,
  stackBundles,
  calculateSupplementPrice,
  calculateYearlySavings,
  formatPrice
};
