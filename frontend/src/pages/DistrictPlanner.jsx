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
          <p className="text-lg font-semibold text-[#1B5E20]">
            Loading district details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-[#f8f3ea]">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1B5E20]">
            District detail not found
          </h2>
          <p className="mt-3 max-w-xl text-gray-600">
            We could not find planner details for this district in the backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#2d2d2d]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={city.image || city.detail_image || "/images/default.jpg"}
          alt={city.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // e.target.src = "/images/default.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-6 md:px-10 xl:px-16">
            <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              Maharashtra District Planner
            </span>

            <h1 className="mt-5 text-4xl font-bold uppercase tracking-wide text-white md:text-6xl">
              {city.name}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
              {city.subtitle ||
                city.tagline ||
                "Explore this beautiful district of Maharashtra."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {city.best_time && (
                <span className="rounded-full bg-[#f5deb3] px-4 py-2 text-sm font-semibold text-[#4d2905]">
                  Best Time: {city.best_time}
                </span>
              )}
              {city.duration && (
                <span className="rounded-full bg-[#f5deb3] px-4 py-2 text-sm font-semibold text-[#4d2905]">
                  Recommended Days: {city.duration}
                </span>
              )}
              {city.budget && (
                <span className="rounded-full bg-[#f5deb3] px-4 py-2 text-sm font-semibold text-[#4d2905]">
                  Budget: {city.budget}
                </span>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate(`/plan-trip/${city.slug}`)}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-[#f5deb3] px-8 py-4 font-semibold text-[#4d2905] shadow-lg transition-all duration-300 hover:scale-[1.05] hover:bg-[#e6c891]"
              >
                <span className="text-lg">Plan Your Trip</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
                <span className="absolute inset-0 rounded-2xl border border-white/20"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="w-full px-6 py-16 md:px-10 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4d7c57]">
              Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#1B5E20]">
              {city.overview_title || `About ${city.name}`}
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-700">
              {city.details || city.description ||
                "No overview available for this district yet."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-md">
                <p className="text-sm text-gray-500">Theme</p>
                <p className="mt-1 font-semibold text-[#1B5E20]">
                  {city.highlights || city.theme || "Not available"}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-md">
                <p className="text-sm text-gray-500">Best Time</p>
                <p className="mt-1 font-semibold text-[#1B5E20]">
                  {city.best_time || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <img
              src={city.detail_image || city.image || "/images/default.jpg"}
              alt={city.name}
              className="h-[420px] w-full rounded-[28px] object-cover shadow-xl"
              onError={(e) => {
                // e.target.src = "/images/default.jpg";
              }}
            />
          </div>
        </div>
      </section>

      {/* Places */}
      <section className="w-full px-6 py-10 md:px-10 xl:px-16">
        <h2 className="text-3xl font-bold text-[#1B5E20]">
          Top Tourist Attractions
        </h2>

        {city.places?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
            {city.places.map((place, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[28px] bg-white shadow-lg"
              >
                <img
                  src={place.image || "/images/default.jpg"}
                  alt={place.title || place.name}
                  className="h-[320px] w-full object-cover"
                  onError={(e) => {
                    // e.target.src = "/images/default.jpg";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1B5E20]">
                    {place.title || place.name}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {place.description || "No description available."}
                  </p>

                  <div className="mt-6 flex gap-3">
                    {place.maps_url && (
                      <a
                        href={place.maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Open Map
                      </a>
                    )}
                    {place.wiki_url && (
                      <a
                        href={place.wiki_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-[#1B5E20] px-4 py-2 text-sm font-semibold text-[#1B5E20]"
                      >
                        Read More
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No tourist attractions added yet.</p>
        )}
      </section>

      {/* Stays */}
      <section className="w-full px-6 py-10 md:px-10 xl:px-16">
        <h2 className="text-3xl font-bold text-[#1B5E20]">Places to Stay</h2>

        {city.stays?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
            {city.stays.map((stay, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[28px] bg-white shadow-lg"
              >
                <img
                  src={stay.image || "/images/default.jpg"}
                  alt={stay.name}
                  className="h-[320px] w-full object-cover"
                  onError={(e) => {
                    // e.target.src = "/images/default.jpg";
                  }}
                />
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[#1B5E20]">
                      {stay.name}
                    </h3>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {stay.type || "Stay"}
                    </span>
                  </div>

                  <p className="text-base leading-7 text-gray-600">
                    {stay.description || "No description available."}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Price:</span>{" "}
                      {stay.price
                        ? `₹${stay.price}/night`
                        : "Not available"}
                    </p>
                    <p>
                      <span className="font-semibold">Amenities:</span>{" "}
                      {stay.amenities || "Not available"}
                    </p>
                  </div>

                  {stay.booking_link && (
                    <a
                      href={stay.booking_link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-block rounded-xl bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Book Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No stay details added yet.</p>
        )}
      </section>

      {/* Culture */}
      <section className="w-full px-6 py-10 md:px-10 xl:px-16">
        <h2 className="text-3xl font-bold text-[#1B5E20]">Culture & Heritage</h2>

        {city.culture?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
            {city.culture.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[28px] bg-white shadow-lg"
              >
                <img
                  src={item.image || "/images/default.jpg"}
                  alt={item.title}
                  className="h-[320px] w-full object-cover"
                  onError={(e) => {
                    // e.target.src = "/images/default.jpg";
                  }}
                />
                <div className="p-6">
                  <span className="rounded-full bg-[#f5deb3] px-3 py-1 text-xs font-semibold text-[#4d2905]">
                    {item.category || "Culture"}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-[#1B5E20]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {item.description || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No cultural details added yet.</p>
        )}
      </section>

      {/* Transport */}
      <section className="w-full px-6 py-10 pb-20 md:px-10 xl:px-16">
        <h2 className="text-3xl font-bold text-[#1B5E20]">Transport</h2>

        {city.transport?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
            {city.transport.map((item, index) => (
              <div
                key={index}
                className="rounded-[28px] bg-white p-8 shadow-lg"
              >
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {item.type || "Transport"}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-[#1B5E20]">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {item.description || "No transport details available."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No transport details added yet.</p>
        )}
      </section>
    </div>
  );
};

export default DistrictPlanner;