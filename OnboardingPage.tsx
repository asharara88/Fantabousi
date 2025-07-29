import React from 'react'
import EnhancedOnboardingForm from '../../components/onboarding/EnhancedOnboardingForm'

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Biowell
          </h1>
          <p className="text-lg text-gray-600">
            Let's personalize your wellness journey
          </p>
        </div>
        <EnhancedOnboardingForm />
      </div>
    </div>
  )
}

export default OnboardingPage