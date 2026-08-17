import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Trophy, Users, Clock, Eye, ChevronRight, Star, Flame } from "lucide-react";

const KidsSection = () => {
  const navigate = useNavigate();
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const mockFeaturedStory = {
    title: "Maharashtra: The Land of Culture and Heritage",
    city: "Maharashtra",
    category: "Culture",
    duration: "2 min",
    description: "Explore the rich cultural heritage of Maharashtra",
    video_url: "/videos/IntroVideo.mp4",
    is_featured: true,
    view_count: 1250,
    tags: ["culture", "heritage", "education"],
  };

  const sampleStories = [
    { id: 1, title: "Shaniwar Wada: The Maratha Legacy", category: "Heritage", duration: "1 min", thumbnail: "🏰", views: "89k" },
    { id: 2, title: "Ganesh Festival Celebration", category: "Festivals", duration: "50 sec", thumbnail: "🐘", views: "210k" },
    { id: 3, title: "Maharashtrian Cuisine Journey", category: "Food", duration: "2 min", thumbnail: "🍛", views: "78k" },
  ];

  const featureCards = [
    { emoji: "🏛️", title: "History", subtitle: "Mighty Forts", color: "from-amber-500 to-orange-600", borderColor: "border-amber-300" },
    { emoji: "🎭", title: "Culture", subtitle: "Living Arts", color: "from-purple-500 to-pink-600", borderColor: "border-purple-300" },
    { emoji: "🍛", title: "Cuisine", subtitle: "Flavor & Spice", color: "from-red-500 to-rose-600", borderColor: "border-red-300" },
  ];

  const culturalIcons = [
    { icon: "🏯", label: "Forts" },
    { icon: "🎨", label: "Warli Art" },
    { icon: "💃", label: "Lavani" },
    { icon: "🥘", label: "Cuisine" },
    { icon: "🪷", label: "Heritage" },
    { icon: "📿", label: "Traditions" },
  ];

  const handleStartQuiz = () => {
    if (!selectedSubtopic) {
      alert("Please select a subtopic first");
      return;
    }
    navigate("/quiz", { state: { subtopic: selectedSubtopic } });
  };

  const handleViewAllStories = () => navigate("/stories");

  return (
    <div className="w-full bg-[#FBF4E8]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .warli-strip {
          height: 14px;
          background-image: repeating-linear-gradient(
            to right,
            #C1502D 0px, #C1502D 6px,
            transparent 6px, transparent 14px
          );
          background-size: 14px 2px;
          background-repeat: repeat-x;
          background-position: center;
        }
        .arch-frame {
          border-radius: 160px 160px 16px 16px;
        }
        .feature-card-glow {
          box-shadow: 0 0 30px rgba(193, 80, 45, 0.15);
        }
      `}</style>

      <div className="warli-strip" />

      <div className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Section heading */}
        <div className="flex items-center gap-3 mb-7 md:mb-9">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C1502D] shrink-0">
            <Star className="w-5 h-5 text-[#FBF4E8] fill-[#FBF4E8]" />
          </span>
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#20263F] tracking-tight leading-none">
              Kids Corner
            </h2>
            <p className="font-body text-sm text-[#8A5A3E] mt-1">
              Stories and quizzes from the heart of Maharashtra
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* ============== LEFT: STORYTELLING ============== */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#E9DAC3] shadow-[0_2px_0_#E9DAC3]">
            {/* Arch-framed video hero */}
            <div className="relative px-5 pt-5">
              <div className="arch-frame relative h-[260px] md:h-[300px] overflow-hidden bg-[#20263F]">
                <video
                  src={mockFeaturedStory.video_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  autoPlay
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#20263F]/90 via-[#20263F]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-body text-[#E9A23B] text-xs font-semibold tracking-wide mb-1">
                    The Sacred City of Faith, Nature & Heritage
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
                    {mockFeaturedStory.city}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedStory(mockFeaturedStory)}
                  aria-label="Watch story"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/15 border-2 border-white/50 flex items-center justify-center hover:scale-110 hover:bg-white/25 transition-all duration-300"
                >
                  <span className="w-11 h-11 rounded-full bg-[#C1502D] flex items-center justify-center">
                    <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" />
                  </span>
                </button>

                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-white">
                  <Clock className="w-3 h-3" />
                  <span className="font-body text-[11px] font-semibold">{mockFeaturedStory.duration}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="px-5 pt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSelectedStory(mockFeaturedStory)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C1502D] text-white font-body text-sm font-semibold hover:bg-[#A8431F] transition-colors duration-200"
              >
                <Play className="w-4 h-4 fill-white" /> Watch story
              </button>
              <button
                onClick={handleViewAllStories}
                className="flex-1 px-5 py-3 rounded-xl bg-[#FBF4E8] text-[#20263F] font-body text-sm font-semibold border border-[#E9DAC3] hover:bg-[#F3E5CC] transition-colors duration-200"
              >
                View all stories
              </button>
            </div>

            {/* Sample stories */}
            <div className="px-5 pb-5 pt-5 mt-1">
              <div className="border-t border-[#E9DAC3] pt-4">
                <h4 className="font-body text-xs font-semibold text-[#8A5A3E] uppercase tracking-wider mb-3">
                  More stories to explore
                </h4>
                <div className="space-y-2">
                  {sampleStories.map((story) => (
                    <button
                      key={story.id}
                      onClick={() => navigate("/stories")}
                      className="w-full group flex items-center gap-3 bg-[#FBF4E8] hover:bg-[#F3E5CC] rounded-xl p-2.5 border border-transparent hover:border-[#E9A23B] transition-all duration-200 text-left"
                    >
                      <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-xl shrink-0 border border-[#E9DAC3]">
                        {story.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] font-semibold text-[#20263F] truncate">
                          {story.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-body text-[11px] text-[#8A5A3E] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {story.duration}
                          </span>
                          <span className="text-[#D9C6A3]">•</span>
                          <span className="font-body text-[11px] text-[#8A5A3E] flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {story.views}
                          </span>
                        </div>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#C1502D] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============== RIGHT: QUIZ - IMPROVED FEATURE CARDS ============== */}
          <div className="bg-gradient-to-br from-[#E8D5C4] to-[#D4BBA5] rounded-2xl p-6 md:p-7 border border-[#C4A88A] shadow-[0_2px_0_#C4A88A]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C1502D]/15 px-3.5 py-1.5 mb-4 border border-[#C1502D]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#C1502D]" />
              <span className="font-body text-xs font-semibold text-[#8A3A1E] tracking-wide">
                Mystic Trail Quiz
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold text-[#3D2415] leading-tight">
              Culture quiz
            </h2>
            <p className="font-body text-sm text-[#5A3A25] mt-1">
              Discover Maharashtra's heritage
            </p>
            <p className="font-body text-sm leading-relaxed text-[#4D3220] mt-3">
              Test your knowledge of Maharashtra's magnificent forts, vibrant culture, and rich culinary traditions.
            </p>

            {/* ========== FEATURE CARDS - LARGER & MORE PROMINENT ========== */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {featureCards.map((item) => {
                const active = selectedSubtopic === item.title;
                return (
                  <button
                    key={item.title}
                    onClick={() => setSelectedSubtopic(item.title)}
                    className={`group relative overflow-hidden rounded-2xl p-4 text-center transition-all duration-300 border-3 shadow-lg ${
                      active
                        ? `bg-gradient-to-br ${item.color} border-[#C1502D] scale-105 feature-card-glow`
                        : "bg-white/90 border-[#C4A88A] hover:scale-105 hover:shadow-xl hover:border-[#C1502D]"
                    }`}
                  >
                    {/* Background glow effect on hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.color} blur-xl`} />
                    
                    <div className="relative z-10">
                      <div className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {item.emoji}
                      </div>
                      <div className={`font-body text-base font-bold transition-colors duration-300 ${
                        active ? "text-white" : "text-[#3D2415] group-hover:text-[#C1502D]"
                      }`}>
                        {item.title}
                      </div>
                      <div className={`font-body text-xs font-medium transition-colors duration-300 ${
                        active ? "text-white/80" : "text-[#6B4F3A] group-hover:text-[#8A3A1E]"
                      }`}>
                        {item.subtitle}
                      </div>
                    </div>

                    {/* Selection indicator - prominent */}
                    {active && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 rounded-full bg-[#C1502D] border-2 border-white flex items-center justify-center shadow-lg">
                          <span className="text-[10px] text-white font-bold">✓</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cultural icons */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Flame className="w-4 h-4 text-[#C1502D]" />
                <h4 className="font-body text-xs font-bold text-[#5A3A25] uppercase tracking-wider">
                  Cultural treasures
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {culturalIcons.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-2.5 text-center bg-white/80 border border-[#C4A88A] hover:border-[#C1502D] hover:shadow-md hover:bg-white transition-all duration-200"
                  >
                    <div className="text-2xl mb-0.5">{item.icon}</div>
                    <span className="font-body text-[10px] font-medium text-[#5A3A25]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleStartQuiz}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#C1502D] hover:bg-[#A8431F] px-5 py-3.5 font-body font-semibold text-white text-sm transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Play size={16} className="fill-current" />
              {selectedSubtopic ? `Start ${selectedSubtopic} quiz` : "Begin your journey"}
              <ChevronRight size={16} className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
            </button>


            {/* Topics */}
            <div className="mt-4 pt-4 border-t border-[#C4A88A]/50 flex flex-wrap gap-2">
              {["Forts", "Culture", "Cuisine", "History", "Traditions"].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 font-body text-[10px] font-medium text-[#5A3A25] bg-white/80 rounded-full border border-[#C4A88A] hover:border-[#C1502D] hover:bg-white transition-colors cursor-default"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="warli-strip" />

      {selectedStory && <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />}
    </div>
  );
};

const StoryModal = ({ story, onClose }) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#20263F]/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-[#E9DAC3]">
          <div>
            <h3 className="font-display text-2xl font-bold text-[#20263F]">{story.title}</h3>
            <div className="flex flex-wrap gap-3 mt-2 font-body text-sm text-[#8A5A3E]">
              <span>{story.city}</span>
              <span>•</span>
              <span>{story.category}</span>
              <span>•</span>
              <span>{story.duration}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#FBF4E8] hover:bg-[#F3E5CC] text-[#20263F] transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="aspect-video bg-[#20263F] rounded-xl overflow-hidden">
            {videoError || !story.video_url ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/60 font-body text-sm">
                Video unavailable
              </div>
            ) : (
              <video
                src={story.video_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
                onError={() => setVideoError(true)}
              />
            )}
          </div>
          <p className="mt-5 font-body text-[#4A3B2C] leading-relaxed">{story.description}</p>
        </div>
      </div>
    </div>
  );
};

export default KidsSection;