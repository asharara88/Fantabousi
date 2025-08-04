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
        <aside role="complementary" aria-label="Page controls" className="fixed z-50 top-6 right-6">
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
              className="absolute w-32 h-32 rounded-full top-20 left-20 bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl"
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
              className="absolute w-40 h-40 rounded-full bottom-20 right-20 bg-gradient-to-r from-secondary/30 to-tertiary/30 blur-3xl"
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
              className="absolute w-24 h-24 rounded-full top-1/2 left-1/4 bg-gradient-to-r from-tertiary/20 to-primary/20 blur-2xl"
            />
          </div>

          <div className="container relative z-10 px-4 mx-auto">
            <div className="grid items-center gap-12 lg:grid-cols-2">
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
                    className="inline-flex items-center px-6 py-3 space-x-2 transition-all duration-300 rounded-full surface-glass hover:shadow-lg"
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
                    className="mb-8 text-5xl font-bold leading-tight tracking-tighter text-left sm:text-6xl md:text-7xl"
                  >
                    <span className="text-text">Your Personal </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                      Smart Coach
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl mb-12 text-xl leading-relaxed tracking-wide text-left sm:text-2xl text-text-light"
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
                  className="flex flex-col gap-6 mb-16 sm:flex-row sm:gap-8"
                >
                  <GlassButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 sm:flex-none"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </GlassButton>

                  <GlassButton
                    variant="default"
                    size="lg"
                    onClick={() => navigate('/demo')}
                    className="flex-1 sm:flex-none"
                  >
                    Watch Demo
                  </GlassButton>
                </motion.div>
                {/* Enhanced Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-2 gap-6 lg:grid-cols-4"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 text-center transition-all duration-300 group surface-glass rounded-2xl hover:shadow-lg"
                    >
                      <div className="text-2xl font-bold transition-colors text-primary group-hover:text-secondary">
                        {stat.value}
                      </div>
                      <div className="text-sm text-text-light">{stat.label}</div>
                      <div className="text-xs font-medium text-green-500">{stat.trend}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex flex-wrap gap-8 text-sm tracking-wide text-text-light">
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
                      <CheckCircle className="w-4 h-4 mr-2 transition-colors text-primary group-hover:text-secondary" />
                      <span className="transition-colors group-hover:text-text">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section with Glass Morphism and Animations */}
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
            <h2 
              id="features-heading" 
              className="mb-6 text-4xl font-bold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary"
            >
              Intelligent Health Optimization
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-text-light">
              Experience the future of personalized health with our AI-powered platform designed to optimize every aspect of your wellness journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </GlassSection>

        {/* Enhanced Features Section */}
        <GlassSection 
          background="gradient" 
          padding="xl"
          className="border-t border-white/20 dark:border-gray-700/30"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
                  className="relative overflow-hidden cursor-pointer group"
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
                        className="absolute inset-0 transition-opacity duration-500 opacity-0 rounded-2xl group-hover:opacity-60"
                        style={{ 
                          background: `radial-gradient(circle, ${feature.gradient.includes('primary') ? 'var(--primary)' : 'var(--secondary)'}/40 0%, transparent 70%)`
                        }}
                      />
                    </motion.div>
                    
                    <div className="relative z-10 text-center">
                      <motion.h3 
                        className="mb-4 text-xl font-bold transition-colors duration-300 text-text group-hover:text-primary"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="leading-relaxed transition-colors duration-300 text-text-light group-hover:text-text"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {feature.description}
                      </motion.p>

                      {/* Expand/Collapse Indicator */}
                      <motion.div
                        className="flex justify-center mt-4"
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
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none rounded-3xl group-hover:opacity-100"
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
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-primary/60"
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
                      className="absolute w-2 h-2 transition-opacity duration-500 rounded-full opacity-0 top-4 right-4 bg-primary/30 group-hover:opacity-100"
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
        </GlassSection>

        {/* Enhanced Testimonials Section */}
        <section role="region" aria-labelledby="testimonials-heading" className="relative py-24 overflow-hidden border-t sm:py-32 border-white/20 dark:border-gray-700/30">
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
              className="absolute w-32 h-32 rounded-full top-1/3 left-1/3 bg-gradient-to-r from-secondary/15 to-tertiary/15 blur-3xl"
            />
          </div>

          <div className="relative z-10 mobile-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 mb-6 space-x-2 rounded-full surface-glass"
              >
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium gradient-text">User Reviews</span>
              </motion.div>

              <h2 id="testimonials-heading" className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="text-text">What our </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                  users say
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-text-light">
                Real stories from people who transformed their health with Biowell
              </p>
            </motion.div>

            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
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
                  className="group"
                >
                  <GlassCard
                    variant="frosted"
                    interactive={true}
                    className="h-full p-8 border border-white/20 hover:border-primary/30"
                  >
                    {/* Quote decoration */}
                    <motion.div
                      className="absolute font-serif text-6xl top-4 right-4 text-primary/20"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      "
                    </motion.div>
                    
                    {/* Stars */}
                    <div className="flex items-center mb-4 space-x-1">
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
                      className="mb-6 leading-relaxed transition-colors duration-300 text-text-light group-hover:text-text"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      "{testimonial.content}"
                    </motion.p>
                    
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 text-2xl rounded-full shadow-lg bg-gradient-to-br from-primary/30 to-secondary/30"
                        whileHover={{ scale: 1.1 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <motion.h4 
                          className="font-semibold transition-colors text-text group-hover:text-primary"
                          whileHover={{ scale: 1.05 }}
                        >
                          {testimonial.name}
                        </motion.h4>
                        <p className="text-sm text-text-light">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none bg-gradient-to-r from-primary/10 to-secondary/10 group-hover:opacity-100 rounded-3xl"
                      initial={false}
                    />
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Logo Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5" />
          <div className="relative z-10 text-center mobile-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="flex justify-center"
            >
              <div className="p-8 transition-all duration-500 surface-glass rounded-3xl hover:shadow-xl">
                <img 
                  src="/logos/biowell-dark.svg"
                  alt="Biowell Logo" 
                  className="object-contain w-auto h-20 transition-opacity dark:hidden opacity-60 hover:opacity-100" 
                />
                <img 
                  src="/logos/biowell-light.svg"
                  alt="Biowell Logo" 
                  className="hidden object-contain w-auto h-20 transition-opacity dark:block opacity-60 hover:opacity-100" 
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
        <section role="region" aria-labelledby="cta-heading" className="relative py-24 overflow-hidden border-t border-white/20 dark:border-gray-700/30">
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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
            />
          </div>

          <div className="relative z-10 mobile-container">
            <motion.div className="text-center">
              <motion.h2 
                id="cta-heading"
                className="mb-8 text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl sm:mb-10 text-balance"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                  Ready to optimize your health?
                </span>
              </motion.h2>
              
              <motion.p 
                className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed tracking-wide sm:text-2xl sm:mb-16 text-text-light text-balance"
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
                  className="relative inline-flex items-center px-12 py-5 overflow-hidden text-xl font-semibold tracking-wide text-white transition-all duration-300 shadow-lg gradient-primary rounded-2xl hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-2 group"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary-dark to-secondary-dark group-hover:opacity-100 rounded-2xl" />
                  
                  {/* Animated particles */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/60"
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