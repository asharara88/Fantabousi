import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DataItem {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  render?: (value: any, item: DataItem) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  description?: string; // For aria-describedby
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface AccessibleDataTableProps {
  data: DataItem[];
  columns: Column[];
  title?: string;
  description?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  error?: string;
  emptyState?: React.ReactNode;
  onSelectionChange?: (selectedIds: string[]) => void;
  onRowClick?: (item: DataItem) => void;
  className?: string;
  ariaLabel?: string;
  announceChanges?: boolean;
}

/**
 * Enhanced Accessible Data Table Component
 * 
 * Accessibility Features:
 * - Full WCAG 2.1 AA compliance
 * - Proper table semantics with caption, thead, tbody
 * - Scope attributes for headers
 * - ARIA labels and descriptions
 * - Keyboard navigation (Arrow keys, Home, End, Page Up/Down)
 * - Screen reader announcements for sorting, filtering, pagination
 * - High contrast focus indicators
 * - Sortable column indicators
 * - Live regions for dynamic content updates
 * - Accessible pagination controls
 * - Row selection with proper ARIA states
 */
const AccessibleDataTable: React.FC<AccessibleDataTableProps> = ({
  data,
  columns,
  title = "Data Table",
  description,
  searchable = true,
  filterable = false,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  loading = false,
  error,
  emptyState,
  onSelectionChange,
  onRowClick,
  className = '',
  ariaLabel,
  announceChanges = true
}) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  // Refs for accessibility
  const tableRef = useRef<HTMLTableElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Announce changes to screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges || !announcementRef.current) return;
    
    announcementRef.current.textContent = message;
    announcementRef.current.setAttribute('aria-live', priority);
    
    // Clear after a delay to allow for new announcements
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  }, [announceChanges]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchQuery) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      filtered = filtered.filter(item =>
        searchableColumns.some(column =>
          String(item[column.key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filtered;
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const result = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    const newDirection = 
      sortConfig?.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    setSortConfig({ key: columnKey, direction: newDirection });
    
    const column = columns.find(col => col.key === columnKey);
    announceToScreenReader(
      `Table sorted by ${column?.label} in ${newDirection}ending order. ${sortedData.length} items.`
    );
  }, [sortConfig, columns, sortedData.length, announceToScreenReader]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    if (query) {
      announceToScreenReader(`Search results updated. ${filteredData.length} items found.`);
    } else {
      announceToScreenReader(`Search cleared. Showing all ${data.length} items.`);
    }
  }, [filteredData.length, data.length, announceToScreenReader]);

  // Handle row selection
  const handleRowSelect = useCallback((id: string, checked: boolean) => {
    const newSelectedIds = checked 
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
    
    announceToScreenReader(
      checked 
        ? `Row selected. ${newSelectedIds.length} of ${paginatedData.length} rows selected.`
        : `Row deselected. ${newSelectedIds.length} of ${paginatedData.length} rows selected.`
    );
  }, [selectedIds, onSelectionChange, paginatedData.length, announceToScreenReader]);

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelectedIds = checked ? paginatedData.map(item => item.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
    
    announceToScreenReader(
      checked 
        ? `All ${paginatedData.length} rows selected.`
        : 'All rows deselected.'
    );
  }, [paginatedData, onSelectionChange, announceToScreenReader]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setFocusedCell(null);
    
    announceToScreenReader(`Page ${page} of ${totalPages}. Showing ${paginatedData.length} items.`);
    
    // Focus first data cell on page change
    setTimeout(() => {
      const firstCell = tableRef.current?.querySelector('tbody td[tabindex="0"]') as HTMLElement;
      firstCell?.focus();
    }, 100);
  }, [totalPages, paginatedData.length, announceToScreenReader]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!focusedCell) return;

    const { row, col } = focusedCell;
    const maxRow = paginatedData.length - 1;
    const maxCol = columns.length - 1 + (selectable ? 1 : 0);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) {
          setFocusedCell({ row: row - 1, col });
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < maxRow) {
          setFocusedCell({ row: row + 1, col });
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) {
          setFocusedCell({ row, col: col - 1 });
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < maxCol) {
          setFocusedCell({ row, col: col + 1 });
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedCell({ row, col: 0 });
        break;
      case 'End':
        e.preventDefault();
        setFocusedCell({ row, col: maxCol });
        break;
      case 'PageUp':
        e.preventDefault();
        if (currentPage > 1) {
          handlePageChange(currentPage - 1);
        }
        break;
      case 'PageDown':
        e.preventDefault();
        if (currentPage < totalPages) {
          handlePageChange(currentPage + 1);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onRowClick) {
          onRowClick(paginatedData[row]);
        }
        break;
    }
  }, [focusedCell, paginatedData, columns.length, selectable, currentPage, totalPages, handlePageChange, onRowClick]);

  // Focus management
  useEffect(() => {
    if (focusedCell) {
      const cellSelector = selectable 
        ? `tbody tr:nth-child(${focusedCell.row + 1}) td:nth-child(${focusedCell.col + 1})`
        : `tbody tr:nth-child(${focusedCell.row + 1}) td:nth-child(${focusedCell.col + 1})`;
      
      const cell = tableRef.current?.querySelector(cellSelector) as HTMLElement;
      cell?.focus();
    }
  }, [focusedCell, selectable]);

  // Loading state
  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-text-light">Loading data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${className} bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6`}>
        <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Error loading data</h3>
        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  // Empty state
  if (paginatedData.length === 0 && !loading) {
    return (
      <div className={`${className} text-center p-8`}>
        {emptyState || (
          <div>
            <p className="text-text-light text-lg mb-2">No data available</p>
            {searchQuery && (
              <p className="text-text-muted text-sm">
                Try adjusting your search criteria
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />

      {/* Table controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search table data..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                       focus:ring-2 focus:ring-primary/20 focus:border-primary
                       bg-white dark:bg-gray-800 text-text placeholder-text-muted
                       text-readable"
              aria-label="Search table data"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Use this field to search across all table data
            </div>
          </div>
        )}

        {/* Table summary */}
        <div className="text-sm text-text-light">
          {searchQuery ? (
            <span aria-live="polite">
              Showing {paginatedData.length} of {filteredData.length} results 
              (filtered from {data.length} total)
            </span>
          ) : (
            <span>
              Showing {paginatedData.length} of {data.length} items
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table
          ref={tableRef}
          className="w-full border-collapse text-readable"
          role="table"
          aria-label={ariaLabel || title}
          aria-describedby={description ? 'table-description' : undefined}
          onKeyDown={handleKeyDown}
        >
          {/* Caption for accessibility */}
          <caption className="sr-only">
            {title}. {description}
            {sortConfig && (
              <span>
                {' '}Sorted by {columns.find(col => col.key === sortConfig.key)?.label} in {sortConfig.direction}ending order.
              </span>
            )}
            {selectable && (
              <span>
                {' '}Table supports row selection. Use checkboxes to select rows.
              </span>
            )}
            {' '}Use arrow keys to navigate, Enter to activate, and Page Up/Down to change pages.
          </caption>

          {description && (
            <caption id="table-description" className="text-left p-4 text-text-light text-sm border-b border-gray-200 dark:border-gray-700">
              {description}
            </caption>
          )}

          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th
                  scope="col"
                  className="p-3 text-left border-b border-gray-200 dark:border-gray-700"
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="border-gray-300 rounded text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
                      aria-describedby="select-all-help"
                    />
                    <span className="sr-only">Select all rows</span>
                  </label>
                  <div id="select-all-help" className="sr-only">
                    Select or deselect all visible rows
                  </div>
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`p-3 text-${column.align || 'left'} font-medium text-text border-b border-gray-200 dark:border-gray-700`}
                  style={{ width: column.width }}
                  aria-describedby={column.description ? `${column.key}-desc` : undefined}
                >
                  {column.sortable && sortable ? (
                    <button
                      className="flex items-center gap-2 hover:text-primary focus:outline-none focus:text-primary
                               focus:ring-2 focus:ring-primary/20 rounded px-1 py-1 -mx-1 -my-1
                               transition-colors duration-200"
                      onClick={() => handleSort(column.key)}
                      aria-label={`Sort by ${column.label}${
                        sortConfig?.key === column.key 
                          ? ` (currently ${sortConfig.direction}ending)`
                          : ''
                      }`}
                      aria-describedby={`${column.key}-sort-help`}
                    >
                      <span>{column.label}</span>
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <SortAsc className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <SortDesc className="w-4 h-4" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                  
                  {column.description && (
                    <div id={`${column.key}-desc`} className="sr-only">
                      {column.description}
                    </div>
                  )}
                  
                  {column.sortable && sortable && (
                    <div id={`${column.key}-sort-help`} className="sr-only">
                      Click to sort this column
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((item, rowIndex) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${selectedIds.includes(item.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                onClick={() => onRowClick?.(item)}
                tabIndex={onRowClick ? 0 : -1}
                role={onRowClick ? 'button' : 'row'}
                aria-selected={selectedIds.includes(item.id)}
                aria-label={onRowClick ? `Click to view details for row ${rowIndex + 1}` : undefined}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
                    e.preventDefault();
                    onRowClick(item);
                  }
                }}
              >
                {selectable && (
                  <td className="p-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => handleRowSelect(item.id, e.target.checked)}
                        className="border-gray-300 rounded text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2"
                        onClick={(e) => e.stopPropagation()}
                        aria-describedby={`row-${rowIndex}-select-help`}
                      />
                      <span className="sr-only">Select row {rowIndex + 1}</span>
                    </label>
                    <div id={`row-${rowIndex}-select-help`} className="sr-only">
                      Select this row for bulk actions
                    </div>
                  </td>
                )}
                
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={`p-3 text-${column.align || 'left'} text-text ${
                      focusedCell?.row === rowIndex && focusedCell?.col === colIndex
                        ? 'ring-2 ring-primary/40 ring-inset'
                        : ''
                    }`}
                    tabIndex={focusedCell?.row === rowIndex && focusedCell?.col === colIndex ? 0 : -1}
                    onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                    role="gridcell"
                    aria-describedby={column.description ? `${column.key}-desc` : undefined}
                  >
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4"
          aria-label="Table pagination"
        >
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                       border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-text hover:bg-gray-50 dark:hover:bg-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:ring-2 focus:ring-primary/20 focus:border-primary"
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                       border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-text hover:bg-gray-50 dark:hover:bg-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:ring-2 focus:ring-primary/20 focus:border-primary"
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-text-light">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, sortedData.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{sortedData.length}</span>
                {' '}results
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center p-2 rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-text hover:bg-gray-50 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:ring-2 focus:ring-primary/20 focus:border-primary"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-text-muted">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                               border focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        page === currentPage
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center p-2 rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-text hover:bg-gray-50 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         focus:ring-2 focus:ring-primary/20 focus:border-primary"
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default AccessibleDataTable;
