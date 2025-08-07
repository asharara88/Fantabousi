import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import SimpleBackdrop from '../ui/SimpleBackdrop';
import { GlassCard, GlassButton } from '../ui/GlassComponents';

export default function HeroSection() {
  return (
    <SimpleBackdrop className="backdrop-brightness-105 dark:backdrop-brightness-95">
      <section className="relative isolate px-6 pt-28 pb-24 lg:pt-36 lg:pb-36">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center space-y-8">

          <motion.div
            className="glass-card inline-block px-6 py-3 rounded-full"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              AI-Powered, Human-Centered
            </span>
          </motion.div>

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
            <GlassButton 
              variant="primary" 
              size="lg"
              className="text-white font-semibold shadow-xl hover:shadow-2xl"
            >
              Start My Plan <ArrowRight size={16} className="ml-2" />
            </GlassButton>
            
            <GlassButton 
              variant="secondary" 
              size="lg"
              className="text-blue-700 dark:text-blue-300 font-medium"
            >
              <PlayCircle size={20} className="mr-2" /> Try Live Demo
            </GlassButton>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { icon: '🛡', text: 'HIPAA-Ready' },
              { icon: '⚡', text: 'Real-Time Analysis' },
              { icon: '✅', text: 'Evidence-Based Protocols' },
              { icon: '🧬', text: 'Personalized Supplement Engine' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-panel px-4 py-2 rounded-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="text-sm">{feature.icon}</span>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </SimpleBackdrop>
  );
}
