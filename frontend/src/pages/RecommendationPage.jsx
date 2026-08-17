import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Menu, User, MapPin, CheckCircle, 
  Play, Plus, Calendar, Compass, Sparkles, ArrowRight,
  Sun, Cloud, Umbrella, Snowflake, Heart, Star
} from 'lucide-react';
import { recommendationApi } from '../services/recommendationApi';

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  const [preferences, setPreferences] = useState({
    month: '',
    interests: [],
    travel_with: '',
    budget: '',
    duration: '',
    adventure_level: ''
  });
  
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const interestOptions = [
    'Nature', 'Heritage', 'Culture', 'Food', 
    'Wildlife', 'Beaches', 'Adventure', 'Spiritual'
  ];
  
  const travelOptions = [
    { id: 'Solo', icon: '🧑' },
    { id: 'Couple', icon: '❤️' },
    { id: 'Family', icon: '👨‍👩‍👧' },
    { id: 'Friends', icon: '👥' }
  ];
  
  const budgetOptions = ['Budget', 'Moderate', 'Premium'];
  const durationOptions = ['Weekend', '5-7 Days', '2+ Weeks'];
  const paceOptions = ['Relaxed', 'Balanced', 'Active'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthsRes, categoriesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/destinations/months'),
          fetch('http://127.0.0.1:8000/api/destinations/categories')
        ]);
        
        if (monthsRes.ok) {
          const data = await monthsRes.json();
          setAvailableMonths(data.months || fullMonthNames);
        } else {
          setAvailableMonths(fullMonthNames);
        }
        
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setAvailableCategories(data.categories || interestOptions);
        } else {
          setAvailableCategories(interestOptions);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setAvailableMonths(fullMonthNames);
        setAvailableCategories(interestOptions);
      }
    };
    
    fetchData();
  }, []);
  
  const updatePreferences = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleInterest = (interest) => {
    setPreferences(prev => {
      const current = prev.interests;
      if (current.includes(interest)) {
        return { ...prev, interests: current.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...current, interest] };
      }
    });
  };
  
  const getMonthAbbr = (month) => month.slice(0, 3).toUpperCase();
  
  const handleSubmit = async () => {
    if (!preferences.month) {
      alert('Please select a month first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await recommendationApi.getRecommendations(preferences);
      setRecommendations(result.recommendations);
      setShowResults(true);
      setStep(3);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError(error.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setShowResults(false);
    setRecommendations(null);
    setPreferences({
      month: '',
      interests: [],
      travel_with: '',
      budget: '',
      duration: '',
      adventure_level: ''
    });
    setStep(1);
    setError(null);
  };
  
  const getWeatherIcon = (month) => {
    const idx = fullMonthNames.indexOf(month);
    if (idx >= 10 || idx <= 1) return <Snowflake className="w-4 h-4 text-blue-400" />;
    if (idx >= 2 && idx <= 4) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (idx >= 5 && idx <= 8) return <Umbrella className="w-4 h-4 text-blue-500" />;
    return <Cloud className="w-4 h-4 text-gray-400" />;
  };
  
  const getSeasonText = (month) => {
    const idx = fullMonthNames.indexOf(month);
    if (idx >= 10 || idx <= 1) return 'Cool weather';
    if (idx >= 2 && idx <= 4) return 'Warm weather';
    if (idx >= 5 && idx <= 8) return 'Monsoon';
    return 'Pleasant weather';
  };
  
  const getSeasonEmoji = (month) => {
    const idx = fullMonthNames.indexOf(month);
    if (idx >= 10 || idx <= 1) return '❄️';
    if (idx >= 2 && idx <= 4) return '☀️';
    if (idx >= 5 && idx <= 8) return '🌧️';
    return '🌤️';
  };

  // =============================================
  // STEP 1: HERO
  // =============================================
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#faf6f2]">
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-[#e8ddd5] rounded-full mb-8">
              <span className="text-sm font-medium text-[#5a3d2b] tracking-widest">YOUR JOURNEY. YOUR PREFERENCES.</span>
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-[#7a4a2e] leading-[1.1] tracking-tight">
              DISCOVER
              <br />
              <span className="text-[#b87333]">MAHARASHTRA</span>
            </h1>
            
            <button
              onClick={() => setStep(2)}
              className="mt-10 inline-flex items-center gap-2 px-10 py-4 bg-[#b87333] text-white font-medium rounded-full hover:bg-[#9a5c28] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Planning
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // =============================================
  // STEP 2: FORM
  // =============================================
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#faf6f2] py-12">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl font-bold text-[#7a4a2e]">PLAN YOUR PERFECT JOURNEY</h2>
            <p className="text-[#5a3d2b] mt-1">Tell us what you love, and we'll find your match.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e8ddd5]">
            
            {/* Month Selection */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-[#5a3d2b] mb-4">When are you travelling?</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {availableMonths.map((month) => {
                  const isSelected = preferences.month === month;
                  return (
                    <button
                      key={month}
                      onClick={() => updatePreferences('month', month)}
                      className={`py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#b87333] text-white shadow-md scale-105'
                          : 'bg-[#f5eee9] text-[#5a3d2b] hover:bg-[#e8ddd5]'
                      }`}
                    >
                      {getMonthAbbr(month)}
                    </button>
                  );
                })}
              </div>
              
              {preferences.month && (
                <div className="mt-4 flex items-center gap-4 bg-[#f5eee9] rounded-xl px-5 py-3 border border-[#e8ddd5]">
                  <span className="text-2xl">{getSeasonEmoji(preferences.month)}</span>
                  <span className="font-semibold text-[#7a4a2e]">{preferences.month}</span>
                  <span className="text-[#b0a094]">•</span>
                  <span className="text-sm text-[#5a3d2b] flex items-center gap-1">
                    {getWeatherIcon(preferences.month)} {getSeasonText(preferences.month)}
                  </span>
                  <span className="text-[#b0a094]">•</span>
                  <span className="text-sm text-[#5a3d2b]">
                    {preferences.month === 'December' || preferences.month === 'January' ? 'Winter travel' : 
                     preferences.month === 'June' || preferences.month === 'July' || preferences.month === 'August' ? 'Monsoon season' :
                     'Great for exploring'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Interests */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-[#5a3d2b] mb-4">What do you love?</h3>
              <div className="flex flex-wrap gap-3">
                {availableCategories.map((interest) => {
                  const isSelected = preferences.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#b87333] text-white shadow-md'
                          : 'bg-[#f5eee9] text-[#5a3d2b] hover:bg-[#e8ddd5]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Travel Style */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-[#5a3d2b] mb-4">Travel Style</h3>
              
              <div className="grid grid-cols-4 gap-3 mb-5">
                {travelOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updatePreferences('travel_with', option.id)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      preferences.travel_with === option.id
                        ? 'bg-[#b87333] text-white shadow-md'
                        : 'bg-[#f5eee9] text-[#5a3d2b] hover:bg-[#e8ddd5]'
                    }`}
                  >
                    <span className="mr-1">{option.icon}</span> {option.id}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-[#5a3d2b] mb-2">Budget</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => updatePreferences('budget', option)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          preferences.budget === option
                            ? 'bg-[#b87333] text-white'
                            : 'bg-[#f5eee9] text-[#5a3d2b] hover:bg-[#e8ddd5]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-[#5a3d2b] mb-2">Duration</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {durationOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => updatePreferences('duration', option)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          preferences.duration === option
                            ? 'bg-[#b87333] text-white'
                            : 'bg-[#f5eee9] text-[#5a3d2b] hover:bg-[#e8ddd5]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-[#5a3d2b] mb-2">Pace</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {paceOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => updatePreferences('adventure_level', option)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          preferences.adventure_level === option
                            ? 'bg-[#b87333] text-white'
                            : 'bg-[#f5eee9] text-[#5a3d2b] hover:bg-[#e8ddd5]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-[#b87333] text-white font-medium rounded-full hover:bg-[#9a5c28] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding your places...
                </>
              ) : (
                <>
                  Find My Places
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // =============================================
  // STEP 3: RESULTS
  // =============================================
  if (step === 3) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#b87333] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[#5a3d2b] mt-4">Finding the perfect places for you...</p>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#e8ddd5] text-center">
            <div className="text-4xl mb-3">😅</div>
            <h3 className="text-xl font-bold text-[#7a4a2e]">Oops! Something went wrong</h3>
            <p className="text-[#5a3d2b] mt-2">{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-[#b87333] text-white rounded-full hover:bg-[#9a5c28] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    if (!recommendations || recommendations.length === 0) {
      return (
        <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#e8ddd5] text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-[#7a4a2e]">No matches found</h3>
            <p className="text-[#5a3d2b] mt-2">Try adjusting your preferences!</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-[#b87333] text-white rounded-full hover:bg-[#9a5c28] transition"
            >
              Adjust Preferences
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#7a4a2e]">
              ✨ YOUR MAHARASHTRA JOURNEY
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <span className="px-4 py-1.5 bg-white rounded-full text-sm text-[#5a3d2b] border border-[#e8ddd5]">
                {preferences.month}
              </span>
              {preferences.interests.slice(0, 3).map((interest) => (
                <span key={interest} className="px-4 py-1.5 bg-white rounded-full text-sm text-[#5a3d2b] border border-[#e8ddd5]">
                  {interest}
                </span>
              ))}
              <span className="px-4 py-1.5 bg-white rounded-full text-sm text-[#5a3d2b] border border-[#e8ddd5]">
                {preferences.travel_with || 'Family'}
              </span>
              <span className="px-4 py-1.5 bg-white rounded-full text-sm text-[#5a3d2b] border border-[#e8ddd5]">
                {preferences.duration || '3 Days'}
              </span>
            </div>
            
            <p className="text-[#5a3d2b] mt-3">We found places that match your style.</p>
          </div>
          
          {/* Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-[#e8ddd5]">
              <div className="w-12 h-12 rounded-full bg-[#f5eee9] flex items-center justify-center text-2xl">🌤️</div>
              <div>
                <div className="font-semibold text-[#7a4a2e]">Pleasant</div>
                <div className="text-xs text-[#5a3d2b]">Perfect exploring weather</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-[#e8ddd5]">
              <div className="w-12 h-12 rounded-full bg-[#f5eee9] flex items-center justify-center text-2xl">🎉</div>
              <div>
                <div className="font-semibold text-[#7a4a2e]">Festivals</div>
                <div className="text-xs text-[#5a3d2b]">Vibrant cultural events</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-[#e8ddd5]">
              <div className="w-12 h-12 rounded-full bg-[#f5eee9] flex items-center justify-center text-2xl">🏰</div>
              <div>
                <div className="font-semibold text-[#7a4a2e]">Heritage</div>
                <div className="text-xs text-[#5a3d2b]">Rich history awaits</div>
              </div>
            </div>
          </div>
          
          {/* Featured Card */}
          {recommendations.length > 0 && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#e8ddd5] mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative h-64 md:h-auto">
                  <img 
                    src={recommendations[0].destination.image_url} 
                    alt={recommendations[0].destination.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/images/placeholder.jpg'}
                  />
                  <div className="absolute top-4 right-4 bg-[#b87333] text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg">
                    {Math.round(recommendations[0].score)}% MATCH
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-3/5">
                  <div className="text-sm text-[#5a3d2b] mb-1">
                    📍 {recommendations[0].destination.district}, Maharashtra
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#7a4a2e] mb-3">
                    {recommendations[0].destination.name.toUpperCase()}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(recommendations[0].destination.categories || []).slice(0, 4).map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-[#f5eee9] rounded-full text-sm text-[#5a3d2b]">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {(recommendations[0].reasons || []).slice(0, 4).map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#5a3d2b]">
                        <CheckCircle className="w-5 h-5 text-[#b87333] flex-shrink-0 mt-0.5" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-6 py-2.5 bg-[#b87333] text-white rounded-full font-medium hover:bg-[#9a5c28] transition">
                      Explore
                    </button>
                    <button className="px-6 py-2.5 bg-[#f5eee9] text-[#5a3d2b] rounded-full font-medium hover:bg-[#e8ddd5] transition flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Trip
                    </button>
                    <button className="px-6 py-2.5 bg-white border border-[#b87333] text-[#b87333] rounded-full font-medium hover:bg-[#f5eee9] transition flex items-center gap-1">
                      <Play className="w-4 h-4" /> Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.slice(1, 5).map((rec) => (
              <div key={rec.destination._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#e8ddd5] hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={rec.destination.image_url} 
                    alt={rec.destination.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/images/placeholder.jpg'}
                  />
                  <div className="absolute top-3 right-3 bg-[#b87333] text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                    {Math.round(rec.score)}% MATCH
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-serif font-bold text-[#7a4a2e] mb-1">
                    {rec.destination.name.toUpperCase()}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(rec.destination.categories || []).slice(0, 3).map((cat, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#f5eee9] rounded-full text-xs text-[#5a3d2b]">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-white border border-[#b87333] text-[#b87333] rounded-full font-medium hover:bg-[#f5eee9] transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Map */}
          <div className="mt-12 pt-8 border-t border-[#e8ddd5]">
            <h2 className="text-xl font-serif font-bold text-[#7a4a2e] text-center mb-4">
              YOUR RECOMMENDED MAHARASHTRA
            </h2>
            <div className="w-full h-80 bg-[#f5eee9] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[#d5c8bd]">
              <Compass className="w-16 h-16 text-[#b87333]/40 mb-4" />
              <p className="text-[#5a3d2b] font-medium">[ INTERACTIVE MAP ]</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#e8ddd5] text-center">
            <p className="text-xs text-[#b0a094] tracking-widest">
              ✦ DISCOVER • LEARN • EXPLORE • GET INSPIRED ✦
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default RecommendationPage;