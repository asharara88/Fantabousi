const subscriptionPlans = [
  {
    name: "Free",
    priceAED: 0,
    billingOptions: {
      monthly: 0,
      annual: 0,
    },
    features: [
      "Connect smart scale and wearables",
      "Browse supplement marketplace (no discounts)",
      "General wellness tips from Smart Coach",
      "No CGM integration",
    ],
    cgmAccess: false,
    personalizedAdvice: false,
    discountEligible: false,
    teamSharing: false,
  },
  {
    name: "Essential",
    priceAED: 199,
    billingOptions: {
      monthly: 199,
      annual: 199 * 12 * 0.85, // 15% discount
    },
    features: [
      "All Free features",
      "Personalized Smart Coach advice",
      "Supplement recommendations",
      "Smart scale, wearables, and CGM integration",
      "Supplement discounts up to 10–15%",
    ],
    cgmAccess: true,
    personalizedAdvice: true,
    discountEligible: true,
    maxDiscount: 0.15,
    teamSharing: false,
  },
  {
    name: "Premium",
    priceAED: 299,
    billingOptions: {
      monthly: 299,
      annual: 299 * 12 * 0.85, // 15% discount
    },
    features: [
      "All Essential features",
      "Advanced biomarkers & recovery insights",
      "Habit Engine & goal-based stack optimization",
      "Supplement discounts up to 15–20%",
      "Partner Access: Add 1 partner for fertility or goal sync",
    ],
    cgmAccess: true,
    personalizedAdvice: true,
    discountEligible: true,
    maxDiscount: 0.20,
    teamSharing: {
      enabled: true,
      members: 2,
      partnerSync: true,
      useCase: "Couples syncing fertility, recovery, or shared goals",
    },
  },
  {
    name: "Enterprise",
    priceAED: null, // custom pricing
    billingOptions: {
      monthly: "Contact us",
      annual: "Contact us",
    },
    features: [
      "Custom packages for 3+ users or B2B partners",
      "Team dashboard & shared insights",
      "Corporate wellness reporting",
      "Dedicated account manager",
      "Volume-based supplement pricing",
    ],
    cgmAccess: true,
    personalizedAdvice: true,
    discountEligible: true,
    teamSharing: {
      enabled: true,
      members: "3+",
      partnerSync: true,
      useCase: "Teams, families, clinics, wellness providers",
    },
    contactCTA: "Speak to our Team",
    isEnterprise: true,
  }
];

export default subscriptionPlans;
