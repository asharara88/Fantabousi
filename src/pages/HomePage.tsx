import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full">
              <Home className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-primary">BIOWELL</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Your comprehensive digital health platform for nutrition, fitness, supplements, and personalized wellness coaching.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/about')}
              className="px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Nutrition Tracking',
              description: 'Track your meals and get personalized nutrition insights',
              path: '/nutrition',
              color: 'bg-green-500'
            },
            {
              title: 'Fitness Plans',
              description: 'Customized workout routines and progress tracking',
              path: '/fitness',
              color: 'bg-blue-500'
            },
            {
              title: 'Smart Supplements',
              description: 'Evidence-based supplement recommendations',
              path: '/supplements',
              color: 'bg-purple-500'
            },
            {
              title: 'AI Coach',
              description: 'Personalized health coaching powered by AI',
              path: '/coach',
              color: 'bg-orange-500'
            }
          ].map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="p-12 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their health with our comprehensive platform.
            </p>
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Your Journey
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
