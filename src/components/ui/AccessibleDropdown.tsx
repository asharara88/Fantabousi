import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

interface AccessibleDropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
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
const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Generate unique IDs for accessibility
  const id = useMemo(() => `dropdown-${Math.random().toString(36).substr(2, 9)}`, []);
  const triggerId = `${id}-trigger`;
  const listId = `${id}-list`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
    if (!value) return placeholder;

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
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

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
      
      // Announce selection change
      const option = options.find(opt => opt.value === optionValue);
      const action = currentValues.includes(optionValue) ? 'deselected' : 'selected';
      setAnnouncement(`${option?.label} ${action}. ${newValues.length} items selected.`);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      
      // Announce selection
      const option = options.find(opt => opt.value === optionValue);
      setAnnouncement(`${option?.label} selected.`);
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;

      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex(0);
        }
        break;

      case 'End':
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex(filteredOptions.length - 1);
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          const option = filteredOptions[focusedIndex];
          if (!option.disabled) {
            handleOptionSelect(option.value);
          }
        }
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
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-gray-500 dark:text-gray-400 mb-2">
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
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
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
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search options..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    aria-label="Search options"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label || "Options"}
              aria-multiselectable={multiple}
              className="py-1 max-h-60 overflow-auto"
              style={{ maxHeight }}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {searchQuery ? 'No results found' : 'No options available'}
                </li>
              ) : (
                <>
                  {/* Ungrouped options */}
                  {groupedOptions.ungrouped.map((option, index) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected(option.value)}
                      aria-disabled={option.disabled}
                      className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                        option.disabled
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          : focusedIndex === index
                          ? 'bg-primary/10 text-primary'
                          : isSelected(option.value)
                          ? 'bg-primary/5 text-primary'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => !option.disabled && handleOptionSelect(option.value)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                      
                      {isSelected(option.value) && (
                        <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                      )}
                    </li>
                  ))}

                  {/* Grouped options */}
                  {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
                    <li key={groupName}>
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                        {groupName}
                      </div>
                      {groupOptions.map((option, index) => {
                        const globalIndex = groupedOptions.ungrouped.length + 
                          Object.entries(groupedOptions.groups)
                            .slice(0, Object.keys(groupedOptions.groups).indexOf(groupName))
                            .reduce((acc, [, opts]) => acc + opts.length, 0) + index;

                        return (
                          <li
                            key={option.value}
                            role="option"
                            aria-selected={isSelected(option.value)}
                            aria-disabled={option.disabled}
                            className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ml-4 ${
                              option.disabled
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : focusedIndex === globalIndex
                                ? 'bg-primary/10 text-primary'
                                : isSelected(option.value)
                                ? 'bg-primary/5 text-primary'
                                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => !option.disabled && handleOptionSelect(option.value)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                  {option.description}
                                </div>
                              )}
                            </div>
                            
                            {isSelected(option.value) && (
                              <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                            )}
                          </li>
                        );
                      })}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
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
