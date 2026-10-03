import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-slate-500 dark:text-slate-400 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-emerald-600 dark:text-emerald-400 mb-2`} />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
