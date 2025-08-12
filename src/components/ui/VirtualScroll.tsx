import React, { useState, useRef, useMemo } from 'react';
import { useScrollPerformance } from '../../utils/hooks';

interface VirtualScrollProps<T> {
  readonly items: T[];
  readonly itemHeight: number;
  readonly containerHeight: number;
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly className?: string;
  readonly overscan?: number; // Number of items to render outside visible area
  readonly onScroll?: (scrollTop: number) => void;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const { optimizedScrollHandler } = useScrollPerformance();
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange.start, visibleRange.end]);

  // Handle scroll with performance optimization
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    
    optimizedScrollHandler(() => {
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    });
  };

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Offset for visible items
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Total height container */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Specialized virtual list for supplements
interface SupplementItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface VirtualSupplementListProps {
  supplements: SupplementItem[];
  onItemClick: (supplement: SupplementItem) => void;
  className?: string;
}

export const VirtualSupplementList: React.FC<VirtualSupplementListProps> = ({
  supplements,
  onItemClick,
  className = ''
}) => {
  const renderSupplementItem = (supplement: SupplementItem) => (
    <button
      className="flex items-center justify-between w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
      onClick={() => onItemClick(supplement)}
      type="button"
    >
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {supplement.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {supplement.category}
        </p>
      </div>
      <div className="text-lg font-semibold text-primary">
        ${supplement.price}
      </div>
    </button>
  );

  return (
    <VirtualScroll
      items={supplements}
      itemHeight={80}
      containerHeight={400}
      renderItem={renderSupplementItem}
      className={className}
    />
  );
};

// Grid virtual scrolling for image galleries
interface VirtualGridProps<T> {
  readonly items: T[];
  readonly itemWidth: number;
  readonly itemHeight: number;
  readonly containerWidth: number;
  readonly containerHeight: number;
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly className?: string;
  readonly gap?: number;
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  className = '',
  gap = 16
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const { optimizedScrollHandler } = useScrollPerformance();

  // Calculate grid dimensions
  const columnsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columnsPerRow);

  // Calculate visible rows
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / rowHeight) + 1,
      totalRows - 1
    );

    return { start: Math.max(0, start), end };
  }, [scrollTop, rowHeight, containerHeight, totalRows]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const startIndex = visibleRange.start * columnsPerRow;
    const endIndex = Math.min((visibleRange.end + 1) * columnsPerRow, items.length);
    return items.slice(startIndex, endIndex);
  }, [items, visibleRange.start, visibleRange.end, columnsPerRow]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    optimizedScrollHandler(() => setScrollTop(newScrollTop));
  };

  const totalHeight = totalRows * rowHeight;
  const offsetY = visibleRange.start * rowHeight;

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${columnsPerRow}, ${itemWidth}px)`,
            gap: `${gap}px`
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleRange.start * columnsPerRow + index}>
              {renderItem(item, visibleRange.start * columnsPerRow + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
