import React from 'react';
import { Activity, Heart, Zap, Moon, Utensils, Target } from 'lucide-react';
import DashboardCards from '../components/dashboard/DashboardCards';
import BWScoreCard from '../components/dashboard/BWScoreCard';
import MetricsCard from '../components/dashboard/MetricsCard';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import SupplementTracker from '../components/dashboard/SupplementTracker';
import RecommendationsCard from '../components/dashboard/RecommendationsCard';
import FitnessWidget from '../components/fitness/FitnessWidget';
import { MetricScore } from '../components/dashboard/BWScoreCard';

const DashboardPage: React.FC = () => {
  // Mock data for BW Score metrics
  const bwScoreMetrics: MetricScore[] = [
    {
      name: 'Sleep Quality',
      score: 78,
      weight: 1.5,
      color: '#8B5CF6',
      icon: <Moon className="w-5 h-5" />,
      description: 'Based on sleep duration, quality, and consistency from your wearable device.'
    },
    {
      name: 'Fitness Level',
      score: 82,
      weight: 1.5,
      color: '#F59E0B',
      icon: <Activity className="w-5 h-5" />,
      description: 'Calculated from workout frequency, intensity, and recovery metrics.'
    },
    {
      name: 'Nutrition Score',
      score: 70,
      weight: 1.2,
      color: '#10B981',
      icon: <Utensils className="w-5 h-5" />,
      description: 'Based on meal quality, timing, and macro balance from food tracking.'
    },
    {
      name: 'Stress Management',
      score: 65,
      weight: 1.0,
      color: '#EF4444',
      icon: <Heart className="w-5 h-5" />,
      description: 'Derived from HRV data, stress surveys, and recovery indicators.'
    },
    {
      name: 'Energy Levels',
      score: 75,
      weight: 0.8,
      color: '#F97316',
      icon: <Zap className="w-5 h-5" />,
      description: 'Self-reported energy levels and activity patterns throughout the day.'
    },
    {
      name: 'Goal Progress',
      score: 88,
      weight: 1.0,
      color: '#6366F1',
      icon: <Target className="w-5 h-5" />,
      description: 'Progress towards your personal health and fitness objectives.'
    }
  ];

  // Mock today's supplements
  const todaysSupplements = [
    {
      id: '1',
      name: 'Vitamin D3',
      dosage: '5000 IU',
      timing: 'With breakfast',
      taken: true,
      timeOfDay: 'morning' as const
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      dosage: '1000mg',
      timing: 'With lunch',
      taken: false,
      timeOfDay: 'afternoon' as const
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      dosage: '400mg',
      timing: '1 hour before bed',
      taken: false,
      timeOfDay: 'bedtime' as const
    }
  ];

  // Mock activity timeline events
  const todaysEvents = [
    {
      id: '1',
      time: '7:00 AM',
      title: 'Morning Vitamins',
      description: 'Vitamin D3, B-Complex',
      type: 'supplement' as const
    },
    {
      id: '2',
      time: '8:30 AM',
      title: 'Breakfast',
      description: 'Greek yogurt with berries',
      type: 'meal' as const
    },
    {
      id: '3',
      time: '10:00 AM',
      title: 'Morning Workout',
      description: '45 min strength training',
      type: 'workout' as const
    },
    {
      id: '4',
      time: '12:30 PM',
      title: 'Lunch',
      description: 'Salmon salad with quinoa',
      type: 'meal' as const
    }
  ];

  // Mock recommendations
  const recommendations = [
    {
      id: '1',
      title: 'Improve Sleep Consistency',
      description: 'Your bedtime varies by over 2 hours. Try maintaining a consistent sleep schedule for better recovery.',
      actionText: 'View Sleep Tips',
      actionLink: '/sleep',
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Increase Protein Intake',
      description: 'You\'re averaging 15g below your protein goal. Consider adding a protein shake post-workout.',
      actionText: 'View Nutrition',
      actionLink: '/nutrition',
      priority: 'medium' as const
    },
    {
      id: '3',
      title: 'Add Magnesium Supplement',
      description: 'Based on your sleep data, magnesium could help improve your deep sleep quality.',
      actionText: 'View Supplements',
      actionLink: '/supplements',
      priority: 'low' as const
    }
  ];

  const handleSupplementTaken = (id: string) => {
    console.log(`Marked supplement ${id} as taken`);
    // In a real app, this would update the supplement tracking
  };

  const handleMetricClick = (metricName: string) => {
    console.log(`Clicked on metric: ${metricName}`);
    // In a real app, this would navigate to detailed metrics view
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Health Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Your personalized health overview and insights</p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* BW Score - Takes up 1 column */}
          <div className="lg:col-span-1">
            <BWScoreCard 
              metrics={bwScoreMetrics}
              onMetricClick={handleMetricClick}
            />
          </div>
          
          {/* Metrics Cards - Takes up 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MetricsCard
              title="Steps Today"
              value="8,247"
              change={{ value: 12, type: 'increase' }}
              icon={<Activity className="w-6 h-6" />}
              color="primary"
            />
            <MetricsCard
              title="Calories Burned"
              value="1,892"
              change={{ value: 8, type: 'increase' }}
              icon={<Zap className="w-6 h-6" />}
              color="secondary"
            />
            <MetricsCard
              title="Sleep Score"
              value="78/100"
              change={{ value: 5, type: 'decrease' }}
              icon={<Moon className="w-6 h-6" />}
              color="purple"
            />
            <MetricsCard
              title="Nutrition Score"
              value="85%"
              change={{ value: 3, type: 'increase' }}
              icon={<Utensils className="w-6 h-6" />}
              color="tertiary"
            />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <SupplementTracker 
              supplements={todaysSupplements}
              onMarkTaken={handleSupplementTaken}
            />
            <FitnessWidget expanded={false} />
          </div>
          
          <div className="space-y-6">
            <ActivityTimeline events={todaysEvents} />
            <RecommendationsCard recommendations={recommendations} />
          </div>
        </div>

        {/* Dashboard Cards - Classic Overview */}
        <DashboardCards />
      </div>
    </div>
  );
};

export default DashboardPage;