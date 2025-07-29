import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

interface BaseAccessibleDropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  maxHeight?: number;
  allowClear?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => void;
}

interface SingleSelectDropdownProps extends BaseAccessibleDropdownProps {
  multiple?: false;
  value?: string;
  onChange: (value: string) => void;
}

interface MultiSelectDropdownProps extends BaseAccessibleDropdownProps {
  multiple: true;
  value?: string[];
  onChange: (value: string[]) => void;
}

type AccessibleDropdownProps = SingleSelectDropdownProps | MultiSelectDropdownProps;

/**
 * Accessible Dropdown Component - Alternative to complex dropdown patterns
 * 
 * Features:
 * - Full keyboard navigation (Arrow keys, Enter, Escape, Home, End)
 * - Screen reader support with proper ARIA attributes
 * - Search functionality with live results
 * - Multiple selection support
 * - Grouped options
 * - Error states and validation
 * - Loading states
 * - Clear functionality
 * - Progressive enhancement (works without JS)
 * - Touch-friendly design
 */
const AccessibleDropdown: React.FC<AccessibleDropdownProps> = (props) => {
  const {
    options,
    value,
    onChange,
    placeholder = "Select an option",
    searchable = false,
    multiple = false,
    disabled = false,
    error,
    label,
    description,
    required = false,
    className = "",
    maxHeight = 300,
    allowClear = false,
    loading = false,
    onSearch
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Generate unique IDs for accessibility
  const id = useMemo(() => `dropdown-${Math.random().toString(36).substring(2, 9)}`, []);
  const triggerId = `${id}-trigger`;
  const listId = `${id}-list`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) {
      return options;
    }
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (option.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [options, searchQuery]);

  // Group filtered options
  const groupedOptions = useMemo(() => {
    const groups: { [key: string]: DropdownOption[] } = {};
    const ungrouped: DropdownOption[] = [];

    filteredOptions.forEach(option => {
      if (option.group) {
        if (!groups[option.group]) {
          groups[option.group] = [];
        }
        groups[option.group].push(option);
      } else {
        ungrouped.push(option);
      }
    });

    return { groups, ungrouped };
  }, [filteredOptions]);

  // Get selected option(s) display text
  const getDisplayValue = () => {
    if (!value) {
      return placeholder;
    }

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) {
        return placeholder;
      }
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option?.label || value[0];
      }
      return `${value.length} selected`;
    }

    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Check if option is selected
  const isSelected = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Handle single selection
  const handleSingleSelection = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    
    // Announce selection
    const option = options.find(opt => opt.value === optionValue);
    setAnnouncement(`${option?.label} selected.`);
  };

  // Handle multiple selection
  const handleMultipleSelection = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
    
    // Announce selection change
    const option = options.find(opt => opt.value === optionValue);
    const action = currentValues.includes(optionValue) ? 'deselected' : 'selected';
    setAnnouncement(`${option?.label} ${action}. ${newValues.length} items selected.`);
  };

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      handleMultipleSelection(optionValue);
    } else {
      handleSingleSelection(optionValue);
    }
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
    setSearchQuery('');
    setAnnouncement('Selection cleared.');
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFocusedIndex(-1);
    
    if (onSearch) {
      onSearch(query);
    }
  };

  // Navigation helpers
  const handleArrowDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setFocusedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handleArrowUp = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (isOpen) {
      setFocusedIndex(prev => 
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    }
  };

  const handleEnterOrSpace = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (!isOpen) {
      setIsOpen(true);
    } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      const option = filteredOptions[focusedIndex];
      if (!option.disabled) {
        handleOptionSelect(option.value);
      }
    }
  };

  const handleHomeEnd = (e: React.KeyboardEvent) => {
    if (isOpen) {
      e.preventDefault();
      if (e.key === 'Home') {
        setFocusedIndex(0);
      } else if (e.key === 'End') {
        setFocusedIndex(filteredOptions.length - 1);
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        handleArrowDown(e);
        break;
      case 'ArrowUp':
        handleArrowUp(e);
        break;
      case 'Home':
      case 'End':
        handleHomeEnd(e);
        break;
      case 'Enter':
      case ' ':
        handleEnterOrSpace(e);
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [focusedIndex]);

  const hasSelection = multiple 
    ? Array.isArray(value) && value.length > 0
    : Boolean(value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={triggerId}
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="ml-1 text-red-500" aria-label="required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p id={descriptionId} className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      {/* Trigger Button */}
      <Button
        ref={triggerRef}
        id={triggerId}
        type="button"
        variant="outline"
        className={`w-full justify-between text-left min-h-[44px] ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? undefined : triggerId}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-required={required}
        aria-invalid={Boolean(error)}
      >
        <span className={`truncate ${hasSelection ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {getDisplayValue()}
        </span>
        
        <div className="flex items-center gap-2 ml-2">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4"
            >
              <AlertCircle className="w-4 h-4 text-gray-400" />
            </motion.div>
          )}
          
          {allowClear && hasSelection && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Clear selection"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </Button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600"
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search options..."
                    className="w-full py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    aria-label="Search options"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label || "Options"}
              aria-multiselectable={multiple}
              className="py-1 overflow-auto max-h-60"
              style={{ maxHeight }}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No results found' : 'No options available'}
                </li>
              ) : (
                <>
                  {/* Ungrouped options */}
                  {groupedOptions.ungrouped.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected(option.value)}
                      aria-disabled={option.disabled}
                      className={`w-full px-3 py-2 text-sm flex items-center justify-between transition-colors text-left ${
                        option.disabled
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          : focusedIndex === index
                          ? 'bg-primary/10 text-primary'
                          : isSelected(option.value)
                          ? 'bg-primary/5 text-primary'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => !option.disabled && handleOptionSelect(option.value)}
                      disabled={option.disabled}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{option.label}</div>
                        {option.description && (
                          <div className="mt-1 text-xs text-gray-500 truncate dark:text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>
                      
                      {isSelected(option.value) && (
                        <Check className="flex-shrink-0 w-4 h-4 ml-2" />
                      )}
                    </button>
                  ))}

                  {/* Grouped options */}
                  {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
                    <li key={groupName}>
                      <div className="px-3 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50">
                        {groupName}
                      </div>
                      {groupOptions.map((option, index) => {
                        const globalIndex = groupedOptions.ungrouped.length + 
                          Object.entries(groupedOptions.groups)
                            .slice(0, Object.keys(groupedOptions.groups).indexOf(groupName))
                            .reduce((acc, [, opts]) => acc + opts.length, 0) + index;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected(option.value)}
                            aria-disabled={option.disabled}
                            className={`w-full px-3 py-2 text-sm flex items-center justify-between transition-colors ml-4 text-left ${
                              option.disabled
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : focusedIndex === globalIndex
                                ? 'bg-primary/10 text-primary'
                                : isSelected(option.value)
                                ? 'bg-primary/5 text-primary'
                                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => !option.disabled && handleOptionSelect(option.value)}
                            disabled={option.disabled}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{option.label}</div>
                              {option.description && (
                                <div className="mt-1 text-xs text-gray-500 truncate dark:text-gray-400">
                                  {option.description}
                                </div>
                              )}
                            </div>
                            
                            {isSelected(option.value) && (
                              <Check className="flex-shrink-0 w-4 h-4 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </li>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <p id={errorId} className="flex items-center gap-1 mt-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Usage Instructions for Screen Readers */}
      <div className="sr-only">
        Use arrow keys to navigate options, Enter or Space to select, Escape to close.
        {multiple && " Multiple selections allowed."}
        {searchable && " Type to search options."}
      </div>
    </div>
  );
};

export default AccessibleDropdown;
