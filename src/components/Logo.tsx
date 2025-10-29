import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative mr-3`}>
        {/* Cube base */}
        <div className="w-full h-full relative">
          {/* Main cube structure */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg transform rotate-12">
            {/* Front face */}
            <div className="absolute inset-1 bg-gradient-to-br from-blue-800 to-blue-900 rounded"></div>
          </div>
          
          {/* Side panels */}
          <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-blue-700 to-blue-800 transform skew-y-12 origin-top"></div>
          <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-blue-800 to-blue-700 transform skew-x-12 origin-left"></div>
          
          {/* Connection dots */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm"></div>
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm transform -translate-y-1/2 translate-x-1/2"></div>
          
          {/* Connection lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
          <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-yellow-400 to-transparent"></div>
          
          {/* Inner highlight */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-white/20 rounded-sm"></div>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <span className={`font-bold text-blue-900 ${textSizeClasses[size]} tracking-tight`} 
              style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>
          FORMANEO
        </span>
      )}
    </div>
  );
};

export default Logo;