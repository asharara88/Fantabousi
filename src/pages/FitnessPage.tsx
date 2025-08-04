import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FitnessTracker from '../components/fitness/FitnessTracker';
import AIWorkoutGenerator from '../components/fitness/AIWorkoutGenerator';
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop';
import { GlassSection, GlassCard } from '../components/ui/GlassComponents';

const FitnessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <AdaptiveBackdrop animationSpeed="medium">
      <GlassSection padding="lg" background="gradient">
        <div className="mobile-container">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl font-bold text-text mb-2">Fitness Dashboard</h1>
            <p className="text-text-light">Comprehensive workout tracking and muscle group analysis</p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center mt-6">
              <GlassCard variant="strong" className="inline-flex p-1">
                <a
                  href="/fitness"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'dashboard' || !activeTab
                      ? 'glass-elevated text-text shadow-sm'
                      : 'text-text-light hover:text-text'
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/fitness?tab=history"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'glass-elevated text-text shadow-sm'
                      : 'text-text-light hover:text-text'
                  }`}
                >
                  History
                </a>
                <a
                  href="/fitness?tab=muscles"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'muscles'
                      ? 'glass-elevated text-text shadow-sm'
                      : 'text-text-light hover:text-text'
                  }`}
                >
                  Muscle Groups
                </a>
                <a
                  href="/fitness?tab=ai-generator"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'ai-generator'
                      ? 'glass-elevated text-text shadow-sm'
                      : 'text-text-light hover:text-text'
                  }`}
                >
                  AI Generator
                </a>
                <a
                  href="/fitness?tab=analytics"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'glass-elevated text-text shadow-sm'
                      : 'text-text-light hover:text-text'
                  }`}
                >
                  Analytics
                </a>
              </GlassCard>
            </div>
          </div>
          
          {activeTab === 'ai-generator' ? (
            <AIWorkoutGenerator />
          ) : (
            <FitnessTracker activeTab={activeTab} />
          )}
        </div>
      </GlassSection>
    </AdaptiveBackdrop>
  );
};

export default FitnessPage;