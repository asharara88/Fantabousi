import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};
