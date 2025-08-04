import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Zap, 
  Brain,
  Star,
  CheckCircle,
  ArrowRight,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { 
  GlassCard, 
  GlassButton, 
  GlassInput, 
  GlassPanel, 
  GlassModal,
  GlassNav,
  GlassSection,
  GlassFeatureCard 
} from './GlassComponents';
import AdaptiveBackdrop from './AdaptiveBackdrop';
import ThemeToggle from './ThemeToggle';

const GlassmorphismShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: 'Enhanced Design',
      description: 'Beautiful glassmorphism effects with backdrop blur and subtle transparency.',
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: 'Premium Feel',
      description: 'Sophisticated visual hierarchy with depth and layering.',
    },
    {
      icon: <Zap className="w-8 h-8 text-tertiary" />,
      title: 'Interactive',
      description: 'Smooth animations and hover effects for enhanced UX.',
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: 'Accessible',
      description: 'Maintains readability while providing stunning visuals.',
    },
  ];

  return (
    <AdaptiveBackdrop animationSpeed="slow" overlay={true}>
      <div className="min-h-screen">
        {/* Fixed Theme Toggle */}
        <aside className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </aside>

        {/* Glass Navigation */}
        <GlassNav className="px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Glassmorphism
            </div>
            <div className="flex items-center space-x-4">
              <GlassButton variant="default" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </GlassButton>
              <GlassButton variant="primary" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </GlassButton>
            </div>
          </div>
        </GlassNav>

        {/* Hero Section */}
        <GlassSection background="gradient" padding="xl">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary"
            >
              Glassmorphism Design System
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-light max-w-3xl mx-auto mb-12"
            >
              Experience the future of UI design with our comprehensive glassmorphism component library.
              Beautiful, accessible, and performant.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
              >
                Open Modal Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                View Components
              </GlassButton>
            </motion.div>

            {/* Search Input Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-md mx-auto"
            >
              <GlassInput
                placeholder="Search components..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                variant="glass"
                className="text-center"
              />
            </motion.div>
          </div>
        </GlassSection>

        {/* Component Showcase */}
        <GlassSection background="pattern" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <GlassFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient="from-primary/20 to-secondary/20"
              />
            ))}
          </div>
        </GlassSection>

        {/* Card Variants Showcase */}
        <GlassSection padding="lg">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-text">
              Glass Card Variants
            </h2>
            <p className="text-text-light text-lg">
              Choose the perfect glass effect for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Default Glass Card */}
            <GlassCard variant="default" className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-text">Default Glass</h3>
              <p className="text-text-light mb-4">
                Standard glass effect with balanced transparency and blur.
              </p>
              <div className="flex items-center text-sm text-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Perfect for content cards
              </div>
            </GlassCard>

            {/* Subtle Glass Card */}
            <GlassCard variant="subtle" className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-text">Subtle Glass</h3>
              <p className="text-text-light mb-4">
                Gentle glass effect for background elements and overlays.
              </p>
              <div className="flex items-center text-sm text-secondary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Great for backgrounds
              </div>
            </GlassCard>

            {/* Strong Glass Card */}
            <GlassCard variant="strong" className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-text">Strong Glass</h3>
              <p className="text-text-light mb-4">
                Bold glass effect with enhanced shadows and highlights.
              </p>
              <div className="flex items-center text-sm text-tertiary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Ideal for focal points
              </div>
            </GlassCard>

            {/* Frosted Glass Card */}
            <GlassCard variant="frosted" className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-text">Frosted Glass</h3>
              <p className="text-text-light mb-4">
                Heavy frosted effect with enhanced saturation and blur.
              </p>
              <div className="flex items-center text-sm text-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Premium feel
              </div>
            </GlassCard>

            {/* Elevated Glass Card */}
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-text">Elevated Glass</h3>
              <p className="text-text-light mb-4">
                Floating glass effect with enhanced shadows and brightness.
              </p>
              <div className="flex items-center text-sm text-secondary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Stands out beautifully
              </div>
            </GlassCard>

            {/* Interactive Glass Card */}
            <GlassCard variant="default" interactive={true} className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-text">Interactive Glass</h3>
              <p className="text-text-light mb-4">
                Hover and click for smooth animations and transitions.
              </p>
              <div className="flex items-center text-sm text-tertiary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Try hovering!
              </div>
            </GlassCard>
          </div>
        </GlassSection>

        {/* Button Showcase */}
        <GlassSection background="gradient" padding="lg">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-text">
              Glass Button Styles
            </h2>
            <p className="text-text-light text-lg">
              Interactive glass buttons with hover effects
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <GlassButton variant="default" size="sm">Small Default</GlassButton>
            <GlassButton variant="primary" size="sm">Small Primary</GlassButton>
            <GlassButton variant="secondary" size="sm">Small Secondary</GlassButton>
            
            <GlassButton variant="default" size="md">Medium Default</GlassButton>
            <GlassButton variant="primary" size="md">Medium Primary</GlassButton>
            <GlassButton variant="secondary" size="md">Medium Secondary</GlassButton>
            
            <GlassButton variant="default" size="lg">Large Default</GlassButton>
            <GlassButton variant="primary" size="lg">Large Primary</GlassButton>
            <GlassButton variant="secondary" size="lg">Large Secondary</GlassButton>
          </div>
        </GlassSection>

        {/* Panel Showcase */}
        <GlassSection padding="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassPanel
              title="Information Panel"
              subtitle="Glass panel with header and content"
              className="h-fit"
            >
              <p className="text-text-light mb-4">
                Glass panels are perfect for organizing related content with a subtle glass background.
                They provide visual separation while maintaining design cohesion.
              </p>
              <div className="space-y-2">
                {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-primary mr-2" />
                    <span className="text-text-light">{feature}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel
              title="Settings Panel"
              subtitle="Configuration and options"
            >
              <div className="space-y-4">
                <GlassInput
                  label="Name"
                  placeholder="Enter your name"
                  variant="glass"
                />
                <GlassInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  variant="glass"
                />
                <div className="flex gap-2">
                  <GlassButton variant="primary" size="sm" className="flex-1">
                    Save
                  </GlassButton>
                  <GlassButton variant="default" size="sm" className="flex-1">
                    Cancel
                  </GlassButton>
                </div>
              </div>
            </GlassPanel>
          </div>
        </GlassSection>

        {/* Glass Modal */}
        <GlassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Glassmorphism Modal"
        >
          <div className="space-y-4">
            <p className="text-text-light">
              This is a beautiful glass modal with backdrop blur and enhanced visual effects.
              Perfect for important dialogs and confirmations.
            </p>
            <GlassInput
              placeholder="Enter some text..."
              variant="glass"
            />
            <div className="flex gap-3 pt-4">
              <GlassButton
                variant="primary"
                size="md"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Confirm
              </GlassButton>
              <GlassButton
                variant="default"
                size="md"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      </div>
    </AdaptiveBackdrop>
  );
};

export default GlassmorphismShowcase;
