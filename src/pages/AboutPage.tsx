import React from 'react'
import { Shield, Zap, Heart, Brain, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop'
import { GlassSection, GlassCard, GlassFeatureCard } from '../components/ui/GlassComponents'

const AboutPage: React.FC = () => {
  // Core values data
  const coreValues = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Science-Backed',
      description: 'All recommendations are based on the latest scientific research and clinical studies.'
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: 'Personalized Care',
      description: 'We tailor our approach to your unique health profile, goals, and preferences.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Continuous Improvement',
      description: 'Our AI learns from your feedback and new research to constantly enhance recommendations.'
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: 'Holistic Approach',
      description: 'We consider all aspects of wellness: physical, mental, nutritional, and recovery.'
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <AdaptiveBackdrop animationSpeed="medium">
      {/* Hero Section with glassmorphism */}
      <GlassSection padding="xl" background="pattern">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Biowell
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-8 text-text-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Transforming wellness through personalized, science-driven guidance
          </motion.p>
        </div>
      </GlassSection>

      {/* Our Mission */}
      <GlassSection padding="xl" background="gradient">
        <div className="mobile-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 text-center">Our Mission</h2>
            <GlassCard variant="elevated" className="p-8 max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert mx-auto">
                <p className="text-text-light">
                  At Biowell, we believe that everyone deserves access to personalized health guidance. 
                  Our mission is to democratize wellness by making science-backed supplement 
                  recommendations accessible to everyone, regardless of their background or 
                  health knowledge.
                </p>
                <p className="text-text-light">
                  We combine cutting-edge AI technology with rigorous scientific research to provide 
                  you with personalized recommendations that evolve with your health journey. Our 
                  team of experts continuously reviews the latest studies to ensure our guidance 
                  remains at the forefront of nutritional science.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </GlassSection>

      {/* Core Values */}
      <GlassSection padding="xl" background="pattern">
        <div className="mobile-container">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-text mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {coreValues.map((value, index) => (
              <GlassFeatureCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                gradient={
                  index % 4 === 0 ? 'from-primary/20 to-secondary/20' :
                  index % 4 === 1 ? 'from-secondary/20 to-tertiary/20' :
                  index % 4 === 2 ? 'from-tertiary/20 to-primary/20' :
                  'from-primary/20 to-purple-500/20'
                }
              />
            ))}
          </motion.div>
        </div>
      </GlassSection>

      {/* Our Approach */}
      <GlassSection padding="xl" background="gradient">
        <div className="mobile-container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 text-center">Our Approach</h2>
              <GlassCard variant="elevated" className="p-8">
                <div className="prose prose-lg dark:prose-invert mx-auto">
                  <h3 className="text-text">Data-Driven Personalization</h3>
                  <p className="text-text-light">
                    Our AI-powered platform analyzes your health profile, lifestyle factors, 
                    and wellness goals to create customized supplement recommendations. We 
                    continuously update our recommendations based on the latest research and 
                    your progress.
                  </p>
                  
                  <h3 className="text-text">Evidence-Based Recommendations</h3>
                  <p className="text-text-light">
                    Every recommendation is backed by peer-reviewed research and clinical studies. 
                    We work with leading researchers and healthcare professionals to ensure our 
                    guidance is both safe and effective.
                  </p>
                  
                  <h3 className="text-text">Holistic Wellness</h3>
                  <p className="text-text-light">
                    We believe in a comprehensive approach to health that considers nutrition, 
                    physical activity, sleep, stress management, and supplementation. Our 
                    recommendations are designed to support your overall wellbeing, not just 
                    address isolated concerns.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </GlassSection>

      {/* CTA Section */}
      <GlassSection padding="xl" background="pattern">
        <div className="mobile-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-text">Ready to start your wellness journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-text-light">
              Join thousands of users who have transformed their health with personalized, 
              science-backed recommendations.
            </p>
            <GlassCard variant="strong" className="inline-block">
              <a
                href="/signup"
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </GlassCard>
          </motion.div>
        </div>
      </GlassSection>
    </AdaptiveBackdrop>
  )
}

export default AboutPage