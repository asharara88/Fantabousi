/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { supplementApi } from '../api/supplementApi';
import StackBuilderModal from '../components/supplements/StackBuilderModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
// import { Link } from 'react-router-dom';

interface SupplementStack {
  id: string;
  name: string;
  description: string;
  supplements: {
    name: string;
    dosage: string;
    timing: string;
  }[];
  totalPrice: number;
  isActive: boolean;
}

const MyStacksPage: React.FC = () => {
  const [stacks, setStacks] = useState<SupplementStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStackBuilder, setShowStackBuilder] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading stacks from API
    setIsLoading(true);
    setTimeout(() => {
      setStacks([
        {
          id: '1',
          name: 'Morning Energy Stack',
          description: 'Supplements to boost energy and focus in the morning',
          supplements: [
            { name: 'Vitamin B Complex', dosage: '1 capsule', timing: 'With breakfast', price: 45.00 },
            { name: 'Omega-3', dosage: '1000mg', timing: 'With breakfast', price: 65.00 },
            { name: 'Rhodiola Rosea', dosage: '500mg', timing: 'Morning', price: 95.00 }
          ],
          totalPrice: 205.00,
          isActive: true
        },
        {
          id: '2',
          name: 'Sleep & Recovery',
          description: 'Supplements to improve sleep quality and recovery',
          supplements: [
            { name: 'Magnesium Glycinate', dosage: '400mg', timing: 'Before bed', price: 75.00 },
            { name: 'L-Theanine', dosage: '200mg', timing: 'Before bed', price: 85.00 },
            { name: 'Zinc', dosage: '15mg', timing: 'With dinner', price: 55.00 }
          ],
          totalPrice: 215.00,
          isActive: true
        },
        {
          id: '3',
          name: 'Immune Support',
          description: 'Supplements to boost immune system',
          supplements: [
            { name: 'Vitamin D3', dosage: '5000 IU', timing: 'With breakfast', price: 40.00 },
            { name: 'Vitamin C', dosage: '1000mg', timing: 'With lunch', price: 60.00 },
            { name: 'Zinc', dosage: '15mg', timing: 'With dinner', price: 55.00 }
          ],
          totalPrice: 155.00,
          isActive: false
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDeleteStack = (id: string) => {
    setStacks(stacks.filter(stack => stack.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setStacks(stacks.map(stack => 
      stack.id === id ? { ...stack, isActive: !stack.isActive } : stack
    ));
  };

  const handleCreateStack = () => {
    setSelectedSupplementId(null);
    setShowStackBuilder(true);
  };

  const handleSaveStack = async (stackData: any) => {
    try {
      await supplementApi.createSupplementStack(stackData);
      // Refresh stacks after saving
      // In a real app, you would call an API to get the updated stacks
      const newStack = {
        id: Date.now().toString(),
        name: stackData.name,
        description: stackData.description,
        supplements: stackData.components.map((component: any) => ({
          name: component.name,
          dosage: component.dosage,
          timing: component.timing,
          price: component.price
        })),
        totalPrice: stackData.total_price,
        isActive: stackData.is_active
      };
      setStacks([newStack, ...stacks]);
    } catch (error) {
      console.error('Error saving stack:', error);
      throw error;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Supplement Stacks</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your personalized supplement stacks</p>
          </div>
          <Button className="flex items-center" onClick={handleCreateStack}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Stack
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : stacks.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Supplement Stacks</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any supplement stacks yet. Create your first stack to get started.
            </p>
            <Button className="flex items-center mx-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Stack
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map(stack => (
              <Card key={stack.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stack.name}</h3>
                    <div className="flex space-x-1">
                      <button 
                        className="p-1 text-gray-600 hover:text-primary rounded-full dark:text-gray-400 dark:hover:text-primary"
                        aria-label="Edit stack"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-600 hover:text-red-500 rounded-full dark:text-gray-400 dark:hover:text-red-400"
                        aria-label="Delete stack"
                        onClick={() => handleDeleteStack(stack.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{stack.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {stack.supplements.map((supplement, index) => {
                      return (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{supplement.name}</span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">({supplement.dosage})</span>
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">{supplement.price.toFixed(2)} AED</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-lg text-primary dark:text-primary-light">Total: {stack.totalPrice.toFixed(2)} AED</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Active</span>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          stack.isActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => handleToggleActive(stack.id)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            stack.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Order Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Stack Builder Modal */}
        <StackBuilderModal
          isOpen={showStackBuilder}
          onClose={() => setShowStackBuilder(false)}
          initialSupplementId={selectedSupplementId || undefined}
          onSaveStack={handleSaveStack}
        />
      </div>
    </div>
  );
};

export default MyStacksPage;