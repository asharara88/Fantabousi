import React from 'react';

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Welcome to BIOWELL!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Let's set up your personalized health profile
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <p className="text-gray-600 dark:text-gray-400">
              Onboarding flow coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;