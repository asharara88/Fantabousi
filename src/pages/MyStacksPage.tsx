import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Info,
  Heart
} from 'lucide-react';
import { getAllSupplements } from '../utils/supplementData';
import type { ProcessedSupplement } from '../utils/supplementData';

interface SupplementStack {
  id: string;
  name: string;
  description: string;
  supplements: string[]; // supplement IDs
  isActive: boolean;
  createdAt: string;
  isFavorite: boolean;
  totalCost: number;
  goal: string;
}

export default function MyStacksPage() {
  const navigate = useNavigate();
  const [stacks, setStacks] = useState<SupplementStack[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStackName, setNewStackName] = useState('');
  const [newStackDescription, setNewStackDescription] = useState('');
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [loading, setLoading] = useState(true);

  const allSupplements = getAllSupplements();
  
  const goals = [
    'General Health',
    'Athletic Performance',
    'Brain Health',
    'Heart Health',
    'Sleep & Recovery',
    'Energy & Vitality',
    'Immune Support',
    'Weight Management'
  ];

  // Sample stacks data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStacks([
        {
          id: 'foundation-stack',
          name: 'Foundation Stack',
          description: 'Essential vitamins and minerals for daily health',
          supplements: ['vitamin-d3', 'omega-3-fish-oil', 'magnesium-glycinate'],
          isActive: true,
          createdAt: '2024-01-15',
          isFavorite: true,
          totalCost: 180.00,
          goal: 'General Health'
        },
        {
          id: 'performance-stack',
          name: 'Performance Stack',
          description: 'Supplements for enhanced athletic performance and recovery',
          supplements: ['creatine-monohydrate', 'b-complex-vitamins', 'ashwagandha-ksm66'],
          isActive: true,
          createdAt: '2024-02-01',
          isFavorite: false,
          totalCost: 165.00,
          goal: 'Athletic Performance'
        },
        {
          id: 'cognitive-stack',
          name: 'Brain Boost Stack',
          description: 'Support for focus, memory, and cognitive function',
          supplements: ['omega-3-fish-oil', 'b-complex-vitamins', 'rhodiola-rosea'],
          isActive: false,
          createdAt: '2024-01-20',
          isFavorite: false,
          totalCost: 210.00,
          goal: 'Brain Health'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getSupplementDetails = (supplementId: string) => {
    return allSupplements.find(s => s.id === supplementId);
  };

  const calculateStackCost = (supplementIds: string[], subscription = false) => {
    return supplementIds.reduce((total, id) => {
      const supplement = getSupplementDetails(id);
      if (!supplement) return total;
      
      const price = subscription && supplement.discounted_price_aed 
        ? supplement.discounted_price_aed 
        : supplement.price_aed;
      
      return total + price;
    }, 0);
  };

  const toggleStackActive = (stackId: string) => {
    setStacks(prev => prev.map(stack => 
      stack.id === stackId 
        ? { ...stack, isActive: !stack.isActive }
        : stack
    ));
  };

  const toggleFavorite = (stackId: string) => {
    setStacks(prev => prev.map(stack => 
      stack.id === stackId 
        ? { ...stack, isFavorite: !stack.isFavorite }
        : stack
    ));
  };

  const deleteStack = (stackId: string) => {
    setStacks(prev => prev.filter(stack => stack.id !== stackId));
  };

  const createStack = () => {
    if (!newStackName.trim() || selectedSupplements.length === 0) return;
    
    const newStack: SupplementStack = {
      id: `stack-${Date.now()}`,
      name: newStackName,
      description: newStackDescription,
      supplements: selectedSupplements,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: false,
      totalCost: calculateStackCost(selectedSupplements),
      goal: selectedGoal || 'General Health'
    };
    
    setStacks(prev => [newStack, ...prev]);
    setShowCreateModal(false);
    setNewStackName('');
    setNewStackDescription('');
    setSelectedSupplements([]);
    setSelectedGoal('');
  };

  const addAllToCart = (stack: SupplementStack) => {
    // Simulate adding to cart
    console.log('Adding stack to cart:', stack.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Supplement Stacks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Organize your supplements into personalized stacks for different goals
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Stack
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Stacks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stacks.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Stacks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stacks.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stacks.filter(s => s.isFavorite).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stacks.filter(s => s.isActive).reduce((total, s) => total + s.totalCost, 0).toFixed(0)} AED
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stacks Grid */}
        {stacks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No stacks yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first supplement stack to organize your supplements by goals
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Stack
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => (
              <Card key={stack.id} className="overflow-hidden">
                <div className="p-6">
                  {/* Stack Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {stack.name}
                        </h3>
                        {stack.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 ml-2 fill-current" />
                        )}
                        {stack.isActive && (
                          <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {stack.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created {new Date(stack.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-4">
                      <button
                        onClick={() => toggleFavorite(stack.id)}
                        className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Heart className={`w-4 h-4 ${stack.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteStack(stack.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Goal Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      <Info className="w-3 h-3 mr-1" />
                      {stack.goal}
                    </span>
                  </div>

                  {/* Supplements */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Supplements ({stack.supplements.length})
                    </h4>
                    <div className="space-y-2">
                      {stack.supplements.slice(0, 3).map((suppId) => {
                        const supplement = getSupplementDetails(suppId);
                        if (!supplement) return null;
                        
                        return (
                          <div key={suppId} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">
                              {supplement.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {supplement.price_aed.toFixed(0)} AED
                            </span>
                          </div>
                        );
                      })}
                      {stack.supplements.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{stack.supplements.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cost and Actions */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {stack.totalCost.toFixed(2)} AED
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">With subscription</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {calculateStackCost(stack.supplements, true).toFixed(2)} AED
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addAllToCart(stack)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStackActive(stack.id)}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        {stack.isActive ? 'Pause' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Stack Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Create New Stack
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stack Name
                    </label>
                    <input
                      type="text"
                      value={newStackName}
                      onChange={(e) => setNewStackName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., Morning Energy Stack"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newStackDescription}
                      onChange={(e) => setNewStackDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Describe the purpose of this stack..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal
                    </label>
                    <select
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a goal</option>
                      {goals.map((goal) => (
                        <option key={goal} value={goal}>{goal}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Supplements
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      {allSupplements.map((supplement) => (
                        <label key={supplement.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSupplements.includes(supplement.id)}
                            onChange={() => {
                              setSelectedSupplements(prev =>
                                prev.includes(supplement.id)
                                  ? prev.filter(id => id !== supplement.id)
                                  : [...prev, supplement.id]
                              );
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {supplement.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedSupplements.length > 0 && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Estimated monthly cost: <span className="font-semibold">
                          {calculateStackCost(selectedSupplements).toFixed(2)} AED
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        With subscription: {calculateStackCost(selectedSupplements, true).toFixed(2)} AED
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createStack}
                    disabled={!newStackName.trim() || selectedSupplements.length === 0}
                  >
                    Create Stack
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
