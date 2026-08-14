import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Trophy, Star, Zap, Users, MapPin, Compass } from "lucide-react";

const featureCards = [
  { 
    emoji: "🏛️", 
    title: "History", 
    subtitle: "Mighty Forts",
    color: "from-amber-600 to-orange-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverColor: "hover:border-amber-400"
  },
  { 
    emoji: "🎭", 
    title: "Culture", 
    subtitle: "Living Arts",
    color: "from-purple-600 to-pink-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:border-purple-400"
  },
  { 
    emoji: "🍛", 
    title: "Cuisine", 
    subtitle: "Flavor & Spice",
    color: "from-red-600 to-rose-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    hoverColor: "hover:border-red-400"
  },
];

const culturalIcons = [
  { icon: "🏯", label: "Forts" },
  { icon: "🎨", label: "Warli Art" },
  { icon: "💃", label: "Lavani" },
  { icon: "🥘", label: "Cuisine" },
  { icon: "🪷", label: "Heritage" },
  { icon: "📿", label: "Traditions" },
];

const BottomSlider = () => {
  const navigate = useNavigate();
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleStartQuiz = () => {
    if (!selectedSubtopic) {
      alert("Please select a subtopic first");
      return;
    }

    navigate("/quiz", {
      state: { subtopic: selectedSubtopic },
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] p-[2px] bg-gradient-to-r from-[#6b3f1d] via-[#a47148] to-[#d4a373] shadow-[0_24px_55px_rgba(0,0,0,0.3)]">
      
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6b3f1d] via-[#8b5e34] to-[#a47148] p-8 md:p-10">
        
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#f5e6cc]/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/10" />
          
          {/* Floating dots */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10 rotate-12">
          <Star className="w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2.5 border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white tracking-wide">
                Mystic Trail Quiz
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
            </div>

            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
              Culture Quiz
              <span className="block text-2xl font-light text-yellow-200/80 mt-2">
                Discover Maharashtra's Heritage
              </span>
            </h2>

            <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Test your knowledge of Maharashtra's magnificent forts, vibrant culture,
              rich culinary traditions, and centuries-old heritage through an engaging
              interactive quiz experience.
            </p>

            {/* Feature Cards */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {featureCards.map((item) => (
                <button
                  key={item.title}
                  onClick={() => setSelectedSubtopic(item.title)}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                    selectedSubtopic === item.title
                      ? `scale-[1.05] border-white/80 bg-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-2 ring-white/50`
                      : `border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] hover:shadow-lg`
                  }`}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.color} blur-2xl`} />
                  
                  <div className="relative z-10">
                    <div className="mb-3 text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {item.emoji}
                    </div>

                    <div className={`text-lg font-bold text-white transition-colors duration-300 ${
                      selectedSubtopic === item.title ? 'text-white' : 'group-hover:text-white'
                    }`}>
                      {item.title}
                    </div>

                    <div className="mt-1 text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      {item.subtitle}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedSubtopic === item.title && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center animate-pulse">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Quiz Stats & Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleStartQuiz}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 font-bold text-[#3a2416] shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play size={20} className="fill-current group-hover:animate-pulse" />
                <span>{selectedSubtopic ? `Start ${selectedSubtopic} Quiz` : 'Begin Your Journey'}</span>
                <span className={`transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
              </button>

              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-1.5 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">1.2k+ played</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-1.5 text-white/60">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">Earn points</span>
                </div>
              </div>
            </div>

            {/* Topics list */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Topics:</span>
              {['Forts', 'Culture', 'Cuisine', 'History', 'Traditions'].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 text-xs font-medium text-white/60 bg-white/10 rounded-full border border-white/10"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Right Content - Enlarged Cultural Icons Card */}
          <div className="relative flex items-center justify-center">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-64 h-64 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
            </div>

            {/* Glow behind */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl animate-pulse" />

            {/* Enlarged Cultural Icons Card */}
            <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/15 shadow-2xl">
              {/* Quiz Time Badge */}
              <div className="absolute -top-5 -right-5 z-20 animate-bounce">
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2.5 shadow-lg">
                  <Zap className="w-4 h-4 text-[#3a2416]" />
                  <span className="text-sm font-bold text-[#3a2416]">Quiz Time</span>
                </div>
              </div>

              {/* Enlarged Icon Grid */}
              <div className="grid grid-cols-3 gap-4">
                {culturalIcons.map((item, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl bg-white/10 backdrop-blur-sm p-5 text-center border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:border-yellow-400/30 cursor-default"
                    style={{
                      animation: `float ${2 + (index * 0.3)}s ease-in-out infinite`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-xs font-medium text-white/30 uppercase tracking-[0.2em]">Explore</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Maharashtra Badge */}
              <div className="flex items-center justify-center gap-3 py-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-base font-semibold text-white/80 tracking-wide">Maharashtra</span>
              </div>

              {/* Heritage Tag */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-1 h-1 rounded-full bg-yellow-400/50" />
                <span className="text-xs font-medium text-white/40 uppercase tracking-[0.1em]">
                  Land of Culture & Heritage
                </span>
                <div className="w-1 h-1 rounded-full bg-yellow-400/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default BottomSlider;