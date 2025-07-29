/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  Activity, 
  Moon, 
  Utensils, 
  Pill, 
  Settings,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Target,
  Zap,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ConsolidatedOnboardingProps {
  onComplete?: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
    icon: User,
    fields: ['firstName', 'lastName', 'email', 'mobile', 'dateOfBirth', 'gender']
  },
  {
    id: 2,
    title: 'Health Goals',
    description: 'What are your primary health objectives?',
    icon: Heart,
    fields: ['primaryHealthGoals', 'healthConcerns', 'fitnessGoals']
  },
  {
    id: 3,
    title: 'Physical Profile',
    description: 'Help us understand your physical characteristics',
    icon: Activity,
    fields: ['height', 'weight', 'activityLevel', 'exerciseFrequency', 'exerciseTypes']
  },
  {
    id: 4,
    title: 'Lifestyle & Sleep',
    description: 'Your daily habits and sleep patterns',
    icon: Moon,
    fields: ['sleepHours', 'sleepQuality', 'stressLevel', 'workSchedule']
  },
  {
    id: 5,
    title: 'Nutrition & Diet',
    description: 'Your dietary preferences and restrictions',
    icon: Utensils,
    fields: ['dietType', 'allergies', 'dietaryRestrictions', 'mealPreferences']
  },
  {
    id: 6,
    title: 'Health History',
    description: 'Medical history and current medications',
    icon: Pill,
    fields: ['medicalConditions', 'currentMedications', 'supplements', 'doctorClearance']
  },
  {
    id: 7,
    title: 'Preferences',
    description: 'Customize your experience',
    icon: Settings,
    fields: ['notificationPreferences', 'dataSharing', 'privacySettings']
  }
];

const ConsolidatedOnboarding: React.FC<ConsolidatedOnboardingProps> = ({ 
  onComplete
}) => {
  const navigate = useNavigate();
  const { 
    updateProfile, 
    completeOnboarding, 
    setOnboardingStep 
  } = useUserProfileStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Check if user is already onboarded
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
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
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepConfig = ONBOARDING_STEPS.find(s => s.id === step);
    if (!stepConfig) return true;

    const newErrors: Record<string, string> = {};
    
    stepConfig.fields.forEach(field => {
      const value = formData[field];
      
      // Required field validation
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
      
      // Email validation
      if (field === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field] = 'Please enter a valid email address';
      }
      
      // Age validation
      if (field === 'age' && value && (isNaN(value) || value < 13 || value > 120)) {
        newErrors[field] = 'Please enter a valid age between 13 and 120';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setOnboardingStep(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setOnboardingStep(prevStep);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Update profile with all collected data
      await updateProfile(formData);
      
      // Complete onboarding
      await completeOnboarding(formData);
      
      setUserData(formData);
      setShowSuccess(true);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/dashboard');
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setErrors({ submit: 'Failed to complete onboarding. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Step {currentStep} of {ONBOARDING_STEPS.length}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    const step = ONBOARDING_STEPS.find(s => s.id === currentStep);
    if (!step) return null;

    const IconComponent = step.icon;

    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {step.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {step.fields.map(field => renderField(field))}
        </div>
      </motion.div>
    );
  };

  const renderField = (field: string) => {
    const value = formData[field] || '';
    const error = errors[field];

    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'email':
      case 'mobile':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor={field}>
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <Input
              id={field}
              type={field === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={error ? 'border-red-500' : ''}
              placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'dateOfBirth':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor={field}>
              Date of Birth
            </label>
            <Input
              id={field}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'gender':
        return (
          <div key={field}>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </legend>
              <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Other'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange(field, option.toLowerCase())}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    value === option.toLowerCase()
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            </fieldset>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'primaryHealthGoals':
      case 'fitnessGoals': {
        const goals = field === 'primaryHealthGoals' 
          ? ['Weight Loss', 'Weight Gain', 'Muscle Building', 'Improved Energy', 'Better Sleep', 'Stress Management', 'Disease Prevention', 'General Wellness']
          : ['Build Muscle', 'Lose Fat', 'Improve Endurance', 'Increase Strength', 'Better Flexibility', 'Sports Performance'];
        
        return (
          <div key={field} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {goals.map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => {
                    const currentGoals = formData[field] || [];
                    const goalExists = currentGoals.includes(goal);
                    const updatedGoals = goalExists
                      ? currentGoals.filter((g: string) => g !== goal)
                      : [...currentGoals, goal];
                    handleInputChange(field, updatedGoals);
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    (formData[field] || []).includes(goal)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );
      }

      case 'activityLevel': {
        const activityLevels = [
          { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
          { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
          { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
          { value: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' }
        ];
        
        return (
          <div key={field} className="md:col-span-2">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity Level
              </legend>
              <div className="grid grid-cols-2 gap-3">
              {activityLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInputChange(field, level.value)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    value === level.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm opacity-75">{level.description}</div>
                </button>
              ))}
            </div>
            </fieldset>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );
      }

      // Add more field types as needed
      default:
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <Input
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={error ? 'border-red-500' : ''}
              placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  const renderSuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-8"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Welcome to Biowell, {userData?.firstName}! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
      >
        Your personalized wellness journey is ready to begin. We've created a customized experience based on your goals and preferences.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-8 mb-12"
      >
        {[
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
        ].map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + Math.random() * 0.3 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Redirecting to your dashboard in a few seconds...
        </p>
        <Button
          onClick={() => {
            if (onComplete) {
              onComplete();
            } else {
              navigate('/dashboard');
            }
          }}
          className="inline-flex items-center px-8 py-3 text-lg"
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderSuccessScreen()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Biowell
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Let's personalize your wellness journey
            </p>
          </motion.div>
        </div>

        <Card className="max-w-4xl mx-auto p-8">
          {renderProgressBar()}
          
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {errors.submit && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === ONBOARDING_STEPS.length ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConsolidatedOnboarding;
