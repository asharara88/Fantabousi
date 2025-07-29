import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Activity, Calendar, Plus, Clock, Flame, BarChart2, TrendingUp, Target, Award, Zap } from 'lucide-react';
import { fitnessApi, WorkoutSession, FitnessSummary } from '../api/fitnessApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import MuscleGroupVisualization from './MuscleGroupVisualization';
import { muscleGroupApi } from '../../api/muscleGroupApi';
import ProgressRing from '../dashboard/ProgressRing';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FitnessTrackerProps {
  activeTab?: string;
}

const FitnessTracker: React.FC<FitnessTrackerProps> = ({ activeTab = 'dashboard' }) => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [fitnessSummary, setFitnessSummary] = useState<FitnessSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [timeRange, setTimeRange] = useState(7); // days
  const [showMuscleVisualization, setShowMuscleVisualization] = useState(false);
  
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
    // Get current user ID
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
    if (currentUserId) {
      loadFitnessData();
    }
  }, [timeRange, currentUserId]);

  const loadFitnessData = async () => {
    setIsLoading(true);
    try {
      const history = await fitnessApi.getWorkoutHistory(currentUserId, timeRange);
      const summary = await fitnessApi.getFitnessSummary(currentUserId, timeRange);
      
      setWorkoutHistory(history);
      setFitnessSummary(summary);
    } catch (error) {
      console.error('Error loading fitness data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async () => {
    try {
      await fitnessApi.logWorkout({
        userId: currentUserId,
        workoutType: newWorkout.workoutType,
        duration: newWorkout.duration,
        caloriesBurned: newWorkout.caloriesBurned,
        timestamp: new Date().toISOString(),
        notes: newWorkout.notes
      });
      
      // Refresh data
      loadFitnessData();
      setShowAddWorkout(false);
      
      // Reset form
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
      [name]: name === 'duration' || name === 'caloriesBurned' ? parseInt(value) : value
    }));
  };

  // Prepare sophisticated chart data
  const activityChartData = {
    labels: fitnessSummary?.dailyMetrics.map(metric => format(parseISO(metric.date), 'MMM d')) || [],
    datasets: [
      {
        label: 'Active Minutes',
        data: fitnessSummary?.dailyMetrics.map(metric => metric.activeMinutes) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Calories Burned',
        data: fitnessSummary?.dailyMetrics.map(metric => metric.caloriesBurned / 10) || [],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const workoutTypeData = {
    labels: ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            size: 13,
            weight: '500'
          },
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 5,
        usePointStyle: true
      }
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
            weight: '500'
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
            weight: '500'
          }
        },
        title: {
          display: true,
          text: 'Active Minutes',
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      y1: {
        position: 'right' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11,
            weight: '500'
          }
        },
        title: {
          display: true,
          text: 'Calories (÷10)',
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 12,
            weight: '600'
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          },
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 5
      }
    },
    cutout: '60%'
  };

  const workoutTypes = [
    'Strength Training',
    'Cardio',
    'HIIT',
    'Yoga',
    'Pilates',
    'Running',
    'Cycling',
    'Swimming',
    'Walking',
    'CrossFit'
  ];

  // Get muscle groups for workout type
  const getMuscleGroupsForWorkout = (workoutType: string) => {
    const muscleMap: Record<string, { primary: string[], secondary: string[] }> = {
      'Strength Training': { primary: ['chest', 'back', 'shoulders'], secondary: ['biceps', 'triceps'] },
      'HIIT': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'calves'] },
      'Yoga': { primary: ['core'], secondary: ['back', 'shoulders'] },
      'Pilates': { primary: ['core', 'glutes'], secondary: ['back'] },
      'Swimming': { primary: ['shoulders', 'back'], secondary: ['chest', 'triceps'] },
      'CrossFit': { primary: ['quads', 'shoulders', 'back'], secondary: ['hamstrings', 'triceps', 'biceps'] },
    };
    return muscleMap[workoutType] || { primary: [], secondary: [] };
  };

  // Mock recovery states for demonstration
  const mockRecoveryStates = [
    { muscleGroup: 'chest', readiness: 'excellent' as const, color: muscleGroupApi.getRecoveryColor('excellent') },
    { muscleGroup: 'back', readiness: 'good' as const, color: muscleGroupApi.getRecoveryColor('good') },
    { muscleGroup: 'shoulders', readiness: 'moderate' as const, color: muscleGroupApi.getRecoveryColor('moderate') },
    { muscleGroup: 'biceps', readiness: 'poor' as const, color: muscleGroupApi.getRecoveryColor('poor') },
    { muscleGroup: 'quads', readiness: 'excellent' as const, color: muscleGroupApi.getRecoveryColor('excellent') },
    { muscleGroup: 'hamstrings', readiness: 'good' as const, color: muscleGroupApi.getRecoveryColor('good') },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Content Controls */}
      {(activeTab === 'dashboard' || !activeTab) && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Fitness Overview</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive insights into your fitness journey</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none font-medium"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <Button
              onClick={() => setShowAddWorkout(true)}
              className="flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Dashboard Tab */}
          {(activeTab === 'dashboard' || !activeTab) && (
            <>
              {/* Sophisticated Fitness Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {fitnessSummary?.totalWorkouts || 0}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">This period</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Workouts</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span>+12% from last period</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-red-500 shadow-lg">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {fitnessSummary?.totalCaloriesBurned || 0}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Calories</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Calories Burned</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span>+8% from last period</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {Math.round((fitnessSummary?.totalActiveMinutes || 0) / 60)}h
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Active time</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Minutes</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span>+15% from last period</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500 shadow-lg">
                        <BarChart2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {Math.round(fitnessSummary?.averageWorkoutDuration || 0)}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Min average</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Avg. Duration</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span>+3% from last period</span>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Advanced Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Trends Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-7 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-3">
                          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Activity Trends</h3>
                      </div>
                    </div>
                    <div className="h-72">
                      <Line data={activityChartData} options={chartOptions} />
                    </div>
                  </Card>
                </motion.div>

                {/* Workout Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-7 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 mr-3">
                          <BarChart2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Workout Distribution</h3>
                      </div>
                    </div>
                    <div className="h-72 flex items-center justify-center">
                      <Doughnut data={workoutTypeData} options={pieChartOptions} />
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Fitness Goals Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-7 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 mr-3">
                      <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Weekly Goals Progress</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="mb-4">
                        <ProgressRing 
                          progress={Math.min(100, ((fitnessSummary?.totalWorkouts || 0) / 5) * 100)}
                          size={120}
                          color="rgba(59, 130, 246, 1)"
                          animated
                        >
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fitnessSummary?.totalWorkouts || 0}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">/ 5 workouts</p>
                          </div>
                        </ProgressRing>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">Workout Goal</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">5 workouts per week</p>
                    </div>

                    <div className="text-center">
                      <div className="mb-4">
                        <ProgressRing 
                          progress={Math.min(100, ((fitnessSummary?.totalActiveMinutes || 0) / 150) * 100)}
                          size={120}
                          color="rgba(16, 185, 129, 1)"
                          animated
                        >
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fitnessSummary?.totalActiveMinutes || 0}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">/ 150 min</p>
                          </div>
                        </ProgressRing>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">Active Minutes</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">150 min per week</p>
                    </div>

                    <div className="text-center">
                      <div className="mb-4">
                        <ProgressRing 
                          progress={Math.min(100, ((fitnessSummary?.totalCaloriesBurned || 0) / 2000) * 100)}
                          size={120}
                          color="rgba(239, 68, 68, 1)"
                          animated
                        >
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fitnessSummary?.totalCaloriesBurned || 0}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">/ 2000 cal</p>
                          </div>
                        </ProgressRing>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">Calories Goal</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2000 cal per week</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <Card className="p-7 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 mr-3">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Workout History</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your recent fitness activities</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(parseInt(e.target.value))}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none font-medium"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={14}>Last 14 days</option>
                    <option value={30}>Last 30 days</option>
                  </select>
                  <Button
                    onClick={() => setShowAddWorkout(true)}
                    className="flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Workout
                  </Button>
                </div>
              </div>
              
              {workoutHistory.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 inline-flex mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts logged</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Start tracking your fitness journey today</p>
                  <Button 
                    onClick={() => setShowAddWorkout(true)}
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Your First Workout
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {workoutHistory.map((workout, index) => (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-primary/10 mr-4">
                              <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white tracking-wide">{workout.workoutType}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                                {format(parseISO(workout.timestamp), 'EEEE, MMM d, yyyy • h:mm a')}
                              </p>
                              {workout.notes && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 italic">{workout.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{workout.duration}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">minutes</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-red-500">{workout.caloriesBurned}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">calories</p>
                              </div>
                              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </Card>
          )}

          {/* Muscle Groups Tab */}
          {activeTab === 'muscles' && (
            <div className="space-y-8">
              <Card className="p-7 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 mr-3">
                    <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Muscle Group Recovery Status</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your recovery across different muscle groups</p>
                  </div>
                </div>
                <MuscleGroupVisualization
                  mode="recovery"
                  recoveryStates={mockRecoveryStates}
                  height={400}
                />
              </Card>
              
              {workoutHistory.length > 0 && (
                <Card className="p-7 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 mr-3">
                      <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Recent Workout Targeting</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Muscle groups targeted in your latest session</p>
                    </div>
                  </div>
                  <MuscleGroupVisualization
                    mode="exercise"
                    exerciseName={workoutHistory[0]?.workoutType}
                    primaryMuscles={getMuscleGroupsForWorkout(workoutHistory[0]?.workoutType || 'Strength Training').primary}
                    secondaryMuscles={getMuscleGroupsForWorkout(workoutHistory[0]?.workoutType || 'Strength Training').secondary}
                    height={400}
                  />
                </Card>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <Card className="p-7 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Detailed Analytics</h3>
                </div>
                <div className="h-80">
                  <Line data={activityChartData} options={chartOptions} />
                </div>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-7 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Favorite Exercise:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fitnessSummary?.favoriteWorkoutType || 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Total Workouts:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fitnessSummary?.totalWorkouts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Total Calories:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{fitnessSummary?.totalCaloriesBurned || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Active Time:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{Math.round((fitnessSummary?.totalActiveMinutes || 0) / 60)} hours</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-7 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">Weekly Goals</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Workouts</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{fitnessSummary?.totalWorkouts || 0}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <motion.div 
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((fitnessSummary?.totalWorkouts || 0) / 5) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Active Minutes</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{fitnessSummary?.totalActiveMinutes || 0}/150</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <motion.div 
                          className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((fitnessSummary?.totalActiveMinutes || 0) / 150) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Calories Burned</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{fitnessSummary?.totalCaloriesBurned || 0}/2000</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <motion.div 
                          className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((fitnessSummary?.totalCaloriesBurned || 0) / 2000) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Add Workout Modal */}
          <AnimatePresence>
            {showAddWorkout && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="w-full max-w-md p-7 shadow-2xl">
                    <div className="flex items-center mb-6">
                      <div className="p-2 rounded-xl bg-primary/10 mr-3">
                        <Plus className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Log a Workout</h3>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="workout-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workout Type</label>
                        <select
                          id="workout-type"
                          name="workoutType"
                          value={newWorkout.workoutType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        >
                          {workoutTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="workout-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (min)</label>
                          <Input
                            id="workout-duration"
                            type="number"
                            name="duration"
                            value={newWorkout.duration}
                            onChange={handleInputChange}
                            min={1}
                            className="text-center"
                          />
                        </div>
                        <div>
                          <label htmlFor="workout-calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calories</label>
                          <Input
                            id="workout-calories"
                            type="number"
                            name="caloriesBurned"
                            value={newWorkout.caloriesBurned}
                            onChange={handleInputChange}
                            min={1}
                            className="text-center"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="workout-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
                        <textarea
                          id="workout-notes"
                          name="notes"
                          value={newWorkout.notes}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                          rows={3}
                          placeholder="How did the workout feel?"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-8">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddWorkout(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddWorkout}
                        className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Save Workout
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default FitnessTracker;