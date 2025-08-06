import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import SimpleBackdrop from '../ui/SimpleBackdrop';

export default function HeroSection() {
  return (
    <SimpleBackdrop className="backdrop-brightness-105 dark:backdrop-brightness-95">
      <section className="relative isolate px-6 pt-28 pb-24 lg:pt-36 lg:pb-36">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center space-y-8">

          <motion.span 
            className="inline-block rounded-full border border-blue-200/80 bg-blue-50/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-900/30 dark:text-blue-300"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            AI-Powered, Human-Centered
          </motion.span>

          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Optimize Yourself. <span className="text-blue-600 dark:text-blue-400">Every Day.</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your Smart Coach connects your health data, learns your patterns, and builds a supplement protocol that evolves with you. Powered by science, built for real life.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
              Start My Plan <ArrowRight size={16} />
            </button>
            <button className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium hover:underline transition-colors duration-200">
              <PlayCircle size={20} /> Try Live Demo
            </button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-5 text-xs mt-8 text-slate-500 dark:text-slate-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full">🛡 HIPAA-Ready</span>
            <span className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full">⚡ Real-Time Analysis</span>
            <span className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full">✅ Evidence-Based Protocols</span>
            <span className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full">🧬 Personalized Supplement Engine</span>
          </motion.div>
        </div>
      </section>
    </SimpleBackdrop>
  );
}
