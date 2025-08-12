/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Activity, Plus, Clock, Flame, Target } from 'lucide-react';
import { fitnessApi, WorkoutSession } from '../../api/fitnessApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FitnessTrackerProps {
  activeTab?: 'dashboard' | 'history' | 'analytics';
}

interface NewWorkoutForm {
  workoutType: string;
  duration: number;
  caloriesBurned: number;
  notes: string;
}

const WORKOUT_TYPES = [
  'Strength Training',
  'Cardio',
  'Yoga',
  'Running',
  'Cycling',
  'Swimming',
  'HIIT',
  'Pilates',
  'Dancing',
  'Sports'
];

const FitnessTracker: React.FC<FitnessTrackerProps> = () => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [timeRange] = useState(7);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [newWorkout, setNewWorkout] = useState<NewWorkoutForm>({
    workoutType: 'Strength Training',
    duration: 45,
    caloriesBurned: 300,
    notes: ''
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error getting current user:', error);
        setCurrentUserId(null);
      }
    };
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId !== null) {
      loadFitnessData();
    }
  }, [timeRange, currentUserId]);

  const loadFitnessData = async () => {
    if (!currentUserId) return;
    
    setIsLoading(true);
    try {
      const history = await fitnessApi.getWorkoutHistory(currentUserId, timeRange);
      setWorkoutHistory(history || []);
    } catch (error) {
      console.error('Error loading fitness data:', error);
      setWorkoutHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async () => {
    try {
      if (!currentUserId) {
        console.error('User not authenticated');
        return;
      }
      
      await fitnessApi.logWorkout({
        userId: currentUserId,
        workoutType: newWorkout.workoutType,
        duration: newWorkout.duration,
        caloriesBurned: newWorkout.caloriesBurned,
        timestamp: new Date().toISOString(),
        notes: newWorkout.notes
      });
      
      await loadFitnessData();
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

  // Chart data preparation
  const prepareActivityChart = () => {
    if (!workoutHistory || workoutHistory.length === 0) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Calories Burned',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      };
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyCalories = last7Days.map(date => {
      const dayWorkouts = workoutHistory.filter(workout => 
        workout.timestamp?.startsWith(date)
      );
      return dayWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
    });

    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Calories Burned',
        data: dailyCalories,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    };
  };

  const prepareWorkoutTypeChart = () => {
    if (!workoutHistory || workoutHistory.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb']
        }]
      };
    }

    const typeCounts: Record<string, number> = {};
    workoutHistory.forEach(workout => {
      const type = workout.workoutType || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return {
      labels: Object.keys(typeCounts),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Calculate streak
  const calculateStreak = () => {
    if (!workoutHistory.length) return 0;
    
    const today = new Date();
    let streak = 0;
    const currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasWorkout = workoutHistory.some(workout => 
        workout.timestamp?.startsWith(dateStr)
      );
      
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading fitness data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your workouts and monitor progress</p>
        </div>
        <Button onClick={() => setShowAddWorkout(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Log Workout
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {workoutHistory.length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Calories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {workoutHistory.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0)}
              </p>
            </div>
            <Flame className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(workoutHistory.reduce((sum, workout) => sum + (workout.duration || 0), 0) / 60)}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateStreak()}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
          <div className="h-64">
            <Line data={prepareActivityChart()} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workout Types</h3>
          <div className="h-64">
            <Doughnut data={prepareWorkoutTypeChart()} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Workouts</h3>
        <div className="space-y-4">
          {workoutHistory.length > 0 ? (
            workoutHistory.slice(0, 5).map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{workout.workoutType}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workout.timestamp ? new Date(workout.timestamp).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{workout.duration}min</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{workout.caloriesBurned} cal</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No workouts logged yet. Start by adding your first workout!
            </p>
          )}
        </div>
      </Card>

      {/* Add Workout Modal */}
      <AnimatePresence>
        {showAddWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Log New Workout</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Workout Type
                  </label>
                  <select
                    name="workoutType"
                    value={newWorkout.workoutType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {WORKOUT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    name="duration"
                    value={newWorkout.duration}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Calories Burned
                  </label>
                  <Input
                    type="number"
                    name="caloriesBurned"
                    value={newWorkout.caloriesBurned}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={newWorkout.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Any additional notes about your workout..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddWorkout(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddWorkout}
                  className="flex-1"
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
};

export default FitnessTracker;
