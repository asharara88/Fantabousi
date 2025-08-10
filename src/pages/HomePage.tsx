import React from 'react'
import { ArrowRight, Heart, Shield, Zap, Brain, CheckCircle, PlayCircle, Users, Target, Star, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassButton } from '../components/ui/GlassComponents'
import { BIOWELL_LOGOS, BIOWELL_COPY } from '../constants/branding'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: 'Personalized Smart Coach',
      description: 'AI-driven recommendations tailored to your unique biology, lifestyle, and goals.'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: 'Science-Backed Supplements',
      description: 'Every recommendation is rooted in peer-reviewed research and clinical studies.'
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: 'Wearable & App Integration',
      description: 'Connect your health data from wearables and apps for comprehensive insights.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden text-gray-900 border-b gradient-subtle border-gray-200/30 dark:border-gray-700/30 dark:text-white sm:py-24 md:py-32">
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
            {/* Hero Content */}
            <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                {BIOWELL_COPY.TAGLINE}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
              {BIOWELL_COPY.SUBTITLE}
            </p>

            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
              {BIOWELL_COPY.DESCRIPTION}
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-6 mb-16 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="px-12 py-5 text-xl font-bold min-w-[280px] shadow-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="flex items-center">
                    Get Started
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </span>
                </GlassButton>
              </motion.div>
              
              <GlassButton
                variant="secondary"
                size="lg"
                className="px-12 py-5 text-xl font-semibold min-w-[280px]"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center">
                  Learn More
                  <ArrowDown className="w-5 h-5 ml-3" />
                </span>
              </GlassButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Everything You Need
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              A comprehensive, science-backed health platform designed for personalized wellness
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="relative p-8 text-white transition-all duration-300 transform rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-600 hover:shadow-2xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    {feature.icon}
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
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Create Your Account
              </h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Create a password"
                  />
                </div>
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600"
                >
                  Create My Account
                </GlassButton>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-16 text-center gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <img 
              src={BIOWELL_LOGOS.LIGHT_THEME}
              alt="Biowell Logo" 
              className="object-contain w-auto h-20 dark:hidden opacity-60" 
            />
            <img 
              src={BIOWELL_LOGOS.DARK_THEME}
              alt="Biowell Logo" 
              className="hidden object-contain w-auto h-20 dark:block opacity-60" 
            />
          </div>
          <div className="mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {BIOWELL_COPY.FOOTER}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage