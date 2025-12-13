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
  const baseStyle = "rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3"
  };

  const variants = {
    primary: "bg-primary text-white shadow-md hover:bg-green-900",
    secondary: "bg-accent text-green-900 shadow-sm hover:bg-yellow-500",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-green-50"
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