import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronRight,
  Menu,
  User,
  MapPin,
  CheckCircle2,
  Check,
  Play,
  Compass,
  Sparkles,
  ArrowRight,
  Sun,
  CloudRain,
  CloudSun,
  Snowflake,
  Heart,
  Users,
  UsersRound,
  UserRound,
  Mountain,
  Landmark,
  Utensils,
  PawPrint,
  Waves,
  RotateCcw,
  Bookmark,
  Map,
} from "lucide-react";

import { recommendationApi } from "../services/recommendationApi";
import Navbar from "../Components/Navbar";

const RecommendationPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const [preferences, setPreferences] = useState({
    month: "",
    interests: [],
    travel_with: "",
    budget: "",
    duration: "",
    adventure_level: "",
  });

  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const fullMonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


const interestImages = {
  Adventure: "/images/adventure.avif",
  Beaches: "/images/beaches.avif",
  Culture: "/images/culture.avif",
  Family: "/images/family.avif",
  Food: "/images/food.avif",
  Heritage: "/images/heritage.avif",
  HillStation: "/images/HillStation.avif",
  History: "/images/history.avif",
  Nature: "/images/nature.avif",
  Nightlife: "/images/nightlife.avif",
  Photography: "/images/photography.avif",
  Science: "/images/science.avif",
  Shopping: "/images/shopping.avif",
  Spiritual: "/images/spiritual.avif",
  Trekking: "/images/trekking.jpg",
  Wildlife: "/images/wildlife.avif",
};
  const interestIcons = {
    Nature: Mountain,
    Heritage: Landmark,
    Culture: Sparkles,
    Food: Utensils,
    Wildlife: PawPrint,
    Beaches: Waves,
    Adventure: Mountain,
    Spiritual: Sparkles,
  };

  const travelOptions = [
    {
      id: "Solo",
      label: "Solo",
      icon: UserRound,
    },
    {
      id: "Couple",
      label: "Couple",
      icon: Heart,
    },
    {
      id: "Family",
      label: "Family",
      icon: UsersRound,
    },
    {
      id: "Friends",
      label: "Friends",
      icon: Users,
    },
  ];

  const budgetLevels = [
    {
      value: 1,
      label: "Budget",
    },
    {
      value: 2,
      label: "Moderate",
    },
    {
      value: 3,
      label: "Premium",
    },
  ];

  const durationLevels = [
    {
      value: 1,
      label: "Weekend",
    },
    {
      value: 2,
      label: "5-7 Days",
    },
    {
      value: 3,
      label: "2+ Weeks",
    },
  ];

  const paceLevels = [
    {
      value: 1,
      label: "Relaxed",
    },
    {
      value: 2,
      label: "Balanced",
    },
    {
      value: 3,
      label: "Active",
    },
  ];

  /* ============================================================
     FETCH MONTHS + CATEGORIES
  ============================================================ */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthsRes, categoriesRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/destinations/months"),
          fetch("http://127.0.0.1:8000/api/destinations/categories"),
        ]);

        if (monthsRes.ok) {
          const data = await monthsRes.json();

          setAvailableMonths(
            Array.isArray(data.months) && data.months.length > 0
              ? data.months
              : fullMonthNames
          );
        } else {
          setAvailableMonths(fullMonthNames);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();

          setAvailableCategories(
            Array.isArray(data.categories) && data.categories.length > 0
              ? data.categories
              : defaultInterests
          );
        } else {
          setAvailableCategories(defaultInterests);
        }
      } catch (err) {
        console.error("Error fetching recommendation data:", err);

        setAvailableMonths(fullMonthNames);
        setAvailableCategories(defaultInterests);
      }
    };

    fetchData();
  }, []);

  /* ============================================================
     PREFERENCE HELPERS
  ============================================================ */

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setPreferences((prev) => {
      const exists = prev.interests.includes(interest);

      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  /* ============================================================
     MONTH / WEATHER HELPERS
  ============================================================ */

  const getMonthAbbr = (month) => {
    if (!month) return "";

    const foundMonth = fullMonthNames.find(
      (item) => item.toLowerCase() === month.toLowerCase()
    );

    return foundMonth
      ? foundMonth.substring(0, 3).toUpperCase()
      : month.substring(0, 3).toUpperCase();
  };

  const getMonthIndex = (month) => {
    if (!month) return -1;

    return fullMonthNames.findIndex(
      (item) => item.toLowerCase() === month.toLowerCase()
    );
  };

  const getWeatherIcon = (month) => {
    const index = getMonthIndex(month);

    if (index === 11 || index <= 1) {
      return <Snowflake size={18} />;
    }

    if (index >= 2 && index <= 4) {
      return <Sun size={18} />;
    }

    if (index >= 5 && index <= 8) {
      return <CloudRain size={18} />;
    }

    return <CloudSun size={18} />;
  };

  const getSeasonDetails = (month) => {
    const index = getMonthIndex(month);

    if (index === 11 || index <= 1) {
      return {
        title: "Cool weather",
        description:
          "Festivals • Winter travel • Pleasant sightseeing",
        emoji: "❄️",
      };
    }

    if (index >= 2 && index <= 4) {
      return {
        title: "Warm weather",
        description:
          "Outdoor adventures • Heritage • Long days",
        emoji: "☀️",
      };
    }

    if (index >= 5 && index <= 8) {
      return {
        title: "Monsoon season",
        description:
          "Waterfalls • Green landscapes • Misty forts",
        emoji: "🌧️",
      };
    }

    return {
      title: "Pleasant weather",
      description:
        "Exploring • Culture • Food experiences",
      emoji: "🌤️",
    };
  };

  /* ============================================================
     SUBMIT
  ============================================================ */

  const handleSubmit = async () => {
    if (!preferences.month) {
      alert("Please select a month first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result =
        await recommendationApi.getRecommendations(preferences);

      setRecommendations(result?.recommendations || []);
      setShowResults(true);

      setTimeout(() => {
        document
          .getElementById("recommendation-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (err) {
      console.error("Recommendation error:", err);

      setError(
        err?.message ||
          "We couldn't find your recommendations right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     RESET
  ============================================================ */

  const handleReset = () => {
    setPreferences({
      month: "",
      interests: [],
      travel_with: "",
      budget: "",
      duration: "",
      adventure_level: "",
    });

    setRecommendations(null);
    setShowResults(false);
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ============================================================
     SLIDER VALUES
  ============================================================ */

  const budgetValue =
    preferences.budget === "Budget"
      ? 1
      : preferences.budget === "Moderate"
      ? 2
      : preferences.budget === "Premium"
      ? 3
      : 2;

  const durationValue =
    preferences.duration === "Weekend"
      ? 1
      : preferences.duration === "5-7 Days"
      ? 2
      : preferences.duration === "2+ Weeks"
      ? 3
      : 2;

  const paceValue =
    preferences.adventure_level === "Relaxed"
      ? 1
      : preferences.adventure_level === "Balanced"
      ? 2
      : preferences.adventure_level === "Active"
      ? 3
      : 2;

  const getLevelLabel = (type, value) => {
    if (type === "budget") {
      return budgetLevels.find(
        (item) => item.value === value
      )?.label;
    }

    if (type === "duration") {
      return durationLevels.find(
        (item) => item.value === value
      )?.label;
    }

    return paceLevels.find(
      (item) => item.value === value
    )?.label;
  };

  const handleSliderChange = (type, value) => {
    const numericValue = Number(value);

    if (type === "budget") {
      updatePreference(
        "budget",
        budgetLevels.find(
          (item) => item.value === numericValue
        )?.label
      );
    }

    if (type === "duration") {
      updatePreference(
        "duration",
        durationLevels.find(
          (item) => item.value === numericValue
        )?.label
      );
    }

    if (type === "pace") {
      updatePreference(
        "adventure_level",
        paceLevels.find(
          (item) => item.value === numericValue
        )?.label
      );
    }
  };

  /* DESTINATION IMAGE FALLBACK*/


  const getDestinationImage = (destination) => {
    return (
      destination?.image_url ||
      "/images/Maharashtra-scaled.jpg"
    );
  };



  return (
    
    <div className="min-h-screen bg-[#fff8f6] text-[#2c160e] antialiased pb-32">
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-sm">
      <Navbar />
    </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .maha-display {
          font-family: 'Epilogue', sans-serif;
        }

        .maha-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .maha-slider {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 5px;
          background: #ffdbd0;
          border-radius: 999px;
          outline: none;
        }

        .maha-slider::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #9a4600;
          cursor: pointer;
          border: 4px solid #fff8f6;
          box-shadow: 0 2px 8px rgba(93,64,55,0.25);
        }

        .maha-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #9a4600;
          cursor: pointer;
          border: 3px solid #fff8f6;
        }
      `}</style>

      <main className="pt-6 px-3 md:px-5 max-w-[1800px] mx-auto space-y-16 md:space-y-20">

        {/* ============================================================
            HERO
        ============================================================ */}

        <section className="relative min-h-[430px] md:min-h-[520px] rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(93,64,55,0.12)]">

          <img
            src="https://images.unsplash.com/photo-1600100397608-f0102c1a5f4f?auto=format&fit=crop&w=1800&q=90"
            alt="Maharashtra landscape"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "/images/Maharashtra-scaled.cms";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#442a22]/95 via-[#442a22]/45 to-transparent" />

          <div className="relative z-10 min-h-[430px] md:min-h-[520px] flex items-end p-7 md:p-12">

            <div className="max-w-3xl">

              <p className="maha-body text-xs md:text-sm uppercase tracking-[0.22em] font-bold text-[#ffb68d] mb-4">
                Your journey. Your preferences.
              </p>

              <h1 className="maha-display text-5xl md:text-7xl lg:text-[82px] leading-[0.95] font-extrabold tracking-[-0.04em] text-white mb-7">
                DISCOVER
                <br />
                <span className="text-[#ffb68d]">
                  MAHARASHTRA
                </span>
              </h1>

              <button
                onClick={() =>
                  document
                    .getElementById("planning-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="maha-body inline-flex items-center gap-2 bg-[#9a4600] hover:bg-[#763300] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
              >
                Start Planning
                <ArrowRight size={18} />
              </button>

            </div>

          </div>
        </section>

        {/* ============================================================
            PLANNING
        ============================================================ */}

        <section
          id="planning-section"
          className="space-y-16"
        >

          {/* MONTH */}

          <section className="space-y-6">

            <div>
              <p className="maha-body text-xs uppercase tracking-[0.2em] font-bold text-[#574237] mb-2">
                Plan Your Perfect Journey
              </p>

              <h2 className="maha-display text-3xl md:text-4xl font-semibold text-[#2c160e]">
                When are you travelling?
              </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-3 -mx-5 px-5 md:mx-0 md:px-0">

              {availableMonths.map((month) => {

                const selected =
                  preferences.month === month;

                return (
                  <button
                    key={month}
                    onClick={() =>
                      updatePreference("month", month)
                    }
                    className={`shrink-0 px-6 py-3 rounded-full border font-semibold text-sm transition-all flex items-center gap-2 ${
                      selected
                        ? "bg-[#1961a1] border-[#1961a1] text-white shadow-md"
                        : "bg-[#fff8f6] border-[#dec0b1] text-[#574237] hover:bg-[#ffe9e3]"
                    }`}
                  >
                    {selected && (
                      <Check
                        size={16}
                        strokeWidth={3}
                      />
                    )}

                    {getMonthAbbr(month)}
                  </button>
                );
              })}

            </div>

            {preferences.month && (
              <div className="bg-[#fff1ed] border border-[#ffdbd0] rounded-xl p-5 flex items-start gap-4">

                <div className="text-2xl">
                  {getSeasonDetails(
                    preferences.month
                  ).emoji}
                </div>

                <div>

                  <h3 className="maha-body font-bold text-[#2c160e]">
                    {preferences.month}
                  </h3>

                  <p className="maha-body text-sm text-[#574237] mt-1 flex flex-wrap items-center gap-2">
                    {getWeatherIcon(
                      preferences.month
                    )}

                    {getSeasonDetails(
                      preferences.month
                    ).title}

                    <span>•</span>

                    {getSeasonDetails(
                      preferences.month
                    ).description}
                  </p>

                </div>
              </div>
            )}

          </section>

          {/* INTERESTS */}

          <section className="space-y-6">

            <div>

              <h2 className="maha-display text-3xl md:text-4xl font-semibold text-[#2c160e] uppercase">
                What do you love?
              </h2>

              <p className="maha-body text-sm text-[#574237] mt-2">
                Pick as many experiences as you want.
              </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

              {availableCategories.map((interest) => {

                const selected =
                  preferences.interests.includes(
                    interest
                  );

                const image =
                  interestImages[interest];

                const Icon =
                  interestIcons[interest] ||
                  Sparkles;

                return (
                  <button
                    key={interest}
                    onClick={() =>
                      toggleInterest(interest)
                    }
                    className={`relative h-28 md:h-32 rounded-xl overflow-hidden group text-left transition-all ${
                      selected
                        ? "ring-2 ring-[#1961a1] ring-offset-2 ring-offset-[#fff8f6]"
                        : ""
                    }`}
                  >

                    {image ? (
                      <img
                        src={image}
                        alt={interest}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#ffe9e3] flex items-center justify-center">
                        <Icon
                          size={42}
                          className="text-[#8b7265]"
                        />
                      </div>
                    )}

                    <div
                      className={`absolute inset-0 transition-colors ${
                        selected
                          ? "bg-[#1961a1]/35"
                          : "bg-black/35 group-hover:bg-black/50"
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    <div className="absolute inset-0 p-4 flex items-end justify-between">

                      <span className="maha-body text-white font-bold text-sm md:text-base">
                        {interest}
                      </span>

                      {selected && (
                        <span className="w-6 h-6 rounded-full bg-white text-[#1961a1] flex items-center justify-center shadow-md">
                          <Check
                            size={15}
                            strokeWidth={3}
                          />
                        </span>
                      )}

                    </div>

                  </button>
                );
              })}

            </div>
          </section>



{/* TRAVEL STYLE */}

<section className="space-y-6">

  <div>
    <h2 className="maha-display text-3xl md:text-4xl font-semibold text-[#2c160e] uppercase tracking-wide">
      Travel Style
    </h2>

    <p className="maha-body mt-2 text-sm text-[#806b61]">
      Choose who you want to explore Maharashtra with
    </p>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
    
    {travelOptions.map((option) => {

      const Icon = option.icon;

      const selected =
        preferences.travel_with === option.id;

      return (
        <button
          key={option.id}
          onClick={() =>
            updatePreference(
              "travel_with",
              option.id
            )
          }
          className={`group relative w-full aspect-[118/132]
            rounded-[22px]
            border-2
            flex flex-col items-center justify-center
            transition-all duration-300 ease-out
            ${
              selected
                ? "border-amber-600 bg-[#236b50] shadow-[0_12px_28px_rgba(35,107,80,0.25)] -translate-y-1"
                : "border-amber-300/60 bg-[#fffaf7] shadow-[0_5px_18px_rgba(71,45,35,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(71,45,35,0.12)] hover:border-amber-400/80"
            }`}
        >

          {/* Selected check */}
          {selected && (
            <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Check
                size={13}
                strokeWidth={3}
                className="text-[#236b50]"
              />
            </span>
          )}

          {/* Icon */}
          <div
            className={`relative w-[64px] h-[64px]
              rounded-full
              flex items-center justify-center
              mb-3
              transition-all duration-300
              ${
                selected
                  ? "bg-white/20 text-white"
                  : option.id === "Solo"
                  ? "bg-[#f2ddd2] text-[#a65335]"
                  : option.id === "Couple"
                  ? "bg-[#f3dce0] text-[#b34d61]"
                  : option.id === "Family"
                  ? "bg-[#f4e5c7] text-[#b47b24]"
                  : "bg-[#dcebe2] text-[#357253]"
              }`}
          >
            <Icon
              size={30}
              strokeWidth={1.8}
            />

            {/* Decorative dot */}
            <span
              className={`absolute bottom-1 right-0
                w-3 h-3 rounded-full border-2
                ${
                  selected
                    ? "bg-[#f3c46b] border-[#236b50]"
                    : "bg-[#e3a98f] border-[#fffaf7]"
                }`}
            />
          </div>

          {/* Label */}
          <span
            className={`maha-body text-[15px] font-semibold
              ${
                selected
                  ? "text-white"
                  : "text-[#3f2b24]"
              }`}
          >
            {option.label}
          </span>

          {/* Small hint */}
          {!selected && (
            <span className="absolute bottom-2.5 text-[8px] uppercase tracking-[0.15em] text-[#a58b80] opacity-0 group-hover:opacity-100 transition-opacity">
              Explore
            </span>
          )}

        </button>
      );
    })}

  </div>
</section>

          {/* SLIDERS */}

 <section className="bg-gradient-to-br from-[#fff4ee] via-[#fff8f5] to-[#ffede4] p-6 md:p-8 rounded-2xl border border-[#f0d0c2] shadow-[0_8px_24px_rgba(93,64,55,0.08)] space-y-7">

  {/* Budget */}
  <div className="relative bg-white/70 rounded-2xl p-4 md:p-5 border border-[#f2ddd5] shadow-[0_2px_10px_rgba(93,64,55,0.04)] space-y-4">

    <div className="flex justify-between items-center gap-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-[#f47920]/15 border border-[#f47920]/20 flex items-center justify-center">
          <span className="text-base text-[#c95d12] font-semibold">₹</span>
        </div>

        <div>
          <label className="maha-body font-semibold text-[#2c160e]">
            Budget
          </label>

          <p className="maha-body text-[11px] text-[#92766a] mt-0.5">
            Your preferred spending level
          </p>
        </div>

      </div>

      <span className="maha-body text-xs font-bold text-[#a44c0a] bg-[#f47920]/12 border border-[#f47920]/20 px-3 py-1.5 rounded-full">
        {getLevelLabel("budget", budgetValue)}
      </span>

    </div>

    <div className="px-1">

      <input
        className="maha-slider w-full"
        type="range"
        min="1"
        max="3"
        step="1"
        value={budgetValue}
        onChange={(e) =>
          handleSliderChange("budget", Number(e.target.value))
        }
      />

      <div className="flex justify-between text-[11px] text-[#80675c] maha-body mt-2">
        <span>Backpacker</span>
        <span>Luxury</span>
      </div>

    </div>

  </div>


  {/* Duration */}
  <div className="relative bg-white/70 rounded-2xl p-4 md:p-5 border border-[#f2ddd5] shadow-[0_2px_10px_rgba(93,64,55,0.04)] space-y-4">

    <div className="flex justify-between items-center gap-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-[#e8753d]/15 border border-[#e8753d]/20 flex items-center justify-center">
          <span className="text-base text-[#c45b2b]">◷</span>
        </div>

        <div>
          <label className="maha-body font-semibold text-[#2c160e]">
            Duration
          </label>

          <p className="maha-body text-[11px] text-[#92766a] mt-0.5">
            How long you'd like to travel
          </p>
        </div>

      </div>

      <span className="maha-body text-xs font-bold text-[#a44c0a] bg-[#f47920]/12 border border-[#f47920]/20 px-3 py-1.5 rounded-full">
        {getLevelLabel("duration", durationValue)}
      </span>

    </div>

    <div className="px-1">

      <input
        className="maha-slider w-full"
        type="range"
        min="1"
        max="3"
        step="1"
        value={durationValue}
        onChange={(e) =>
          handleSliderChange("duration", Number(e.target.value))
        }
      />

      <div className="flex justify-between text-[11px] text-[#80675c] maha-body mt-2">
        <span>Weekend</span>
        <span>2+ Weeks</span>
      </div>

    </div>

  </div>


  {/* Pace */}
  <div className="relative bg-white/70 rounded-2xl p-4 md:p-5 border border-[#f2ddd5] shadow-[0_2px_10px_rgba(93,64,55,0.04)] space-y-4">

    <div className="flex justify-between items-center gap-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-[#e59b45]/15 border border-[#e59b45]/20 flex items-center justify-center">
          <span className="text-base text-[#bd7624]">✦</span>
        </div>

        <div>
          <label className="maha-body font-semibold text-[#2c160e]">
            Pace
          </label>

          <p className="maha-body text-[11px] text-[#92766a] mt-0.5">
            Your preferred travel rhythm
          </p>
        </div>

      </div>

      <span className="maha-body text-xs font-bold text-[#a44c0a] bg-[#f47920]/12 border border-[#f47920]/20 px-3 py-1.5 rounded-full">
        {getLevelLabel("pace", paceValue)}
      </span>

    </div>

    <div className="px-1">

      <input
        className="maha-slider w-full"
        type="range"
        min="1"
        max="3"
        step="1"
        value={paceValue}
        onChange={(e) =>
          handleSliderChange("pace", Number(e.target.value))
        }
      />

      <div className="flex justify-between text-[11px] text-[#80675c] maha-body mt-2">
        <span>Relaxed</span>
        <span>Action-Packed</span>
      </div>

    </div>

  </div>

</section>

          {/* ERROR */}

          {error && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 text-center">

              <div className="text-3xl mb-3">
                😅
              </div>

              <h3 className="maha-display text-xl font-bold text-[#7a2e2e]">
                Something went wrong
              </h3>

              <p className="maha-body text-sm text-[#574237] mt-2">
                {error}
              </p>

              <button
                onClick={handleSubmit}
                className="mt-5 px-6 py-2.5 rounded-xl bg-[#9a4600] text-white font-bold"
              >
                Try Again
              </button>

            </div>
          )}

        </section>

        {/* ============================================================
            RESULTS
        ============================================================ */}

        {showResults && (
          <section
            id="recommendation-results"
            className="scroll-mt-24 space-y-8"
          >

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

              <div>

                <p className="maha-body text-xs uppercase tracking-[0.2em] font-bold text-[#574237] mb-2">
                  Your personalized journey
                </p>

                <h2 className="maha-display text-4xl md:text-5xl font-bold text-[#2c160e]">
                  Places picked for you.
                </h2>

                <p className="maha-body text-[#574237] mt-3">
                  Based on your month, interests and travel style.
                </p>

              </div>

              <button
                onClick={handleReset}
                className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#dec0b1] bg-white text-[#574237] font-bold text-sm hover:bg-[#ffe9e3] transition"
              >
                <RotateCcw size={16} />
                Change Preferences
              </button>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="bg-white rounded-2xl border border-[#ffdbd0] p-14 text-center">

                <div className="w-12 h-12 border-4 border-[#ffdbd0] border-t-[#9a4600] rounded-full animate-spin mx-auto" />

                <h3 className="maha-display text-xl font-bold text-[#2c160e] mt-5">
                  Finding your places...
                </h3>

                <p className="maha-body text-sm text-[#574237] mt-2">
                  Matching Maharashtra destinations with your preferences.
                </p>

              </div>

            ) : recommendations?.length > 0 ? (

              <>

                {/* SUMMARY */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  <div className="bg-white rounded-xl border border-[#ffdbd0] p-4">
                    <p className="text-xs uppercase tracking-wider text-[#8b7265] maha-body">
                      Month
                    </p>

                    <p className="maha-display font-bold text-[#2c160e] mt-1">
                      {preferences.month}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#ffdbd0] p-4">
                    <p className="text-xs uppercase tracking-wider text-[#8b7265] maha-body">
                      Interests
                    </p>

                    <p className="maha-display font-bold text-[#2c160e] mt-1">
                      {preferences.interests.length ||
                        "All"}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#ffdbd0] p-4">
                    <p className="text-xs uppercase tracking-wider text-[#8b7265] maha-body">
                      Travel
                    </p>

                    <p className="maha-display font-bold text-[#2c160e] mt-1">
                      {preferences.travel_with ||
                        "Flexible"}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#ffdbd0] p-4">
                    <p className="text-xs uppercase tracking-wider text-[#8b7265] maha-body">
                      Pace
                    </p>

                    <p className="maha-display font-bold text-[#2c160e] mt-1">
                      {preferences.adventure_level ||
                        "Balanced"}
                    </p>
                  </div>

                </div>

                {/* FEATURED */}

                <div className="bg-white rounded-2xl overflow-hidden border border-[#ffdbd0] shadow-[0_6px_30px_rgba(93,64,55,0.08)]">

                  <div className="grid md:grid-cols-2">

                    <div className="relative min-h-[320px] md:min-h-[430px]">

                      <img
                        src={getDestinationImage(
                          recommendations[0]
                            .destination
                        )}
                        alt={
                          recommendations[0]
                            .destination.name
                        }
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#442a22]/70 via-transparent to-transparent" />

                      <div className="absolute top-5 right-5 bg-[#1961a1] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        {Math.round(
                          recommendations[0]
                            .score || 0
                        )}
                        % MATCH
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">

                        <span className="maha-body inline-flex items-center gap-1 text-white text-sm">

                          <MapPin size={15} />

                          {
                            recommendations[0]
                              .destination
                              .district
                          }

                          , Maharashtra

                        </span>

                      </div>

                    </div>

                    <div className="p-7 md:p-10 flex flex-col justify-center">

                      <p className="maha-body text-xs uppercase tracking-[0.18em] font-bold text-[#9a4600] mb-3">
                        Top recommendation
                      </p>

                      <h3 className="maha-display text-4xl md:text-5xl font-extrabold text-[#2c160e] leading-tight">
                        {
                          recommendations[0]
                            .destination.name
                        }
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-5">

                        {(
                          recommendations[0]
                            .destination
                            .categories || []
                        )
                          .slice(0, 4)
                          .map(
                            (category, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 rounded-full bg-[#fff1ed] text-[#574237] text-xs font-bold"
                              >
                                {category}
                              </span>
                            )
                          )}

                      </div>

                      <div className="mt-6 space-y-3">

                        {(
                          recommendations[0]
                            .reasons || []
                        )
                          .slice(0, 4)
                          .map(
                            (reason, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >

                                <CheckCircle2
                                  size={19}
                                  className="text-[#2c694e] mt-0.5 shrink-0"
                                />

                                <span className="maha-body text-sm text-[#574237]">
                                  {reason}
                                </span>

                              </div>
                            )
                          )}

                      </div>

                      <div className="flex flex-wrap gap-3 mt-8">

                        <button
                          onClick={() => {

                            const id =
                              recommendations[0]
                                .destination
                                ._id;

                            if (id) {
                              navigate(
                                `/destination/${id}`
                              );
                            }

                          }}
                          className="px-6 py-3 rounded-xl bg-[#9a4600] hover:bg-[#763300] text-white font-bold text-sm transition flex items-center gap-2"
                        >
                          Explore
                          <ArrowRight size={16} />
                        </button>

                        <button
                          className="px-5 py-3 rounded-xl bg-[#fff1ed] text-[#574237] font-bold text-sm flex items-center gap-2 hover:bg-[#ffe2da] transition"
                        >
                          <Bookmark size={16} />
                          Save
                        </button>

                        <button
                          className="px-5 py-3 rounded-xl border border-[#9a4600] text-[#9a4600] font-bold text-sm flex items-center gap-2 hover:bg-[#fff1ed] transition"
                        >
                          <Play size={16} />
                          Story
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

                {/* MORE RECOMMENDATIONS */}

                {recommendations.length > 1 && (

                  <div className="space-y-5">

                    <div className="flex items-center justify-between">

                      <h3 className="maha-display text-2xl md:text-3xl font-bold text-[#2c160e]">
                        More places to explore
                      </h3>

                      <span className="text-sm maha-body text-[#8b7265]">
                        {recommendations.length - 1}{" "}
                        more matches
                      </span>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                      {recommendations
                        .slice(1, 7)
                        .map((rec, index) => (

                          <div
                            key={
                              rec.destination
                                ?._id ||
                              `${rec.destination?.name}-${index}`
                            }
                            className="bg-white rounded-2xl overflow-hidden border border-[#ffdbd0] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(93,64,55,0.10)] transition-all"
                          >

                            <div className="relative h-52">

                              <img
                                src={getDestinationImage(
                                  rec.destination
                                )}
                                alt={
                                  rec.destination
                                    ?.name ||
                                  "Destination"
                                }
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85";
                                }}
                              />

                              <div className="absolute top-4 right-4 bg-[#1961a1] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                                {Math.round(
                                  rec.score || 0
                                )}
                                % MATCH
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                              <div className="absolute bottom-4 left-4 text-white flex items-center gap-1 text-xs maha-body">

                                <MapPin size={14} />

                                {
                                  rec.destination
                                    ?.district
                                }

                              </div>

                            </div>

                            <div className="p-5">

                              <h4 className="maha-display text-2xl font-bold text-[#2c160e]">
                                {
                                  rec.destination
                                    ?.name
                                }
                              </h4>

                              <div className="flex flex-wrap gap-1.5 mt-3">

                                {(
                                  rec.destination
                                    ?.categories ||
                                  []
                                )
                                  .slice(0, 3)
                                  .map(
                                    (cat, index) => (
                                      <span
                                        key={index}
                                        className="px-2.5 py-1 rounded-full bg-[#fff1ed] text-[#574237] text-xs font-semibold"
                                      >
                                        {cat}
                                      </span>
                                    )
                                  )}

                              </div>

                              <button
                                onClick={() => {

                                  const id =
                                    rec.destination
                                      ?._id;

                                  if (id) {
                                    navigate(
                                      `/destination/${id}`
                                    );
                                  }

                                }}
                                className="mt-5 w-full py-2.5 rounded-xl border border-[#9a4600] text-[#9a4600] font-bold text-sm hover:bg-[#fff1ed] transition flex items-center justify-center gap-2"
                              >
                                View Details
                                <ChevronRight
                                  size={16}
                                />
                              </button>

                            </div>

                          </div>

                        ))}

                    </div>

                  </div>
                )}

                {/* MAP */}

                <div className="pt-8 border-t border-[#dec0b1]/50">

                  <div className="flex items-center justify-between mb-5">

                    <div>

                      <p className="maha-body text-xs uppercase tracking-[0.2em] text-[#8b7265] font-bold">
                        Your destinations
                      </p>

                      <h3 className="maha-display text-2xl md:text-3xl font-bold text-[#2c160e] mt-1">
                        Explore your Maharashtra
                      </h3>

                    </div>

                    <Compass
                      size={30}
                      className="text-[#9a4600]"
                    />

                  </div>

                  <div className="h-[300px] rounded-2xl bg-[#ffe9e3] border border-[#ffdbd0] flex flex-col items-center justify-center">

                    <Compass
                      size={62}
                      className="text-[#9a4600]/30"
                    />

                    <p className="maha-display font-bold text-[#574237] mt-4">
                      Interactive Maharashtra Map
                    </p>

                    <p className="maha-body text-xs text-[#8b7265] mt-1">
                      Your recommended destinations will appear here.
                    </p>

                  </div>

                </div>

              </>

            ) : (

              <div className="bg-white rounded-2xl border border-[#ffdbd0] p-12 text-center">

                <div className="text-5xl mb-4">
                  🔍
                </div>

                <h3 className="maha-display text-2xl font-bold text-[#2c160e]">
                  No exact matches found
                </h3>

                <p className="maha-body text-sm text-[#574237] mt-2">
                  Try selecting a few more interests or changing your travel preferences.
                </p>

                <button
                  onClick={handleReset}
                  className="mt-6 px-6 py-3 bg-[#9a4600] text-white rounded-xl font-bold"
                >
                  Adjust Preferences
                </button>

              </div>

            )}

          </section>
        )}

      </main>

      {/* ============================================================
          FIND MY PLACES
      ============================================================ */}

      {!showResults && (
        <div className="fixed bottom-5 left-0 right-0 z-40 px-5 md:px-10 pointer-events-none">

          <div className="max-w-[1400px] mx-auto flex justify-center">

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="pointer-events-auto w-full md:w-auto min-w-[280px] bg-[#9a4600] hover:bg-[#763300] disabled:opacity-70 text-white maha-display font-bold text-lg py-4 px-12 rounded-xl shadow-[0_8px_28px_rgba(154,70,0,0.32)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >

              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding Places...
                </>
              ) : (
                <>
                  FIND MY PLACES
                  <Sparkles size={19} />
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* ============================================================
          MOBILE NAV
      ============================================================ */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#fff8f6]/95 backdrop-blur-xl border-t border-[#dec0b1]/30 shadow-[0_-4px_15px_rgba(93,64,55,0.08)]">

        <div className="flex justify-around items-center py-2.5 px-3 pb-4">

          <button className="flex flex-col items-center justify-center bg-[#f47920] text-white rounded-full px-4 py-1.5">

            <Compass size={19} />

            <span className="text-[10px] font-bold mt-1 maha-body">
              Discover
            </span>

          </button>

          <button className="flex flex-col items-center justify-center text-[#574237] px-4 py-1.5 rounded-full hover:bg-[#ffe9e3]">

            <Map size={19} />

            <span className="text-[10px] font-semibold mt-1 maha-body">
              Journey
            </span>

          </button>

          <button className="flex flex-col items-center justify-center text-[#574237] px-4 py-1.5 rounded-full hover:bg-[#ffe9e3]">

            <Bookmark size={19} />

            <span className="text-[10px] font-semibold mt-1 maha-body">
              Saved
            </span>

          </button>

          <button className="flex flex-col items-center justify-center text-[#574237] px-4 py-1.5 rounded-full hover:bg-[#ffe9e3]">

            <User size={19} />

            <span className="text-[10px] font-semibold mt-1 maha-body">
              Profile
            </span>

          </button>

        </div>

      </nav>

    </div>
  );
};

export default RecommendationPage;