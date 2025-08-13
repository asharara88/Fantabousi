import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong' | 'frosted' | 'elevated';
  interactive?: boolean;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  hover = true,
}) => {
  const baseClasses = 'glass-card';
  const variantClasses = {
    default: 'glass',
    subtle: 'glass-subtle',
    strong: 'glass-strong',
    frosted: 'glass-frosted',
    elevated: 'glass-elevated',
  };

  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: hover ? { 
      scale: 1.02, 
      y: -4
    } : {},
    whileTap: { scale: 0.98 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  } : {};

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactive && 'cursor-pointer',
        className
      )}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

// Glass Button Component
interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 touch-target';
  const variantClasses = {
    default: 'btn-glass',
    primary: 'btn-glass-primary',
    secondary: 'btn-glass-secondary',
  };
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};

// Glass Input Component
interface GlassInputProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  variant?: 'default' | 'glass';
  label?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  id,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  variant = 'default',
  label,
  error,
  disabled = false,
  name,
  required = false,
}) => {
  const baseClasses = 'input w-full transition-all duration-300';
  const variantClasses = {
    default: 'input',
    glass: 'input-glass',
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-light">
          {label}
        </label>
      )}
      <motion.input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={cn(
          baseClasses,
          variantClasses[variant],
          error && 'border-error focus:border-error',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

// Glass Panel Component
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  title,
  subtitle,
}) => {
  return (
    <motion.div
      className={cn('glass-panel p-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-light">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

// Glass Modal Component
interface GlassModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  title,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div
        className={cn('glass-modal relative max-w-md w-full p-6', className)}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-text">{title}</h2>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

// Glass Navigation Component
interface GlassNavProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const GlassNav: React.FC<GlassNavProps> = ({
  children,
  className = '',
  sticky = true,
}) => {
  return (
    <motion.nav
      className={cn(
        'glass-nav',
        sticky && 'sticky top-0 z-40',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.nav>
  );
};

// Glass Section Component with Enhanced Background
interface GlassSectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'none' | 'gradient' | 'pattern';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassSection: React.FC<GlassSectionProps> = ({
  children,
  className = '',
  background = 'none',
  padding = 'lg',
}) => {
  const paddingClasses = {
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20 lg:py-24',
    xl: 'py-20 sm:py-24 lg:py-28',
  };

  const backgroundClasses = {
    none: '',
    gradient: 'bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5',
    pattern: 'relative overflow-hidden',
  };

  return (
    <section className={cn(
      'relative',
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      {background === 'pattern' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20" />
          <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        </div>
      )}
      <div className="mobile-container relative z-10">
        {children}
      </div>
    </section>
  );
};

// Glass Feature Card with Enhanced Animations
interface GlassFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  gradient?: string;
}

export const GlassFeatureCard: React.FC<GlassFeatureCardProps> = ({
  icon,
  title,
  description,
  className = '',
  gradient = 'from-primary/20 to-secondary/20',
}) => {
  return (
    <motion.div
      className={cn('glass-card group cursor-pointer', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03, 
        y: -8
      }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
      
      <div className="relative z-10 p-8">
        {/* Icon with enhanced animation */}
        <motion.div 
          className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto"
          whileHover={{ 
            scale: 1.2,
            rotate: [0, -10, 10, 0],
          }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-xl font-semibold text-text text-center mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-text-light text-center leading-relaxed">
          {description}
        </p>

        {/* Animated particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`particle-${i}-${Math.random()}`}
              className="absolute w-1 h-1 bg-primary/60 rounded-full"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
