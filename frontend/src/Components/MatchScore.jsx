import React from 'react';

const MatchScore = ({ score, size = 'lg' }) => {
  const radius = size === 'lg' ? 40 : 30;
  const strokeWidth = size === 'lg' ? 5 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };
  
  const sizeClass = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';
  const textSize = size === 'lg' ? 'text-lg' : 'text-xs';
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className={`${sizeClass} transform -rotate-90`}>
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${textSize} text-gray-800 leading-none`}>
          {Math.round(score)}
        </span>
        <span className="text-[6px] text-gray-400 uppercase tracking-wider leading-tight">Match</span>
      </div>
    </div>
  );
};

export default MatchScore;