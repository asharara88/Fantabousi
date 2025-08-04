import React from 'react';
import NutritionTracker from '../components/nutrition/NutritionTracker';
import AIFoodAnalyzer from '../components/nutrition/AIFoodAnalyzer';
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop';
import ThemeToggle from '../components/ui/ThemeToggle';
import { GlassSection, GlassCard, GlassButton } from '../components/ui/GlassComponents';

const NutritionPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('tracker');

  return (
    <AdaptiveBackdrop animationSpeed="medium" overlay={true}>
      <ThemeToggle />
      <GlassSection padding="lg" background="gradient">
        <div className="mobile-container">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-text">Nutrition</h1>
            <p className="text-text-light">Track your meals and monitor your nutrition</p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center mt-6">
              <GlassCard variant="strong" className="inline-flex p-1">
                <GlassButton
                  onClick={() => setActiveTab('tracker')}
                  variant={activeTab === 'tracker' ? 'primary' : 'default'}
                  size="sm"
                  className="text-sm font-medium"
                >
                  Manual Tracker
                </GlassButton>
                <GlassButton
                  onClick={() => setActiveTab('ai-analyzer')}
                  variant={activeTab === 'ai-analyzer' ? 'primary' : 'default'}
                  size="sm"
                  className="text-sm font-medium"
                >
                  AI Food Analyzer
                </GlassButton>
              </GlassCard>
            </div>
          </div>
        </div>
        
        {activeTab === 'ai-analyzer' ? (
          <AIFoodAnalyzer />
        ) : (
          <NutritionTracker />
        )}
      </GlassSection>
    </AdaptiveBackdrop>
  );
};

export default NutritionPage;