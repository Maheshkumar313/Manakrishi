import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyle = "rounded-2xl font-bold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center";
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-base"
  };

  const variants = {
    // Gradient Green
    primary: "bg-gradient-to-r from-primary to-green-700 text-white shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5 border border-transparent",
    // Bright Yellow/Gold
    secondary: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-950 shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 border border-transparent",
    // Red
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-sm",
    // Outline Green
    outline: "border-2 border-primary/20 text-primary bg-white hover:border-primary hover:bg-green-50 shadow-sm"
  };

  return (
    <button 
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};