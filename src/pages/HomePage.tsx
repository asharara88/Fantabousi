import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Lock, Activity, Users, Zap, Heart, Brain, Baby, Target, CheckCircle, Menu, X, Monitor, Award, Database, Smartphone, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'
import { getBiowellLogo } from '../constants/branding'

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLearnMoreExpanded, setIsLearnMoreExpanded] = React.useState(false);
  const { actualTheme } = useTheme();

  const navigationItems = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Smart Coaches', href: '#smart-coaches' },
    { name: 'Security', href: '#security' },
    { name: 'FAQ', href: '#faq' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const smartCoaches = [
    {
      name: 'Biowell',
      logo: getBiowellLogo(actualTheme),
      specialty: 'Comprehensive Health & Performance',
      description: 'A unified hub for optimizing fitness, sleep, mental wellness, and cognitive performance. Delivers personalized routines, breathwork, and supplement protocols for peak daily performance.',
      features: ['Fitness Optimization', 'Sleep Enhancement', 'Cognitive & Mental Wellness', 'Breathwork & Meditation']
    },
    {
      name: 'Ubergene',
      logo: 'https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/ubergene/Dark%20theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1YmVyZ2VuZS9EYXJrIHRoZW1lLnN2ZyIsImlhdCI6MTc1NTE1Mzg0OCwiZXhwIjoxODMyOTEzODQ4fQ.88nkhyEnPZuSNvTqnUzcx775VP75gRP0CbDrSKI-bJw',
      specialty: 'Reproductive Health & Fertility',
      description: 'Couples-focused fertility coaching with synchronized male and female insights. Includes tailored nutrition, supplements, and guidance to align both partners toward shared reproductive goals.',
      features: ['Fertility Optimization', 'Male & Female Insights', 'Targeted Nutrition & Supplements', 'Hormone & Cycle Support']
    },
    {
      name: 'Metaflex',
      logo: 'https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/metaflexlogos/metaflexlogo.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZXRhZmxleGxvZ29zL21ldGFmbGV4bG9nby5zdmciLCJpYXQiOjE3NTUxNTM4MDUsImV4cCI6MTgyNDE4NzQwNX0.Ci5Q0wdvIeQuq8pLd2A0KVsNac-JqTWSHOgQY0r_Wsc',
      specialty: 'Nutrition & Metabolic Health',
      description: 'Data-driven metabolic health support with CGM trend analysis and precise nutrition timing. Provides supplement strategies and routines to optimize energy, flexibility, and blood sugar balance.',
      features: ['CGM Analysis', 'Nutrition Timing', 'Metabolic Flexibility', 'Blood Sugar Optimization']
    }
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Set Your Goals',
      description: 'Simple onboarding to define priorities and choose Smart Coaches (Biowell, Ubergene, Metaflex).',
      icon: <Target className="w-6 h-6" />
    },
    {
      step: '2',
      title: 'Connect Securely',
      description: 'Sync wearables/apps or enter details manually; encryption end-to-end.',
      icon: <Shield className="w-6 h-6" />
    },
    {
      step: '3',
      title: 'Get Your Plan',
      description: 'Guidance, relevant nutrition (with recipes), and supplements — all managed through Biowell.',
      icon: <Brain className="w-6 h-6" />
    },
    {
      step: '4',
      title: 'Track & Evolve',
      description: 'Real-time progress tracking with plans adapting as your data and goals change.',
      icon: <Activity className="w-6 h-6" />
    }
  ];

    const coreMethodologies = [
    {
      name: 'Data-Driven Health Insights',
      description: 'Advanced analytics and trending of your biomarkers to provide personalized recommendations.',
      icon: <Monitor className="w-6 h-6" />
    },
    {
      name: 'Evidence-Based Protocols',
      description: 'Every recommendation is backed by peer-reviewed research and proven methodologies.',
      icon: <Activity className="w-6 h-6" />
    },
    {
      name: 'Personalized Nutrition & Supplements',
      description: 'Tailored plans and coordinated supplement protocols aligned to your goals.',
      icon: <Heart className="w-6 h-6" />
    },
    {
      name: 'Specialized Guidance & Activities',
      description: 'Unique exercises, routines, and practices from each coach\'s expertise.',
      icon: <Users className="w-6 h-6" />
    }
  ];

  const trustBadges = [
    { icon: <Award className="w-5 h-5" />, text: 'Research‑backed insights' },
    { icon: <Lock className="w-5 h-5" />, text: 'Enterprise‑grade encryption' },
    { icon: <Shield className="w-5 h-5" />, text: 'Privacy‑first design' },
    { icon: <Smartphone className="w-5 h-5" />, text: 'Works with leading wearables' }
  ];

  const faqs = [
    {
      question: 'What is a Smart Coach?',
      answer: 'A Smart Coach is a specialized AI-powered health advisor with expertise in specific areas like metabolic health, reproductive wellness, or comprehensive fitness. Each coach has a unique personality and scientific focus.'
    },
    {
      question: 'How is guidance created?',
      answer: 'Our guidance is based on peer-reviewed research, your personal health data, and proven methodologies. Each recommendation is tailored to your specific goals and current health status.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. Your health data is encrypted in transit and at rest with enterprise-grade security. You control all connections and can revoke access anytime.'
    },
    {
      question: 'Can I switch coaches?',
      answer: 'Absolutely. You can enable or disable any Smart Coach at any time. Your data and progress remain secure as you customize your experience.'
    },
    {
      question: 'Do you support wearables?',
      answer: 'Yes, we integrate with leading wearables and health apps. You can also input data manually if you prefer.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl mobile-container">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="flex items-center">
                <img 
                  src={getBiowellLogo(actualTheme)}
                  alt="Biowell" 
                  className="object-contain w-auto h-16 sm:h-20" 
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden space-x-8 md:flex">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="font-medium text-gray-700 transition-colors duration-200 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden space-x-4 md:flex">
              <ThemeToggle />
              <Link
                to="/login"
                className="font-medium text-gray-700 transition-colors duration-200 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 font-semibold text-white transition-all duration-200 rounded-lg gradient-primary hover:shadow-lg hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 md:hidden">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-panel border-t md:hidden border-gray-200/30 dark:border-gray-700/30"
              >
                <div className="py-4 space-y-4">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block font-medium text-gray-700 transition-colors duration-200 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                    <Link
                      to="/login"
                      className="block mb-3 font-medium text-gray-700 transition-colors duration-200 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full px-6 py-3 font-semibold text-center text-white transition-all duration-200 rounded-lg gradient-primary hover:shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden text-gray-900 border-b gradient-subtle border-gray-200/30 dark:border-gray-700/30 dark:text-white sm:pt-28 sm:pb-40 md:pt-32 md:pb-48">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto mobile-container">
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tighter sm:text-6xl md:text-7xl text-balance">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300">
                Optimize yourself everyday.
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed tracking-wide sm:text-2xl text-text-light text-balance">
              A Suite of Specialized Smart Coaches—each with a unique personality and scientific expertise—delivering research‑backed, personalized guidance.
            </p>
            
            {/* Microproof */}
            <div className="glass-card glass-subtle inline-block px-6 py-2 mb-12 text-sm font-medium tracking-wide transition-all duration-200 cursor-default rounded-2xl">
              <span className="text-gray-700 dark:text-gray-300">Backed by peer‑reviewed research and rigorous data practices</span>
            </div>
            
            <motion.div 
              className="flex flex-col gap-6 mb-12 sm:flex-row sm:gap-8 sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="gradient-primary text-white px-10 sm:px-12 py-4 rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-200 inline-flex items-center justify-center text-lg min-w-[200px] tracking-wide shadow-lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </motion.div>
              <button
                onClick={() => setIsLearnMoreExpanded(!isLearnMoreExpanded)}
                className="inline-flex items-center gap-2 font-medium tracking-wide text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
              >
                Learn More
                {isLearnMoreExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </motion.div>

            {/* Expandable Learn More Section */}
            <AnimatePresence>
              {isLearnMoreExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12 overflow-hidden"
                >
                  <div className="glass-card glass-frosted max-w-4xl p-8 mx-auto rounded-3xl">
                    <div className="mb-8 text-center">
                      <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Purpose-Built AI — Not Your Average Chatbot
                      </h3>
                      <p className="text-lg leading-relaxed text-text-light">
                        Evidence-based, personalized health coaching built on your data.
                      </p>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="mb-4 text-xl font-semibold text-center text-gray-900 dark:text-white">
                        The Science Behind Your Smart Coach
                      </h4>
                      <p className="max-w-3xl mx-auto leading-relaxed text-center text-text-light">
                        Biowell's Smart Coaches are fine-tuned and parameterized using peer-reviewed research, real-time biometric data from wearables, and proprietary supplement protocols. Every recommendation is grounded in science — and built for your goals, not generic answers.
                      </p>
                    </div>

                    {/* Key Trust Badges - Inline Row */}
                    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="glass-card glass-subtle p-4 text-center rounded-xl">
                        <div className="mb-2 text-2xl">🧪</div>
                        <h5 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Science-Backed</h5>
                        <p className="text-xs text-text-light">Peer-reviewed protocols only</p>
                      </div>
                      
                      <div className="glass-card glass-subtle p-4 text-center rounded-xl">
                        <div className="mb-2 text-2xl">📊</div>
                        <h5 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Data-Driven</h5>
                        <p className="text-xs text-text-light">Powered by your wearables, CGM & smart scale</p>
                      </div>
                      
                      <div className="glass-card glass-subtle p-4 text-center rounded-xl">
                        <div className="mb-2 text-2xl">🔒</div>
                        <h5 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Private by Design</h5>
                        <p className="text-xs text-text-light">Your data stays yours</p>
                      </div>
                      
                      <div className="glass-card glass-subtle p-4 text-center rounded-xl">
                        <div className="mb-2 text-2xl">💡</div>
                        <h5 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Specialized Intelligence</h5>
                        <p className="text-xs text-text-light">Domain-tuned AI for your goals</p>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="space-y-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-primary to-primary-dark rounded-xl hover:shadow-xl hover:scale-105 group"
                        >
                          Get Started
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                        
                        <button
                          onClick={() => setIsLearnMoreExpanded(!isLearnMoreExpanded)}
                          className="glass-interactive inline-flex items-center justify-center px-6 py-4 text-lg font-medium transition-all duration-300 border-2 text-primary border-primary rounded-xl hover:bg-primary hover:text-white"
                        >
                          See How It Works
                        </button>
                      </div>
                      
                      <p className="text-sm text-text-light">
                        Take the 2-minute quiz to meet your Smart Coach
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm tracking-wide text-text-light">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-2 text-primary">{badge.icon}</div>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto mobile-container">
          <motion.div 
            className="max-w-4xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              How it works
            </h2>
            <p className="text-xl leading-relaxed text-text-light text-balance">
              Simple steps to transform your health journey
            </p>
          </motion.div>
          
          <div className="grid gap-12 md:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                className="glass-card glass-subtle text-center p-8 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-white rounded-2xl gradient-primary">
                  {step.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-text-light">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Coach Section */}
      <section className="py-24 border-t border-gray-200/30 dark:border-gray-700/30 sm:py-32">
        <div className="max-w-6xl mx-auto mobile-container">
          <motion.div 
            className="max-w-4xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Meet Our SmartCoach Apps Suite
            </h2>
            <p className="text-xl leading-relaxed text-text-light text-balance">
              Specialized AI coaches for every aspect of your health journey
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {smartCoaches.map((coach, index) => (
              <motion.div
                key={index}
                className="glass-card glass-elevated p-8 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-center w-24 h-24 mb-6 p-4 glass-subtle rounded-2xl">
                    <img 
                      src={coach.logo} 
                      alt={`${coach.name} logo`}
                      className="w-full h-full object-contain filter transition-all duration-300"
                      onError={(e) => {
                        console.log(`Failed to load ${coach.name} logo:`, coach.logo);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="mb-4 text-lg font-medium text-primary">
                    {coach.specialty}
                  </p>
                  <p className="leading-relaxed text-text-light">
                    {coach.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {coach.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-text-light">
                      <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Methodologies Section */}
      <section className="py-24 border-t border-gray-200/30 dark:border-gray-700/30 sm:py-32 gradient-subtle">
        <div className="max-w-6xl mx-auto mobile-container">
          <motion.div 
            className="max-w-4xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Our Core Methodologies
            </h2>
            <p className="text-xl leading-relaxed text-text-light text-balance">
              Evidence-based approaches that power your health transformation
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {coreMethodologies.map((methodology, index) => (
              <motion.div
                key={index}
                className="glass-card glass-elevated p-8 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white rounded-xl gradient-primary">
                  {methodology.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {methodology.name}
                </h3>
                <p className="leading-relaxed text-text-light">
                  {methodology.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-gray-200/30 dark:border-gray-700/30 sm:py-32">
        <div className="max-w-4xl mx-auto mobile-container">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl leading-relaxed text-text-light text-balance">
              Everything you need to know about our Smart Coaches
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="glass-card glass-subtle p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="leading-relaxed text-text-light">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-24 border-t border-gray-200/30 dark:border-gray-700/30 sm:py-32 gradient-subtle">
        <div className="max-w-6xl mx-auto mobile-container">
          <motion.div 
            className="max-w-4xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Your Privacy, Secured
            </h2>
            <p className="text-xl leading-relaxed text-text-light text-balance">
              Enterprise-grade security for your most personal health data
            </p>
          </motion.div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="glass-card glass-subtle p-6 text-center rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <Shield className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                End-to-End Encryption
              </h3>
              <p className="text-sm text-text-light">
                Your data is encrypted at rest and in transit
              </p>
            </motion.div>
            
            <motion.div
              className="glass-card glass-subtle p-6 text-center rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <Database className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Private by Design
              </h3>
              <p className="text-sm text-text-light">
                Your health data never leaves your control
              </p>
            </motion.div>
            
            <motion.div
              className="glass-card glass-subtle p-6 text-center rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                HIPAA Compliant
              </h3>
              <p className="text-sm text-text-light">
                Meeting the highest healthcare standards
              </p>
            </motion.div>
            
            <motion.div
              className="glass-card glass-subtle p-6 text-center rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <Award className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                SOC 2 Certified
              </h3>
              <p className="text-sm text-text-light">
                Independently verified security controls
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 border-t border-gray-200/30 dark:border-gray-700/30 sm:py-32">
        <div className="max-w-4xl mx-auto text-center mobile-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Ready to meet your Smart Coach?
            </h2>
            <p className="mb-12 text-xl leading-relaxed text-text-light text-balance">
              Join thousands who've transformed their health with personalized, science-backed guidance.
            </p>
            
            <motion.div 
              className="flex flex-col gap-6 sm:flex-row sm:gap-8 sm:justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to="/signup"
                className="gradient-primary text-white px-10 sm:px-12 py-4 rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-200 inline-flex items-center justify-center text-lg min-w-[200px] tracking-wide shadow-lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link
                to="/login"
                className="glass-interactive px-10 py-4 font-semibold text-gray-700 transition-all duration-200 border-2 border-gray-300 dark:text-gray-300 dark:border-gray-600 rounded-2xl hover:border-primary dark:hover:border-primary-light hover:text-primary dark:hover:text-primary-light sm:px-12"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage