/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Info, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Select from 'react-select'; 
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Supplement {
  id: string;
  name: string;
  brand: string;
  description: string;
  tier: 'green' | 'yellow' | 'orange';
  use_case: string;
  price_aed: number;
  dosage?: string;
}

interface StackItem {
  supplement: Supplement;
  dosage: string;
  timing: string;
  notes?: string;
}

interface StackBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSupplementId?: string;
  onSaveStack: (stackData: any) => Promise<void>;
}

const StackBuilderModal: React.FC<StackBuilderModalProps> = ({
  isOpen,
  onClose,
  initialSupplementId,
  onSaveStack
}) => {
  const [stackName, setStackName] = useState('My Custom Stack');
  const [stackDescription, setStackDescription] = useState('');
  const [stackCategory, setStackCategory] = useState('Custom');
  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Load supplements
  useEffect(() => {
    const fetchSupplements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('supplements')
          .select('*')
          .eq('is_available', true);
        
        if (error) throw error;
        
        setSupplements(data || []);
      } catch (err) {
        console.error('Error fetching supplements:', err);
        setError('Failed to load supplements. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchSupplements();
    }
  }, [isOpen]);
  
  // Add initial supplement if provided
  useEffect(() => {
    if (initialSupplementId && supplements.length > 0) {
      const initialSupplement = supplements.find(s => s.id === initialSupplementId);
      if (initialSupplement && !stackItems.some(item => item.supplement.id === initialSupplementId)) {
        addSupplementToStack(initialSupplement);
      }
    }
  }, [initialSupplementId, supplements]);
  
  const addSupplementToStack = (supplement: Supplement) => {
    setStackItems(prev => [
      ...prev,
      {
        supplement,
        dosage: supplement.dosage || 'As directed',
        timing: getDosageTiming(supplement),
        notes: ''
      }
    ]);
  };
  
  // Get appropriate timing based on supplement type
  const getDosageTiming = (supplement: Supplement) => {
    const name = supplement.name.toLowerCase();
    const description = (supplement.description || '').toLowerCase();
    const category = (supplement.category || '').toLowerCase();
    
    if (
      name.includes('melatonin') || 
      name.includes('magnesium') || 
      name.includes('glycine') || 
      name.includes('valerian') ||
      name.includes('zinc') ||
      category.includes('sleep')
    ) {
      return 'Before bed';
    }
    
    if (
      name.includes('caffeine') || 
      name.includes('ginseng') ||
      category.includes('energy') ||
      description.includes('energy')
    ) {
      return 'Morning';
    }
    
    if (
      name.includes('protein') ||
      name.includes('enzyme') ||
      category.includes('digestion') ||
      description.includes('digestion')
    ) {
      return 'With meals';
    }
    
    if (
      name.includes('creatine') ||
      name.includes('beta-alanine') ||
      name.includes('citrulline') ||
      category.includes('performance')
    ) {
      return 'Before workout';
    }
    
    return 'Morning';
  };
  
  const removeSupplementFromStack = (index: number) => {
    setStackItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateStackItem = (index: number, field: keyof StackItem, value: any) => {
    setStackItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };
  
  const calculateTotalPrice = () => {
    return stackItems.reduce((sum, item) => sum + item.supplement.price_aed, 0);
  };
  
  const handleSaveStack = async () => {
    if (stackItems.length === 0) {
      setError('Please add at least one supplement to your stack.');
      return;
    }
    
    if (!stackName.trim()) {
      setError('Please provide a name for your stack.');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const stackData = {
        user_id: user.id,
        name: stackName,
        description: stackDescription,
        category: stackCategory,
        components: stackItems.map(item => ({
          id: item.supplement.id,
          name: item.supplement.name,
          dosage: item.dosage,
          timing: item.timing,
          notes: item.notes,
          price: item.supplement.price_aed
        })),
        total_price: calculateTotalPrice(),
        is_active: true
      };
      
      await onSaveStack(stackData);
      
      setSuccess('Stack saved successfully!');
      
      // Reset form after successful save
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving stack:', err);
      setError('Failed to save stack. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const categoryOptions = [
    { value: 'Custom', label: 'Custom' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Recovery', label: 'Recovery' },
    { value: 'Sleep', label: 'Sleep' },
    { value: 'Cognitive', label: 'Cognitive' },
    { value: 'Immune', label: 'Immune' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Longevity', label: 'Longevity' },
    { value: 'Gut Health', label: 'Gut Health' }
  ];
  
  const timingOptions = [
    { value: 'Morning', label: 'Morning' },
    { value: 'Afternoon', label: 'Afternoon' },
    { value: 'Evening', label: 'Evening' },
    { value: 'Before bed', label: 'Before bed' },
    { value: 'With meals', label: 'With meals' },
    { value: 'Before workout', label: 'Before workout' },
    { value: 'After workout', label: 'After workout' }
  ];
  
  const getTierBadge = (tier: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    };
    
    const icons = {
      green: <Check className="w-3 h-3 mr-1" />,
      yellow: <AlertCircle className="w-3 h-3 mr-1" />,
      orange: <Info className="w-3 h-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[tier]}`}>
        {icons[tier]}
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Build Your Supplement Stack</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Stack Name</label>
              <Input
                value={stackName}
                onChange={(e) => setStackName(e.target.value)}
                placeholder="Enter a name for your stack"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === stackCategory)}
                onChange={(option) => setStackCategory(option?.value || 'Custom')}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={stackDescription}
              onChange={(e) => setStackDescription(e.target.value)}
              placeholder="Describe the purpose of this stack..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>
          
          <div className="mt-6 mb-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center text-blue-800 dark:text-blue-300 mb-2">
              <Info className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">Evidence-Based Recommendations</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              For optimal results, consider these evidence-based guidelines:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 list-disc pl-5 space-y-1">
              <li>Start with 1-3 supplements to assess individual responses</li>
              <li>Green tier supplements have the strongest scientific support</li>
              <li>Take fat-soluble supplements (Vitamin D, Omega-3s) with meals containing fat</li>
              <li>Check for interactions if you're taking medications</li>
              <li>Some supplements work best when cycled (e.g., adaptogenic herbs)</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supplements in Stack</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total: <span className="font-bold text-primary">{calculateTotalPrice().toFixed(2)} AED</span>
              </div>
            </div>
            
            {stackItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No supplements added yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add supplements from the list below to build your personalized stack
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stackItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-gray-900 dark:text-white mr-2">
                            {item.supplement.name}
                            <span className="text-xs ml-2 text-gray-500">{item.supplement.brand || 'Biowell'}</span>
                          </h4>
                          {getTierBadge(item.supplement.tier)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.supplement.brand}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white mr-4">
                          {item.supplement.price_aed.toFixed(2)} AED
                        </span>
                        <button
                          onClick={() => removeSupplementFromStack(index)}
                          className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Dosage</label>
                        <Input
                          value={item.dosage}
                          onChange={(e) => updateStackItem(index, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg daily"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Timing</label>
                        <Select
                          options={timingOptions}
                          value={timingOptions.find(option => option.value === item.timing)}
                          onChange={(option) => updateStackItem(index, 'timing', option?.value || 'Morning')}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                      <Input
                        value={item.notes || ''}
                        onChange={(e) => updateStackItem(index, 'notes', e.target.value)}
                        placeholder="Any special instructions or notes"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Supplements</h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading supplements...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {supplements
                  .filter(supp => !stackItems.some(item => item.supplement.id === supp.id))
                  .map(supplement => (
                    <div 
                      key={supplement.id} 
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addSupplementToStack(supplement)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {supplement.name}
                        </h4>
                        {getTierBadge(supplement.tier)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {supplement.brand}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-medium">
                          {supplement.price_aed.toFixed(2)} AED
                        </span>
                        <button
                          className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            addSupplementToStack(supplement);
                          }}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveStack}
              disabled={isSaving || stackItems.length === 0}
            >
              {isSaving ? 'Saving...' : 'Save Stack'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StackBuilderModal;