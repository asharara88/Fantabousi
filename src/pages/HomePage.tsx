import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shield, Zap, Brain, CheckCircle, Star, Users, Trophy, Play, BarChart3, Target } from 'lucide-react'
import EvidenceBasedHealthOptimization from '../components/health/EvidenceBasedHealthOptimization'
import { motion } from 'framer-motion'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: 'Personalized Health',
      description: 'AI-driven recommendations tailored to your unique biology, lifestyle, and goals.',
      metric: '95% accuracy'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: 'Science-Backed',
      description: 'Every recommendation is rooted in peer-reviewed research and clinical studies.',
      metric: '10,000+ studies'
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: 'Optimize Performance',
      description: 'Enhance your energy, focus, and overall well-being with targeted nutrition and lifestyle recommendations.',
      metric: 'Personalized'
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: 'AI Coach',
      description: 'Your personal health coach available 24/7 to guide your wellness journey.',
      metric: '24/7 support'
    }
  ]

  const socialProof = [
    { stat: 'AI-Powered', label: 'Recommendations' },
    { stat: 'Science-Based', label: 'Approach' },
    { stat: 'Personalized', label: 'Experience' },
    { stat: 'Evidence-Backed', label: 'Content' }
  ]

  const benefits = [
    'Personalized supplement recommendations',
    'AI-powered nutrition planning', 
    'Real-time health tracking',
    'Expert-reviewed content',
    'Community support',
    '30-day money-back guarantee'
  ]
  return (
    <div className="min-h-screen">
      {/* Hero Section - Primary CTA */}
      <section className="relative py-20 overflow-hidden text-gray-900 border-b gradient-subtle border-gray-200/30 dark:border-gray-700/30 dark:text-white sm:py-24 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium tracking-wide transition-all duration-200 surface-glass rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">Science-backed health optimization</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter sm:text-6xl md:text-7xl">
              <span>Your Personal </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Health Coach
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed tracking-wide sm:text-2xl text-text-light">
              Get personalized nutrition, supplements, and fitness plans powered by AI. 
              <strong className="text-gray-900 dark:text-white"> Start your journey to optimal health.</strong>
            </p>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 gap-6 mb-12 sm:grid-cols-4">
              {socialProof.map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-2xl font-bold text-primary sm:text-3xl">{item.stat}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA */}
            <motion.div 
              className="flex flex-col items-center gap-6 mb-12 sm:flex-row sm:justify-center sm:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="gradient-primary text-white px-12 py-5 rounded-2xl font-bold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center text-xl min-w-[280px] tracking-wide shadow-xl"
                >
                  Get Started
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </motion.div>
              
              <motion.button
                className="flex items-center px-6 py-3 text-lg font-medium text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-2xl hover:border-primary hover:text-primary"
                whileHover={{ scale: 1.02 }}
              >
                <Play className="w-5 h-5 mr-3" />
                Learn More
              </motion.button>
            </motion.div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Free to get started</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Science-backed approach</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Personalized for you</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Value Proposition */}
      <section className="relative py-20 overflow-hidden gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Why Choose Biowell?
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-text-light">
              A comprehensive, science-backed health platform designed for personalized wellness
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={`feature-${feature.title}-${index}`} 
                className="relative p-8 text-white transition-all duration-300 transform rounded-2xl gradient-primary hover:shadow-2xl hover:-translate-y-2"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-white/90">{feature.metric}</div>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-white/90">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - What You Get */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
                Everything You Need for 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {" "}Optimal Health
                </span>
              </h2>
              <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
                Our all-in-one platform gives you everything you need to transform your health, backed by science and powered by AI.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Visual Element - Dashboard Preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">Your Health Dashboard</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Updated in real-time</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Energy Level</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Sleep Quality</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Nutrition Score</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div className="w-14 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Today's Recommendation</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Add Omega-3 supplement to improve recovery and reduce inflammation
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof & About */}
      <section className="py-20 gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Built on Science, Designed for You
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Evidence-Based Approach",
                content: "Every recommendation is rooted in peer-reviewed research and clinical studies, ensuring you get reliable health guidance.",
                icon: <Shield className="w-8 h-8 text-primary" />
              },
              {
                title: "Personalized Experience", 
                content: "Our AI analyzes your unique health profile to provide tailored recommendations that fit your lifestyle and goals.",
                icon: <Brain className="w-8 h-8 text-primary" />
              },
              {
                title: "Comprehensive Platform",
                content: "Track nutrition, supplements, fitness, and wellness all in one place with intuitive tools and insights.",
                icon: <Target className="w-8 h-8 text-primary" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {item.icon}
                  <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Conversion Focused */}
      <section className="relative py-20 overflow-hidden text-white bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Ready to Start Your Health Journey?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Take the first step towards optimizing your health with personalized, science-backed recommendations.
              <br />
              <strong>Get started today.</strong>
            </p>
            
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="bg-white text-primary px-12 py-5 rounded-2xl font-bold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center text-xl min-w-[280px] shadow-xl"
                >
                  Get Started
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm opacity-80">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Free to get started</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Science-backed recommendations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Personalized experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-16 text-center gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <img 
              src="https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1MjY2MzQ0NiwiZXhwIjoxNzg0MTk5NDQ2fQ.gypGnDpYXvYFyGCKWfeyCrH4fYBGEcNOKurPfcbUcWY"
              alt="Biowell Logo" 
              className="object-contain w-auto h-20 dark:hidden opacity-60" 
            />
            <img 
              src="https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUyNjYzNDE4LCJleHAiOjE3ODQxOTk0MTh9.itsGbwX4PiR9BYMO_jRyHY1KOGkDFiF-krdk2vW7cBE"
              alt="Biowell Logo" 
              className="hidden object-contain w-auto h-20 dark:block opacity-60" 
            />
          </div>
        </div>
      </section>

      {/* Evidence-Based Section */}
      <section id="evidence-based-health">
        <EvidenceBasedHealthOptimization expanded={false} />
      </section>
    </div>
  )
}

export default HomePage