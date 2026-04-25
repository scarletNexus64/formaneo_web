import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  message = 'Chargement...'
}) => {
  const sizes = {
    sm: { container: 'w-8 h-8', inner: 'w-6 h-6', dot: 'w-1.5 h-1.5', text: 'text-xs' },
    md: { container: 'w-12 h-12', inner: 'w-10 h-10', dot: 'w-2 h-2', text: 'text-sm' },
    lg: { container: 'w-16 h-16', inner: 'w-14 h-14', dot: 'w-2.5 h-2.5', text: 'text-base' }
  };

  const currentSize = sizes[size];

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      {/* Modern spinner with dual rings */}
      <div className={`relative ${currentSize.container}`}>
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-red-600/20`}></div>

        {/* Animated ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-red-600 border-r-red-600 animate-spin`}></div>

        {/* Inner ring */}
        <div className={`absolute inset-1 ${currentSize.inner} rounded-full border-2 border-transparent border-b-red-400 border-l-red-400 animate-spin-reverse`}></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${currentSize.dot} bg-red-600 rounded-full animate-pulse`}></div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className={`mt-4 ${currentSize.text} text-gray-600 font-medium animate-fade-in`}>
          {message}
        </p>
      )}

      <style>{`
        @keyframes spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;