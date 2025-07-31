import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Sparkles, Users, Shield, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { subscriptionPlans, formatPrice, calculateYearlySavings } from '../data/pricingData';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handlePlanSelect = (planId: string) => {
    // Handle plan selection - could navigate to signup or payment
    console.log('Selected plan:', planId);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Heart className="w-6 h-6" />;
      case 'plus': return <Zap className="w-6 h-6" />;
      case 'pro': return <Star className="w-6 h-6" />;
      case 'elite': return <Crown className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'plus': return 'from-blue-500 to-blue-600';
      case 'pro': return 'from-purple-500 to-purple-600';
      case 'elite': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-light text-gray-900 dark:text-gray-100 mb-6">
            Choose Your <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent font-medium">Wellness Journey</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Personalized health optimization plans designed to fit your lifestyle and goals. 
            From AI-powered coaching to premium human support.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                Save 17%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-xl ${
                plan.popular ? 'ring-2 ring-primary ring-opacity-50 scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${getPlanColor(plan.id)} text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.id)} rounded-2xl text-white mb-4 shadow-lg`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-light text-gray-900 dark:text-gray-100">
                    {formatPrice(billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    /month
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="line-through">{formatPrice(plan.price.monthly * 12)}</span>
                    <span className="text-green-600 dark:text-green-400 ml-2 font-medium">
                      Save {formatPrice(calculateYearlySavings(plan))}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handlePlanSelect(plan.id)}
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
  );
};

export default PricingPage;
