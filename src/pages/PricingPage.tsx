import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { AdaptiveBackdrop } from '../components/ui/AdaptiveBackdrop';
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

  const handleSignUp = (planType: string) => {
    // Handle free plan signup - redirect to registration
    window.location.href = '/auth/signup';
  };

  return (
    <AdaptiveBackdrop>
      <div className="container mx-auto px-4 py-16">
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
          <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
            Unlock personalized health insights with CGM integration, AI coaching, and supplement optimization
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-text' : 'text-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-primary rounded-full shadow-md"
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-text' : 'text-muted'}`}>
                Annual
              </span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                Save 15%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative backdrop-blur-xl border rounded-3xl p-8 ${
                plan.name === 'Premium' 
                  ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 ring-2 ring-primary/20' 
                  : 'bg-white/10 border-white/20'
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
              {plan.teamSharing && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-500 font-medium">
                      Team Access: {plan.teamSharing.members} members
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">{plan.teamSharing.useCase}</p>
                </div>
              )}

              {/* CGM Integration Badge */}
              {plan.cgmAccess && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
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
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => window.open('mailto:sales@biowell.ai', '_blank')}
                  >
                    {plan.contactCTA}
                  </Button>
                ) : plan.priceAED === 0 ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handleSignUp('free')}
                    disabled={loading}
                  >
                    Get Started Free
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant={plan.name === 'Premium' ? 'primary' : 'outline'}
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
                    </Button>
                    
                    {plan.priceAED > 0 && (
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
            </motion.div>
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
    </AdaptiveBackdrop>
  );
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700' 
                    : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600'
                } text-white shadow-lg transition-all duration-300`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 text-center mb-8">
            What's Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                AI-Powered Coaching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI that learns your patterns and provides personalized recommendations 24/7
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Human Expertise
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Certified health coaches and nutritionists available for personalized guidance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Premium Supplements
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Third-party tested, scientifically-backed supplements with exclusive member discounts
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, you can cancel your subscription at any time with no cancellation fees. Your benefits continue until the end of your billing period.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your subscription fee.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Are supplements included in the price?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Subscription plans include discounts on supplements (10-30% off), but supplements are purchased separately based on your personalized recommendations.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                How does the AI coaching work?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our AI analyzes your health data, preferences, and goals to provide personalized recommendations. It learns from your responses and adapts over time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </AdaptiveBackdrop>
  );
};

export default PricingPage;
