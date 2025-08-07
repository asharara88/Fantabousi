import React from 'react'
import { Shield, Zap, Heart, Brain, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen">
      {/* Hero Section with consistent styling */}
      <section className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white py-16 md:py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary opacity-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-secondary opacity-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        
        <div className="mobile-container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Biowell
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Transforming wellness through personalized, science-driven guidance
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-gradient-to-bl from-primary/5 to-tertiary/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/5 h-1/5 bg-gradient-to-tr from-secondary/5 to-tertiary/5 rounded-tr-full"></div>
        
        <div className="mobile-container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Mission</h2>
              <div className="prose prose-lg dark:prose-invert mx-auto">
                <p>
                  At Biowell, we believe that everyone deserves access to personalized health guidance. 
                  Our mission is to democratize wellness by making science-backed supplement 
                  recommendations accessible to everyone, regardless of their background or 
                  health knowledge.
                </p>
                <p>
                  We combine cutting-edge AI technology with rigorous scientific research to provide 
                  you with personalized recommendations that evolve with your health journey. Our 
                  team of experts continuously reviews the latest studies to ensure our guidance 
                  remains at the forefront of nutritional science.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-tertiary/5 to-secondary/5 rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-tl from-primary/5 to-tertiary/5 rounded-tl-full"></div>
        
        <div className="mobile-container">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
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
              <motion.div 
                key={index} 
                className={`feature-card ${
                  index % 3 === 0 ? 'bg-gradient-to-br from-primary-dark to-primary' :
                  index % 3 === 1 ? 'bg-gradient-to-br from-secondary-dark to-secondary' :
                  index % 3 === 2 ? 'bg-gradient-to-br from-tertiary-dark to-tertiary' :
                  'bg-gradient-to-br from-primary-dark to-primary'
                }`}
                variants={itemVariants}
              >
                <div className="p-3 rounded-full bg-white/20 inline-flex mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white dark:text-white text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-1/5 h-1/5 bg-gradient-to-tl from-tertiary/5 to-secondary/5 rounded-tl-full"></div>
        
        <div className="mobile-container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Approach</h2>
              <div className="prose prose-lg dark:prose-invert mx-auto">
                <h3>Data-Driven Personalization</h3>
                <p>
                  Our AI-powered platform analyzes your health profile, lifestyle factors, 
                  and wellness goals to create customized supplement recommendations. We 
                  continuously update our recommendations based on the latest research and 
                  your progress.
                </p>
                
                <h3>Evidence-Based Recommendations</h3>
                <p>
                  Every recommendation is backed by peer-reviewed research and clinical studies. 
                  We work with leading researchers and healthcare professionals to ensure our 
                  guidance is both safe and effective.
                </p>
                
                <h3>Holistic Wellness</h3>
                <p>
                  We believe in a comprehensive approach to health that considers nutrition, 
                  physical activity, sleep, stress management, and supplementation. Our 
                  recommendations are designed to support your overall wellbeing, not just 
                  address isolated concerns.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary opacity-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary opacity-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
        />
        
        <div className="mobile-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Ready to start your wellness journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their health with personalized, 
              science-backed recommendations.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage