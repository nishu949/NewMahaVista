import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const MyBookingsPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");

  // Sample bookings for UI
  // Later this will come from your backend API
  const bookings = [
    {
      id: "MV-2026-00124",
      city: "Nashik",
      state: "Maharashtra",
      experience: "Heritage & Vineyard Experience",
      date: "24 Aug 2026",
      bookedOn: "12 Aug 2026",
      guests: 2,
      duration: "2 Days / 1 Night",
      amount: "₹4,999",
      status: "Upcoming",
      image:
        "https://images.unsplash.com/photo-1590766940555-54a4c0f6b3d4?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "MV-2026-00117",
      city: "Mahabaleshwar",
      state: "Maharashtra",
      experience: "Nature & Hill Station Escape",
      date: "18 Aug 2026",
      bookedOn: "8 Aug 2026",
      guests: 3,
      duration: "3 Days / 2 Nights",
      amount: "₹7,499",
      status: "Upcoming",
      image:
        "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "MV-2026-00091",
      city: "Pune",
      state: "Maharashtra",
      experience: "Historic Pune City Tour",
      date: "2 Aug 2026",
      bookedOn: "27 Jul 2026",
      guests: 2,
      duration: "1 Day",
      amount: "₹2,499",
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1600181956602-9e6f4f6d8f4c?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "MV-2026-00074",
      city: "Aurangabad",
      state: "Maharashtra",
      experience: "Ajanta & Ellora Heritage Tour",
      date: "15 Jul 2026",
      bookedOn: "4 Jul 2026",
      guests: 4,
      duration: "2 Days / 1 Night",
      amount: "₹6,999",
      status: "Cancelled",
      image:
        "https://images.unsplash.com/photo-1600100397608-f0105c4f8f2b?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === activeTab
        );

  const upcomingCount = bookings.filter(
    (booking) => booking.status === "Upcoming"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const getStatusStyle = (status) => {
    if (status === "Upcoming") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4] text-[#1f2924]">

      <Navbar />

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-[#064e3b]">

        {/* Decorative circles */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />

        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[#10b981]/10" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-green-50 backdrop-blur-sm">
              🌿 MahaVista Travel
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              My Bookings
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-green-50/75 md:text-base">
              Keep track of your Maharashtra adventures, manage
              upcoming trips and revisit your travel experiences.
            </p>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Upcoming */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                  Upcoming
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-[#064e3b]">
                  {upcomingCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                🧳
              </div>

            </div>

            <p className="mt-3 text-sm text-gray-500">
              Trips waiting for you
            </p>

          </div>


          {/* Completed */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                  Completed
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-blue-700">
                  {completedCount}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                ✓
              </div>

            </div>

            <p className="mt-3 text-sm text-gray-500">
              Adventures you've completed
            </p>

          </div>


          {/* Cancelled */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                  Cancelled
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-red-600">
                  {cancelledCount}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl">
                ×
              </div>

            </div>

            <p className="mt-3 text-sm text-gray-500">
              Cancelled reservations
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* BOOKINGS SECTION */}
        {/* ================================================= */}

        <section className="mt-10">

          {/* Heading */}

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#078f61]">
                Your journeys
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-[#1f2924] md:text-3xl">
                Your Bookings
              </h2>

            </div>

            <button
              onClick={() => navigate("/")}
              className="w-fit rounded-xl bg-[#064e3b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#08744e]"
            >
              + Explore Maharashtra
            </button>

          </div>


          {/* ================================================= */}
          {/* FILTER TABS */}
          {/* ================================================= */}

          <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">

            {["All", "Upcoming", "Completed", "Cancelled"].map(
              (tab) => (

                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-[#064e3b] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>

              )
            )}

          </div>


          {/* ================================================= */}
          {/* BOOKING LIST */}
          {/* ================================================= */}

          <div className="mt-6 space-y-5">

            {filteredBookings.length === 0 ? (

              /* EMPTY STATE */

              <div className="rounded-[30px] bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
                  🧳
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-800">
                  No bookings found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  You don't have any bookings in this category yet.
                  Start exploring Maharashtra and plan your next
                  adventure.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-6 rounded-xl bg-[#064e3b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#08744e]"
                >
                  Explore Destinations
                </button>

              </div>

            ) : (

              filteredBookings.map((booking) => (

                <article
                  key={booking.id}
                  className="group overflow-hidden rounded-[28px] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="flex flex-col lg:flex-row">

                    {/* ================================================= */}
                    {/* IMAGE */}
                    {/* ================================================= */}

                    <div className="relative h-56 w-full overflow-hidden lg:h-auto lg:w-72">

                      <img
                        src={booking.image}
                        alt={booking.city}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Image Overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Destination */}

                      <div className="absolute bottom-4 left-4">

                        <p className="text-xs font-medium text-white/80">
                          Maharashtra
                        </p>

                        <h3 className="text-2xl font-extrabold text-white">
                          {booking.city}
                        </h3>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* CONTENT */}
                    {/* ================================================= */}

                    <div className="flex flex-1 flex-col p-6">

                      {/* Top Row */}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>

                            <span className="text-xs font-medium text-gray-400">
                              #{booking.id}
                            </span>

                          </div>

                          <h3 className="mt-3 text-xl font-extrabold text-[#1f2924]">
                            {booking.experience}
                          </h3>

                        </div>


                        {/* Amount */}

                        <div className="sm:text-right">

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Total
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-[#064e3b]">
                            {booking.amount}
                          </p>

                        </div>

                      </div>


                      {/* Details */}

                      <div className="mt-6 grid grid-cols-2 gap-4 border-y border-gray-100 py-5 sm:grid-cols-4">

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Travel Date
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-700">
                            📅 {booking.date}
                          </p>

                        </div>


                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Guests
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-700">
                            👥 {booking.guests}
                          </p>

                        </div>


                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-700">
                            ⏱ {booking.duration}
                          </p>

                        </div>


                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Booked On
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-700">
                            {booking.bookedOn}
                          </p>

                        </div>

                      </div>


                      {/* Bottom */}

                      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-xs text-gray-400">
                          Booking ID:{" "}
                          <span className="font-semibold text-gray-600">
                            {booking.id}
                          </span>
                        </p>


                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/booking/${booking.id}`
                              )
                            }
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:border-[#064e3b] hover:text-[#064e3b]"
                          >
                            View Details
                          </button>

                          {booking.status === "Upcoming" && (
                            <button
                              className="rounded-xl bg-[#064e3b] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#08744e]"
                            >
                              Manage Booking
                            </button>
                          )}

                          {booking.status === "Completed" && (
                            <button
                              className="rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-[#08744e] transition hover:bg-emerald-100"
                            >
                              Book Again
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </article>

              ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
};

export default MyBookingsPage;