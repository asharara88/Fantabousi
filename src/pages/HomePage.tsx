import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Lock, Activity, Users, Zap, Heart, Brain, Baby, Target, CheckCircle, ChevronDown, ChevronUp, Menu, X, Monitor, Award, Database, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'
import { getBiowellLogo } from '../constants/branding'

// Features data
const HomePage: React.FC = () => {
  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { actualTheme } = useTheme();

  const navigationItems = [
    { name: 'Features', href: '#features' },
    { name: 'Science', href: '#evidence-based-health' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const features = [
    {
      icon: <Heart className="w-10 h-10" style={{ color: '#00ff88' }} />,
      title: 'Personalized Health',
      description: 'Get personalized health insights—covering supplements, habits, nutrition, and recovery—based on your unique data and daily metrics.'
    },
    {
      icon: <Shield className="w-10 h-10" style={{ color: '#00ff88' }} />,
      title: 'Science-Backed',
      description: 'All recommendations are based on the latest scientific research and clinical studies.'
    },
    {
      icon: <Zap className="w-10 h-10" style={{ color: '#00ff88' }} />,
      title: 'Optimize Performance',
      description: 'Enhance your energy, focus, and overall well-being with targeted nutrition.'
    },
    {
      icon: <Brain className="w-10 h-10" style={{ color: '#00ff88' }} />,
      title: 'AI-Powered Coach',
      description: 'Get personalized guidance from our AI health coach to help you reach your wellness goals.'
    }
  ]

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-200/30 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto mobile-container">
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
                className="md:hidden border-t border-gray-200/30 dark:border-gray-700/30"
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
      
      {/* Hero Section with consistent styling - add top padding for fixed nav */}
      <section className="relative pt-24 pb-32 overflow-hidden text-gray-900 border-b gradient-subtle border-gray-200/30 dark:border-gray-700/30 dark:text-white sm:pt-28 sm:pb-40 md:pt-32 md:pb-48">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto mobile-container">
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <a 
              href="#evidence-based-health" 
              className="inline-block px-6 py-2 mb-8 text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer surface-glass rounded-2xl hover:shadow-md"
            >
              <span className="text-gray-700 dark:text-gray-300">Evidence-based health optimization</span>
            </a>
            <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tighter text-left sm:text-6xl md:text-7xl text-balance">
              <span>Your Personal </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Health Coach
              </span>
            </h1>
            <p className="max-w-3xl mb-12 text-xl leading-relaxed tracking-wide text-left sm:text-2xl sm:mb-16 text-text-light text-balance">
              Optimize your everyday.
            </p>
            
            {/* Biowell AI Suite Description */}
            <motion.div 
              className="max-w-4xl mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="p-6 rounded-2xl surface-glass border border-gray-200/20 dark:border-gray-700/20">
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 text-center sm:text-base">
                  <span className="font-semibold text-primary">Biowell</span> for overall health and performance. <span className="font-semibold text-primary">Ubergene</span> for reproductive health and fertility. <span className="font-semibold text-primary">Metaflex</span> for metabolism and joint health. <span className="font-semibold text-primary">Metaflex Nutrition</span> for personalized nutrition to elevate health and performance — all powered by advanced AI, secured with enterprise-grade encryption, and built with your privacy in mind.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-6 mb-16 sm:flex-row sm:gap-8"
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
              <Link
                to="/login"
                className="font-medium tracking-wide text-gray-600 underline transition-colors duration-200 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light underline-offset-4"
              >
                Already have an account? Sign in
              </Link>
            </motion.div>
            
            <div className="flex flex-wrap gap-8 text-sm tracking-wide text-text-light">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                <span>Science-backed approach</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                <span>AI-powered coaching</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with responsive spacing */}
      <section id="features" className="relative py-24 overflow-hidden transition-all duration-300 sm:py-28 md:py-32 gradient-subtle">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/3 rounded-bl-full h-1/3 bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 rounded-tr-full h-1/4 bg-gradient-to-tr from-tertiary/10 to-primary/10 blur-3xl"></div>
        
        <div className="mobile-container">
          <motion.div 
            className="mb-16 text-left sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl sm:mb-8 text-balance">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Why Choose Biowell?
              </span>
            </h2>
            <p className="max-w-3xl text-xl leading-relaxed tracking-wide sm:text-2xl text-text-light text-balance">
              Experience the future of personalized wellness
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={`feature-${feature.title}-${index}`} 
                className="relative p-8 overflow-hidden text-white transition-all duration-300 transform cursor-pointer rounded-2xl card-elevated hover:shadow-2xl hover:-translate-y-2 gradient-primary group"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleCard(index)}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-100"></div>
                
                <div className="flex mb-6">
                  <div className="inline-flex p-4 shadow-lg rounded-2xl bg-white/20 backdrop-blur-sm">
                    {feature.icon}
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold tracking-tight text-left text-white">
                    {feature.title}
                  </h3>
                  {expandedCard === index ? (
                    <ChevronUp className="w-6 h-6 text-white/80" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white/80" />
                  )}
                </div>
                
                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="relative z-10 pt-3 text-base leading-relaxed tracking-wide text-left text-white/90">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Evidence-Based Health Optimization Section */}
            {/* Evidence-Based Health Optimization Section */}
      <section id="evidence-based-health">
        <EvidenceBasedHealthOptimization expanded={false} />
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 overflow-hidden gradient-subtle sm:py-28 md:py-32">
        <div className="mobile-container">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              About Biowell
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 sm:text-xl">
              We're dedicated to transforming personal health through evidence-based optimization. 
              Our AI-powered platform combines the latest scientific research with personalized 
              recommendations to help you achieve optimal wellness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 overflow-hidden sm:py-28 md:py-32">
        <div className="mobile-container">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              Get in Touch
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300 sm:text-xl">
              Ready to start your health optimization journey? We're here to help.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-4 text-lg font-semibold text-white transition-all duration-200 rounded-2xl gradient-primary hover:shadow-xl hover:-translate-y-1 sm:px-12"
              >
               Get Started
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage