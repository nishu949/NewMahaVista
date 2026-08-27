import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"
const API_BASE_URL = "http://127.0.0.1:8000";

/* STORIES PAGE */

const StoriesPage = () => {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStory, setSelectedStory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* FETCH ALL STORIES ,Backend doesn't have GET /api/stories.We first get cities and then stories for every city. */

  useEffect(() => {
    fetchAllStories();
  }, []);

  const fetchAllStories = async () => {
    try {
      setLoading(true);
      setError(null);

      /* Get available cities */
      const citiesResponse = await fetch(
        `${API_BASE_URL}/api/stories/cities`
      );

      if (!citiesResponse.ok) {
        throw new Error("Unable to load story cities");
      }

      const citiesData = await citiesResponse.json();

      const cities = citiesData.cities || [];

      /* If cities endpoint returns nothing */
      if (!cities.length) {
        setStories([]);
        return;
      }

      /* Fetch stories for every city */
      const requests = cities.map(async (city) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/stories/city/${encodeURIComponent(
              city
            )}?limit=50`
          );

          if (!response.ok) return [];

          const data = await response.json();

          return data.stories || [];
        } catch (err) {
          console.error(`Failed to fetch stories for ${city}`, err);
          return [];
        }
      });

      const results = await Promise.all(requests);

      const allStories = results.flat();

      /* Remove duplicate stories */
      const uniqueStories = Array.from(
        new Map(
          allStories.map((story) => [
            story._id?.$oid || story._id || story.title,
            story,
          ])
        ).values()
      );

      setStories(uniqueStories);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError(err.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  /*  CATEGORIES*/

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        stories
          .map((story) => story.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [stories]);

  /* FILTER STORIES */

  const filteredStories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return stories.filter((story) => {
      const searchableText = [
        story.title,
        story.city,
        story.category,
        story.description,
        ...(story.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        story.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [stories, searchTerm, selectedCategory]);

  /* FEATURED STORY */

  const featuredStory =
    stories.find((story) => story.is_featured) ||
    stories[0];

  /* LOADING */

  if (loading) {
    return <StoryPageSkeleton />;
  }

  /*  ERROR */

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#fffdf8] border border-[#ded9ca] p-10 text-center">
          <div className="text-5xl mb-5">📽️</div>

          <h2 className="font-serif text-3xl text-[#153f2d]">
            Stories unavailable
          </h2>

          <p className="mt-4 text-[#667085] leading-relaxed">
            {error}
          </p>

          <button
            onClick={fetchAllStories}
            className="mt-7 px-7 py-3 bg-[#08793c] text-white font-semibold hover:bg-[#075f30] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#153f2d]">
<Navbar/>
      <header className="max-w-[1350px] mx-auto px-6 md:px-10">

        <div className="h-[82px] flex items-center justify-between border-b border-[#ddd8ca]">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[#31506b] text-lg hover:text-[#08793c] transition"
          >
            <span className="text-2xl">←</span>
            <span>Back</span>
          </button>

          <div className="text-[#08793c] font-extrabold tracking-[0.25em] text-sm">
            MAHAVISTA
          </div>

        </div>

      </header>


      {/* =====================================================
          HERO / EDITORIAL INTRO
      ===================================================== */}

      <section className="border-b border-[#ddd8ca]">

        <div className="max-w-[1350px] mx-auto px-6 md:px-10">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 py-14 md:py-20 lg:py-24 items-center">

            {/* LEFT TEXT */}

            <div>

              <div className="flex items-center gap-4 mb-7">

                <span className="w-10 h-[3px] bg-[#e9a817]" />

                <span className="text-[#08793c] font-bold tracking-[0.2em] text-sm">
                  STORYTELLING
                </span>

              </div>

              <h1 className="font-serif text-[58px] md:text-[76px] lg:text-[82px] leading-[0.94] tracking-[-0.04em] text-[#153f2d]">
                Stories of
                <br />
                Maharashtra
              </h1>

              <p className="mt-8 max-w-[650px] text-[#31506b] text-lg md:text-xl leading-[1.8]">
                Travel through Maharashtra's history, culture,
                festivals and landscapes through short,
                engaging stories.
              </p>


              {/* SEARCH */}

              <div className="mt-10 max-w-[700px]">

                <div className="relative">

                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search by city, story, culture or heritage..."
                    className="w-full h-[66px] bg-[#fffdf8] border border-[#d7d2c5] px-14 pr-5 text-[#31506b] text-base outline-none placeholder:text-[#9ba3b0] focus:border-[#08793c] transition"
                  />

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#08793c]"
                    >
                      ✕
                    </button>
                  )}

                </div>

              </div>

            </div>


            {/* =================================================
                FEATURED VISUAL
            ================================================= */}

            {featuredStory && (
              <div className="relative">

                <div className="relative h-[360px] md:h-[470px] lg:h-[520px] overflow-hidden bg-[#183d2d]">

                  {/* VIDEO */}

                  {getVideoUrl(featuredStory.video_url) ? (
                    <video
                      src={getVideoUrl(featuredStory.video_url)}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#183d2d]">
                      <span className="text-[100px]">
                        {featuredStory.thumbnail || "🎬"}
                      </span>
                    </div>
                  )}

                  {/* IMAGE OVERLAY */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />


                  {/* FEATURED LABEL */}

                  <div className="absolute top-5 left-5">

                    <span className="bg-[#e9a817] text-white px-4 py-2 text-xs font-bold tracking-[0.15em]">
                      FEATURED STORY
                    </span>

                  </div>


                  {/* PLAY */}

                  <button
                    onClick={() =>
                      setSelectedStory(featuredStory)
                    }
                    className="absolute inset-0 flex items-center justify-center group"
                  >

                    <span className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center text-[#08793c] text-2xl pl-1 shadow-xl group-hover:scale-105 transition-transform">
                      ▶
                    </span>

                  </button>


                  {/* FEATURED TEXT */}

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">

                    <div className="flex items-center gap-3 text-sm mb-3">

                      <span className="text-[#f5c451] font-semibold">
                        {featuredStory.category}
                      </span>

                      <span className="opacity-60">•</span>

                      <span>
                        {featuredStory.city}
                      </span>

                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight">
                      {featuredStory.title}
                    </h2>

                    <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
                      <span>◷ {featuredStory.duration}</span>
                      <span>•</span>
                      <span>
                        {formatViews(featuredStory.view_count)} views
                      </span>
                    </div>

                  </div>

                </div>

                {/* Small editorial caption */}

                <div className="flex justify-between items-center mt-3 text-xs text-[#7a7f78]">

                  <span>
                    Featured from the MahaVista story collection
                  </span>

                  <button
                    onClick={() =>
                      setSelectedStory(featuredStory)
                    }
                    className="text-[#08793c] font-semibold hover:underline"
                  >
                    Watch →
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORY NAVIGATION
      ===================================================== */}

      <section className="border-b border-[#d9d5ca] bg-[#fffdf8]">

        <div className="max-w-[1350px] mx-auto px-6 md:px-10">

          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`relative py-5 text-base md:text-lg whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "text-[#08793c] font-semibold"
                    : "text-[#607084] hover:text-[#153f2d]"
                }`}
              >

                {category}

                {selectedCategory === category && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#08793c]" />
                )}

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          STORY LIBRARY
      ===================================================== */}

      <main className="max-w-[1350px] mx-auto px-6 md:px-10 py-16 md:py-20">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <span className="w-7 h-[2px] bg-[#e9a817]" />

              <span className="uppercase tracking-[0.16em] text-xs font-bold text-[#08793c]">
                Story Library
              </span>

            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-[#153f2d]">
              Explore the collection
            </h2>

          </div>

          <p className="text-[#6d7480] text-sm">
            {filteredStories.length}{" "}
            {filteredStories.length === 1
              ? "story"
              : "stories"}
          </p>

        </div>


        {/* SEARCH RESULT MESSAGE */}

        {searchTerm && (
          <div className="mb-8 text-[#607084]">

            Showing results for{" "}
            <span className="font-semibold text-[#153f2d]">
              "{searchTerm}"
            </span>

            <button
              onClick={() => setSearchTerm("")}
              className="ml-3 text-[#08793c] font-semibold hover:underline"
            >
              Clear
            </button>

          </div>
        )}


        {/* STORIES */}

        {filteredStories.length === 0 ? (

          <div className="py-24 border-t border-b border-[#ddd8ca] text-center">

            <div className="text-5xl mb-5">
              🔎
            </div>

            <h3 className="font-serif text-3xl text-[#153f2d]">
              No stories found
            </h3>

            <p className="mt-3 text-[#6d7480]">
              Try another city, topic or category.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 text-[#08793c] font-semibold underline underline-offset-4"
            >
              Clear filters
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">

            {filteredStories.map((story, index) => (

              <StoryCard
                key={
                  story._id?.$oid ||
                  story._id ||
                  `${story.title}-${index}`
                }
                story={story}
                onWatch={() =>
                  setSelectedStory(story)
                }
              />

            ))}

          </div>

        )}

      </main>


      {/* =====================================================
          BOTTOM EDITORIAL STRIP
      ===================================================== */}

      <section className="border-t border-[#d9d5ca] bg-[#153f2d] text-white">

        <div className="max-w-[1350px] mx-auto px-6 md:px-10 py-14">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

            <div>

              <p className="text-[#e9b53b] text-xs tracking-[0.2em] font-bold uppercase mb-3">
                MahaVista
              </p>

              <h3 className="font-serif text-3xl md:text-4xl">
                Every place has a story.
              </h3>

            </div>

            <p className="max-w-xl text-white/70 leading-relaxed">
              From ancient forts and sacred cities to coastal
              villages and vibrant festivals, discover Maharashtra
              one story at a time.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          VIDEO MODAL
      ===================================================== */}

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
   STORY CARD
============================================================ */

const StoryCard = ({ story, onWatch }) => {

  const videoUrl = getVideoUrl(story.video_url);

  return (
    <article className="group">

      {/* VIDEO */}

      <div className="relative h-[245px] overflow-hidden bg-[#183d2d]">

        {videoUrl ? (

          <video
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

        ) : (

          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">
              {story.thumbnail || "🎬"}
            </span>
          </div>

        )}

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />


        {/* CATEGORY */}

        <div className="absolute top-4 left-4">

          <span className="bg-[#fffdf8]/95 px-3 py-1.5 text-xs font-semibold text-[#08793c]">
            {story.category}
          </span>

        </div>


        {/* DURATION */}

        <div className="absolute top-4 right-4">

          <span className="bg-black/55 text-white px-3 py-1.5 text-xs">
            ◷ {story.duration}
          </span>

        </div>


        {/* PLAY */}

        <button
          onClick={onWatch}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Watch ${story.title}`}
        >

          <span className="w-14 h-14 rounded-full bg-white/90 text-[#08793c] flex items-center justify-center pl-1 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300 shadow-lg">
            ▶
          </span>

        </button>


        {/* CITY */}

        <div className="absolute bottom-4 left-5 text-white text-sm font-medium">
          📍 {story.city}
        </div>

      </div>


      {/* CONTENT */}

      <div className="pt-5">

        <div className="flex items-center gap-3 text-xs text-[#7a8088] mb-3">

          <span>
            {story.category}
          </span>

          <span>•</span>

          <span>
            {story.duration}
          </span>

          {story.view_count > 0 && (
            <>
              <span>•</span>
              <span>
                {formatViews(story.view_count)} views
              </span>
            </>
          )}

        </div>


        <h3
          onClick={onWatch}
          className="font-serif text-[27px] leading-tight text-[#153f2d] cursor-pointer group-hover:text-[#08793c] transition-colors"
        >
          {story.title}
        </h3>


        <p className="mt-3 text-[#657080] leading-relaxed text-sm line-clamp-2">
          {story.description}
        </p>


        {/* TAGS */}

        {story.tags?.length > 0 && (

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4">

            {story.tags.slice(0, 3).map((tag, index) => (

              <span
                key={index}
                className="text-xs text-[#08793c]"
              >
                #{tag}
              </span>

            ))}

          </div>

        )}


        {/* WATCH */}

        <button
          onClick={onWatch}
          className="mt-5 flex items-center gap-2 text-sm font-bold text-[#08793c] hover:gap-3 transition-all"
        >
          Watch story
          <span>→</span>
        </button>

      </div>

    </article>
  );
};


/* ============================================================
   STORY MODAL
============================================================ */

const StoryModal = ({ story, onClose }) => {

  const [videoError, setVideoError] = useState(false);

  const videoUrl = getVideoUrl(story.video_url);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >

      <div
        className="bg-[#fffdf8] w-full max-w-5xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="flex items-start justify-between gap-6 p-6 md:p-8 border-b border-[#ddd8ca]">

          <div>

            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">

              <span className="text-[#08793c] font-semibold">
                {story.category}
              </span>

              <span className="text-[#aaa]">•</span>

              <span className="text-[#687385]">
                📍 {story.city}
              </span>

              <span className="text-[#aaa]">•</span>

              <span className="text-[#687385]">
                ◷ {story.duration}
              </span>

            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-[#153f2d]">
              {story.title}
            </h2>

          </div>


          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 border border-[#d9d5ca] text-[#536070] hover:border-red-300 hover:text-red-500 transition"
          >
            ✕
          </button>

        </div>


        {/* VIDEO */}

        <div className="p-5 md:p-8">

          <div className="aspect-video bg-black overflow-hidden">

            {videoError || !videoUrl ? (

              <div className="w-full h-full flex flex-col items-center justify-center text-white">

                <span className="text-6xl mb-4">
                  🎬
                </span>

                <p className="text-white/60">
                  Video could not be loaded.
                </p>

                <button
                  onClick={() => setVideoError(false)}
                  className="mt-5 px-5 py-2 bg-[#08793c] text-white"
                >
                  Try Again
                </button>

              </div>

            ) : (

              <video
                key={videoUrl}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                controlsList="nodownload"
                onError={() => setVideoError(true)}
              />

            )}

          </div>


          {/* DESCRIPTION */}

          <div className="mt-7 max-w-3xl">

            <p className="text-[#536070] text-base md:text-lg leading-[1.8]">
              {story.description}
            </p>


            {story.tags?.length > 0 && (

              <div className="flex flex-wrap gap-2 mt-6">

                {story.tags.map((tag, index) => (

                  <span
                    key={index}
                    className="text-sm text-[#08793c] bg-[#edf4e8] px-3 py-1.5"
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
   VIDEO URL HANDLER

   Your MongoDB currently contains paths like:

   ..\public\videos\raigadvideo.mp4

   Browser cannot directly use that path.

   This converts it to:

   /videos/raigadvideo.mp4

   which works when the videos are inside:

   frontend/public/videos/
============================================================ */

const getVideoUrl = (url) => {

  if (!url) return null;

  const value = String(url).trim();

  /* Cloudinary / external video */
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  /* Already a public URL */
  if (value.startsWith("/")) {
    return value;
  }

  /* Windows path */
  let cleaned = value
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^(\.\/)+/, "");

  /* Remove public folder */
  cleaned = cleaned.replace(/^public\//i, "");

  /* Make sure it starts with / */
  return `/${cleaned}`;
};


/* ============================================================
   FORMAT VIEWS
============================================================ */

const formatViews = (views) => {

  const number = Number(views) || 0;

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toString();
};


/* ============================================================
   LOADING SKELETON
============================================================ */

const StoryPageSkeleton = () => {

  return (
    <div className="min-h-screen bg-[#f7f4ec]">

      {/* HEADER */}

      <div className="max-w-[1350px] mx-auto px-6 md:px-10">

        <div className="h-[82px] border-b border-[#ddd8ca] flex items-center justify-between">

          <div className="w-20 h-5 bg-[#e6e1d5] animate-pulse" />

          <div className="w-28 h-4 bg-[#e6e1d5] animate-pulse" />

        </div>


        {/* HERO */}

        <div className="grid lg:grid-cols-2 gap-16 py-20">

          <div className="animate-pulse">

            <div className="w-36 h-3 bg-[#ddd8ca] mb-8" />

            <div className="w-[80%] h-20 bg-[#ddd8ca]" />

            <div className="w-[65%] h-20 bg-[#ddd8ca] mt-3" />

            <div className="w-full h-5 bg-[#e4dfd3] mt-8" />

            <div className="w-[80%] h-5 bg-[#e4dfd3] mt-3" />

            <div className="h-[66px] bg-[#e4dfd3] mt-10" />

          </div>

          <div className="h-[470px] bg-[#ddd8ca] animate-pulse" />

        </div>

      </div>


      {/* CATEGORY */}

      <div className="h-[65px] bg-white border-y border-[#ddd8ca] animate-pulse" />


      {/* CARDS */}

      <div className="max-w-[1350px] mx-auto px-6 md:px-10 py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {[1, 2, 3, 4, 5, 6].map((item) => (

            <div
              key={item}
              className="animate-pulse"
            >

              <div className="h-[245px] bg-[#ddd8ca]" />

              <div className="h-3 w-24 bg-[#ddd8ca] mt-5" />

              <div className="h-8 w-[85%] bg-[#ddd8ca] mt-4" />

              <div className="h-4 w-full bg-[#e4dfd3] mt-4" />

              <div className="h-4 w-[70%] bg-[#e4dfd3] mt-2" />

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};


export default StoriesPage;