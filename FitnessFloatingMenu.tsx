import React, { useState } from 'react';
import { Activity, Plus, Target, BarChart3, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FitnessFloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Log Workout',
      href: '/fitness?tab=history',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Dashboard',
      href: '/fitness',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'Muscle Groups',
      href: '/fitness?tab=muscles',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Analytics',
      href: '/fitness?tab=analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mb-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 ${item.color} text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        className={`w-14 h-14 ${isOpen ? 'bg-red-500' : 'bg-orange-500'} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FitnessFloatingMenu;