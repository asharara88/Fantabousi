import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  MoreHorizontal
} from 'lucide-react';
import { Button } from './Button';
import AccessibleDropdown from './AccessibleDropdown';

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
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface AdvancedDataTableProps {
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
  viewMode?: 'table' | 'grid' | 'list';
  allowViewModeChange?: boolean;
  className?: string;
}

/**
 * Advanced Data Table Component - Accessible alternative to complex data displays
 * 
 * Features:
 * - Full keyboard navigation
 * - Screen reader support with proper table semantics
 * - Multiple view modes (table, grid, list)
 * - Advanced filtering and searching
 * - Sortable columns
 * - Row selection
 * - Pagination
 * - Loading and error states
 * - Responsive design
 * - Progressive enhancement
 */
const AdvancedDataTable: React.FC<AdvancedDataTableProps> = ({
  data,
  columns,
  title,
  description,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  loading = false,
  error,
  emptyState,
  onSelectionChange,
  onRowClick,
  viewMode: initialViewMode = 'table',
  allowViewModeChange = true,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const tableRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter and search data
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      result = result.filter(item =>
        searchableColumns.some(col =>
          String(item[col.key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter(item =>
          values.includes(String(item[key]))
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
      });
    }

    return result;
  }, [data, searchQuery, filters, sortConfig, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));

    setAnnouncement(`Sorted by ${column.label} ${sortConfig?.direction === 'asc' ? 'descending' : 'ascending'}`);
  };

  // Handle selection
  const handleRowSelect = (id: string, selected: boolean) => {
    const newSelectedIds = selected
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    
    setSelectedIds(newSelectedIds);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelectedIds = selected ? paginatedData.map(item => item.id) : [];
    setSelectedIds(newSelectedIds);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }

    setAnnouncement(`${selected ? 'Selected' : 'Deselected'} all ${paginatedData.length} rows`);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setAnnouncement(`${filteredData.length} results found`);
  };

  // Get filter options for a column
  const getFilterOptions = (columnKey: string): FilterOption[] => {
    const values = data.map(item => String(item[columnKey]));
    const uniqueValues = [...new Set(values)];
    
    return uniqueValues.map(value => {
      const count = values.filter(v => v === value).length;
      return {
        value,
        label: value,
        count
      };
    });
  };

  // Handle filter change
  const handleFilterChange = (columnKey: string, selectedValues: string | string[]) => {
    const values = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
    setFilters(prev => ({
      ...prev,
      [columnKey]: values
    }));
    setCurrentPage(1);
  };

  // Keyboard navigation for table
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedCell || viewMode !== 'table') return;

    const { row, col } = focusedCell;
    const maxRow = paginatedData.length - 1;
    const maxCol = columns.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (row < maxRow) {
          setFocusedCell({ row: row + 1, col });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) {
          setFocusedCell({ row: row - 1, col });
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < maxCol) {
          setFocusedCell({ row, col: col + 1 });
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) {
          setFocusedCell({ row, col: col - 1 });
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
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onRowClick) {
          onRowClick(paginatedData[row]);
        }
        break;
    }
  };

  // Render table view
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse"
        role="table"
        aria-label={title}
        aria-describedby={description ? 'table-description' : undefined}
        onKeyDown={handleKeyDown}
      >
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {selectable && (
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all rows"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
            )}
            {columns.map((column, colIndex) => (
              <th
                key={column.key}
                className={`p-3 text-${column.align || 'left'} font-medium text-gray-900 dark:text-white`}
                style={{ width: column.width }}
              >
                {column.sortable && sortable ? (
                  <button
                    className="flex items-center gap-2 hover:text-primary focus:outline-none focus:text-primary"
                    onClick={() => handleSort(column.key)}
                    aria-label={`Sort by ${column.label}`}
                  >
                    {column.label}
                    {sortConfig?.key === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, rowIndex) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(item)}
              tabIndex={0}
              role="row"
              aria-selected={selectedIds.includes(item.id)}
            >
              {selectable && (
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => handleRowSelect(item.id, e.target.checked)}
                    aria-label={`Select row ${rowIndex + 1}`}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td
                  key={column.key}
                  className={`p-3 text-${column.align || 'left'} text-gray-900 dark:text-white ${
                    focusedCell?.row === rowIndex && focusedCell?.col === colIndex
                      ? 'ring-2 ring-primary/20'
                      : ''
                  }`}
                  tabIndex={focusedCell?.row === rowIndex && focusedCell?.col === colIndex ? 0 : -1}
                  onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                  role="gridcell"
                >
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {paginatedData.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow ${
            onRowClick ? 'cursor-pointer hover:border-primary' : ''
          } ${selectedIds.includes(item.id) ? 'ring-2 ring-primary/20' : ''}`}
          onClick={() => onRowClick?.(item)}
          tabIndex={0}
          role="article"
          aria-label={`Item ${item.id}`}
        >
          {selectable && (
            <div className="mb-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={(e) => handleRowSelect(item.id, e.target.checked)}
                aria-label={`Select item ${item.id}`}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="space-y-2">
            {columns.slice(0, 3).map((column) => (
              <div key={column.key}>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {column.label}
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </dd>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="space-y-2">
      {paginatedData.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            onRowClick ? 'cursor-pointer' : ''
          } ${selectedIds.includes(item.id) ? 'ring-2 ring-primary/20' : ''}`}
          onClick={() => onRowClick?.(item)}
          tabIndex={0}
          role="listitem"
        >
          <div className="flex items-center gap-3">
            {selectable && (
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={(e) => handleRowSelect(item.id, e.target.checked)}
                aria-label={`Select item ${item.id}`}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {columns[0].render ? columns[0].render(item[columns[0].key], item) : item[columns[0].key]}
              </div>
              {columns[1] && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {columns[1].render ? columns[1].render(item[columns[1].key], item) : item[columns[1].key]}
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`} role="alert">
        <div className="text-red-600 dark:text-red-400">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={tableRef} className={`advanced-data-table space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p id="table-description" className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* View Mode Toggle */}
        {allowViewModeChange && (
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {searchable && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                aria-label="Search data"
              />
            </div>
          </div>
        )}

        {filterable && (
          <div className="flex gap-2 flex-wrap">
            {columns.filter(col => col.filterable !== false).map((column) => (
              <AccessibleDropdown
                key={column.key}
                options={getFilterOptions(column.key).map(option => ({
                  value: option.value,
                  label: `${option.label} (${option.count})`,
                  description: `${option.count} items`
                }))}
                value={filters[column.key] || []}
                onChange={(value) => handleFilterChange(column.key, value)}
                placeholder={`Filter ${column.label}`}
                multiple
                searchable
                allowClear
                className="min-w-[200px]"
              />
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
          {searchQuery && ` for "${searchQuery}"`}
        </div>
        {selectedIds.length > 0 && (
          <div>
            {selectedIds.length} selected
          </div>
        )}
      </div>

      {/* Data Display */}
      {filteredData.length === 0 ? (
        <div className="text-center py-8">
          {emptyState || (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No data found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {searchQuery ? 'Try adjusting your search or filters' : 'No data available'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'grid' && (
            <div className="p-4">
              {renderGridView()}
            </div>
          )}
          {viewMode === 'list' && (
            <div className="p-4">
              {renderListView()}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Keyboard Instructions */}
      <div className="sr-only">
        {viewMode === 'table' && 'Use arrow keys to navigate table cells, Enter to select rows, Space to toggle selection.'}
      </div>
    </div>
  );
};

export default AdvancedDataTable;
