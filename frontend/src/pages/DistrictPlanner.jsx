import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const API_BASE = "http://127.0.0.1:8000";

const DistrictPlanner = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCityPlanner = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/cities/${slug}/planner`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("District detail not found");
          }
          throw new Error("Failed to fetch district details");
        }

        const data = await res.json();
        setCity(data);
      } catch (err) {
        setCity(null);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCityPlanner();
    }
  }, [slug]);

  useEffect(() => {
    console.log("city", city);
  }, [city]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3ea]">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#1B5E20] border-t-transparent"></div>
            <p className="mt-4 text-lg font-semibold text-[#1B5E20]">
              Loading district details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-[#f8f3ea]">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <div className="rounded-full bg-red-100 p-6">
            <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#1B5E20]">
            District Not Found
          </h2>
          <p className="mt-3 max-w-xl text-gray-600">
            We could not find planner details for this district in the backend.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-[#1B5E20] px-8 py-3 font-semibold text-white transition hover:bg-[#2e7d32]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#2d2d2d]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={city.image || city.detail_image || "/images/default.jpg"}
            alt={city.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // e.target.src = "/images/default.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        </div>

        <div className="absolute inset-0 flex items-end pb-20">
          <div className="w-full px-6 md:px-10 xl:px-16">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3">
                <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  📍 Maharashtra District Planner
                </span>
                {city.highlights && (
                  <span className="inline-block rounded-full bg-[#f5deb3]/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                    {city.highlights}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-5xl font-bold uppercase tracking-wide text-white md:text-7xl lg:text-8xl">
                {city.name}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
                {city.subtitle ||
                  city.tagline ||
                  "Explore this beautiful district of Maharashtra."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {city.best_time && (
                  <span className="flex items-center gap-2 rounded-full bg-[#f5deb3] px-4 py-2 text-sm font-semibold text-[#4d2905]">
                    <span>📅</span> {city.best_time}
                  </span>
                )}
                {city.duration && (
                  <span className="flex items-center gap-2 rounded-full bg-[#f5deb3] px-4 py-2 text-sm font-semibold text-[#4d2905]">
                    <span>⏱️</span> {city.duration}
                  </span>
                )}
                {city.budget && (
                  <span className="flex items-center gap-2 rounded-full bg-[#f5deb3] px-4 py-2 text-sm font-semibold text-[#4d2905]">
                    <span>💰</span> {city.budget}
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/plan-trip/${city.slug}`)}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-[#f5deb3] px-8 py-4 font-semibold text-[#4d2905] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="text-lg">Plan Your Trip</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </button>
                <button
                  onClick={() => {
                    const section = document.getElementById("overview");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Explore More ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="w-full px-6 py-20 md:px-10 xl:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-[#1B5E20]"></div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d7c57]">
                Overview
              </p>
            </div>
            <h2 className="text-4xl font-bold text-[#1B5E20]">
              {city.overview_title || `About ${city.name}`}
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-700">
              {city.details || city.description ||
                "No overview available for this district yet."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg">
                <p className="text-sm text-gray-500">Theme</p>
                <p className="mt-1 text-lg font-semibold text-[#1B5E20]">
                  {city.highlights || city.theme || "Not available"}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg">
                <p className="text-sm text-gray-500">Best Time</p>
                <p className="mt-1 text-lg font-semibold text-[#1B5E20]">
                  {city.best_time || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-[#1B5E20]/5"></div>
            <img
              src={city.detail_image || city.image || "/images/default.jpg"}
              alt={city.name}
              className="relative h-[450px] w-full rounded-[28px] object-cover shadow-2xl"
              onError={(e) => {
                // e.target.src = "/images/default.jpg";
              }}
            />
          </div>
        </div>
      </section>

      <div className="w-full px-6 md:px-10 xl:px-16">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Places - Enhanced Cards */}
      <section className="w-full px-6 py-20 md:px-10 xl:px-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-[#1B5E20]"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d7c57]">
            Attractions
          </p>
        </div>
        <h2 className="text-4xl font-bold text-[#1B5E20]">
          Top Tourist Attractions
        </h2>

        {city.places?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {city.places.map((place, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                {/* Image Container with Gradient Overlay */}
                <div className="relative overflow-hidden">
                  <img
                    src={place.image || "/images/default.jpg"}
                    alt={place.title || place.name}
                    className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // e.target.src = "/images/default.jpg";
                    }}
                  />
                  {/* Gradient Overlay - Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Tag Badge - Top Right */}
                  <span className="absolute right-4 top-4 rounded-full bg-[#1B5E20] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    Must Visit
                  </span>
                  
                  {/* Location Badge - Bottom Left */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1B5E20] backdrop-blur-sm">
                    <span>📍</span> Attraction
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1B5E20] transition-colors group-hover:text-[#2e7d32]">
                    {place.title || place.name}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-600 line-clamp-3">
                    {place.description || "No description available."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {place.maps_url && (
                      <a
                        href={place.maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1B5E20] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2e7d32] hover:shadow-lg"
                      >
                        <span>📍</span> Open Map
                      </a>
                    )}
                    {place.wiki_url && (
                      <a
                        href={place.wiki_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1B5E20] px-5 py-2.5 text-sm font-semibold text-[#1B5E20] transition hover:bg-[#1B5E20] hover:text-white"
                      >
                        Read More →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-md">
            <p className="text-gray-600">No tourist attractions added yet.</p>
          </div>
        )}
      </section>

      <div className="w-full px-6 md:px-10 xl:px-16">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Culture - Enhanced Cards */}
      <section className="w-full px-6 py-20 md:px-10 xl:px-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-[#1B5E20]"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d7c57]">
            Heritage
          </p>
        </div>
        <h2 className="text-4xl font-bold text-[#1B5E20]">Culture & Heritage</h2>

        {city.culture?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {city.culture.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/images/default.jpg"}
                    alt={item.title}
                    className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // e.target.src = "/images/default.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute right-4 top-4 rounded-full bg-[#f5deb3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#4d2905] shadow-lg">
                    {item.category || "Culture"}
                  </span>
                  
                  {/* Icon Overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1B5E20] backdrop-blur-sm">
                    <span>🏛️</span> Heritage
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1B5E20] transition-colors group-hover:text-[#2e7d32]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-600 line-clamp-3">
                    {item.description || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-md">
            <p className="text-gray-600">No cultural details added yet.</p>
          </div>
        )}
      </section>

      <div className="w-full px-6 md:px-10 xl:px-16">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Stays - Enhanced Cards */}
      <section className="w-full px-6 py-20 md:px-10 xl:px-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-[#1B5E20]"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d7c57]">
            Accommodation
          </p>
        </div>
        <h2 className="text-4xl font-bold text-[#1B5E20]">Places to Stay</h2>

        {city.stays?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {city.stays.map((stay, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={stay.image || "/images/default.jpg"}
                    alt={stay.name}
                    className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // e.target.src = "/images/default.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Price Badge - Top Right */}
                  {stay.price && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#f5deb3] px-4 py-1.5 text-sm font-bold text-[#4d2905] shadow-lg">
                      ₹{stay.price}/night
                    </span>
                  )}
                  
                  {/* Type Badge - Bottom Left */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1B5E20] backdrop-blur-sm">
                    <span>🏨</span> {stay.type || "Stay"}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1B5E20] transition-colors group-hover:text-[#2e7d32]">
                    {stay.name}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-600 line-clamp-2">
                    {stay.description || "No description available."}
                  </p>

                  {/* Amenities Chips */}
                  {stay.amenities && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stay.amenities.split(",").map((item, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                        >
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-md">
            <p className="text-gray-600">No stay details added yet.</p>
          </div>
        )}
      </section>

      <div className="w-full px-6 md:px-10 xl:px-16">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Transport - Enhanced Cards */}
      <section className="w-full px-6 py-20 pb-28 md:px-10 xl:px-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-[#1B5E20]"></div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d7c57]">
            Connectivity
          </p>
        </div>
        <h2 className="text-4xl font-bold text-[#1B5E20]">Transport</h2>

        {city.transport?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {city.transport.map((item, index) => {
              const icons = {
                air: "✈️",
                rail: "🚆",
                road: "🚗",
                default: "🚌"
              };
              const bgColors = {
                air: "bg-blue-50",
                rail: "bg-orange-50",
                road: "bg-green-50",
                default: "bg-gray-50"
              };
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${bgColors[item.type?.toLowerCase()] || bgColors.default}`}>
                      {icons[item.type?.toLowerCase()] || icons.default}
                    </div>
                    <div>
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase text-green-700">
                        {item.type || "Transport"}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-[#1B5E20]">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {item.description || "No transport details available."}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-md">
            <p className="text-gray-600">No transport details added yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DistrictPlanner;