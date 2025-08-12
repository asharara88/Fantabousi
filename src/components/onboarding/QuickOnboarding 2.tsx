import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  fitnessGoals: string[];
  dietaryRestrictions: string[];
  healthConditions: string[];
}

interface QuickOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

const QuickOnboarding: React.FC<QuickOnboardingProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    age: '',
    activityLevel: 'moderate',
    primaryGoals: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' }
  ];

  const healthGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Better Sleep',
    'More Energy',
    'Stress Management',
    'General Wellness'
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age between 13 and 120';
    }

    if (formData.primaryGoals.length === 0) {
      newErrors.primaryGoals = 'Please select at least one health goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        ...formData,
        age: parseInt(formData.age)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Start Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Just the essentials to get you started
          </p>
        </motion.div>

        <Card className="p-8">
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age *
                  </label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter your age"
                    min="13"
                    max="120"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activity Level
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activityLevels.map((level) => (
                  <motion.div
                    key={level.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label className="cursor-pointer">
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
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Health Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Primary Health Goals *
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                      </div>
                    </label>
                  </motion.div>
                ))}
              </div>
              
              {errors.primaryGoals && (
                <p className="text-red-500 text-sm">{errors.primaryGoals}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Complete Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuickOnboarding;
