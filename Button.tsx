import React from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg";
  as?: React.ElementType;
  to?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  size = "default",
  className = "",
  as: Component = "button",
  to,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none touch-target relative overflow-hidden";
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    outline: "border border-surface-3 text-light hover:bg-surface-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-muted hover:text hover:bg-surface-2",
    destructive: "bg-error text-white hover:bg-error/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm min-w-[2.25rem]",
    default: "h-12 py-3 px-6 text-base min-w-[3rem]",
    lg: "h-14 px-8 text-lg min-w-[3.5rem]"
  };
  
  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  // Handle Link component
  if (Component !== "button" && to) {
    return (
      <Component to={to} className={classes} {...props}>
        <span className="relative z-10">{children}</span>
      </Component>
    );
  }
  
  return (
    <Component className={classes} {...props}>
      <span className="relative z-10">{children}</span>
    </Component>
  );
};