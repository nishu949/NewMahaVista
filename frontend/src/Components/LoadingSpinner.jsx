import React from 'react';

const LoadingSpinner = ({ message = "Finding the perfect Maharashtra destinations for you..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#E9DAC3] border-t-[#C1502D] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🌏</span>
        </div>
      </div>
      <p className="mt-6 font-body text-[#5A3A25] text-sm md:text-base animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;