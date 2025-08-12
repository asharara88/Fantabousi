/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  primaryGoals: string[];
  dietPreference: string;
  sleepHours: string;
  allergies: string;
}

interface ComprehensiveOnboardingProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const ComprehensiveOnboarding: React.FC<ComprehensiveOnboardingProps> = ({ 
  onComplete, 
  onBack 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    primaryGoals: [],
    dietPreference: '',
    sleepHours: '',
    allergies: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    'Personal Info',
    'Physical Details',
    'Lifestyle',
    'Health Goals'
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Very heavy exercise 2x/day' }
  ];

  const dietPreferences = [
    'No Restrictions',
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'Gluten Free'
  ];

  const healthGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Better Sleep',
    'More Energy',
    'Stress Management',
    'General Wellness',
    'Heart Health',
    'Digestive Health',
    'Mental Clarity',
    'Athletic Performance'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Personal Info
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
          newErrors.age = 'Please enter a valid age between 13 and 120';
        }
        if (!formData.gender) newErrors.gender = 'Please select your gender';
        break;

      case 1: // Physical Details
        if (!formData.height || parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
          newErrors.height = 'Please enter a valid height in cm (100-250)';
        }
        if (!formData.weight || parseInt(formData.weight) < 30 || parseInt(formData.weight) > 300) {
          newErrors.weight = 'Please enter a valid weight in kg (30-300)';
        }
        break;

      case 2: // Lifestyle
        if (!formData.sleepHours || parseInt(formData.sleepHours) < 3 || parseInt(formData.sleepHours) > 15) {
          newErrors.sleepHours = 'Please enter valid sleep hours (3-15)';
        }
        break;

      case 3: // Health Goals
        if (formData.primaryGoals.length === 0) {
          newErrors.primaryGoals = 'Please select at least one health goal';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete({
          ...formData,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          sleepHours: parseInt(formData.sleepHours)
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name *
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age *
                </label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Physical Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Height (cm) *
                </label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Enter height in cm"
                  min="100"
                  max="250"
                  className={errors.height ? 'border-red-500' : ''}
                />
                {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (kg) *
                </label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter weight in kg"
                  min="30"
                  max="300"
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Activity Level
              </label>
              <div className="space-y-3">
                {activityLevels.map((level) => (
                  <label key={level.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level.value}
                      checked={formData.activityLevel === level.value}
                      onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      formData.activityLevel === level.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {level.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {level.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Lifestyle Information
            </h3>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Average Sleep Hours *
              </label>
              <Input
                type="number"
                value={formData.sleepHours}
                onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                placeholder="Hours of sleep per night"
                min="3"
                max="15"
                className={errors.sleepHours ? 'border-red-500' : ''}
              />
              {errors.sleepHours && <p className="mt-1 text-sm text-red-500">{errors.sleepHours}</p>}
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Diet Preference
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {dietPreferences.map((diet) => (
                  <label key={diet} className="cursor-pointer">
                    <input
                      type="radio"
                      name="dietPreference"
                      value={diet}
                      checked={formData.dietPreference === diet}
                      onChange={(e) => handleInputChange('dietPreference', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.dietPreference === diet
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                      <div className="text-sm font-medium">{diet}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Allergies or Dietary Restrictions
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="List any allergies or dietary restrictions..."
                rows={3}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Health Goals *
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select all that apply to create your personalized wellness plan
            </p>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {healthGoals.map((goal) => (
                <motion.div
                  key={goal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.primaryGoals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.primaryGoals.includes(goal)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                      <div className="text-sm font-medium">{goal}</div>
                      {formData.primaryGoals.includes(goal) && (
                        <Check className="w-4 h-4 mx-auto mt-1" />
                      )}
                    </div>
                  </label>
                </motion.div>
              ))}
            </div>
            
            {errors.primaryGoals && (
              <p className="text-sm text-red-500">{errors.primaryGoals}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Comprehensive Health Assessment
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 mb-8 bg-gray-200 rounded-full dark:bg-gray-700">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <Card className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 0 ? 'Back to Options' : 'Previous'}
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveOnboarding;
