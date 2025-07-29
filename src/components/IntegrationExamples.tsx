/**
 * Integration Examples - Converting Existing Components
 * This file shows how to update your existing BioWell components
 * to use the new focus management system
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, AlertTriangle } from 'lucide-react';

// Import the new focus management utilities
import AccessibleModal from '../ui/AccessibleModal';
import AccessibleDropdown from '../ui/AccessibleDropdown';
import LiveRegion, { StatusMessage, FormValidationAnnouncer } from '../ui/LiveRegion';
import { useFocusManagement, useFocusTrap } from '../../utils/focusManagement';

// =============================================================================
// 1. EXAMPLE: Enhanced StackBuilderModal
// =============================================================================

interface Supplement {
  id: string;
  name: string;
  category: string;
  dosage: string;
  description?: string;
}

interface EnhancedStackBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplements: Supplement[]) => void;
  availableSupplements: Supplement[];
  currentStack: Supplement[];
}

const EnhancedStackBuilderModal: React.FC<EnhancedStackBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableSupplements,
  currentStack
}) => {
  const { announce } = useFocusManagement();
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>(currentStack);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert supplements to dropdown options
  const supplementOptions = availableSupplements.map(supp => ({
    value: supp.id,
    label: supp.name,
    description: supp.description,
    group: supp.category
  }));

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...Array.from(new Set(availableSupplements.map(s => s.category)))
      .map(cat => ({ value: cat, label: cat }))
  ];

  const handleAddSupplement = (supplementId: string) => {
    const supplement = availableSupplements.find(s => s.id === supplementId);
    if (supplement && !selectedSupplements.find(s => s.id === supplementId)) {
      const newStack = [...selectedSupplements, supplement];
      setSelectedSupplements(newStack);
      announce(`${supplement.name} added to stack`, 'polite');
    }
  };

  const handleRemoveSupplement = (supplementId: string) => {
    const supplement = selectedSupplements.find(s => s.id === supplementId);
    if (supplement) {
      setSelectedSupplements(prev => prev.filter(s => s.id !== supplementId));
      announce(`${supplement.name} removed from stack`, 'polite');
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(selectedSupplements);
      announce(`Stack saved with ${selectedSupplements.length} supplements`, 'polite');
      onClose();
    } catch (error) {
      announce('Failed to save stack. Please try again.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Build Your Supplement Stack"
      description="Select supplements to create your personalized stack"
      size="lg"
      initialFocus="input[name='search']"
    >
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="supplement-search" className="block text-sm font-medium mb-2">
              Search Supplements
            </label>
            <input
              id="supplement-search"
              name="search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ingredient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <AccessibleDropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            label="Filter by Category"
            placeholder="Select category"
          />
        </div>

        {/* Available Supplements */}
        <div>
          <h3 className="text-lg font-medium mb-3">Available Supplements</h3>
          <AccessibleDropdown
            options={supplementOptions.filter(opt => {
              const supplement = availableSupplements.find(s => s.id === opt.value);
              if (!supplement) return false;
              
              const matchesSearch = !searchQuery || 
                supplement.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCategory = !selectedCategory || 
                supplement.category === selectedCategory;
              
              return matchesSearch && matchesCategory;
            })}
            value=""
            onChange={handleAddSupplement}
            searchable={true}
            placeholder="Select supplement to add"
            label="Add Supplement"
            description="Choose supplements to add to your stack"
          />
        </div>

        {/* Current Stack */}
        <div>
          <h3 className="text-lg font-medium mb-3">
            Your Stack ({selectedSupplements.length} supplements)
          </h3>
          
          {selectedSupplements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No supplements in your stack yet.</p>
              <p className="text-sm mt-1">Add supplements from the list above.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedSupplements.map((supplement) => (
                <div 
                  key={supplement.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{supplement.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {supplement.category} • {supplement.dosage}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSupplement(supplement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    aria-label={`Remove ${supplement.name} from stack`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || selectedSupplements.length === 0}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Save Stack
          </button>
        </div>
      </div>

      {/* Live Region for announcements */}
      <LiveRegion level="polite">
        {/* Dynamic announcements will be handled by the announce function */}
      </LiveRegion>
    </AccessibleModal>
  );
};

// =============================================================================
// 2. EXAMPLE: Enhanced QuickWorkoutLogger
// =============================================================================

interface WorkoutData {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

interface EnhancedQuickWorkoutLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: WorkoutData) => Promise<void>;
  exercises: string[];
}

const EnhancedQuickWorkoutLogger: React.FC<EnhancedQuickWorkoutLoggerProps> = ({
  isOpen,
  onClose,
  onSave,
  exercises
}) => {
  const { announce, focusFirstError } = useFocusManagement();
  
  const [formData, setFormData] = useState<WorkoutData>({
    exercise: '',
    sets: 0,
    reps: 0,
    weight: 0,
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const exerciseOptions = exercises.map(exercise => ({
    value: exercise,
    label: exercise
  }));

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.exercise) {
      errors.exercise = 'Exercise is required';
    }
    if (formData.sets < 1) {
      errors.sets = 'Sets must be at least 1';
    }
    if (formData.reps < 1) {
      errors.reps = 'Reps must be at least 1';
    }
    if (formData.weight < 0) {
      errors.weight = 'Weight cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setFormTouched({
      exercise: true,
      sets: true,
      reps: true,
      weight: true,
      notes: true
    });

    if (!validateForm()) {
      announce('Please correct the errors and try again', 'assertive');
      focusFirstError();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await onSave(formData);
      setSubmitStatus('success');
      announce('Workout logged successfully', 'polite');
      
      // Reset form
      setFormData({ exercise: '', sets: 0, reps: 0, weight: 0, notes: '' });
      setFormErrors({});
      setFormTouched({});
      
      setTimeout(() => onClose(), 1000); // Brief delay to show success
    } catch (error) {
      setSubmitStatus('error');
      announce('Failed to log workout. Please try again.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof WorkoutData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Workout Logger"
      description="Log your workout quickly and easily"
      initialFocus="input[name='exercise-search']"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exercise Selection */}
        <AccessibleDropdown
          options={exerciseOptions}
          value={formData.exercise}
          onChange={(value) => handleFieldChange('exercise', value)}
          searchable={true}
          label="Exercise"
          placeholder="Search and select exercise"
          required
          error={formErrors.exercise && formTouched.exercise ? formErrors.exercise : undefined}
        />

        {/* Sets, Reps, Weight Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="sets" className="block text-sm font-medium mb-1">
              Sets *
            </label>
            <input
              id="sets"
              name="sets"
              type="number"
              min="1"
              value={formData.sets || ''}
              onChange={(e) => handleFieldChange('sets', parseInt(e.target.value) || 0)}
              onBlur={() => setFormTouched(prev => ({ ...prev, sets: true }))}
              className={`
                w-full px-3 py-2 border rounded-md
                ${formErrors.sets && formTouched.sets
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:ring-primary/20'
                }
                focus:outline-none focus:ring-2
              `}
              aria-invalid={Boolean(formErrors.sets && formTouched.sets)}
              required
            />
            {formErrors.sets && formTouched.sets && (
              <p className="mt-1 text-sm text-red-600">{formErrors.sets}</p>
            )}
          </div>

          <div>
            <label htmlFor="reps" className="block text-sm font-medium mb-1">
              Reps *
            </label>
            <input
              id="reps"
              name="reps"
              type="number"
              min="1"
              value={formData.reps || ''}
              onChange={(e) => handleFieldChange('reps', parseInt(e.target.value) || 0)}
              onBlur={() => setFormTouched(prev => ({ ...prev, reps: true }))}
              className={`
                w-full px-3 py-2 border rounded-md
                ${formErrors.reps && formTouched.reps
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:ring-primary/20'
                }
                focus:outline-none focus:ring-2
              `}
              aria-invalid={Boolean(formErrors.reps && formTouched.reps)}
              required
            />
            {formErrors.reps && formTouched.reps && (
              <p className="mt-1 text-sm text-red-600">{formErrors.reps}</p>
            )}
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1">
              Weight (lbs)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.5"
              value={formData.weight || ''}
              onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value) || 0)}
              onBlur={() => setFormTouched(prev => ({ ...prev, weight: true }))}
              className={`
                w-full px-3 py-2 border rounded-md
                ${formErrors.weight && formTouched.weight
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:ring-primary/20'
                }
                focus:outline-none focus:ring-2
              `}
              aria-invalid={Boolean(formErrors.weight && formTouched.weight)}
            />
            {formErrors.weight && formTouched.weight && (
              <p className="mt-1 text-sm text-red-600">{formErrors.weight}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Any additional notes about this exercise..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <StatusMessage
            message="Workout logged successfully!"
            type="success"
          />
        )}

        {submitStatus === 'error' && (
          <StatusMessage
            message="Failed to log workout. Please try again."
            type="error"
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSubmitting ? 'Logging...' : 'Log Workout'}
          </button>
        </div>
      </form>

      {/* Form Validation Announcer */}
      <FormValidationAnnouncer
        errors={formErrors}
        touched={formTouched}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
      />
    </AccessibleModal>
  );
};

// =============================================================================
// 3. EXAMPLE: Enhanced PWA Install Prompt
// =============================================================================

interface EnhancedPWAInstallPromptProps {
  onInstall: () => Promise<void>;
  onDismiss: () => void;
  canInstall: boolean;
}

const EnhancedPWAInstallPrompt: React.FC<EnhancedPWAInstallPromptProps> = ({
  onInstall,
  onDismiss,
  canInstall
}) => {
  const { announce } = useFocusManagement();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<'success' | 'error' | null>(null);

  const handleInstall = async () => {
    setIsInstalling(true);
    setInstallStatus(null);

    try {
      await onInstall();
      setInstallStatus('success');
      announce('BioWell app installed successfully', 'polite');
      
      setTimeout(() => {
        onDismiss();
      }, 2000);
    } catch (error) {
      setInstallStatus('error');
      announce('Failed to install app. Please try again.', 'assertive');
    } finally {
      setIsInstalling(false);
    }
  };

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
        role="banner"
        aria-label="App installation prompt"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Install BioWell App
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Get faster access and offline capabilities by installing our app.
            </p>

            {installStatus === 'success' && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">App installed successfully!</span>
              </div>
            )}

            {installStatus === 'error' && (
              <div className="mt-2 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Installation failed. Please try again.</span>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleInstall}
                disabled={isInstalling}
                className="
                  px-3 py-1.5 bg-primary text-white text-sm rounded-md
                  hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
              >
                {isInstalling && (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
              
              <button
                type="button"
                onClick={onDismiss}
                disabled={isInstalling}
                className="
                  px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm
                  hover:text-gray-900 dark:hover:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-gray-500/20
                  disabled:opacity-50
                "
              >
                Not now
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            disabled={isInstalling}
            className="
              flex-shrink-0 p-1 text-gray-400 hover:text-gray-600
              focus:outline-none focus:ring-2 focus:ring-gray-500/20 rounded
              disabled:opacity-50
            "
            aria-label="Dismiss installation prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Live region for installation status */}
      <LiveRegion level="polite">
        {installStatus === 'success' && 'BioWell app installed successfully'}
        {installStatus === 'error' && 'App installation failed'}
      </LiveRegion>
    </div>
  );
};

// =============================================================================
// EXPORT ALL ENHANCED COMPONENTS
// =============================================================================

export {
  EnhancedStackBuilderModal,
  EnhancedQuickWorkoutLogger,
  EnhancedPWAInstallPrompt
};

/**
 * Migration Guide:
 * 
 * 1. Replace existing modal components with AccessibleModal
 * 2. Use AccessibleDropdown for all select inputs
 * 3. Add useFocusManagement hook for announcements
 * 4. Include FormValidationAnnouncer for forms
 * 5. Use LiveRegion for dynamic content updates
 * 6. Add proper ARIA labels and descriptions
 * 7. Implement keyboard navigation
 * 8. Test with screen readers
 */
