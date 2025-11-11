
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
  const colorClasses = {
    gray: 'bg-gray-600 text-gray-200',
    red: 'bg-red-500/80 text-white',
    yellow: 'bg-yellow-500/80 text-yellow-900',
    green: 'bg-green-500/80 text-white',
    blue: 'bg-blue-500/80 text-white',
    purple: 'bg-purple-500/80 text-white',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  );
};
