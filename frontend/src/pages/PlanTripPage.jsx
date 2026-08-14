import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import SimpleMap from "../Components/SimpleMap";

const API_BASE = "http://127.0.0.1:8000";

const preferenceOptions = [
  { label: "Heritage", icon: "🏰" },
  { label: "Nature", icon: "🌿" },
  { label: "Culinary", icon: "🍲" },
  { label: "Trekking", icon: "🥾" },
];

const PlanTripPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPrefs, setSelectedPrefs] = useState(["Heritage"]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    travel_date: "",
    guests: 2,
    special_interests: "Heritage",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH CITY ================= */

  useEffect(() => {
    const fetchCityPlanner = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/cities/${slug}/planner`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch city details");
        }

        const data = await res.json();
        setCity(data);
      } catch (err) {
        console.error(err);
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCityPlanner();
    }
  }, [slug]);

  /* ================= PREFERENCES ================= */

  const togglePreference = (pref) => {
    let updatedPrefs = [];

    if (selectedPrefs.includes(pref)) {
      updatedPrefs = selectedPrefs.filter(
        (item) => item !== pref
      );
    } else {
      updatedPrefs = [...selectedPrefs, pref];
    }

    setSelectedPrefs(updatedPrefs);

    setFormData((prev) => ({
      ...prev,
      special_interests:
        updatedPrefs.join(", ") || "General Travel",
    }));
  };

  /* ================= FORM CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= FORM SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        travel_date: formData.travel_date,
        guests: Number(formData.guests),
        special_interests: formData.special_interests,
      };

      const res = await fetch(
        `${API_BASE}/api/cities/${slug}/trip-inquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Failed to submit trip enquiry"
        );
      }

      setSuccessMessage(
        data.message || "Trip enquiry submitted successfully"
      );

      setFormData({
        full_name: "",
        email: "",
        travel_date: "",
        guests: 2,
        special_interests: "",
      });

      setSelectedPrefs([]);
    } catch (err) {
      setErrorMessage(
        err.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= BOOKING NAVIGATION ================= */

  const handleBooking = () => {
    navigate(`/booking/${slug}`);
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3ea]">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-lg font-semibold text-[#1B5E20]">
            Loading trip planner...
          </p>
        </div>
      </div>
    );
  }

  /* ================= CITY ERROR ================= */

  if (!city) {
    return (
      <div className="min-h-screen bg-[#f8f3ea]">
        <Navbar />

        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">

          <h2 className="text-3xl font-bold text-[#1B5E20]">
            Trip planner not available
          </h2>

          <p className="mt-3 max-w-xl text-gray-600">
            We could not load trip planning details for this district.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-[#1B5E20] px-6 py-3 font-semibold text-white"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  /* ================= MAIN PAGE ================= */

  return (
    <div className="min-h-screen bg-[#f9f7f1] text-[#2d2d2d]">

      <Navbar />

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-12 lg:px-6">

        {/* ================================================= */}
        {/* LEFT SIDE - TRIP ENQUIRY */}
        {/* ================================================= */}

        <aside className="lg:col-span-4">

          <div className="rounded-[28px] bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

            {/* Header */}

            <div className="mb-8">

              <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1c1b]">
                Trip Enquiry
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Customize your journey for {city.name}.
              </p>

            </div>


            {/* Form */}

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >

              {/* Destination */}

              <div className="space-y-2">

                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-[#005db7]">
                  Destination
                </label>

                <div className="rounded-2xl bg-[#f4f4f1] px-4 py-4 text-sm text-gray-800 shadow-sm">
                  {city.name}
                </div>

              </div>


              {/* Full Name */}

              <div className="space-y-2">

                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-[#005db7]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border-none bg-[#f4f4f1] px-4 py-4 text-sm outline-none focus:bg-white focus:shadow-md"
                  required
                />

              </div>


              {/* Email */}

              <div className="space-y-2">

                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-[#005db7]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border-none bg-[#f4f4f1] px-4 py-4 text-sm outline-none focus:bg-white focus:shadow-md"
                  required
                />

              </div>


              {/* Date + Group Size */}

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">

                  <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-[#005db7]">
                    Date
                  </label>

                  <input
                    type="date"
                    name="travel_date"
                    value={formData.travel_date}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-none bg-[#f4f4f1] px-4 py-4 text-sm outline-none focus:bg-white focus:shadow-md"
                    required
                  />

                </div>


                <div className="space-y-2">

                  <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-[#005db7]">
                    Group Size
                  </label>

                  <input
                    type="number"
                    name="guests"
                    min="1"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-none bg-[#f4f4f1] px-4 py-4 text-sm outline-none focus:bg-white focus:shadow-md"
                    required
                  />

                </div>

              </div>


              {/* Preferences */}

              <div className="space-y-2">

                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-[#005db7]">
                  Preferences
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {preferenceOptions.map((item) => {

                    const active =
                      selectedPrefs.includes(item.label);

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() =>
                          togglePreference(item.label)
                        }
                        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium transition ${
                          active
                            ? "bg-[#d0a99d] text-[#2c160e]"
                            : "bg-[#f4f4f1] text-gray-600 hover:bg-[#e8e8e5]"
                        }`}
                      >

                        <span className="text-sm">
                          {item.icon}
                        </span>

                        {item.label}

                      </button>
                    );

                  })}

                </div>

              </div>


              {/* Success Message */}

              {successMessage && (
                <div className="rounded-2xl bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
                  {successMessage}
                </div>
              )}


              {/* Error Message */}

              {errorMessage && (
                <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              )}


              {/* Submit */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#a83900] py-4 text-lg font-bold text-white shadow-[0_12px_30px_rgba(168,57,0,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? "Submitting..."
                  : "Generate Itinerary"}
              </button>

            </form>

          </div>

        </aside>


        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <section className="space-y-8 lg:col-span-8">

          {/* ================= MAP ================= */}

          <div className="relative h-[500px] overflow-hidden rounded-[2.5rem] bg-[#e8e8e5] shadow-[0_18px_45px_rgba(0,0,0,0.08)] lg:h-[600px]">

            <SimpleMap cityName={city.name} />

            {/* Route View */}

            <div className="pointer-events-none absolute left-6 right-6 top-6 flex flex-col gap-4 md:flex-row">

              <div className="pointer-events-auto max-w-md flex-1 rounded-3xl bg-white/85 p-6 shadow-xl backdrop-blur-xl">

                <div className="mb-4 flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a83900] text-white">
                    🛣️
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      Route View
                    </p>

                    <h3 className="text-xl font-bold text-[#1a1c1b]">
                      Pune — {city.name}
                    </h3>

                  </div>

                </div>


                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      Start Point
                    </p>

                    <p className="text-lg font-bold text-[#a83900]">
                      Pune
                    </p>

                  </div>


                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      Destination
                    </p>

                    <p className="text-lg font-bold text-[#005db7]">
                      {city.name}
                    </p>

                  </div>

                </div>

              </div>


              {/* Map Controls */}

              <div className="pointer-events-auto flex self-start gap-2 rounded-3xl bg-white/85 p-4 shadow-xl backdrop-blur-xl">

                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm transition hover:bg-[#ffdbcf]">
                  +
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm transition hover:bg-[#ffdbcf]">
                  −
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm transition hover:bg-[#ffdbcf]">
                  ◎
                </button>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* BOOKING CARD */}
          {/* ================================================= */}

          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#064e3b] via-[#08744e] to-[#0a8f61] p-7 text-white shadow-[0_15px_35px_rgba(0,80,50,0.18)] md:p-9">

            {/* Decorative background */}

            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

              {/* Content */}

              <div className="max-w-2xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm">
                  ✨ Plan your experience
                </div>

                <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                  Ready to explore {city.name}?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-green-50/80 md:text-base">
                  Turn your travel plans into an unforgettable
                  experience. Explore {city.name}, choose your
                  preferred experience, select your date and book
                  your trip with MahaVista.
                </p>


                {/* Features */}

                <div className="mt-5 flex flex-wrap gap-2">

                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs backdrop-blur-sm">
                    📅 Flexible dates
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs backdrop-blur-sm">
                    👥 Group friendly
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs backdrop-blur-sm">
                    🔒 Secure booking
                  </span>

                </div>

              </div>


              {/* CTA */}

              <div className="flex-shrink-0">

                <button
                  onClick={() =>
                    navigate(`/booking/${slug}`)
                  }
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-[#075c3d] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:w-auto"
                >

                  <span>
                    Book Your Experience
                  </span>

                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </button>

                <p className="mt-3 text-center text-xs text-green-100/70">
                  Explore & book {city.name}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default PlanTripPage;