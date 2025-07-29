import React, { useState, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import AccessibleModal from './ui/AccessibleModal';
import AccessibleDropdown from './ui/AccessibleDropdown';
import LiveRegion, { StatusMessage, FormValidationAnnouncer } from './ui/LiveRegion';
import { useFocusManagement } from '../utils/focusManagement';

interface DataItem {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
}

/**
 * Comprehensive Focus Management Demo
 * Demonstrates all focus management features and best practices
 */
const FocusManagementDemo: React.FC = () => {
  const { announce, saveFocus, restoreFocus, focusFirstError } = useFocusManagement();
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', category: '', status: 'active' as const });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  // Data states
  const [items, setItems] = useState<DataItem[]>([
    { id: '1', name: 'Sample Item 1', category: 'Health', status: 'active' },
    { id: '2', name: 'Sample Item 2', category: 'Fitness', status: 'inactive' },
    { id: '3', name: 'Sample Item 3', category: 'Nutrition', status: 'active' },
  ]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);
  
  // Refs for focus management
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Categories for dropdown
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Health', label: 'Health' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Supplements', label: 'Supplements' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormTouched({ name: true, category: true, status: true });
    
    if (!validateForm()) {
      announce('Form has errors. Please correct them and try again.', 'assertive');
      focusFirstError();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedItem) {
        // Edit existing item
        setItems(prev => prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, ...formData }
            : item
        ));
        setStatusMessage({ text: 'Item updated successfully!', type: 'success' });
        announce('Item updated successfully', 'polite');
      } else {
        // Add new item
        const newItem: DataItem = {
          id: Date.now().toString(),
          ...formData
        };
        setItems(prev => [...prev, newItem]);
        setStatusMessage({ text: 'Item added successfully!', type: 'success' });
        announce('Item added successfully', 'polite');
      }
      
      setSubmitStatus('success');
      handleCloseModal();
      
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage({ text: 'Failed to save item. Please try again.', type: 'error' });
      announce('Failed to save item', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddModal = () => {
    saveFocus();
    setFormData({ name: '', category: '', status: 'active' });
    setFormErrors({});
    setFormTouched({});
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: DataItem) => {
    saveFocus();
    setFormData({ name: item.name, category: item.category, status: item.status });
    setFormErrors({});
    setFormTouched({});
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (item: DataItem) => {
    saveFocus();
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    setFormData({ name: '', category: '', status: 'active' });
    setFormErrors({});
    setFormTouched({});
    setSubmitStatus(null);
    
    // Focus will be restored automatically by the modal component
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      setItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setStatusMessage({ text: 'Item deleted successfully!', type: 'success' });
      announce(`${selectedItem.name} deleted`, 'polite');
      handleCloseModal();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Announce search results
    if (query) {
      const filteredCount = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      ).length;
      announce(`${filteredCount} items found for "${query}"`, 'polite');
    }
  };

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category);
    
    if (category) {
      const filteredCount = items.filter(item => item.category === category).length;
      announce(`Filtered to ${filteredCount} items in ${category} category`, 'polite');
    } else {
      announce('Filter cleared, showing all items', 'polite');
    }
  };

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <header className="mb-8">
        <h1 
          id="main-content"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          tabIndex={-1}
        >
          Focus Management Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive demonstration of focus management and accessibility features
        </p>
      </header>

      {/* Status Messages */}
      {statusMessage && (
        <div className="mb-6">
          <StatusMessage
            message={statusMessage.text}
            type={statusMessage.type}
            onDismiss={() => setStatusMessage(null)}
          />
        </div>
      )}

      {/* Controls Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="
                  w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600
                  rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                "
                aria-label="Search items"
              />
            </div>
            
            <div className="min-w-48">
              <AccessibleDropdown
                options={categoryOptions}
                value={filterCategory}
                onChange={handleCategoryFilter}
                placeholder="Filter by category"
                label="Category Filter"
                className="w-full"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            ref={addButtonRef}
            type="button"
            onClick={handleOpenAddModal}
            className="
              flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md
              hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20
              transition-colors
            "
            aria-describedby="add-button-desc"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <span id="add-button-desc" className="sr-only">
            Opens a dialog to add a new item
          </span>
        </div>
      </section>

      {/* Data Table */}
      <section>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Items ({filteredItems.length})
            </h2>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || filterCategory ? 'No items match your filters.' : 'No items found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table 
                ref={tableRef}
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                role="table"
                aria-label="Items table"
              >
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      scope="col"
                    >
                      Name
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      scope="col"
                    >
                      Category
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      scope="col"
                    >
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      scope="col"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-semibold rounded-full
                          ${item.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          }
                        `}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="
                              p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300
                              hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md
                              focus:outline-none focus:ring-2 focus:ring-blue-500/20
                            "
                            aria-label={`Edit ${item.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(item)}
                            className="
                              p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300
                              hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md
                              focus:outline-none focus:ring-2 focus:ring-red-500/20
                            "
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      <AccessibleModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={handleCloseModal}
        title={selectedItem ? 'Edit Item' : 'Add New Item'}
        description={selectedItem ? 'Update the item details below.' : 'Enter the details for the new item.'}
        initialFocus="input[name='name']"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              id="item-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              onBlur={() => setFormTouched(prev => ({ ...prev, name: true }))}
              className={`
                w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700
                text-gray-900 dark:text-white focus:outline-none focus:ring-2
                ${formErrors.name && formTouched.name
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary/20 focus:border-primary'
                }
              `}
              aria-invalid={Boolean(formErrors.name && formTouched.name)}
              aria-describedby={formErrors.name && formTouched.name ? 'name-error' : undefined}
              required
            />
            {formErrors.name && formTouched.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <AccessibleDropdown
              options={categoryOptions.slice(1)} // Remove "All Categories" option
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              label="Category"
              placeholder="Select a category"
              required
              error={formErrors.category && formTouched.category ? formErrors.category : undefined}
            />
          </div>

          <div>
            <AccessibleDropdown
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
              label="Status"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="
                px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md
                focus:outline-none focus:ring-2 focus:ring-gray-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-4 py-2 bg-primary text-white rounded-md
                hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isSubmitting ? 'Saving...' : (selectedItem ? 'Update' : 'Add')}
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

      {/* Delete Confirmation Modal */}
      <AccessibleModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        title="Delete Item"
        description="This action cannot be undone."
        role="alertdialog"
        initialFocus="button[data-action='cancel']"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete "{selectedItem?.name}"?
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              data-action="cancel"
              onClick={handleCloseModal}
              className="
                px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md
                focus:outline-none focus:ring-2 focus:ring-gray-500/20
              "
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteItem}
              className="
                px-4 py-2 bg-red-600 text-white rounded-md
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20
              "
            >
              Delete
            </button>
          </div>
        </div>
      </AccessibleModal>

      {/* Live region for dynamic announcements */}
      <LiveRegion level="polite">
        {/* This will announce dynamic content changes */}
      </LiveRegion>
    </div>
  );
};

export default FocusManagementDemo;
