/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Activity, Calendar, Plus, Clock, Flame, BarChart2, Dumbbell } from 'lucide-react';
import { fitnessApi, WorkoutSession, FitnessSummary } from '../../api/fitnessApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressRing from '../dashboard/ProgressRing';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EnhancedFitnessTrackerProps {
  activeTab?: string;
}

const EnhancedFitnessTracker: React.FC<EnhancedFitnessTrackerProps> = ({ activeTab = 'dashboard' }) => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [fitnessSummary, setFitnessSummary] = useState<FitnessSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [timeRange, setTimeRange] = useState(7);
  
  // New workout form state
  const [newWorkout, setNewWorkout] = useState({
    workoutType: 'Strength Training',
    duration: 45,
    caloriesBurned: 300,
    notes: ''
  });

  // Get current user
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || 'demo-user');
      } catch (error) {
        console.error('Error getting current user:', error);
        setCurrentUserId('demo-user');
      }
    };
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadFitnessData();
    }
  }, [timeRange, currentUserId]);

  const loadFitnessData = async () => {
    setIsLoading(true);
    try {
      const history = await fitnessApi.getWorkoutHistory(currentUserId, timeRange);
      const summary = await fitnessApi.getFitnessSummary(currentUserId, timeRange);
      
      setWorkoutHistory(history || []);
      setFitnessSummary(summary);
    } catch (error) {
      console.error('Error loading fitness data:', error);
      // Set fallback data
      setWorkoutHistory([]);
      setFitnessSummary({
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        totalActiveMinutes: 0,
        averageWorkoutDuration: 0,
        favoriteWorkoutType: 'None',
        dailyMetrics: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async () => {
    if (!currentUserId) return;
    
    try {
      await fitnessApi.logWorkout({
        userId: currentUserId,
        workoutType: newWorkout.workoutType,
        duration: newWorkout.duration,
        caloriesBurned: newWorkout.caloriesBurned,
        timestamp: new Date().toISOString(),
        notes: newWorkout.notes
      });
      
      loadFitnessData();
      setShowAddWorkout(false);
      
      setNewWorkout({
        workoutType: 'Strength Training',
        duration: 45,
        caloriesBurned: 300,
        notes: ''
      });
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'caloriesBurned' ? parseInt(value) || 0 : value
    }));
  };

  // Prepare chart data with better error handling
  const chartData = {
    labels: fitnessSummary?.dailyMetrics?.map(metric => {
      try {
        return format(parseISO(metric.date), 'MMM d');
      } catch (error) {
        console.warn('Error parsing date:', metric.date, error);
        return metric.date;
      }
    }) || [],
    datasets: [
      {
        label: 'Active Minutes',
        data: fitnessSummary?.dailyMetrics?.map(metric => metric.activeMinutes || 0) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
            weight: 'normal' as const
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
            weight: 'normal' as const
          }
        },
        title: {
          display: true,
          text: 'Active Minutes',
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={`loading-card-${i}`} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
        <Card className="p-6 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </Card>
      </div>
    );
  }

  // Dashboard Tab
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Workouts</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {fitnessSummary?.totalWorkouts || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Calories Burned</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {fitnessSummary?.totalCaloriesBurned || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-500/10">
                  <Flame className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Active Minutes</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {fitnessSummary?.totalActiveMinutes || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500/10">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Duration</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {Math.round(fitnessSummary?.averageWorkoutDuration || 0)}m
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-500/10">
                  <BarChart2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Trend</h3>
                <div className="flex gap-2">
                  {[7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeRange(days)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        timeRange === days
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setShowAddWorkout(true)}
                  className="w-full gradient-primary text-white hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Workout
                </Button>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Favorite Workout</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {fitnessSummary?.favoriteWorkoutType || 'None yet'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Weekly Goal</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">5 workouts</span>
                    <ProgressRing
                      progress={(fitnessSummary?.totalWorkouts || 0) / 5 * 100}
                      size={40}
                      strokeWidth={4}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Workout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Workouts</h3>
            
            {workoutHistory.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No workouts logged yet</p>
                <Button
                  onClick={() => setShowAddWorkout(true)}
                  className="mt-4 gradient-primary text-white"
                >
                  Log Your First Workout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {workoutHistory.slice(0, 5).map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {workout.workoutType}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(workout.timestamp), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {workout.duration}min
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {workout.caloriesBurned} cal
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Add Workout Modal */}
        <AnimatePresence>
          {showAddWorkout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddWorkout(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Log New Workout
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Workout Type
                    </label>
                    <select
                      id="workoutType"
                      name="workoutType"
                      value={newWorkout.workoutType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Strength Training">Strength Training</option>
                      <option value="Cardio">Cardio</option>
                      <option value="HIIT">HIIT</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Running">Running</option>
                      <option value="Swimming">Swimming</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (minutes)
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      name="duration"
                      value={newWorkout.duration}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="caloriesBurned" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Calories Burned
                    </label>
                    <Input
                      id="caloriesBurned"
                      type="number"
                      name="caloriesBurned"
                      value={newWorkout.caloriesBurned}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="workoutNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      id="workoutNotes"
                      name="notes"
                      value={newWorkout.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="How did the workout feel?"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowAddWorkout(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddWorkout}
                    className="flex-1 gradient-primary text-white"
                  >
                    Log Workout
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // History Tab
  if (activeTab === 'history') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workout History</h3>
            <Button
              onClick={() => setShowAddWorkout(true)}
              className="gradient-primary text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Workout
            </Button>
          </div>
          
          {workoutHistory.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Workouts Yet
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start logging your workouts to see your fitness journey
              </p>
              <Button
                onClick={() => setShowAddWorkout(true)}
                className="gradient-primary text-white"
              >
                Log Your First Workout
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutHistory.map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-primary/10 mr-4">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {workout.workoutType}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(workout.timestamp), 'EEEE, MMM d, yyyy • h:mm a')}
                        </p>
                        {workout.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {workout.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {workout.duration}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">minutes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {workout.caloriesBurned}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">calories</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Default fallback
  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Feature Coming Soon
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        This fitness feature is currently in development.
      </p>
    </Card>
  );
};

export default EnhancedFitnessTracker;
