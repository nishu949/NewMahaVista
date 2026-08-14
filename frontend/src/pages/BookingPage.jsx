import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const API_URL = "http://127.0.0.1:8000";

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ================= CITY =================
  const [city, setCity] = useState(null);
  const [cityLoading, setCityLoading] = useState(true);

  // ================= LOGIN =================
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      alert("Please login to continue with your booking.");

      navigate(`/login?redirect=/booking/${slug}`, {
        replace: true,
      });
    }
  }, [isLoggedIn, navigate, slug]);

  // ================= EXPERIENCE =================
  const [experience, setExperience] =
    useState("Local Experience");

  const experiencePrices = {
    "Local Experience": 1999,
    "Heritage Experience": 2499,
  };

  // ================= DATE =================
  const [travelDate, setTravelDate] = useState("");

  // ================= TRAVELLERS =================
  const [travellers, setTravellers] = useState(2);

  // ================= PERSONAL DETAILS =================
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    from_city: "",
    special_requests: "",
  });

  // ================= BOOKING STATE =================
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  // ================= LOAD CITY =================
  useEffect(() => {
    if (!slug) {
      setCityLoading(false);
      return;
    }

    fetch(`${API_URL}/api/cities/${slug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }

        return response.json();
      })
      .then((data) => {
        console.log("City loaded:", data);
        setCity(data);
      })
      .catch((err) => {
        console.error("Error loading city:", err);
        setError("Unable to load the selected city.");
      })
      .finally(() => {
        setCityLoading(false);
      });
  }, [slug]);

  // ================= PRICE =================
  const pricePerPerson = experiencePrices[experience];

  const experienceCost = pricePerPerson * travellers;

  const taxes = 200;
  const serviceFee = 99;

  const total = experienceCost + taxes + serviceFee;

  // ================= INPUT HANDLER =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= TRAVELLER HANDLERS =================
  const decreaseTravellers = () => {
    setTravellers((previous) =>
      Math.max(1, previous - 1)
    );
  };

  const increaseTravellers = () => {
    setTravellers((previous) =>
      Math.min(20, previous + 1)
    );
  };

  // ================= BOOKING SUBMIT =================
  const handleBooking = async () => {
    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn) {
      alert("Please login first to make a booking.");

      navigate(`/login?redirect=/booking/${slug}`);

      return;
    }

    setError("");

    if (!travelDate) {
      setError("Please select your travel date.");
      return;
    }

    if (!formData.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.from_city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!city) {
      setError("City information is not available.");
      return;
    }

    try {
      setBookingLoading(true);

      const bookingData = {
        city: city.name,
        experience: experience,
        travel_date: travelDate,
        travellers: travellers,

        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        from_city: formData.from_city,

        special_requests:
          formData.special_requests || null,
      };

      console.log("Sending booking:", bookingData);

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Booking failed."
        );
      }

      console.log("Booking response:", data);

      setBookingId(data.booking_id);
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ================= LOADING =================
  if (cityLoading) {
    return (
      <div className="min-h-screen bg-[#f4f8f3]">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading your booking page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-[#f4f8f3]">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">😕</div>

            <h2 className="text-xl font-bold text-gray-900">
              Unable to load city
            </h2>

            <p className="text-gray-500 mt-2">
              {error || "City information could not be loaded."}
            </p>

            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#f4f8f3] text-gray-800">

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative">

        <div className="h-[330px] overflow-hidden">

          <img
            src={
              city.image ||
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
            }
            alt={city.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#063c29]/90 via-[#063c29]/60 to-black/20"></div>

          <div className="absolute inset-0">

            <div className="max-w-7xl mx-auto px-5 lg:px-8 h-full flex items-center">

              <div className="text-white max-w-2xl">

                <button
                  onClick={() => navigate(-1)}
                  className="mb-6 flex items-center gap-2 text-green-100 hover:text-white text-sm transition"
                >
                  ← Back to {city.name}
                </button>

                <div className="flex items-center gap-2 text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">
                  <span>📍</span>
                  {city.name}
                </div>

                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Book your{" "}
                  {city.name}
                  <span className="text-green-300">
                    {" "}experience
                  </span>
                </h2>

                <p className="text-green-50/80 mt-4 text-lg">
                  {city.tagline ||
                    city.subtitle ||
                    `Discover the best experiences in ${city.name}.`}
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 -mt-12 relative z-10 pb-16">

        <div className="grid lg:grid-cols-[1fr_390px] gap-7">

          {/* ================= LEFT ================= */}
          <div className="space-y-6">

            {/* ================= EXPERIENCE ================= */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">

              <div className="mb-7">

                <div className="flex items-center gap-3 mb-2">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                    ✨
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Choose your experience
                    </h3>

                    <p className="text-sm text-gray-500">
                      Select what you want to explore in{" "}
                      {city.name}
                    </p>
                  </div>

                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-4">

                {/* LOCAL */}
                <div
                  onClick={() =>
                    setExperience("Local Experience")
                  }
                  className={`group cursor-pointer rounded-2xl p-5 transition hover:shadow-md border-2 ${
                    experience === "Local Experience"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-100 hover:border-green-300"
                  }`}
                >

                  <div className="flex justify-between">

                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                      🍷
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${
                        experience === "Local Experience"
                          ? "bg-green-600"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      {experience === "Local Experience"
                        ? "✓"
                        : ""}
                    </div>

                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mt-5">
                    Local Experience
                  </h4>

                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Experience the best attractions,
                    food and culture of {city.name}.
                  </p>

                  <div className="flex justify-between items-end mt-5">

                    <div>
                      <p className="text-xs text-gray-400">
                        Starting from
                      </p>

                      <p className="text-green-700 font-bold text-lg">
                        ₹1,999
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Popular
                    </span>

                  </div>

                </div>


                {/* HERITAGE */}
                <div
                  onClick={() =>
                    setExperience("Heritage Experience")
                  }
                  className={`group cursor-pointer rounded-2xl p-5 transition hover:shadow-md border-2 ${
                    experience === "Heritage Experience"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-100 hover:border-green-300"
                  }`}
                >

                  <div className="flex justify-between">

                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
                      🏛️
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        experience ===
                        "Heritage Experience"
                          ? "bg-green-600"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      {experience ===
                      "Heritage Experience"
                        ? "✓"
                        : ""}
                    </div>

                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mt-5">
                    Heritage Experience
                  </h4>

                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Discover historic places and
                    cultural landmarks around{" "}
                    {city.name}.
                  </p>

                  <div className="flex justify-between items-end mt-5">

                    <div>
                      <p className="text-xs text-gray-400">
                        Starting from
                      </p>

                      <p className="text-green-700 font-bold text-lg">
                        ₹2,499
                      </p>
                    </div>

                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                      Explore
                    </span>

                  </div>

                </div>

              </div>
            </section>


            {/* ================= DATE + GUESTS ================= */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">

              <div className="mb-7">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    📅
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-gray-900">
                      When are you going?
                    </h3>

                    <p className="text-sm text-gray-500">
                      Select your preferred travel date
                    </p>

                  </div>

                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                {/* DATE */}
                <div>

                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Travel date
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      📅
                    </span>

                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) =>
                        setTravelDate(e.target.value)
                      }
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />

                  </div>

                </div>


                {/* TRAVELLERS */}
                <div>

                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Travellers
                  </label>

                  <div className="h-14 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between px-4">

                    <div className="flex items-center gap-3">

                      <div className="text-lg">
                        👥
                      </div>

                      <div>

                        <p className="font-semibold text-gray-800 text-sm">
                          Adults
                        </p>

                        <p className="text-xs text-gray-400">
                          Age 13+
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-4">

                      <button
                        onClick={decreaseTravellers}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-green-500 hover:text-green-600"
                      >
                        −
                      </button>

                      <span className="font-bold">
                        {travellers}
                      </span>

                      <button
                        onClick={increaseTravellers}
                        className="w-8 h-8 rounded-full bg-green-600 text-white hover:bg-green-700"
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* ================= PERSONAL DETAILS ================= */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">

              <div className="mb-7">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    👤
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-gray-900">
                      Traveller information
                    </h3>

                    <p className="text-sm text-gray-500">
                      Tell us who is travelling
                    </p>

                  </div>

                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full h-13 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                  />

                </div>


                {/* EMAIL */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full h-13 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                  />

                </div>


                {/* PHONE */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full h-13 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                  />

                </div>


                {/* CITY */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your city
                  </label>

                  <input
                    type="text"
                    name="from_city"
                    value={formData.from_city}
                    onChange={handleInputChange}
                    placeholder="Where are you travelling from?"
                    className="w-full h-13 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition"
                  />

                </div>

              </div>


              {/* NOTES */}
              <div className="mt-5">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special requests
                  <span className="font-normal text-gray-400">
                    {" "}(optional)
                  </span>
                </label>

                <textarea
                  rows="4"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or requests?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none resize-none transition"
                />

              </div>

            </section>


            {/* ================= ERROR ================= */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm">
                ⚠️ {error}
              </div>
            )}


            {/* ================= SUCCESS ================= */}
            {bookingSuccess && (
              <section className="bg-green-50 border border-green-200 rounded-2xl p-6">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold text-green-800 text-lg">
                      Booking successful!
                    </h3>

                    <p className="text-green-700 text-sm mt-1">
                      Your booking has been successfully
                      created.
                    </p>

                    <p className="text-sm text-gray-600 mt-3">
                      Booking ID:
                      <span className="font-bold ml-2">
                        {bookingId}
                      </span>
                    </p>

                  </div>

                </div>

              </section>
            )}


            {/* ================= BENEFITS ================= */}
            <section>

              <h3 className="font-bold text-gray-900 text-lg mb-4">
                Why book with MahaVista?
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">

                <div className="bg-white border border-gray-100 rounded-2xl p-5">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    🌿
                  </div>

                  <h4 className="font-semibold">
                    Local experiences
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Discover experiences curated for
                    your destination.
                  </p>

                </div>


                <div className="bg-white border border-gray-100 rounded-2xl p-5">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    🔒
                  </div>

                  <h4 className="font-semibold">
                    Secure booking
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Your booking information stays
                    protected.
                  </p>

                </div>


                <div className="bg-white border border-gray-100 rounded-2xl p-5">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    💬
                  </div>

                  <h4 className="font-semibold">
                    Travel support
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Get assistance whenever you need it.
                  </p>

                </div>

              </div>

            </section>

          </div>


          {/* ================= RIGHT SUMMARY ================= */}
          <aside className="lg:sticky lg:top-6 h-fit">

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

              {/* HEADER */}
              <div className="bg-gradient-to-br from-[#075b3b] to-[#0a8a55] p-6 text-white">

                <p className="text-green-100 text-sm">
                  Booking summary
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  {city.name}
                </h3>

                <div className="flex items-center gap-2 mt-3 text-green-100 text-sm">
                  📍 Maharashtra
                </div>

              </div>


              <div className="p-6">

                {/* EXPERIENCE */}
                <div className="flex gap-4 pb-5 border-b border-dashed border-gray-200">

                  <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center text-3xl">
                    {experience === "Local Experience"
                      ? "🍷"
                      : "🏛️"}
                  </div>

                  <div>

                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Experience
                    </p>

                    <h4 className="font-bold text-gray-900 mt-1">
                      {experience.replace(
                        " Experience",
                        ""
                      )}{" "}
                      {city.name} Experience
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      ⭐ 4.8 · Popular choice
                    </p>

                  </div>

                </div>


                {/* DETAILS */}
                <div className="py-5 space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                      📅
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        DATE
                      </p>

                      <p className="font-semibold text-sm">
                        {travelDate
                          ? new Date(
                              travelDate +
                                "T00:00:00"
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Select date"}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                      👥
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        TRAVELLERS
                      </p>

                      <p className="font-semibold text-sm">
                        {travellers}{" "}
                        {travellers === 1
                          ? "Adult"
                          : "Adults"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* PRICE */}
                <div className="border-t border-gray-100 pt-5 space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Experience ×{" "}
                      {travellers}
                    </span>

                    <span className="font-medium">
                      ₹
                      {experienceCost.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Taxes & fees
                    </span>

                    <span className="font-medium">
                      ₹{taxes}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Service fee
                    </span>

                    <span className="font-medium">
                      ₹{serviceFee}
                    </span>

                  </div>

                </div>


                {/* TOTAL */}
                <div className="mt-5 rounded-2xl bg-green-50 p-4 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  <span className="text-2xl">
                    💚
                  </span>

                </div>


                {/* CONTINUE */}
                {!bookingSuccess && (
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="w-full mt-5 h-14 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-base shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                  >
                    {bookingLoading
                      ? "Processing booking..."
                      : "Continue to booking →"}
                  </button>
                )}


                {bookingSuccess && (
                  <div className="w-full mt-5 h-14 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    ✓ Booking Confirmed
                  </div>
                )}


                <p className="text-center text-xs text-gray-400 mt-4">
                  🔒 You won't be charged yet
                </p>

              </div>

            </div>


            {/* SUPPORT */}
            <div className="mt-5 rounded-2xl bg-[#073b2b] p-5 text-white">

              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  💬
                </div>

                <div>

                  <p className="font-semibold">
                    Need help planning?
                  </p>

                  <p className="text-green-200 text-xs mt-1">
                    Our travel team can help you
                    plan your {city.name} trip.
                  </p>

                  <button className="text-green-300 text-sm font-semibold mt-3">
                    Talk to us →
                  </button>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100">

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-7 flex flex-col md:flex-row justify-between gap-4">

          <div>

            <p className="font-bold text-gray-900">
              Maha
              <span className="text-green-600">
                Vista
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Explore Maharashtra. Experience more.
            </p>

          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
          </div>

        </div>

      </footer>

    </div>
  );
};

export default BookingPage;