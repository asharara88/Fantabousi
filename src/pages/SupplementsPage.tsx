import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Store, 
  Target, 
  Layers,
  ArrowRight,
  Shield,
  TrendingUp,
  Award,
  CheckCircle,
  Info
} from 'lucide-react';
import { getAllSupplements } from '../utils/supplementData';

export default function SupplementsPage() {
  const navigate = useNavigate();
  const supplements = getAllSupplements();
  
  // Get some featured supplements for display
  const featuredSupplements = supplements.slice(0, 3);
  
  // Count supplements by evidence tier
  const greenTierCount = supplements.filter(s => s.tier === 'green').length;
  const yellowTierCount = supplements.filter(s => s.tier === 'yellow').length;

  const navigationCards = [
    {
      id: 'store',
      title: 'Supplement Store',
      description: 'Browse our curated selection of evidence-based supplements',
      icon: Store,
      color: 'bg-blue-500',
      path: '/supplements/store',
      badge: `${supplements.length} Products`
    },
    {
      id: 'recommendations',
      title: 'Get Recommendations',
      description: 'Personalized supplement suggestions based on your goals',
      icon: Target,
      color: 'bg-green-500',
      path: '/supplements/recommendations',
      badge: 'AI Powered'
    },
    {
      id: 'stacks',
      title: 'My Stacks',
      description: 'Organize supplements into custom stacks for different goals',
      icon: Layers,
      color: 'bg-purple-500',
      path: '/supplements/stacks',
      badge: 'Personal'
    }
  ];

  const evidenceInfo = [
    {
      tier: 'green',
      name: 'Strong Evidence',
      count: greenTierCount,
      description: 'Multiple high-quality human clinical trials',
      icon: Shield,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
    },
    {
      tier: 'yellow',
      name: 'Moderate Evidence',
      count: yellowTierCount,
      description: 'Some supporting studies, mixed or limited results',
      icon: Info,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Evidence-Based Supplements
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Discover scientifically-backed supplements to optimize your health and performance. 
            Every product is carefully selected based on research evidence and quality standards.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{supplements.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{greenTierCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Strong Evidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{yellowTierCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Moderate Evidence</div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {navigationCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card 
                key={card.id} 
                className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(card.path)}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${card.color} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {card.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {card.description}
                  </p>
                  
                  <Button 
                    className="w-full group-hover:bg-primary-dark transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(card.path);
                    }}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Evidence Explanation */}
        <Card className="mb-12 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Evidence-Based Approach
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We categorize all supplements based on the strength of scientific evidence supporting their use. 
              This helps you make informed decisions about your health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evidenceInfo.map((info) => {
              const IconComponent = info.icon;
              return (
                <div key={info.tier} className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${info.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                        {info.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({info.count} products)
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {info.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Featured Supplements */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Supplements
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Popular evidence-based supplements trusted by our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSupplements.map((supplement) => (
              <Card key={supplement.id} className="p-6 hover:shadow-lg transition-shadow">
                <img
                  src={supplement.image_url}
                  alt={supplement.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                
                <div className="mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    supplement.tier === 'green' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {supplement.tier === 'green' ? <Shield className="w-3 h-3 mr-1" /> : <Info className="w-3 h-3 mr-1" />}
                    {supplement.tier.charAt(0).toUpperCase() + supplement.tier.slice(1)} Evidence
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {supplement.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {supplement.use_case}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {supplement.price_aed.toFixed(2)} AED
                  </span>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/supplements/detail/${supplement.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quality Assurance */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
          <div className="text-center">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quality You Can Trust
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              All our supplements are third-party tested, made in GMP-certified facilities, 
              and backed by scientific research. We believe in transparency and quality above all.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: CheckCircle, text: 'Third-Party Tested' },
                { icon: Shield, text: 'GMP Certified' },
                { icon: TrendingUp, text: 'Science-Backed' },
                { icon: Award, text: 'Premium Quality' }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="text-center">
                    <IconComponent className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
