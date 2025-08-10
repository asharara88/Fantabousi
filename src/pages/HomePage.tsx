import React from 'react'
import { ArrowRight, Heart, Shield, Zap, Brain, CheckCircle, PlayCircle, Users, Target, Star, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassButton } from '../components/ui/GlassComponents'
import { BIOWELL_LOGOS } from '../constants/branding'

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

  const howItWorks = [
    {
      step: 1,
      title: 'Take Your Health Quiz',
      description: 'Answer questions about your health goals, lifestyle, and current wellness routine.'
    },
    {
      step: 2,
      title: 'Connect Your Wearable Data',
      description: 'Sync your fitness trackers and health apps for personalized insights.'
    },
    {
      step: 3,
      title: 'Receive Your Personalized Plan',
      description: 'Get custom supplement recommendations and health coaching tailored to you.'
    }
  ]

  const testimonials = [
    {
      name: "Sarah Ahmed",
      quote: "Biowell helped me optimize my supplement routine. I feel more energetic and focused.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Mohammad Ali",
      quote: "The personalized coaching made all the difference in achieving my health goals.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Fatima Hassan",
      quote: "Love how easy it is to track my progress and get science-backed recommendations.",
      image: "/api/placeholder/60/60"
    }
  ]

  const faqs = [
    {
      question: "How does Biowell personalize my health plan?",
      answer: "We analyze your health quiz responses, wearable data, and goals to create personalized supplement and lifestyle recommendations using AI."
    },
    {
      question: "Are the supplements safe and tested?",
      answer: "Yes, all our supplement recommendations are based on peer-reviewed research and sourced from reputable manufacturers."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time from your account settings."
    },
    {
      question: "How often do you update my recommendations?",
      answer: "Your recommendations are updated monthly based on your progress and any new health data you provide."
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
                Optimize Your Health,
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Every Day.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
              Personalized programs, science-backed supplements, and smart integrations to help you achieve your health goals.
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

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Works</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Users Say</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
              Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Pricing</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <motion.div
              className="p-8 glass-card border-2 border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Monthly</h3>
              <div className="text-4xl font-bold text-emerald-600 mb-6">
                AED 199<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Personalized health coaching</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Supplement recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Wearable data integration</span>
                </li>
              </ul>
              <GlassButton
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Get Started
              </GlassButton>
            </motion.div>

            <motion.div
              className="p-8 glass-card border-2 border-emerald-600 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Annual</h3>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                AED 149<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-emerald-600 mb-6">Billed annually • Save AED 600</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Everything in Monthly</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced analytics</span>
                </li>
              </ul>
              <GlassButton
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600"
              >
                Get Started
              </GlassButton>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Upgrade for specialized coaches from <span className="font-semibold text-emerald-600">AED 99/month</span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="p-6 glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Your Health Journey Starts Today
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of users taking control of their health with personalized insights.
            </p>
            
            <GlassButton
              variant="secondary"
              size="lg"
              className="px-12 py-5 text-xl font-bold bg-white text-emerald-600 hover:bg-gray-100"
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </GlassButton>
          </motion.div>
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
        </div>
      </section>
    </div>
  )
}

