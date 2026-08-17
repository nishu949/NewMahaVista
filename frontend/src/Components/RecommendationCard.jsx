import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MatchScore from './MatchScore';

const RecommendationCard = ({ recommendation, index }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  const { destination, score, reasons, festival } = recommendation;
  
  const handleExplore = () => {
    navigate(`/city/${destination.slug || destination.district?.toLowerCase()}`);
  };
  
  const handleAddToTrip = () => {
    alert(`Added ${destination.name} to your trip!`);
  };
  
  const handleWatchStory = () => {
    navigate('/stories');
  };
  
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E9DAC3] hover:border-[#C1502D] shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-300">
      
      {/* Image */}
      <div className="relative h-44 md:h-48 overflow-hidden bg-[#FBF4E8]">
        <img
          src={imageError ? '/images/placeholder.jpg' : destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Rank */}
        {index < 3 && (
          <div className="absolute top-2 left-2">
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg ${
              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
              'bg-gradient-to-r from-amber-600 to-amber-700'
            }`}>
              #{index + 1}
            </div>
          </div>
        )}
        
        {/* Score */}
        <div className="absolute bottom-2 right-2">
          <MatchScore score={score} size="sm" />
        </div>
        
        {/* Festival Badge */}
        {festival && (
          <div className="absolute top-2 right-2">
            <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-bold shadow-lg animate-pulse">
              🎉 Festival
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-display text-base font-bold text-[#20263F] truncate group-hover:text-[#C1502D] transition-colors">
              {destination.name}
            </h4>
            <p className="font-body text-xs text-[#8A5A3E] truncate">
              {destination.district}, Maharashtra
            </p>
          </div>
          <span className="font-body text-[10px] font-bold text-[#C1502D] bg-[#FBF4E8] px-2.5 py-1 rounded-full whitespace-nowrap">
            {Math.round(score)}%
          </span>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mt-2">
          {(destination.categories || []).slice(0, 3).map((category, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-[#FBF4E8] text-[9px] font-medium text-[#5A3A25] rounded-full border border-[#E9DAC3]"
            >
              {category}
            </span>
          ))}
          {(destination.categories || []).length > 3 && (
            <span className="px-2 py-0.5 bg-[#FBF4E8] text-[9px] font-medium text-[#5A3A25] rounded-full border border-[#E9DAC3]">
              +{destination.categories.length - 3}
            </span>
          )}
        </div>
        
        {/* Reasons */}
        <div className="mt-2 space-y-0.5">
          {reasons && reasons.slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="text-green-600 text-[10px]">✓</span>
              <p className="font-body text-[10px] text-[#5A3A25] line-clamp-1">{reason}</p>
            </div>
          ))}
        </div>
        
        {/* Buttons */}
        <div className="mt-3 flex gap-1.5">
          <button
            onClick={handleExplore}
            className="flex-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C1502D] to-[#A8431F] text-white text-[10px] font-semibold hover:shadow-md transition-all duration-200"
          >
            Explore
          </button>
          <button
            onClick={handleAddToTrip}
            className="px-3 py-1.5 rounded-full bg-white border border-[#C1502D] text-[#C1502D] text-[10px] font-semibold hover:bg-[#C1502D] hover:text-white transition-all duration-200"
          >
            + Trip
          </button>
          <button
            onClick={handleWatchStory}
            className="px-3 py-1.5 rounded-full bg-[#FBF4E8] border border-[#E9DAC3] text-[#5A3A25] text-[10px] font-semibold hover:bg-[#F3E5CC] transition-all duration-200"
          >
            🎬
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;