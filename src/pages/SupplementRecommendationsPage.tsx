import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Brain, 
  Heart, 
  Dumbbell,
  Shield,
  Moon,
  Zap,
  Target,
  ShoppingCart,
  ArrowRight,
  Clock,
  User,
  CheckCircle
} from 'lucide-react';
import { getAllSupplements, searchSupplements } from '../utils/supplementData';
import type { ProcessedSupplement } from '../utils/supplementData';

interface GoalCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  supplements: string[];
}

export default function SupplementRecommendationsPage() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState({
    age: '',
    gender: '',
    activityLevel: '',
    dietType: '',
    healthConcerns: [] as string[]
  });
  const [recommendations, setRecommendations] = useState<ProcessedSupplement[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const goalCategories: GoalCategory[] = [
    {
      id: 'cognitive',
      name: 'Brain Health & Focus',
      icon: Brain,
      description: 'Enhance memory, focus, and cognitive function',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
      supplements: ['omega-3-fish-oil', 'b-complex-vitamins']
    },
    {
      id: 'heart',
      name: 'Heart Health',
      icon: Heart,
      description: 'Support cardiovascular health and circulation',
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
      supplements: ['omega-3-fish-oil', 'coq10-ubiquinol']
    },
    {
      id: 'fitness',
      name: 'Athletic Performance',
      icon: Dumbbell,
      description: 'Boost energy, strength, and recovery',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
      supplements: ['creatine-monohydrate', 'vitamin-d3', 'magnesium-glycinate']
    },
    {
      id: 'immunity',
      name: 'Immune Support',
      icon: Shield,
      description: 'Strengthen immune system and overall health',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
      supplements: ['vitamin-d3', 'vitamin-c-complex', 'zinc-bisglycinate']
    },
    {
      id: 'sleep',
      name: 'Sleep & Recovery',
      icon: Moon,
      description: 'Improve sleep quality and recovery',
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800',
      supplements: ['magnesium-glycinate', 'ashwagandha-ksm66']
    },
    {
      id: 'energy',
      name: 'Energy & Vitality',
      icon: Zap,
      description: 'Boost energy levels and reduce fatigue',
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
      supplements: ['b-complex-vitamins', 'iron-bisglycinate', 'rhodiola-rosea']
    }
  ];

  const healthConcernOptions = [
    'Stress & Anxiety',
    'Poor Sleep',
    'Low Energy',
    'Digestive Issues',
    'Joint Pain',
    'Memory Issues',
    'Mood Support',
    'Weight Management'
  ];

  const generateRecommendations = () => {
    setLoading(true);
    
    // Simulate API call with complex recommendation logic
    setTimeout(() => {
      const allSupplements = getAllSupplements();
      let recommendedSupplements: ProcessedSupplement[] = [];
      
      // Get supplements based on selected goals
      selectedGoals.forEach(goalId => {
        const goal = goalCategories.find(g => g.id === goalId);
        if (goal) {
          goal.supplements.forEach(suppId => {
            const supplement = allSupplements.find(s => s.id === suppId);
            if (supplement && !recommendedSupplements.find(r => r.id === supplement.id)) {
              recommendedSupplements.push(supplement);
            }
          });
        }
      });

      // Add personalized recommendations based on profile
      if (personalInfo.age && parseInt(personalInfo.age) > 50) {
        const vitaminD = allSupplements.find(s => s.id === 'vitamin-d3');
        const coq10 = allSupplements.find(s => s.id === 'coq10-ubiquinol');
        [vitaminD, coq10].forEach(supp => {
          if (supp && !recommendedSupplements.find(r => r.id === supp.id)) {
            recommendedSupplements.push(supp);
          }
        });
      }

      if (personalInfo.activityLevel === 'high' || personalInfo.activityLevel === 'very-high') {
        const creatine = allSupplements.find(s => s.id === 'creatine-monohydrate');
        const magnesium = allSupplements.find(s => s.id === 'magnesium-glycinate');
        [creatine, magnesium].forEach(supp => {
          if (supp && !recommendedSupplements.find(r => r.id === supp.id)) {
            recommendedSupplements.push(supp);
          }
        });
      }

      // Health concern-based recommendations
      if (personalInfo.healthConcerns.includes('Stress & Anxiety')) {
        const ashwagandha = allSupplements.find(s => s.id === 'ashwagandha-ksm66');
        if (ashwagandha && !recommendedSupplements.find(r => r.id === ashwagandha.id)) {
          recommendedSupplements.push(ashwagandha);
        }
      }

      if (personalInfo.healthConcerns.includes('Low Energy')) {
        const bComplex = allSupplements.find(s => s.id === 'b-complex-vitamins');
        const iron = allSupplements.find(s => s.id === 'iron-bisglycinate');
        [bComplex, iron].forEach(supp => {
          if (supp && !recommendedSupplements.find(r => r.id === supp.id)) {
            recommendedSupplements.push(supp);
          }
        });
      }

      // If no specific recommendations, provide foundational supplements
      if (recommendedSupplements.length === 0) {
        const foundational = ['vitamin-d3', 'omega-3-fish-oil', 'magnesium-glycinate'];
        foundational.forEach(suppId => {
          const supplement = allSupplements.find(s => s.id === suppId);
          if (supplement) {
            recommendedSupplements.push(supplement);
          }
        });
      }

      // Prioritize green tier supplements
      recommendedSupplements.sort((a, b) => {
        if (a.tier === 'green' && b.tier !== 'green') return -1;
        if (b.tier === 'green' && a.tier !== 'green') return 1;
        return 0;
      });

      setRecommendations(recommendedSupplements.slice(0, 6)); // Limit to 6 recommendations
      setShowResults(true);
      setLoading(false);
    }, 2000);
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleHealthConcern = (concern: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      healthConcerns: prev.healthConcerns.includes(concern)
        ? prev.healthConcerns.filter(c => c !== concern)
        : [...prev.healthConcerns, concern]
    }));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'orange':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Personalized Supplement Recommendations
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Based on your goals and profile, here are our science-backed recommendations
            </p>
          </div>

          {/* Summary Card */}
          <Card className="mb-8 p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recommendation Summary
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Goals:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {selectedGoals.map(goalId => 
                    goalCategories.find(g => g.id === goalId)?.name
                  ).join(', ')}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Activity Level:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">
                  {personalInfo.activityLevel?.replace('-', ' ') || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Focus Areas:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {personalInfo.healthConcerns.join(', ') || 'General wellness'}
                </p>
              </div>
            </div>
          </Card>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recommendations.map((supplement, index) => (
              <Card key={supplement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(supplement.tier)}`}>
                      {supplement.tier.charAt(0).toUpperCase() + supplement.tier.slice(1)} Evidence
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      #{index + 1} Priority
                    </span>
                  </div>
                  
                  <img
                    src={supplement.image_url}
                    alt={supplement.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {supplement.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {supplement.use_case}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {supplement.price_aed.toFixed(2)} AED
                    </span>
                    {supplement.subscription_discount_percent && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Save {supplement.subscription_discount_percent}% with subscription
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/supplements/detail/${supplement.id}`)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
            >
              Modify Preferences
            </Button>
            <Button onClick={() => navigate('/supplements/store')}>
              Browse All Supplements
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Personalized Supplement Recommendations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Answer a few questions to get science-backed supplement recommendations tailored to your goals and lifestyle
          </p>
        </div>

        {/* Step 1: Health Goals */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-3">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What are your health goals?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalCategories.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg ${goal.color} mr-3`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {goal.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {goal.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Step 2: Personal Information */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-3">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tell us about yourself
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Range
                </label>
                <select
                  value={personalInfo.age}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select age range</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-55">46-55</option>
                  <option value="56-65">56-65</option>
                  <option value="65+">65+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Level
                </label>
                <select
                  value={personalInfo.activityLevel}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, activityLevel: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little/no exercise)</option>
                  <option value="low">Low (light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                  <option value="high">High (hard exercise 6-7 days/week)</option>
                  <option value="very-high">Very High (physical job + exercise)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diet Type
                </label>
                <select
                  value={personalInfo.dietType}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dietType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select diet type</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Ketogenic</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 3: Health Concerns */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-3">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Any specific health concerns? (Optional)
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {healthConcernOptions.map((concern) => {
                const isSelected = personalInfo.healthConcerns.includes(concern);
                
                return (
                  <div
                    key={concern}
                    onClick={() => toggleHealthConcern(concern)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{concern}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Generate Recommendations Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={generateRecommendations}
            disabled={selectedGoals.length === 0 || loading}
            className="px-8 py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Recommendations...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Get My Recommendations
              </>
            )}
          </Button>
          
          {selectedGoals.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please select at least one health goal to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
