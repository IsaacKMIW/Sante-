import React from 'react';

interface HeartSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function HeartSpinner({ 
  size = 'md', 
  color = '#FF4B6E'
}: HeartSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div 
      className={`heart-spinner ${sizeClasses[size]}`}
      role="status"
      aria-label="Chargement..."
      style={{ '--heart-color': color } as React.CSSProperties}
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );
}