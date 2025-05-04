import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'md', 
  asChild = false, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const variantStyles = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
  };
  
  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  const Comp = asChild ? React.Children.only(children).type : 'button';
  
  if (asChild) {
    const child = React.Children.only(children);
    return React.cloneElement(child, {
      ...props,
      className: `${combinedClassName} ${child.props.className || ''}`,
    });
  }
  
  return <Comp className={combinedClassName} {...props}>{children}</Comp>;
}; 