import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Shield, Zap, Brain, TrendingUp, Target, Star } from 'lucide-react';
import SimpleBackdrop from '../ui/SimpleBackdrop';
import { GlassCard, GlassButton } from '../ui/GlassComponents';

export default function HeroSection() {
  return (
    <SimpleBackdrop className="backdrop-brightness-105 dark:backdrop-brightness-95">
      <section className="relative px-6 pb-24 isolate pt-28 lg:pt-36 lg:pb-36">
        <div className="flex flex-col items-center max-w-7xl mx-auto space-y-12 text-center">

          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card border border-amber-400/20"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Enterprise-Grade Precision Health Platform
            </span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-5xl font-black leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              Your Biology
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Decoded
            </span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.div 
            className="max-w-4xl space-y-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              The world's first <span className="font-bold text-blue-600 dark:text-blue-400">AI-driven longevity engine</span> that transforms your biomarkers into precision interventions worth <span className="font-bold text-emerald-600">$10,000+ annually</span> in optimized health outcomes.
            </p>
            
            {/* ROI Metrics */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="glass-card px-6 py-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">47%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Biomarker Improvement</div>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="text-2xl font-bold text-blue-600">$12.4K</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Annual Health ROI</div>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Protocol Adherence</div>
              </div>
            </div>
          </motion.div>

          {/* Premium CTAs */}
          <motion.div 
            className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassButton 
              variant="primary" 
              size="lg"
              className="px-12 py-6 text-lg font-bold text-white shadow-2xl hover:shadow-3xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-3" />
              Access Precision Engine - $497/month
              <ArrowRight size={20} className="ml-3" />
            </GlassButton>
            
            <GlassButton 
              variant="secondary" 
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400"
            >
              <PlayCircle size={20} className="mr-3" /> 
              Book Executive Demo
            </GlassButton>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="glass-panel px-6 py-3 rounded-full border border-emerald-400/20">
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <Shield className="w-4 h-4" />
                FDA-Compliant Data Security
              </span>
            </div>
            <div className="glass-panel px-6 py-3 rounded-full border border-blue-400/20">
              <span className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                <Brain className="w-4 h-4" />
                120+ Clinical Integrations
              </span>
            </div>
            <div className="glass-panel px-6 py-3 rounded-full border border-purple-400/20">
              <span className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                <TrendingUp className="w-4 h-4" />
                $2.1B+ Outcomes Tracked
              </span>
            </div>
            <div className="glass-panel px-6 py-3 rounded-full border border-amber-400/20">
              <span className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                <Target className="w-4 h-4" />
                Enterprise-Grade AI
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </SimpleBackdrop>
  );
}
