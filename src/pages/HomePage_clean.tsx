import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Shield, Zap, Brain, CheckCircle, ChevronDown, ChevronUp, Star } from 'lucide-react'
import EvidenceBasedHealthOptimization from '../components/health/EvidenceBasedHealthOptimization'
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop'
import ThemeToggle from '../components/ui/ThemeToggle'
import LiveTimeDisplay from '../components/ui/LiveTimeDisplay'
import { GlassCard, GlassButton, GlassSection, GlassFeatureCard } from '../components/ui/GlassComponents'
import { motion } from 'framer-motion'

// Features data
const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);

  const features = [
    {
      icon: <Heart className="w-10 h-10 text-primary" />,
      title: 'Personalized Health',
      description: 'AI-powered insights tailored to your unique health profile, genetic data, and lifestyle patterns for precision wellness.',
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      icon: <Shield className="w-10 h-10 text-secondary" />,
      title: 'Evidence-Based',
      description: 'Every recommendation backed by peer-reviewed research and validated through our comprehensive health database.',
      gradient: 'from-secondary-500 to-tertiary-500'
    },
    {
      icon: <Zap className="w-10 h-10 text-tertiary" />,
      title: 'Real-Time Optimization',
      description: 'Continuous monitoring and instant adjustments to your health protocol based on biomarker feedback.',
      gradient: 'from-tertiary-500 to-primary-500'
    },
    {
      icon: <Brain className="w-10 h-10 text-primary" />,
      title: 'Cognitive Enhancement',
      description: 'Optimize mental performance with targeted nootropics, sleep optimization, and stress management protocols.',
      gradient: 'from-primary-500 to-purple-500'
    }
  ];

  return (
    <AdaptiveBackdrop animationSpeed="slow" overlay={true}>
      <div className="relative min-h-screen">
        {/* Fixed Elements - Complementary landmark for utility controls */}
        <aside role="complementary" aria-label="Page controls" className="fixed z-50 top-6 right-6">
          <ThemeToggle />
        </aside>

        {/* Hero Section with Enhanced Design */}
        <section role="banner" className="relative pt-16 pb-24 overflow-hidden sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
          <div className="relative z-10 mobile-container">
            <motion.div 
              className="max-w-5xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 mb-8 space-x-2 rounded-full surface-glass"
              >
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium gradient-text">Welcome to Biowell</span>
              </motion.div>

              <h1 className="mb-8 text-5xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="text-text">Your Personal </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                  AI Health Coach
                </span>
              </h1>

              <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed tracking-wide sm:text-2xl text-text-light">
                Transform your health with personalized, evidence-based recommendations powered by cutting-edge AI and biometric analysis.
              </p>

              <motion.div 
                className="flex flex-col justify-center gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 text-lg"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GlassButton>
                <GlassButton
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 text-lg"
                >
                  Learn More
                </GlassButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid Section */}
        <GlassSection 
          background="gradient" 
          padding="xl"
          className="border-t border-white/20 dark:border-gray-700/30"
        >
          <motion.div 
            className="mb-16 text-center sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 mb-6 space-x-2 rounded-full surface-glass"
            >
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium gradient-text">Premium Features</span>
            </motion.div>

            <h2 id="features-heading" className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl sm:mb-8 text-balance">
              <span className="text-text">Why Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                Biowell?
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed tracking-wide sm:text-2xl text-text-light text-balance">
              Experience the future of personalized wellness with AI-powered insights
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <GlassFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={`from-${feature.gradient.split('-')[1]}-500/20 to-${feature.gradient.split('-')[3]}-500/20`}
                className="h-full"
              />
            ))}
          </motion.div>
        </GlassSection>

        {/* Evidence-Based Health Section */}
        <GlassSection background="pattern" padding="xl">
          <EvidenceBasedHealthOptimization />
        </GlassSection>

        {/* Call to Action Section */}
        <section role="region" aria-labelledby="cta-heading" className="relative py-24 overflow-hidden border-t sm:py-32 border-white/20 dark:border-gray-700/30">
          <div className="relative z-10 mobile-container">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 id="cta-heading" className="mb-6 text-4xl font-bold sm:text-5xl text-text">
                Ready to Transform Your Health?
              </h2>
              <p className="max-w-2xl mx-auto mb-12 text-xl text-text-light">
                Join thousands of users who have already started their journey to optimal wellness
              </p>
              
              <motion.div 
                className="flex flex-col justify-center gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 text-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/pricing')}
                  className="px-8 py-4 text-lg"
                >
                  View Pricing
                </GlassButton>
              </motion.div>

              <motion.div 
                className="mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <LiveTimeDisplay variant="full" />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </AdaptiveBackdrop>
  )
}

export default HomePage
