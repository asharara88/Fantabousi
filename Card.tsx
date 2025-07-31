import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: typeof Link;
  to?: string;
  variant?: 'default' | 'outline' | 'elevated' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, as: Component = 'div', to, variant = 'default', ...props }, ref) => {
    const cardStyles = cn(
      "rounded-2xl overflow-hidden transition-all duration-300 relative",
      variant === 'default' && "bg-surface-1 shadow-lg border border-surface-3/50 hover:shadow-xl hover:-translate-y-0.5",
      variant === 'outline' && "bg-surface-1 border border-surface-3 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      variant === 'elevated' && "bg-surface-1 shadow-xl hover:shadow-2xl border border-surface-3/50 hover:-translate-y-1",
      variant === 'glass' && "glass shadow-xl hover:shadow-2xl hover:-translate-y-0.5",
      className
    );
    
    if (Component === Link && to) {
      return (
        <Link
          to={to}
          className={cardStyles}
          {...props}
        />
      );
    }
    
    return (
      <div
        ref={ref}
        className={cardStyles}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";