import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Zap, Brain, CheckCircle } from 'lucide-react';
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop';
import ThemeToggle from '../components/ui/ThemeToggle';

const LandingPage: React.FC = () => {
  return (
    <AdaptiveBackdrop animationSpeed="medium" overlay={true}>
      <ThemeToggle />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        {/* Content overlay for better readability */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[1px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hero Title */}
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 dark:from-blue-300 dark:via-emerald-300 dark:to-purple-300">
                Biowell
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl mb-12 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Personalized health optimization powered by AI and backed by science
            </motion.p>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="text-center p-6 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/30 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300">
                <Heart className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Personalized</p>
              </div>
              <div className="text-center p-6 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/30 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300">
                <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Science-Backed</p>
              </div>
              <div className="text-center p-6 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/30 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Optimized</p>
              </div>
              <div className="text-center p-6 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/30 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300">
                <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered</p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Link>
              </motion.div>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium underline underline-offset-4 transition-colors duration-200"
              >
                Already have an account? Sign in
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <div className="flex items-center bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 dark:border-gray-700/50">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 dark:border-gray-700/50">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Science-backed approach</span>
              </div>
              <div className="flex items-center bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 dark:border-gray-700/50">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Smart coaching</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="py-24 bg-white/30 dark:bg-black/30 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Transform Your Health Journey
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed">
              Experience the future of personalized wellness with our AI-powered platform that adapts to your unique needs and goals.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/pricing"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
              >
                View Pricing
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </AdaptiveBackdrop>
  );
};

export default LandingPage;
