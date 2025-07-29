/**
 * Mobile Utility Components
 * 
 * Collection of utility components specifically designed for mobile responsiveness
 * and touch interactions in the WasteFinder application
 */
import React from "react";

// Mobile-optimized container component
interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function MobileContainer({ 
  children, 
  className = "", 
  padding = "md" 
}: MobileContainerProps) {
  const paddingClasses = {
    none: "",
    sm: "px-4 sm:px-6",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12"
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized grid component
interface MobileGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function MobileGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className = ""
}: MobileGridProps) {
  const gapClasses = {
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8"
  };

  const gridCols = `grid-cols-${columns.mobile} ${columns.tablet ? `sm:grid-cols-${columns.tablet}` : ''} ${columns.desktop ? `lg:grid-cols-${columns.desktop}` : ''}`;

  return (
    <div className={`grid ${gridCols} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized button component
interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MobileButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = ""
}: MobileButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base", // Optimized for mobile touch
    lg: "h-12 px-6 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}

// Mobile-optimized input component
interface MobileInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export function MobileInput({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className = "",
  label,
  error
}: MobileInputProps) {
  const baseClasses = "flex h-11 w-full border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  const errorClasses = error ? "border-destructive" : "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${className}`}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
  hover?: boolean;
}

export function MobileCard({
  children,
  className = "",
  padding = "md",
  onClick,
  hover = false
}: MobileCardProps) {
  const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm";
  const paddingClasses = {
    sm: "p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
  };
  const interactiveClasses = onClick ? "cursor-pointer" : "";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${paddingClasses[padding]} ${interactiveClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}

// Mobile-friendly loading spinner
interface MobileSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MobileSpinner({ size = "md", className = "" }: MobileSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]} ${className}`} />
  );
}

// Mobile touch-optimized tabs
interface MobileTabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function MobileTabs({ tabs, activeTab, onTabChange, className = "" }: MobileTabsProps) {
  return (
    <div className={className}>
      {/* Tab buttons */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

// Mobile-optimized modal/dialog
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function MobileModal({ isOpen, onClose, title, children, className = "" }: MobileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mobile-optimized toast notification
interface MobileToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export function MobileToast({ message, type = "info", isVisible, onClose }: MobileToastProps) {
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white"
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center justify-between ${typeClasses[type]}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-xl opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
