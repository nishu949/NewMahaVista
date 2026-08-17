import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendationCard from './RecommendationCard';

const RecommendationResults = ({ recommendations, loading, error, preferences, onReset }) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#E9DAC3]">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-[#E9DAC3] border-t-[#C1502D] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🌏</span>
            </div>
          </div>
          <p className="mt-4 font-body text-sm text-[#5A3A25] animate-pulse">
            Finding the perfect Maharashtra destinations...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200 text-center">
        <div className="text-4xl mb-3">😅</div>
        <h3 className="font-display text-lg font-bold text-red-700">Oops! Something went wrong</h3>
        <p className="font-body text-sm text-red-600 mt-2">{error}</p>
        <button
          onClick={onReset}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-yellow-200 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="font-display text-lg font-bold text-yellow-700">No matching destinations found</h3>
        <p className="font-body text-sm text-yellow-600 mt-2">
          Try adjusting your preferences!
        </p>
        <button
          onClick={onReset}
          className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-full text-sm font-semibold hover:bg-yellow-700 transition"
        >
          Adjust Preferences
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#20263F]">
              Your Personalized Trip
            </h2>
          </div>
          <p className="font-body text-xs text-[#8A5A3E]">
            {recommendations.length} amazing destinations for you
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-1.5 rounded-full bg-[#FBF4E8] border border-[#E9DAC3] text-[#5A3A25] text-xs font-semibold hover:bg-[#F3E5CC] transition"
        >
          Start Over
        </button>
      </div>
      
      {/* Preferences Summary */}
      {preferences && (
        <div className="bg-[#FBF4E8] rounded-xl p-3 border border-[#E9DAC3] flex flex-wrap gap-2 items-center">
          <span className="font-body text-xs font-semibold text-[#5A3A25]">📅 {preferences.month}</span>
          {preferences.interests && preferences.interests.slice(0, 4).map((interest) => (
            <span key={interest} className="px-2 py-0.5 bg-white rounded-full text-[10px] text-[#5A3A25] border border-[#E9DAC3]">
              {interest}
            </span>
          ))}
          {preferences.interests && preferences.interests.length > 4 && (
            <span className="px-2 py-0.5 bg-white rounded-full text-[10px] text-[#5A3A25] border border-[#E9DAC3]">
              +{preferences.interests.length - 4}
            </span>
          )}
          <span className="text-[#D9C6A3]">|</span>
          <span className="font-body text-xs text-[#5A3A25]">👥 {preferences.travel_with || 'Any'}</span>
          <span className="text-[#D9C6A3]">|</span>
          <span className="font-body text-xs text-[#5A3A25]">💰 {preferences.budget || 'Any'}</span>
        </div>
      )}
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.destination._id || index}
            recommendation={rec}
            index={index}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className="text-center pt-4 border-t border-[#E9DAC3]">
        <p className="font-body text-[10px] text-[#8A5A3E] tracking-wide">
          ✦ Discover&nbsp;&nbsp;•&nbsp;&nbsp;Learn&nbsp;&nbsp;•&nbsp;&nbsp;
          Explore&nbsp;&nbsp;•&nbsp;&nbsp;Get Inspired
        </p>
      </div>
    </div>
  );
};

export default RecommendationResults;