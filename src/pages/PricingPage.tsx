import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop';
import { GlassSection, GlassCard, GlassButton } from '../components/ui/GlassComponents';
import { stripeService } from '../services/stripeService';
import { SUBSCRIPTION_PRICE_IDS } from '../lib/stripe';
import subscriptionPlans from '../data/subscriptionPlans';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleSubscriptionPurchase = async (plan: any, billingCycle: 'monthly' | 'annual') => {
    // Mock user data - in real app, get from auth context
    const user = { id: 'user_123', email: 'user@example.com' };
    
    if (!user) {
      alert('Please sign in to continue');
      return;
    }

    setLoading(true);
    setSelectedPlan(`${plan.name}-${billingCycle}`);

    try {
      // Get the Stripe price ID based on plan and billing cycle
      const priceKey = `${plan.name.toLowerCase()}_${billingCycle}` as keyof typeof SUBSCRIPTION_PRICE_IDS;
      const priceId = SUBSCRIPTION_PRICE_IDS[priceKey];

      if (!priceId) {
        throw new Error('Price ID not found for this plan');
      }

      // Create checkout session
      const session = await stripeService.createSubscriptionCheckout(
        priceId,
        user.id,
        user.email
      );

      // Redirect to Stripe checkout
      await stripeService.redirectToCheckout(session.sessionId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan('');
    }
  };

  const handleSignUp = () => {
    // Handle free plan signup - redirect to registration
    window.location.href = '/auth/signup';
  };

  return (
    <AdaptiveBackdrop>
      <GlassSection padding="xl" background="gradient">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-text mb-6">
              Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">Health Plan</span>
            </h1>
            <p className="text-xl text-text-light max-w-3xl mx-auto mb-8">
              Unlock personalized health insights with CGM integration, AI coaching, and supplement optimization
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-text' : 'text-text-light'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-16 h-8 glass-panel border border-white/30 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-primary rounded-full shadow-md"
                  animate={{ x: isAnnual ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isAnnual ? 'text-text' : 'text-text-light'}`}>
                  Annual
                </span>
                <span className="glass-panel bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  Save 15%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {subscriptionPlans.map((plan) => (
              <GlassCard
                key={plan.name}
                variant={plan.name === 'Premium' ? 'elevated' : 'default'}
                interactive={true}
                className={`relative p-8 ${
                  plan.name === 'Premium' 
                    ? 'ring-2 ring-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10' 
                    : ''
                }`}
              >
              {plan.name === 'Premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                
                {plan.priceAED === null ? (
                  <div className="text-4xl font-bold text-text">Custom</div>
                ) : plan.priceAED === 0 ? (
                  <div className="text-4xl font-bold text-text">Free</div>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-text">
                      AED {isAnnual 
                        ? Math.round(plan.billingOptions.annual / 12)
                        : plan.billingOptions.monthly
                      }
                      <span className="text-lg text-muted">/month</span>
                    </div>
                    {isAnnual && plan.priceAED > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Save AED {(plan.billingOptions.monthly * 12) - plan.billingOptions.annual} annually
                      </div>
                    )}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Team Sharing Badge */}
              {plan.teamSharing && typeof plan.teamSharing === 'object' && 'members' in plan.teamSharing && (
                <div className="mb-4 p-3 glass-panel bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-500 font-medium">
                      Team Access: {plan.teamSharing.members} members
                    </span>
                  </div>
                  <p className="text-xs text-text-light mt-1">{plan.teamSharing.useCase}</p>
                </div>
              )}

              {/* CGM Integration Badge */}
              {plan.cgmAccess && (
                <div className="mb-4 p-3 glass-panel bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <HeartIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">
                      CGM Integration Included
                    </span>
                  </div>
                </div>
              )}

              {/* CTA Button with Stripe Integration */}
              <div className="mt-8">
                {plan.isEnterprise ? (
                  <GlassButton
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => window.open('mailto:sales@biowell.ai', '_blank')}
                  >
                    {plan.contactCTA}
                  </GlassButton>
                ) : plan.priceAED === 0 ? (
                  <GlassButton
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => handleSignUp()}
                    disabled={loading}
                  >
                    Get Started Free
                  </GlassButton>
                ) : (
                  <div className="space-y-3">
                    <GlassButton
                      variant={plan.name === 'Premium' ? 'primary' : 'default'}
                      size="lg"
                      className="w-full"
                      onClick={() => handleSubscriptionPurchase(plan, 'monthly')}
                      disabled={loading}
                    >
                      {loading && selectedPlan === `${plan.name}-monthly` ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        `Start ${plan.name} Plan`
                      )}
                    </GlassButton>
                    
                    {plan.priceAED && plan.priceAED > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-sm"
                        onClick={() => handleSubscriptionPurchase(plan, 'annual')}
                        disabled={loading}
                      >
                        {loading && selectedPlan === `${plan.name}-annual` ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Choose Annual (Save 15%)'
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              </GlassCard>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-text mb-4">
              All Plans Include
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-text">Security & Privacy</h4>
                <p className="text-sm text-muted">End-to-end encryption, HIPAA compliance, secure data storage</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-text">Mobile Apps</h4>
                <p className="text-sm text-muted">iOS and Android apps with offline sync capabilities</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-text">24/7 Support</h4>
                <p className="text-sm text-muted">Expert health coaching support via chat and email</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center text-text mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
              },
              {
                q: "What's included in the CGM integration?",
                a: "Real-time glucose monitoring, personalized nutrition insights, and AI-powered recommendations based on your glucose responses."
              },
              {
                q: "How does partner access work?",
                a: "Premium plans allow you to add one partner for shared goals, fertility tracking, and coordinated health insights."
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all paid plans come with a 7-day free trial. Cancel anytime during the trial for no charge."
              }
            ].map((faq, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6">
                <h4 className="font-semibold text-text mb-2">{faq.q}</h4>
                <p className="text-sm text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
        </div>
      </GlassSection>
    </AdaptiveBackdrop>
  );
};

export default PricingPage;