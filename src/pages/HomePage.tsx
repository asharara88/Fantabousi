import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Shield, Zap, Brain, CheckCircle, ChevronDown, ChevronUp, Star } from 'lucide-react'
import EvidenceBasedHealthOptimization from '../components/health/EvidenceBasedHealthOptimization'
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop'
import ThemeToggle from '../components/ui/ThemeToggle'
import LiveTimeDisplay from '../components/ui/LiveTimeDisplay'
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
      gradient: 'from-blue-500 to-cyan-500',
      bgPattern: '🧬'
    },
    {
      icon: <Shield className="w-10 h-10 text-secondary" />,
      title: 'Science-Backed',
      description: 'Every recommendation is grounded in peer-reviewed research, clinical studies, and evidence-based medicine.',
      gradient: 'from-green-500 to-emerald-500',
      bgPattern: '🔬'
    },
    {
      icon: <Zap className="w-10 h-10 text-tertiary" />,
      title: 'Optimize Performance',
      description: 'Enhance your physical and mental performance with precision nutrition, supplement timing, and recovery protocols.',
      gradient: 'from-yellow-500 to-orange-500',
      bgPattern: '⚡'
    },
    {
      icon: <Brain className="w-10 h-10 text-secondary-light" />,
      title: 'Smart Coach',
      description: '24/7 AI health coach with conversational intelligence, contextual awareness, and personalized guidance.',
      gradient: 'from-purple-500 to-pink-500',
      bgPattern: '🤖'
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Fitness Enthusiast",
      content: "Biowell transformed my approach to health. The AI coach feels like having a personal nutritionist available 24/7.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Dr. Ahmed K.",
      role: "Healthcare Professional", 
      content: "The science-backed recommendations and CGM integration make this the most comprehensive health platform I've seen.",
      rating: 5,
      avatar: "👨‍⚕️"
    },
    {
      name: "Lisa R.",
      role: "Busy Professional",
      content: "Finally, a health app that adapts to my lifestyle instead of the other way around. Love the partner sync feature!",
      rating: 5,
      avatar: "👩‍💻"
    }
  ]

  const stats = [
    { label: "Active Users", value: "10K+", trend: "+25%" },
    { label: "Health Insights", value: "1M+", trend: "+40%" },
    { label: "Success Rate", value: "94%", trend: "+3%" },
    { label: "Countries", value: "50+", trend: "+12%" }
  ]

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <AdaptiveBackdrop animationSpeed="slow" overlay={true}>
      <div className="relative min-h-screen">
        {/* Fixed Elements - Complementary landmark for utility controls */}
        <aside role="complementary" aria-label="Page controls" className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </aside>

        {/* Hero Section with Enhanced Design */}
        <section role="region" aria-labelledby="hero-heading" className="relative pt-24 pb-16 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-secondary/30 to-tertiary/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-tertiary/20 to-primary/20 rounded-full blur-2xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Enhanced Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Live Time Display */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <LiveTimeDisplay variant="compact" />
                </motion.div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center space-x-2 surface-glass rounded-full px-6 py-3 hover:shadow-lg transition-all duration-300"
                  >
                    <motion.span 
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium gradient-text">AI-Powered Health Coach</span>
                  </motion.div>

                  <motion.h1
                    id="hero-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tighter text-left leading-tight"
                  >
                    <span className="text-text">Your Personal </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
                      Smart Coach
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl sm:text-2xl mb-12 text-text-light max-w-3xl tracking-wide text-left leading-relaxed"
                  >
                    Transform your health with AI-powered insights, personalized nutrition, 
                    and evidence-based supplement recommendations. Connect your wearables, 
                    track your progress, and optimize your wellness journey.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-16"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <button
                      onClick={() => navigate('/signup')}
                      className="gradient-primary text-white px-10 sm:px-12 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center text-lg min-w-[200px] tracking-wide shadow-lg group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <span>Get Started</span>
                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <button
                      onClick={() => navigate('/login')}
                      className="surface-glass text-text hover:text-primary font-medium px-8 py-4 rounded-2xl transition-all duration-300 tracking-wide hover:shadow-lg border border-white/20 hover:border-primary/30"
                    >
                      Already have an account? Sign in
                    </button>
                  </motion.div>
                </motion.div>

                {/* Enhanced Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-center group surface-glass rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                        {stat.value}
                      </div>
                      <div className="text-sm text-text-light">{stat.label}</div>
                      <div className="text-xs text-green-500 font-medium">{stat.trend}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex flex-wrap gap-8 text-sm text-text-light tracking-wide">
                  {[
                    'Personalized recommendations',
                    'Science-backed approach',
                    'Real-time insights',
                    '24/7 AI support'
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center group"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-primary group-hover:text-secondary transition-colors" />
                      <span className="group-hover:text-text transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Column - Enhanced Visual Elements */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative lg:pl-8"
              >
                <div className="relative h-[600px]">
                  {/* Main Dashboard Card with Enhanced Animations */}
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-80 h-96 backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-shadow duration-500"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text">Health Dashboard</h3>
                        <motion.div 
                          className="w-3 h-3 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">BW Score</span>
                          <motion.span 
                            className="text-3xl font-bold gradient-text"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            87
                          </motion.span>
                        </div>
                        
                        {[
                          { label: "Sleep", value: 92, color: "from-blue-500 to-blue-600" },
                          { label: "Nutrition", value: 78, color: "from-green-500 to-green-600" },
                          { label: "Fitness", value: 85, color: "from-orange-500 to-orange-600" }
                        ].map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-text-muted">{metric.label}</span>
                              <span className="text-text font-medium">{metric.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200/20 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ delay: index * 0.2, duration: 1.5, ease: "easeOut" }}
                                className={`h-2 rounded-full bg-gradient-to-r ${metric.color} shadow-sm`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced AI Chat Card */}
                  <motion.div
                    animate={{ 
                      y: [0, 15, 0],
                      rotate: [0, -1, 0]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-20 right-0 w-72 h-80 backdrop-blur-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-shadow duration-500"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                        <span className="text-text font-medium">AI Coach</span>
                        <motion.div
                          className="ml-auto w-2 h-2 bg-green-500 rounded-full"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm"
                        >
                          <p className="text-sm text-text">
                            "Based on your sleep data, I recommend adjusting your magnesium intake to 400mg, taken 2 hours before bed..."
                          </p>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2 }}
                          className="bg-primary/20 rounded-2xl p-3 ml-6 backdrop-blur-sm"
                        >
                          <p className="text-sm text-text">
                            "Tell me more about the timing"
                          </p>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 3 }}
                          className="flex items-center space-x-2 text-text-muted"
                        >
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity,
                                  delay: i * 0.2 
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs">AI is analyzing...</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Supplement Card */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      x: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute bottom-0 left-10 w-64 h-48 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-shadow duration-500"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-text font-semibold">Today's Stack</h4>
                        <motion.div
                          className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          3/5 taken
                        </motion.div>
                      </div>
                      
                      {[
                        { name: "Vitamin D3", time: "Morning", status: "✓", color: "text-green-500" },
                        { name: "Omega-3", time: "With lunch", status: "⏰", color: "text-yellow-500" },
                        { name: "Magnesium", time: "Evening", status: "○", color: "text-gray-400" }
                      ].map((supplement, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.2 }}
                          className="flex items-center justify-between hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                          <div>
                            <div className="text-sm font-medium text-text">{supplement.name}</div>
                            <div className="text-xs text-text-muted">{supplement.time}</div>
                          </div>
                          <span className={`text-lg ${supplement.color}`}>{supplement.status}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section with Glass Morphism and Animations */}
        <section role="region" aria-labelledby="features-heading" className="py-24 sm:py-28 md:py-32 relative overflow-hidden border-t border-white/20 dark:border-gray-700/30">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-tertiary/10 to-primary/10 rounded-full blur-3xl"
            />
          </div>

          <div className="mobile-container relative z-10">
            <motion.div 
              className="mb-16 sm:mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 surface-glass rounded-full px-6 py-3 mb-6"
              >
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium gradient-text">Premium Features</span>
              </motion.div>

              <h2 id="features-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 tracking-tighter leading-tight text-balance">
                <span className="text-text">Why Choose </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
                  Biowell?
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-text-light max-w-3xl mx-auto tracking-wide leading-relaxed text-balance">
                Experience the future of personalized wellness with AI-powered insights
              </p>
            </motion.div>

            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title} 
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    rotateY: 5
                  }}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => toggleCard(index)}
                >
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 ${feature.bgPattern} opacity-5 rounded-3xl`} />
                  
                  <div className={`surface-glass rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-white/20 hover:border-primary/30`}>
                    {/* Gradient Overlay on Hover */}
                    <motion.div
                      className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}
                      initial={false}
                    />
                    
                    {/* Icon with Enhanced Animation */}
                    <motion.div 
                      className={`${feature.gradient} w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 relative z-10 mx-auto`}
                      whileHover={{ 
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white drop-shadow-sm" })}
                      
                      {/* Glow Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                        style={{ 
                          background: `radial-gradient(circle, ${feature.gradient.includes('primary') ? 'var(--primary)' : 'var(--secondary)'}/40 0%, transparent 70%)`
                        }}
                      />
                    </motion.div>
                    
                    <div className="text-center relative z-10">
                      <motion.h3 
                        className="text-xl font-bold mb-4 text-text group-hover:text-primary transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-text-light leading-relaxed group-hover:text-text transition-colors duration-300"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {feature.description}
                      </motion.p>

                      {/* Expand/Collapse Indicator */}
                      <motion.div
                        className="mt-4 flex justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        {expandedCard === index ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-light" />
                        )}
                      </motion.div>
                    </div>

                    {/* Animated Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ 
                        background: `linear-gradient(45deg, transparent 30%, ${feature.gradient.includes('primary') ? 'var(--primary)' : 'var(--secondary)'}/20 50%, transparent 70%)`,
                        backgroundSize: '200% 200%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />

                    {/* Hover Particles Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary/60 rounded-full"
                          style={{
                            left: `${15 + i * 10}%`,
                            top: `${20 + (i % 3) * 20}%`,
                          }}
                          animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>

                    {/* Corner Accent */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section role="region" aria-labelledby="testimonials-heading" className="py-24 sm:py-32 relative overflow-hidden border-t border-white/20 dark:border-gray-700/30">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-secondary/15 to-tertiary/15 rounded-full blur-3xl"
            />
          </div>

          <div className="mobile-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 surface-glass rounded-full px-6 py-3 mb-6"
              >
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium gradient-text">User Reviews</span>
              </motion.div>

              <h2 id="testimonials-heading" className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                <span className="text-text">What our </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
                  users say
                </span>
              </h2>
              <p className="text-xl text-text-light max-w-3xl mx-auto">
                Real stories from people who transformed their health with Biowell
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <div className="surface-glass rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-white/20 hover:border-primary/30">
                    {/* Quote decoration */}
                    <motion.div
                      className="absolute top-4 right-4 text-6xl text-primary/20 font-serif"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      "
                    </motion.div>
                    
                    {/* Stars */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2 
                          }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.p
                      className="text-text-light leading-relaxed mb-6 group-hover:text-text transition-colors duration-300"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      "{testimonial.content}"
                    </motion.p>
                    
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </motion.div>
                      <div>
                        <motion.h4 
                          className="font-semibold text-text group-hover:text-primary transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          {testimonial.name}
                        </motion.h4>
                        <p className="text-sm text-text-light">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                      initial={false}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Logo Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5" />
          <div className="mobile-container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="flex justify-center"
            >
              <div className="surface-glass rounded-3xl p-8 hover:shadow-xl transition-all duration-500">
                <img 
                  src="/logos/biowell-dark.svg"
                  alt="Biowell Logo" 
                  className="h-20 w-auto object-contain dark:hidden opacity-60 hover:opacity-100 transition-opacity" 
                />
                <img 
                  src="/logos/biowell-light.svg"
                  alt="Biowell Logo" 
                  className="h-20 w-auto object-contain hidden dark:block opacity-60 hover:opacity-100 transition-opacity" 
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Evidence-Based Health Optimization Section */}
        <section role="region" aria-labelledby="evidence-based-health-heading" className="relative overflow-hidden border-t border-white/20 dark:border-gray-700/30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-black/30" aria-hidden="true" />
          <EvidenceBasedHealthOptimization expanded={false} />
        </section>

        {/* Enhanced CTA Section */}
        <section role="region" aria-labelledby="cta-heading" className="py-24 relative overflow-hidden border-t border-white/20 dark:border-gray-700/30">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
            />
          </div>

          <div className="mobile-container relative z-10">
            <motion.div className="text-center">
              <motion.h2 
                id="cta-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 sm:mb-10 tracking-tighter leading-tight text-balance"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
                  Ready to optimize your health?
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl sm:text-2xl mb-12 sm:mb-16 text-text-light max-w-3xl mx-auto tracking-wide leading-relaxed text-balance"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of users who have transformed their wellness journey with AI-powered insights
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="gradient-primary text-white px-12 py-5 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-2 transition-all duration-300 inline-flex items-center text-xl tracking-wide shadow-lg group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  {/* Animated particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/60 rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </button>
              </motion.div>

              {/* Live Time Display at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-16"
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