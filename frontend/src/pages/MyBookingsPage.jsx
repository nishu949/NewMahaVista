import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const API_URL = "http://127.0.0.1:8000";

const MyBookingsPage = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const userEmail = localStorage.getItem("user");

      if (!userEmail) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/bookings?email=${encodeURIComponent(userEmail)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch bookings");
      }

      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CANCEL BOOKING
  // =========================================================

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancelLoading(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to cancel booking");
      }

      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(
        err.message || "Failed to cancel booking. Please try again."
      );
    } finally {
      setCancelLoading(null);
    }
  };

  // =========================================================
  // LOGIN CHECK
  // =========================================================

  useEffect(() => {
    if (!isLoggedIn) {
      alert("Please login to view your bookings.");
      navigate("/login?redirect=/my-bookings");
      return;
    }

    fetchBookings();
  }, [isLoggedIn, navigate]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (amount) => {
    if (!amount) return "N/A";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[#fff4d8] text-[#b77900] border-[#f5dda2]";

      case "confirmed":
        return "bg-[#e6f5ed] text-[#147a4b] border-[#b9dfca]";

      case "cancelled":
        return "bg-[#fff0ef] text-[#c83b32] border-[#f1c3bf]";

      case "completed":
        return "bg-[#eef1ff] text-[#465ac7] border-[#cdd3f7]";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f3ed]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#eadfd4] border-t-[#b65d2a] animate-spin">
              <span className="text-xl">✈️</span>
            </div>

            <p className="mt-5 text-sm font-semibold text-[#786f67]">
              Loading your adventures...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f7f3ed]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="w-full max-w-md rounded-[30px] border border-[#eadfd4] bg-white p-10 text-center shadow-[0_20px_60px_rgba(70,50,35,0.10)]">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5e8dc] text-4xl">
              🔒
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#29241f]">
              Access Restricted
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#817970]">
              Please login to view your bookings.
            </p>

            <button
              onClick={() =>
                navigate("/login?redirect=/my-bookings")
              }
              className="mt-6 rounded-2xl bg-[#b65d2a] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#b65d2a]/20 transition hover:bg-[#9f4d20]"
            >
              Login Now
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f3ed]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="w-full max-w-md rounded-[30px] border border-[#eadfd4] bg-white p-10 text-center shadow-[0_20px_60px_rgba(70,50,35,0.10)]">

            <div className="text-6xl">😕</div>

            <h2 className="mt-5 text-2xl font-bold text-[#29241f]">
              Oops!
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#817970]">
              {error}
            </p>

            <button
              onClick={fetchBookings}
              className="mt-6 rounded-2xl bg-[#b65d2a] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#b65d2a]/20 transition hover:bg-[#9f4d20]"
            >
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO BOOKINGS
  // =========================================================

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f3ed]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="w-full max-w-md rounded-[30px] border border-[#eadfd4] bg-white p-10 text-center shadow-[0_20px_60px_rgba(70,50,35,0.10)]">

            <div className="text-7xl">🗺️</div>

            <h2 className="mt-5 text-2xl font-bold text-[#29241f]">
              No Bookings Yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#817970]">
              You haven't made any bookings yet.
              Start your Maharashtra adventure today!
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-6 rounded-2xl bg-[#b65d2a] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#b65d2a]/20 transition hover:bg-[#9f4d20]"
            >
              Explore Destinations
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#29241f]">

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[520px] overflow-hidden">

        {/* Background Image */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/maharashtra-hero.jpeg')",
          }}
        />

        {/* Dark cinematic overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#171411]/90 via-[#171411]/65 to-[#171411]/25" />

        {/* Bottom fade */}

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#171411]/35 to-transparent" />

        {/* Hero Content */}

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 lg:px-8">

          <div className="flex w-full flex-col gap-10 md:flex-row md:items-center md:justify-between">

            {/* LEFT */}

            <div className="max-w-2xl">

              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/95 px-5 py-2.5 shadow-lg">

                <span className="text-lg">🎒</span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#9e4b20]">
                  My Travel Journal
                </span>

              </div>

              <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">

                Your Maharashtra

                <span className="block text-[#f0a16f]">
                  Adventures.
                </span>

              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/90 md:text-lg">
                Every destination you've booked, all in one place.
                Revisit your journeys, check your travel details
                and manage your reservations.
              </p>

              <button
                onClick={() => navigate("/home")}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#c7652d] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-[#ad5120]"
              >
                <span className="text-xl">＋</span>
                Plan Another Trip
              </button>

            </div>

            {/* TOTAL TRIPS CARD */}

            <div className="w-full max-w-[210px] self-end md:self-center">

              <div className="rounded-[24px] border border-white/60 bg-white/95 p-7 text-center shadow-2xl backdrop-blur-md">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e9df] text-2xl">
                  🗺️
                </div>

                <p className="mt-5 text-sm font-medium text-[#625b54]">
                  Total Trips
                </p>

                <p className="mt-1 font-serif text-5xl font-bold text-[#b65d2a]">
                  {bookings.length}
                </p>

                <p className="mt-1 text-sm font-medium text-[#625b54]">
                  {bookings.length === 1 ? "adventure" : "adventures"}
                </p>

              </div>

            </div>

          </div>
        </div>

      </section>

      {/* =====================================================
          BOOKINGS
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

        {/* SECTION HEADER */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b65d2a]">
              Your Journeys
            </p>

            <h2 className="mt-2 font-serif text-4xl font-bold text-[#302a25]">
              Booked Experiences
            </h2>

          </div>

          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cdbbaa] bg-transparent px-6 py-3.5 text-sm font-bold text-[#6c432b] transition hover:bg-white hover:shadow-md"
          >
            ◉
            Explore More Destinations
          </button>

        </div>

        {/* =====================================================
            BOOKING GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {bookings.map((booking, index) => (

            <article
              key={booking._id}
              className="group overflow-hidden rounded-[24px] border border-[#e9e0d7] bg-white shadow-[0_8px_30px_rgba(65,45,30,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(65,45,30,0.12)]"
              style={{
                animation: `fadeInUp 0.5s ease-out ${
                  index * 0.08
                }s both`,
              }}
            >

              {/* CARD HEADER */}

              <div className="p-6 pb-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f9e6dc] text-2xl text-[#b65d2a]">
                      📍
                    </div>

                    <div>

                      <h3 className="font-serif text-2xl font-bold text-[#302a25]">
                        {booking.city || "Unknown City"}
                      </h3>

                      <p className="mt-0.5 text-sm text-[#817970]">
                        {booking.experience || "Experience"}
                      </p>

                    </div>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status || "Pending"}
                  </span>

                </div>

                {/* DIVIDER */}

                <div className="my-5 border-t border-dashed border-[#ded5cc]" />

                {/* DATE / TRAVELLERS */}

                <div className="grid grid-cols-2 gap-5">

                  <div>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#91877e]">
                      Date
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#3b342e]">
                      <span>📅</span>
                      {formatDate(booking.travel_date)}
                    </p>

                  </div>

                  <div>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#91877e]">
                      Travellers
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#3b342e]">
                      <span>👥</span>
                      {booking.travellers || 1}{" "}
                      {booking.travellers === 1
                        ? "Adult"
                        : "Adults"}
                    </p>

                  </div>

                </div>

                {/* DIVIDER */}

                <div className="my-5 border-t border-[#eee7df]" />

                {/* CONTACT + TOTAL */}

                <div className="flex items-end justify-between gap-4">

                  <div className="space-y-3">

                    <div className="flex items-center gap-2 text-sm text-[#5f5851]">

                      <span className="text-[#8e8379]">
                        ✉
                      </span>

                      <span className="max-w-[180px] truncate">
                        {booking.email || "N/A"}
                      </span>

                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#5f5851]">

                      <span className="text-[#8e8379]">
                        ☎
                      </span>

                      <span>
                        {booking.phone || "N/A"}
                      </span>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-[11px] font-medium text-[#91877e]">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#b65d2a]">
                      {formatPrice(booking.total)}
                    </p>

                  </div>

                </div>

              </div>

              {/* CARD FOOTER */}

              <div className="flex items-center justify-between border-t border-[#eee7df] bg-[#fbf9f6] px-6 py-4">

                <p className="max-w-[170px] truncate font-mono text-[10px] text-[#817970]">
                  ID: {booking._id}
                </p>

                <button
                  onClick={() =>
                    cancelBooking(booking._id)
                  }
                  disabled={
                    cancelLoading === booking._id
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-[#edaaa3] bg-white px-4 py-2.5 text-xs font-bold text-[#c23c35] transition hover:bg-[#fff1ef] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {cancelLoading === booking._id ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c23c35] border-t-transparent" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <span>×</span>
                      Cancel Booking
                    </>
                  )}

                </button>

              </div>

            </article>

          ))}

        </div>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <div className="mt-12 overflow-hidden rounded-[28px] bg-[#302a25] px-7 py-8 shadow-xl md:px-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e39a6e]">
                Keep Exploring
              </p>

              <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                Ready for more adventures?
              </h3>

              <p className="mt-1 text-sm text-white/60">
                Discover another beautiful corner of Maharashtra.
              </p>

            </div>

            <button
              onClick={() => navigate("/home")}
              className="rounded-2xl bg-[#c7652d] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#ad5120]"
            >
              Plan Your Next Trip →
            </button>

          </div>

        </div>

      </main>

      {/* =====================================================
          ANIMATION
      ===================================================== */}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
};

export default MyBookingsPage;