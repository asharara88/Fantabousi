/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Target
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import ModernLoader from './ModernLoader';
import QuickOnboarding from './QuickOnboarding';
import ComprehensiveOnboarding from './ComprehensiveOnboarding';
import OnboardingSuccess from './OnboardingSuccess';
import { cn } from '../../utils/cn';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type OnboardingType = 'selection' | 'quick' | 'comprehensive' | 'loading' | 'success';

interface OnboardingOption {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  recommended?: boolean;
}

const SeamlessOnboardingPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<OnboardingType>('selection');
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndOnboardingStatus();
  }, []);

  const checkAuthAndOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if user has already completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, first_name')
        .eq('id', user.id)
        .single();

      if (profile?.onboarding_completed) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const onboardingOptions: OnboardingOption[] = [
    {
      id: 'quick',
      title: 'Quick Start',
      description: 'Get started in just 2 minutes with essential information',
      duration: '2-3 minutes',
      icon: <Zap className="w-8 h-8" />,
      features: [
        'Basic profile setup',
        'Primary health goals', 
        'Activity level assessment',
        'Instant recommendations'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Setup',
      description: 'Complete profile for personalized recommendations',
      duration: '8-10 minutes',
      icon: <Target className="w-8 h-8" />,
      features: [
        'Detailed health assessment',
        'Lifestyle analysis',
        'Nutrition preferences',
        'Advanced AI recommendations',
        'Personalized supplement stacks',
        'Custom wellness plan'
      ],
      color: 'from-blue-500 to-purple-600',
      recommended: true
    }
  ];

  const handleOnboardingSelection = (optionId: string) => {
    setError(null);
    setCurrentView(optionId as OnboardingType);
  };

  const handleOnboardingComplete = async (formData: any) => {
    setCurrentView('loading');
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save profile data
      const profileData = {
        id: user.id,
        first_name: formData.firstName?.trim(),
        last_name: formData.lastName?.trim() || '',
        email: formData.email || user.email,
        age: formData.age || null,
        gender: formData.gender || null,
        height: formData.height || null,
        weight: formData.weight || null,
        activity_level: formData.activityLevel || null,
        primary_health_goals: Array.isArray(formData.primaryGoals) ? formData.primaryGoals : [],
        diet_preference: formData.dietPreference || null,
        sleep_hours: formData.sleepHours || null,
        allergies: formData.allergies ? [formData.allergies] : [],
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) throw profileError;

      // Store user data for success page
      setUserData({
        firstName: formData.firstName,
        primaryGoals: formData.primaryGoals || [],
        activityLevel: formData.activityLevel
      });

      // Show success page
      setTimeout(() => {
        setCurrentView('success');
      }, 2000);

    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setError('Failed to save your profile. Please try again.');
      setCurrentView('selection');
    }
  };

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const renderOnboardingSelection = () => (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-6"
          >
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to BioWell
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Let's create your personalized wellness journey. Choose how you'd like to get started.
          </p>
        </motion.div>

        {/* Onboarding Options */}
        <div className="grid max-w-4xl gap-8 mx-auto md:grid-cols-2">
          {onboardingOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {option.recommended && (
                <div className="absolute z-10 transform -translate-x-1/2 -top-3 left-1/2">
                  <span className="px-4 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Recommended
                  </span>
                </div>
              )}
              
              <Card 
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2",
                  option.recommended ? "border-blue-200 dark:border-blue-800" : "border-gray-200 dark:border-gray-700"
                )}
                onClick={() => handleOnboardingSelection(option.id)}
              >
                <div className="p-8">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl mb-6 text-white`}>
                    {option.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {option.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                  
                  {/* Duration */}
                  <div className="flex items-center mb-6 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{option.duration}</span>
                  </div>
                  
                  {/* Features */}
                  <ul className="mb-6 space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA */}
                  <Button 
                    className={cn(
                      "w-full",
                      option.recommended ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""
                    )}
                    onClick={() => handleOnboardingSelection(option.id)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Skip for now
          </Button>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'quick':
        return (
          <QuickOnboarding
            onComplete={handleOnboardingComplete}
            onBack={() => setCurrentView('selection')}
          />
        );

      case 'comprehensive':
        return (
          <ComprehensiveOnboarding
            onComplete={handleOnboardingComplete}
            onBack={() => setCurrentView('selection')}
          />
        );

      case 'loading':
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
            <div className="text-center">
              <ModernLoader size="lg" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Setting up your profile...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Creating your personalized health journey
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'success':
        return (
          <OnboardingSuccess
            userData={userData}
            onGetStarted={handleGetStarted}
          />
        );

      default:
        return renderOnboardingSelection();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default SeamlessOnboardingPage;
