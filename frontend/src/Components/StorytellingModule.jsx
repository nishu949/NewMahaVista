import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StorytellingModule = ({ city = "Maharashtra" }) => {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedStory();
  }, [city]);

  const fetchFeaturedStory = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch featured story
      const response = await fetch(
        `http://127.0.0.1:8000/api/stories/city/${city}/featured`
      );

      if (response.ok) {
        const featured = await response.json();
        setFeaturedStory(featured);
      } else {
        // If no featured story, fetch all stories and use the first one
        const allStoriesResponse = await fetch(
          `http://127.0.0.1:8000/api/stories/city/${city}`
        );
        if (allStoriesResponse.ok) {
          const data = await allStoriesResponse.json();
          if (data.stories && data.stories.length > 0) {
            setFeaturedStory(data.stories[0]);
          } else {
            setError("No stories found for this city");
          }
        } else {
          setError("Failed to fetch stories");
        }
      }
    } catch (error) {
      console.error("Error fetching featured story:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h3 className="text-xl font-bold text-red-700 mb-2">Unable to load story</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchFeaturedStory}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredStory) {
    return (
      <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6 py-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8 text-center">
          <span className="text-4xl mb-4 block">📹</span>
          <h3 className="text-xl font-bold text-yellow-700 mb-2">No featured story</h3>
          <p className="text-yellow-600">
            No featured story available for "{city}".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1350px] mx-auto px-4 md:px-6 py-6">

      {/* MAIN PREMIUM CARD */}
      <div className="relative overflow-hidden rounded-[34px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.16)] border border-white">

        {/* ======================================================
            HERO SECTION - VIDEO BACKGROUND
        ====================================================== */}
        <div className="relative h-[430px] md:h-[550px] overflow-hidden">

          {/* VIDEO BACKGROUND */}
          {featuredStory?.video_url ? (
            <video
              src={featuredStory.video_url}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
              loop
              autoPlay
              poster={featuredStory.thumbnail}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
              <span className="text-8xl opacity-30">🎬</span>
            </div>
          )}

          {/* DARK GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* TOP LEFT STORY BADGE */}
          <div className="absolute top-0 left-0 z-20">
            <div className="bg-gradient-to-r from-[#ffb31a] to-[#f58a00] text-white px-7 py-5 rounded-br-[28px] shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#f59e0b] shadow-md">
                  <span className="text-xl">▶</span>
                </div>

                <div>
                  <p className="text-sm md:text-base font-extrabold tracking-wide">
                    STORYTELLING
                  </p>
                  <p className="text-sm md:text-base font-extrabold tracking-wide">
                    VIDEOS
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HERO CONTENT */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">

            <div className="max-w-3xl">

              {/* CITY TITLE */}
              <div className="flex items-end gap-3">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl">
                  {city}
                </h1>

                <span className="text-yellow-400 text-3xl mb-2">
                  ✦
                </span>
              </div>

              <p className="text-white text-xl md:text-2xl font-semibold mt-2 drop-shadow-lg">
                The Sacred City of
              </p>

              <p className="text-[#ffd21c] text-2xl md:text-3xl font-extrabold mt-1 drop-shadow-lg">
                Faith, Nature & Heritage
              </p>
            </div>

            {/* DURATION */}
            <div className="absolute bottom-7 right-7">
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/55 backdrop-blur-md border border-white/50 text-white shadow-xl">
                <span className="text-xl">◷</span>
                <span className="font-bold text-lg">
                  {featuredStory?.duration || "50 sec"}
                </span>
              </div>
            </div>
          </div>

          {/* PLAY BUTTON OVERLAY */}
          <button
            onClick={() => setSelectedStory(featuredStory)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/60 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-[#8aca19] via-[#4eae28] to-[#08793c] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-3xl md:text-4xl text-white">▶</span>
            </div>
          </button>
        </div>

        {/* ======================================================
            CONTENT SECTION - BUTTONS ONLY
        ====================================================== */}
        <div className="relative bg-gradient-to-br from-[#fffaf0] via-[#fffdf7] to-[#f3f8e9] px-6 md:px-10 py-8">

          {/* BUTTONS ROW */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            {/* WATCH STORY BUTTON */}
            {featuredStory && (
              <button
                onClick={() => setSelectedStory(featuredStory)}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#8aca19] via-[#4eae28] to-[#08793c] text-white text-xl md:text-2xl font-extrabold shadow-[0_10px_25px_rgba(65,150,45,0.35)] hover:shadow-[0_14px_35px_rgba(65,150,45,0.45)] hover:scale-[1.02] transition-all duration-300 border-4 border-white"
              >
                <span className="mr-3">▶</span>
                Watch Story
              </button>
            )}

            {/* VIEW ALL STORIES BUTTON */}
            <button
              onClick={() => navigate('/stories')}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white border-2 border-[#08793c] text-[#08793c] text-xl md:text-2xl font-extrabold hover:bg-[#08793c] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
            >
              View All Stories
            </button>

          </div>

          {/* FOOTER TAGLINE */}
          <div className="mt-6 pt-5 border-t border-green-900/10 text-center">
            <p className="text-[#146b38] font-semibold tracking-wide">
              ✦ Discover&nbsp;&nbsp;•&nbsp;&nbsp;Learn&nbsp;&nbsp;•&nbsp;&nbsp;
              Explore&nbsp;&nbsp;•&nbsp;&nbsp;Get Inspired
            </p>
          </div>
        </div>
      </div>

      {/* STORY MODAL */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
};


/* ============================================================
   STORY MODAL
============================================================ */

const StoryModal = ({ story, onClose }) => {
  const [videoError, setVideoError] = useState(false);

  const getVideoUrl = () => {
    if (story.video_url) {
      if (story.video_url.startsWith('/') || 
          story.video_url.startsWith('http')) {
        return story.video_url;
      }
    }
    return story.video_url || null;
  };

  const videoSrc = getVideoUrl();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[30px] overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800">
              {story.title}
            </h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              <span>📍 {story.city}</span>
              <span>•</span>
              <span>{story.category}</span>
              <span>•</span>
              <span>◷ {story.duration}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition"
          >
            ✕
          </button>
        </div>

        {/* VIDEO PLAYER */}
        <div className="p-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
            {videoError || !videoSrc ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                <span className="text-6xl mb-4">🎬</span>
                <p className="text-gray-400 text-center">
                  {!videoSrc ? "No video available" : "Video unavailable"}
                </p>
                <button 
                  onClick={() => {
                    setVideoError(false);
                    const video = document.querySelector('video');
                    if (video) video.load();
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <video
                key={videoSrc}
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
                controlsList="nodownload"
                onError={(e) => {
                  console.error('Video failed to load:', e);
                  console.log('Video URL attempted:', videoSrc);
                  setVideoError(true);
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully!');
                  setVideoError(false);
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <p className="text-gray-700 leading-relaxed">
              {story.description}
            </p>
            {story.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


/* ============================================================
   LOADING SKELETON
============================================================ */

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-[1350px] mx-auto px-4 py-6">

      <div className="rounded-[34px] overflow-hidden bg-white shadow-2xl animate-pulse">

        <div className="h-[430px] md:h-[550px] bg-gradient-to-br from-green-900 to-blue-900" />

        <div className="p-8 bg-[#fffaf0]">

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-16 w-48 bg-gray-200 rounded-full" />
            <div className="h-16 w-48 bg-gray-200 rounded-full" />
          </div>

          <div className="h-5 w-64 bg-gray-200 rounded mx-auto mt-6" />
        </div>
      </div>
    </div>
  );
};

export default StorytellingModule;