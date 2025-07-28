import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart3, Target, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Calories Today',
      value: '1,850',
      target: '2,200',
      icon: Target,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Workouts This Week',
      value: '4',
      target: '5',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Supplements Taken',
      value: '3',
      target: '4',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Streak Days',
      value: '12',
      target: '30',
      icon: Calendar,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  const quickActions = [
    { title: 'Log Meal', path: '/nutrition', color: 'bg-green-500' },
    { title: 'Start Workout', path: '/fitness', color: 'bg-blue-500' },
    { title: 'Take Supplements', path: '/supplements', color: 'bg-purple-500' },
    { title: 'Chat with Coach', path: '/coach', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your health overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        / {stat.target}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate(action.path)}
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg mb-2`}></div>
                <span className="text-sm">{action.title}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { action: 'Logged breakfast', time: '8:30 AM', type: 'nutrition' },
              { action: 'Completed morning workout', time: '7:00 AM', type: 'fitness' },
              { action: 'Took Vitamin D supplement', time: '6:45 AM', type: 'supplement' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'nutrition' ? 'bg-green-500' :
                  activity.type === 'fitness' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
