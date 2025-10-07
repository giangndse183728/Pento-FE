import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
  progressColor?: string;
  labelColor?: string;
  percentageColor?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  progressColor = 'bg-emerald-500',
  labelColor = 'text-gray-300',
  percentageColor = 'text-white',
  className = ''
}) => {
  return (
    <div className={`group ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs ${labelColor}`}>{label}</span>
        <span className={`text-xl font-bold ${percentageColor}`}>{percentage}%</span>
      </div>
      <div className="relative w-full bg-gray-600/30 rounded-full h-2">
        <div 
          className={`${progressColor} h-2 rounded-full transition-all duration-1000 ease-out`} 
          style={{width: `${percentage}%`}}
        ></div>
        <div 
          className="absolute top-1/2 transform -translate-y-1/2" 
          style={{left: `${percentage - 10}%`}}
        >
          <div className="w-6 h-4 bg-white/90 backdrop-blur-lg border border-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