export default HomePage 
      preview: 'Connect with 120+ health platforms',
      details: 'Seamless data flow from labs, wearables, and clinical systems',
      icon: <Zap className="w-6 h-6" />
    },
    { 
      title: 'Predictive Analytics', 
      preview: 'Forecast health outcomes 6-12 months ahead',
      details: 'Proprietary algorithms trained on longitudinal health data',
      icon: <BarChart3 className="w-6 h-6" />
    }
  ]

  const benefits = [
    'Enterprise-grade data security and compliance',
    'Clinically-validated intervention protocols', 
    'Real-time biomarker optimization',
    'Dedicated health concierge service',
    'Executive health dashboard',
    'ROI-guaranteed health outcomes'
  ]
  return (
    <div className="min-h-screen">
      {/* Hero Section - Primary CTA */}
      <section className="relative py-20 overflow-hidden text-gray-900 border-b gradient-subtle border-gray-200/30 dark:border-gray-700/30 dark:text-white sm:py-24 md:py-32">
        {/* Enhanced animated background with data stream feel */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Data stream lines */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse"
                style={{
                  left: `${15 + i * 12}%`,
                  height: '100%',
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
          
          {/* Floating data points */}
          <div className="absolute w-2 h-2 rounded-full top-1/3 left-1/5 bg-primary/40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute w-2 h-2 rounded-full top-2/3 right-1/4 bg-secondary/40 animate-ping" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute w-2 h-2 rounded-full bottom-1/3 left-1/3 bg-primary/40 animate-ping" style={{ animationDelay: '2.5s' }}></div>
        </div>
        
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Enhanced Badge with AI presence */}
            <motion.div
              className="inline-flex items-center px-8 py-4 mb-8 text-sm font-semibold tracking-wide transition-all duration-200 border rounded-full surface-glass group border-emerald-400/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-3 h-3 mr-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <Shield className="w-5 h-5 mr-2 text-emerald-600" />
              <span className="text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text">
                Enterprise Health Intelligence Platform • $2.1B+ Outcomes Tracked
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-8xl">
              <span className="text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text">
                Precision Health
              </span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text">
                Engine
              </span>
              <br />
              <span className="text-3xl font-medium sm:text-4xl md:text-5xl text-slate-600 dark:text-slate-400">
                Worth $10,000+ Annually
              </span>
            </h1>

            {/* Value Proposition */}
            <div className="max-w-4xl mx-auto mb-12 space-y-6">
              <p className="text-xl font-medium leading-relaxed sm:text-2xl text-slate-700 dark:text-slate-300">
                Transform your biomarkers into <span className="font-bold text-blue-600 dark:text-blue-400">precision interventions</span> using the world's most advanced longevity AI. Join executives optimizing for peak performance and extended healthspan.
              </p>
              
              {/* ROI Metrics */}
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                <div className="px-6 py-4 text-center border glass-card border-emerald-400/20">
                  <div className="text-2xl font-bold text-emerald-600">47%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Biomarker Improvement</div>
                </div>
                <div className="px-6 py-4 text-center border glass-card border-blue-400/20">
                  <div className="text-2xl font-bold text-blue-600">$12.4K</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Annual Health ROI</div>
                </div>
                <div className="px-6 py-4 text-center border glass-card border-purple-400/20">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Protocol Adherence</div>
                </div>
              </div>
            </div>

            {/* Smart Coach Features - Interactive Hover Cards */}
            <div className="grid grid-cols-1 gap-4 mb-12 sm:grid-cols-2 lg:grid-cols-4">
              {smartCoachFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative p-4 cursor-pointer group glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="text-primary">{feature.icon}</div>
                    <h3 className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="mb-1 text-xs text-gray-700 dark:text-gray-300">{feature.preview}</p>
                  
                  {/* Hover tooltip */}
                  <div className="absolute z-10 px-3 py-2 mb-2 text-xs transition-opacity duration-200 transform -translate-x-1/2 rounded-lg opacity-0 pointer-events-none bottom-full left-1/2 glass-panel group-hover:opacity-100 whitespace-nowrap">
                    {feature.details}
                    <div className="absolute transform -translate-x-1/2 border-4 border-transparent top-full left-1/2 border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium CTA Section */}
            <motion.div 
              className="flex flex-col items-center gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Primary CTA */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="px-16 py-8 text-xl font-bold min-w-[400px] tracking-wide shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-blue-400/20"
                  onClick={() => window.location.href = '/onboarding'}
                >
                  <span className="relative z-10 flex items-center">
                    <Zap className="w-6 h-6 mr-3" />
                    Access Precision Engine - $497/month
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </span>
                </GlassButton>
              </motion.div>
              
              {/* Secondary CTAs */}
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                <GlassButton
                  variant="secondary"
                  size="md"
                  className="flex items-center px-8 py-4 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <PlayCircle className="w-5 h-5 mr-3" />
                  Book Executive Demo
                </GlassButton>
                
                <GlassButton
                  variant="secondary"
                  size="md"
                  className="flex items-center px-8 py-4 text-lg font-semibold border-2 border-emerald-300 dark:border-emerald-600 hover:border-emerald-500 dark:hover:border-emerald-400"
                >
                  <Target className="w-5 h-5 mr-3" />
                  View Pricing Plans
                </GlassButton>
              </div>
            </motion.div>
            
            {/* Premium Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="px-6 py-3 border rounded-full glass-panel border-emerald-400/20">
                <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <Shield className="w-4 h-4" />
                  FDA-Compliant Security
                </span>
              </div>
              <div className="px-6 py-3 border rounded-full glass-panel border-blue-400/20">
                <span className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  <Brain className="w-4 h-4" />
                  120+ Clinical Integrations
                </span>
              </div>
              <div className="px-6 py-3 border rounded-full glass-panel border-purple-400/20">
                <span className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                  <Target className="w-4 h-4" />
                  $2.1B+ Outcomes Tracked
                </span>
              </div>
              <div className="px-6 py-3 border rounded-full glass-panel border-amber-400/20">
                <span className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                  <Zap className="w-4 h-4" />
                  Enterprise-Grade AI
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Value Proposition */}
      <section className="relative py-20 overflow-hidden gradient-subtle">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
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
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
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
              <div className="p-8 shadow-2xl glass-card">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">Your Health Dashboard</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Updated in real-time</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Energy Level</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 mr-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Sleep Quality</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 mr-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full w-18"></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Nutrition Score</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 mr-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full w-14"></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 mt-6 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Today's Recommendation</div>
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16 text-center"
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

          <div className="grid gap-8 md:grid-cols-3">
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
                className="p-6 glass-card"
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
        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              Ready to Optimize Your Biology?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Join the future of personalized wellness. Your data becomes your advantage.
              <br />
              <strong>Start with Smart Coach today.</strong>
            </p>
            
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <GlassButton
                  variant="secondary"
                  size="lg"
                  className="px-12 py-5 text-xl min-w-[280px] shadow-xl bg-white text-primary"
                  onClick={() => window.location.href = '/signup'}
                >
                  Get Started
                  <ArrowRight className="w-6 h-6 ml-3" />
                </GlassButton>
              </motion.div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm opacity-80">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Wearables integrated</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Precision stacking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Smart Coach AI</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-16 text-center gradient-subtle">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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