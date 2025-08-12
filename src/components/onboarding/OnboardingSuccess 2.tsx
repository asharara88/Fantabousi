import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight, Target, Heart, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface OnboardingSuccessProps {
  userData: {
    firstName: string;
    primaryGoals: string[];
    activityLevel: string;
  } | null;
  onGetStarted: () => void;
}

const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({ userData, onGetStarted }) => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Personalized Recommendations',
      description: 'AI-powered supplement and nutrition suggestions based on your goals'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health Tracking',
      description: 'Monitor your progress with comprehensive wellness metrics'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smart Insights',
      description: 'Get actionable insights to optimize your health journey'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-8"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to BioWell{userData?.firstName ? `, ${userData.firstName}` : ''}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Your personalized wellness journey starts now
            </p>
            
            {userData?.primaryGoals && userData.primaryGoals.length > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  Focused on: {userData.primaryGoals.slice(0, 2).join(', ')}
                  {userData.primaryGoals.length > 2 && ` +${userData.primaryGoals.length - 2} more`}
                </span>
              </div>
            )}
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What's Next?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Your dashboard is ready with personalized recommendations, health tracking tools, and AI-powered insights.
              </p>
              <Button
                onClick={onGetStarted}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🎉 You're one step closer to achieving your health goals!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
