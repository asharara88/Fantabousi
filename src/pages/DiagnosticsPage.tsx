import React from 'react';
import { motion } from 'framer-motion';
import NetworkDiagnostics from '../components/diagnostics/NetworkDiagnostics';

const DiagnosticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 py-12">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Authentication Diagnostics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive network and authentication testing to diagnose connection issues
          </p>
        </div>
        
        <NetworkDiagnostics />
      </motion.div>
    </div>
  );
};

export default DiagnosticsPage;
