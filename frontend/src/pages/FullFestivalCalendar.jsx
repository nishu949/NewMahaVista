import { useState } from "react";
import { useNavigate } from "react-router-dom";
import festivals from "../data/festivals";

const FullFestivalCalendar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // ================= FESTIVAL ICONS =================

  const festivalIcons = {
    "Makar Sankranti": "🪁",
    Pongal: "🌾",
    Lohri: "🔥",

    "Maha Shivratri": "🔱",
    "Magha Purnima": "🌕",
    "Ratha Saptami": "☀️",

    Holi: "🎨",
    Dhulivandan: "🌈",
    "Rang Panchami": "🎨",

    "Gudi Padwa": "🚩",
    "Ram Navami": "🏹",
    "Hanuman Jayanti": "🙏",

    "Buddha Purnima": "🪷",
    "Akshaya Tritiya": "✨",
    "Vat Savitri": "🌳",

    "Jagannath Rath Yatra": "🛕",
    "Guru Purnima": "📿",
    "Yogini Ekadashi": "🪔",

    "Kanwar Yatra": "🔱",
    "Kartikeya Jayanti": "🦚",

    "Raksha Bandhan": "🎀",
    Janmashtami: "🦚",
    "Ganesh Chaturthi": "🐘",

    "Ganesh Visarjan": "🙏",
    "Anant Chaturdashi": "🪔",

    "Navratri Begins": "🌺",
    Navratri: "🌺",

    Dussehra: "🏹",
    "Karwa Chauth": "🌙",

    Diwali: "🪔",
    "Govardhan Puja": "🐄",
    "Bhai Dooj": "🎁",

    "Margashirsha Purnima": "🌕",
    "Vaikuntha Ekadashi": "🪷",
    "Gita Jayanti": "📖",
  };

  // ================= SEARCH =================

  const filteredMonths = festivals
    .map((month) => ({
      ...month,

      festivals: month.festivals.filter((festival) =>
        festival.name
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    }))
    .filter((month) => month.festivals.length > 0);

  return (
    <section className="min-h-screen bg-[#f8f5ef] py-6 sm:py-8 lg:py-10 px-3 sm:px-5 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* ================= TOP HEADER ================= */}

        <div className="relative overflow-hidden rounded-3xl border border-[#e4cfaa] bg-gradient-to-br from-[#fff8e8] via-[#faf4e8] to-[#edf5eb] shadow-lg px-5 py-7 sm:px-8 sm:py-9 mb-7">

          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#d4a373]/10" />

          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-[#2f5d34]/10" />

          <div className="relative z-10">

            <button
              type="button"
              onClick={() => navigate("/festivals")}
              className="mb-5 px-4 py-2 rounded-xl bg-[#2f5d34] text-white text-sm font-semibold hover:bg-[#244b29] transition"
            >
              ← Back to Festival Page
            </button>

            <div className="flex items-center gap-2 mb-2">

              <span className="text-xl">
                🌿
              </span>

              <p className="uppercase tracking-[0.22em] sm:tracking-[0.3em] text-[#4d7a53] text-xs sm:text-sm font-bold">
                Complete Cultural Calendar
              </p>

            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f5d34] leading-tight">
              Full Maharashtra Festival Calendar
            </h1>

            <div className="flex items-center gap-2 mt-2">

              <span className="text-[#d4a373] text-lg">
                ✦
              </span>

              <p className="text-gray-600 text-sm sm:text-base">
                Explore all festivals month by month.
              </p>

            </div>

          </div>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-2xl shadow-md border border-[#eadcc5] p-3 sm:p-4 mb-7">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search festival..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#d4a373] rounded-xl pl-11 pr-10 py-3 sm:py-4 text-sm sm:text-base text-gray-700 bg-[#fffdf9] focus:outline-none focus:ring-2 focus:ring-[#2f5d34] focus:border-[#2f5d34] transition"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2f5d34] text-lg"
              >
                ✕
              </button>
            )}

          </div>

        </div>

        {/* ================= MONTHS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredMonths.map((month) => (

            <div
              key={month.month}
              className="group bg-white rounded-2xl overflow-hidden border border-[#eadcc5] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* ================= MONTH IMAGE ================= */}

              <div className="relative w-full h-44 overflow-hidden bg-gray-100">

                <img
                  src={month.image}
                  alt={`${month.month} festival`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">

                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                    {month.month}
                  </h2>

                  <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#2f5d34] font-bold shadow-md">
                    ✦
                  </span>

                </div>

              </div>

              {/* ================= FESTIVAL LIST ================= */}

              <div className="p-5">

                <p className="text-xs uppercase tracking-widest text-[#4d7a53] font-bold mb-3">
                  Festivals
                </p>

                {month.festivals.map((festival, index) => (

                  <div
                    key={`${festival.name}-${index}`}
                    className="flex items-start gap-3 py-3 border-b border-[#eee6d8] last:border-b-0"
                  >

                    {/* ICON */}

                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center text-xl">
                      {festivalIcons[festival.name] || "🌸"}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0">

                      <p className="font-semibold text-gray-800 text-sm sm:text-base">
                        {festival.name}
                      </p>

                      <div className="flex items-center gap-1 mt-1">

                        <span className="text-[#d4a373] text-xs">
                          📅
                        </span>

                        <p className="text-xs sm:text-sm text-gray-500">
                          {festival.date}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

        {/* ================= NO RESULT ================= */}

        {filteredMonths.length === 0 && (

          <div className="bg-white rounded-2xl shadow-md border border-[#eadcc5] p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-[#2f5d34]">
              No Festival Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching with another festival name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#2f5d34] text-white font-semibold hover:bg-[#244b29] transition"
            >
              Clear Search
            </button>

          </div>

        )}

        {/* ================= BOTTOM ================= */}

        <div className="mt-10 flex justify-center">

          <button
            type="button"
            onClick={() => navigate("/festivals")}
            className="px-6 py-3 rounded-xl border-2 border-[#2f5d34] text-[#2f5d34] font-semibold hover:bg-[#2f5d34] hover:text-white transition"
          >
            ← Back to Festival Calendar
          </button>

        </div>

        <div className="flex items-center justify-center gap-3 mt-8">

          <div className="h-px bg-[#d4a373] w-16 sm:w-24" />

          <span className="text-xl text-[#d4a373]">
            ✦
          </span>

          <div className="h-px bg-[#d4a373] w-16 sm:w-24" />

        </div>

      </div>

    </section>
  );
};

export default FullFestivalCalendar;