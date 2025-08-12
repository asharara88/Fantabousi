/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Plus, Activity, Clock, Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { fitnessApi } from '../../api/fitnessApi';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo user UUID for when no authenticated user is available
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

interface QuickWorkoutLoggerProps {
  onWorkoutLogged?: () => void;
}

const QuickWorkoutLogger: React.FC<QuickWorkoutLoggerProps> = ({ onWorkoutLogged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>(DEMO_USER_ID);
  const [workout, setWorkout] = useState({
    type: 'Strength Training',
    duration: 45,
    calories: 300
  });

  const workoutTypes = [
    'Strength Training', 'Cardio', 'HIIT', 'Yoga', 'Running', 'Cycling'
  ];

  useEffect(() => {
    // Get current user ID
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || DEMO_USER_ID);
      } catch (error) {
        console.error('Error getting current user:', error);
        setCurrentUserId(DEMO_USER_ID);
      }
    };
    
    getCurrentUser();
  }, []);

  const handleQuickLog = async () => {
    setIsLogging(true);
    try {
      await fitnessApi.logWorkout({
        userId: currentUserId,
        workoutType: workout.type,
        duration: workout.duration,
        caloriesBurned: workout.calories,
        timestamp: new Date().toISOString()
      });
      
      setIsOpen(false);
      onWorkoutLogged?.();
      
      // Reset form
      setWorkout({
        type: 'Strength Training',
        duration: 45,
        calories: 300
      });
    } catch (error) {
      console.error('Error logging workout:', error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Quick Log Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Log Workout</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Workout Type</label>
                  <select
                    value={workout.type}
                    onChange={(e) => setWorkout(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {workoutTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (min)</label>
                    <Input
                      type="number"
                      value={workout.duration}
                      onChange={(e) => setWorkout(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Calories</label>
                    <Input
                      type="number"
                      value={workout.calories}
                      onChange={(e) => setWorkout(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleQuickLog}
                    disabled={isLogging}
                    className="flex-1"
                  >
                    {isLogging ? 'Logging...' : 'Log Workout'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickWorkoutLogger;