import React, { memo, useMemo } from 'react';
import { cn } from '../../utils/cn';

interface PerformantCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  'data-testid'?: string;
}

// Memoized card component to prevent unnecessary re-renders
export const PerformantCard = memo<PerformantCardProps>(({
  children,
  className,
  variant = 'default',
  size = 'md',
  onClick,
  'data-testid': testId
}) => {
  const cardClasses = useMemo(() => {
    const baseClasses = 'rounded-xl transition-all duration-200';
    
    const variantClasses = {
      default: 'bg-surface-1 border border-surface-3',
      outlined: 'bg-transparent border-2 border-surface-3',
      elevated: 'bg-surface-1 shadow-lg hover:shadow-xl'
    };
    
    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };
    
    const interactiveClasses = onClick 
      ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0' 
      : '';
    
    return cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      interactiveClasses,
      className
    );
  }, [variant, size, onClick, className]);

  const handleKeyDown = useMemo(() => {
    return onClick ? (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    } : undefined;
  }, [onClick]);

  if (onClick) {
    return (
      <button 
        className={cn(cardClasses, 'border-none bg-transparent p-0 text-left')}
        onClick={onClick}
        data-testid={testId}
        onKeyDown={handleKeyDown}
      >
        <div className="w-full h-full">
          {children}
        </div>
      </button>
    );
  }

  return (
    <div 
      className={cardClasses}
      data-testid={testId}
    >
      {children}
    </div>
  );
});

PerformantCard.displayName = 'PerformantCard';

// Memoized list item component
interface PerformantListItemProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  onClick?: (id: string | number) => void;
}

export const PerformantListItem = memo<PerformantListItemProps>(({
  id,
  children,
  className,
  isSelected = false,
  onClick
}) => {
  const handleClick = useMemo(() => {
    return onClick ? () => onClick(id) : undefined;
  }, [onClick, id]);

  const itemClasses = useMemo(() => {
    return cn(
      'p-4 transition-colors duration-150',
      isSelected 
        ? 'bg-primary/10 border-l-4 border-primary' 
        : 'hover:bg-surface-2',
      onClick && 'cursor-pointer',
      className
    );
  }, [isSelected, onClick, className]);

  const handleKeyDown = useMemo(() => {
    return handleClick ? (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    } : undefined;
  }, [handleClick]);

  if (handleClick) {
    return (
      <button 
        className={cn(itemClasses, 'border-none bg-transparent p-0 text-left w-full')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-pressed={isSelected}
      >
        {children}
      </button>
    );
  }

  return (
    <div 
      className={itemClasses}
      aria-selected={isSelected}
    >
      {children}
    </div>
  );
});

PerformantListItem.displayName = 'PerformantListItem';

// Skeleton loading component for better perceived performance
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = memo<SkeletonProps>(({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height
}) => {
  const skeletonClasses = useMemo(() => {
    const baseClasses = 'bg-surface-3';
    
    const variantClasses = {
      text: 'h-4 rounded',
      rectangular: 'rounded-md',
      circular: 'rounded-full'
    };
    
    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-bounce',
      none: ''
    };
    
    return cn(
      baseClasses,
      variantClasses[variant],
      animationClasses[animation],
      className
    );
  }, [variant, animation, className]);

  const style = useMemo(() => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }), [width, height]);

  return <div className={skeletonClasses} style={style} />;
});

Skeleton.displayName = 'Skeleton';

// Performance-optimized grid component
interface PerformantGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PerformantGrid = memo<PerformantGridProps>(({
  children,
  columns = 3,
  gap = 'md',
  className
}) => {
  const gridClasses = useMemo(() => {
    const baseClasses = 'grid';
    
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };
    
    return cn(
      baseClasses,
      columnClasses[columns],
      gapClasses[gap],
      className
    );
  }, [columns, gap, className]);

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
});

PerformantGrid.displayName = 'PerformantGrid';
