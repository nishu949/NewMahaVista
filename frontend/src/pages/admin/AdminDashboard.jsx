import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
// import AdminNavbar from "../../Components/admin/AdminNavbar";
import {
  Users,
  MapPin,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  IndianRupee,
  Activity,
  Sparkles,
  Award,
  // Compass,  <-- Removed
  Coffee,
  Star,
  // Crown,    <-- Removed
  Gem,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const adminData = JSON.parse(
      localStorage.getItem("adminData") || "{}"
    );

    setAdmin(adminData);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      console.log("Dashboard data:", data);
      setStats(data);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  // =================================================
  // LOADING
  // =================================================

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#faf6ef] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#e8dcc8]" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#b8860b] animate-spin" />
          </div>
          <p className="mt-5 text-sm font-semibold text-[#8b7355]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =================================================
  // STAT CARDS - MahaVista Heritage Theme
  // =================================================

  const statCards = [
    {
      title: "Total Users",
      value: stats.total_users || 0,
      icon: Users,
      description: "Registered travelers",
      gradient: "from-white to-white",
      iconBg: "bg-[#d4a853]/20",
      iconColor: "text-[#b8860b]",
      borderColor: "border-[#d4a853]/30",
    },
    {
      title: "Total Bookings",
      value: stats.total_bookings || 0,
      icon: BookOpen,
      description: "All reservations",
      gradient: "from-white to-white",
      iconBg: "bg-[#8b4513]/20",
      iconColor: "text-[#8b4513]",
      borderColor: "border-[#8b4513]/30",
    },
    {
      title: "Total Cities",
      value: stats.total_cities || 0,
      icon: MapPin,
      description: "Destinations available",
      gradient: "from-white to-white",
      iconBg: "bg-[#cd853f]/20",
      iconColor: "text-[#cd853f]",
      borderColor: "border-[#cd853f]/30",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.total_revenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: "Generated revenue",
      gradient: "from-white to-white",
      iconBg: "bg-[#b8860b]/20",
      iconColor: "text-[#b8860b]",
      borderColor: "border-[#b8860b]/30",
    },
  ];

  // =================================================
  // BOOKING STATUS - Warm Heritage Colors
  // =================================================

  const statusCards = [
    {
      title: "Pending",
      value: stats.pending_bookings || 0,
      icon: Clock,
      description: "Awaiting confirmation",
      gradient: "from-[#fdf6e8] to-[#faf0d7]",
      iconBg: "bg-[#daa520]/20",
      iconColor: "text-[#b8860b]",
      borderColor: "border-[#daa520]/30",
    },
    {
      title: "Confirmed",
      value: stats.confirmed_bookings || 0,
      icon: CheckCircle,
      description: "Upcoming confirmed trips",
      gradient: "from-[#e8f0ee] to-[#dce8e4]",
      iconBg: "bg-[#2c6b5f]/20",
      iconColor: "text-[#2c6b5f]",
      borderColor: "border-[#2c6b5f]/30",
    },
    {
      title: "Completed",
      value: stats.completed_bookings || 0,
      icon: Calendar,
      description: "Successfully completed trips",
      gradient: "from-[#f0f0e8] to-[#e8e4d8]",
      iconBg: "bg-[#8b6914]/20",
      iconColor: "text-[#8b6914]",
      borderColor: "border-[#8b6914]/30",
    },
    {
      title: "Cancelled",
      value: stats.cancelled_bookings || 0,
      icon: XCircle,
      description: "Cancelled reservations",
      gradient: "from-[#fdf0ed] to-[#f8e4de]",
      iconBg: "bg-[#c0392b]/20",
      iconColor: "text-[#c0392b]",
      borderColor: "border-[#c0392b]/30",
    },
  ];

  // =================================================
  // STATUS STYLES - Heritage Theme
  // =================================================

  const statusStyles = {
    pending: {
      text: "text-[#b8860b]",
      bg: "bg-[#fdf6e8]",
      border: "border-[#daa520]/40",
      dot: "bg-[#daa520]",
    },
    confirmed: {
      text: "text-[#2c6b5f]",
      bg: "bg-[#e8f0ee]",
      border: "border-[#2c6b5f]/30",
      dot: "bg-[#2c6b5f]",
    },
    completed: {
      text: "text-[#8b6914]",
      bg: "bg-[#f0f0e8]",
      border: "border-[#8b6914]/30",
      dot: "bg-[#8b6914]",
    },
    cancelled: {
      text: "text-[#c0392b]",
      bg: "bg-[#fdf0ed]",
      border: "border-[#c0392b]/30",
      dot: "bg-[#c0392b]",
    },
  };

  // =================================================
  // MAIN UI
  // =================================================

  return (
    <div className="min-h-screen bg-[#F1E3D2] text-[#3d2e1e] flex">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <AdminSidebar onLogout={handleLogout} />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="ml-64 flex-1 min-w-0">

        {/* <AdminNavbar admin={admin} /> */}

       <main className="px-6 pb-7 lg:px-5">


<div className="mt-7 relative overflow-hidden rounded-3xl shadow-xl border-2 border-amber-300/50 min-h-[218px]">
  
  {/* Background Image - Positioned on the right */}
  <div 
    className="absolute inset-0 bg-cover bg-right bg-no-repeat"
    style={{
      backgroundImage: 'url("../images/MahaFort.png")',
      backgroundPosition: '70% center',
    }}
  />

  {/* White overlay gradient - fades from left (more white) to right (transparent) */}
  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/600 to-transparent" />
  
  {/* Extra overlay for left side to ensure text readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent" />

  {/* Decorative elements */}
  <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
  <div className="absolute right-32 bottom-0 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />
  <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-amber-200/5 blur-2xl" />

  {/* Pattern dots */}
  <div className="absolute inset-0 opacity-[0.03]" style={{
    backgroundImage: 'radial-gradient(circle, #b8860b 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  }} />

  {/* Border design */}
  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-7 lg:p-8 z-10">

    <div className="flex-1">

      <div className="flex items-center gap-2 mb-3 flex-wrap">

        <span className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-100/70 px-3 py-1.5 text-xs font-semibold text-[#70420e] backdrop-blur-sm">

          <Sparkles className="w-3.5 h-3.5" />

          Admin Overview

        </span>

        <span className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-100/70 px-3 py-1.5 text-xs font-semibold text-[#70420e] backdrop-blur-sm">

          <Award className="w-3.5 h-3.5" />

          Welcome

        </span>

      </div>

      <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#70420e] font-serif">

        Welcome back,{" "}

        <span className="text-[#b8860b] relative">
          {admin?.full_name || "Admin"}
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#b8860b] to-transparent rounded-full" />
        </span>

        !

      </h2>

      <p className="mt-2 max-w-2xl text-sm text-[#8b7355]">

        Here's what's happening across your MahaVista Travel
        platform today.

      </p>

    </div>

    {/* Total Bookings & Explore */}
    <div className="flex items-center gap-3 flex-shrink-0">

      {/* Total Bookings */}
      <div className="rounded-2xl border-2 border-[#e8dcc8] bg-white/80 backdrop-blur-sm px-5 py-3 shadow-sm hover:shadow-md transition-shadow">

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b7355]">

          Total Bookings

        </p>

        <p className="mt-1 text-2xl font-extrabold text-[#b8860b]">

          {stats.total_bookings || 0}

        </p>

      </div>

      {/* Explore */}
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md hover:scale-105"
      >

        Explore

        <ArrowUpRight className="w-4 h-4" />

      </button>

    </div>

  </div>

</div>
          {/* ================================================= */}
          {/* MAIN STAT CARDS - Heritage Theme */}
          {/* ================================================= */}

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {statCards.map((card) => {

              const Icon = card.icon;

              return (

                <div
                  key={card.title}
                  className={`group rounded-3xl border-2 ${card.borderColor} bg-gradient-to-br ${card.gradient} p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden`}
                >

                  {/* Decorative shine */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-[#daa520]/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

                  {/* Heritage border accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent" />

                  <div className="flex items-start justify-between relative z-10">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b7355]">

                        {card.title}

                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-[#2c1f0e]">

                        {card.value}

                      </p>

                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >

                      <Icon
                        className={`h-5 w-5 ${card.iconColor}`}
                      />

                    </div>

                  </div>

                  <p className="mt-3 text-xs text-[#8b7355] relative z-10 flex items-center gap-1">

                    {card.description}

                  </p>

                </div>

              );

            })}

          </div>

          {/* ================================================= */}
          {/* BOOKING OVERVIEW */}
          {/* ================================================= */}

                  <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-[#e8dcc8] p-6 shadow-sm">

            {/* Header with Graph on the right */}
            <div className="mb-6 flex items-center justify-between gap-6 flex-wrap">
              
              {/* Left: Title */}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#2c1f0e] font-serif">
                    Booking Overview
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#daa520]/10 text-[#b8860b] rounded-full border border-[#daa520]/20">
                    Live
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#8b7355]">
                  Current booking status across the platform.
                </p>
              </div>

              {/* Right: Compact Graph */}
              <div className="flex items-center gap-6">
                <div className="bg-[#FBF4E8] border border-[#E9DAC3] rounded-xl px-3 py-2">
                   <BookingTrendChart />
                </div>
                
                {/* Real-time badge */}
                <div className="flex items-center gap-2 text-xs text-[#b8860b] bg-[#fdf6e8] px-3 py-1.5 rounded-full border border-[#daa520]/20">
                  <Star className="w-3 h-3" />
                  <span>Updated in real-time</span>
                </div>
              </div>

            </div>

            {/* The Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statusCards.map((card) => {
                // ... rest of your card code

                const Icon = card.icon;

                return (

                  <div
                    key={card.title}
                    className={`group rounded-3xl border-2 ${card.borderColor} bg-gradient-to-br ${card.gradient} p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden cursor-pointer`}
                  >

                    {/* Decorative circle */}
                    <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${card.iconBg} opacity-20 group-hover:scale-150 transition-transform duration-500`} />

                    {/* Heritage accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#b8860b]/20 to-transparent" />

                    <div className="flex items-center justify-between relative z-10">

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      >

                        <Icon
                          className={`h-5 w-5 ${card.iconColor}`}
                        />

                      </div>

                      <ArrowUpRight
                        className={`h-4 w-4 ${card.iconColor} opacity-40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100`}
                      />

                    </div>

                    <p className="mt-4 text-2xl font-extrabold text-[#2c1f0e] relative z-10">

                      {card.value}

                    </p>

                    <p className="mt-1 text-sm font-bold text-[#4a3520] relative z-10">

                      {card.title}

                    </p>

                    <p className="mt-1 text-xs text-[#8b7355] relative z-10">

                      {card.description}

                    </p>

                  </div>

                );

              })}

            </div>

          </div>

          {/* ================================================= */}
          {/* RECENT BOOKINGS */}
          {/* ================================================= */}

          <div className="mt-8 overflow-hidden rounded-3xl border-2 border-[#e8dcc8] bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b-2 border-[#e8dcc8] px-6 py-5 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#faf6ef] to-[#f5ede1]">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b8860b]/10 border border-[#b8860b]/20">

                    <BookOpen className="h-5 w-5 text-[#b8860b]" />

                  </div>

                  <div>

                    <h2 className="text-lg font-extrabold text-[#2c1f0e] font-serif">

                      Recent Bookings

                    </h2>

                    <p className="text-xs text-[#8b7355]">

                      Latest reservations made by travelers.

                    </p>

                  </div>

                </div>

              </div>

              <button
                onClick={() => navigate("/admin/bookings")}
                className="group flex items-center gap-2 self-start rounded-2xl border-2 border-[#e8dcc8] bg-[#15966b] px-4 py-2.5 text-sm font-bold text-white transition-all hover:border-[#b8860b] hover:bg-[#fdf6e8] hover:shadow-md sm:self-auto"
              >

                View all

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

              </button>

            </div>

            {/* No bookings */}

            {stats.recent_bookings?.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b8860b]/10 to-[#b8860b]/5 border border-[#b8860b]/20">

                  <BookOpen className="h-7 w-7 text-[#b8860b]" />

                </div>

                <h3 className="mt-5 font-bold text-[#4a3520]">

                  No bookings yet

                </h3>

                <p className="mt-1 text-sm text-[#8b7355]">

                  New reservations will appear here.

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b border-[#e8dcc8] bg-gradient-to-r from-[#faf6ef] to-[#f5ede1]">

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">

                        Traveler

                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">

                        Destination

                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">

                        Experience

                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">

                        Status

                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">

                        Amount

                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {stats.recent_bookings
                      ?.slice(0, 5)
                      .map((booking, index) => {

                        const currentStatus =
                          booking.status?.toLowerCase();

                        const status =
                          statusStyles[currentStatus] ||
                          statusStyles.pending;

                        return (

                          <tr
                            key={booking._id || index}
                            className="border-b border-[#efe6d8] last:border-0 transition-all hover:bg-[#faf6ef]"
                          >

                            {/* Traveler */}

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b8860b]/20 to-[#b8860b]/5 text-sm font-extrabold text-[#b8860b] border border-[#b8860b]/20">

                                  {(booking.full_name || "U")
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <p className="text-sm font-bold text-[#2c1f0e]">

                                    {booking.full_name || "Unknown"}

                                  </p>

                                  <p className="text-xs text-[#8b7355]">

                                    Traveler

                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* Destination */}

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5ede1] border border-[#e8dcc8]">

                                  <MapPin className="h-4 w-4 text-[#b8860b]" />

                                </div>

                                <span className="text-sm font-semibold text-[#4a3520]">

                                  {booking.city || "—"}

                                </span>

                              </div>

                            </td>

                            {/* Experience */}

                            <td className="px-6 py-4">

                              <span className="text-sm text-[#4a3520] bg-[#faf6ef] px-3 py-1 rounded-full border border-[#e8dcc8]">

                                {booking.experience || "—"}

                              </span>

                            </td>

                            {/* Status */}

                            <td className="px-6 py-4">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-medium capitalize ${status.bg} ${status.border} ${status.text}`}
                              >

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`}
                                />

                                {booking.status || "Pending"}

                              </span>

                            </td>

                            {/* Amount */}

                            <td className="px-6 py-4 text-right">

                              <div className="inline-flex items-center gap-1 text-sm font-extrabold text-[#b8860b] bg-[#fdf6e8] px-3 py-1 rounded-full border border-[#daa520]/20">

                                <IndianRupee className="h-3 w-3" />

                                {booking.total?.toLocaleString() || "0"}

                              </div>

                            </td>

                          </tr>

                        );

                      })}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* ================================================= */}
          {/* FOOTER SUMMARY - Heritage Style */}
          {/* ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border-2 border-[#e8dcc8] bg-gradient-to-r from-white to-[#faf6ef] px-5 py-4 text-xs text-[#8b7355] shadow-sm sm:flex-row">

            <div className="flex items-center gap-2">

              <div className="p-1.5 rounded-lg bg-[#b8860b]/10 border border-[#b8860b]/20">
                <Users className="h-4 w-4 text-[#b8860b]" />
              </div>

              <span className="font-medium text-[#4a3520]">
                {stats.total_users || 0} registered travelers
              </span>

            </div>

            <div className="flex items-center gap-2">

              <div className="p-1.5 rounded-lg bg-[#b8860b]/10 border border-[#b8860b]/20">
                <MapPin className="h-4 w-4 text-[#b8860b]" />
              </div>

              <span className="font-medium text-[#4a3520]">
                {stats.total_cities || 0} Maharashtra destinations
              </span>

            </div>

            <div className="flex items-center gap-2">

              <div className="p-1.5 rounded-lg bg-[#b8860b]/10 border border-[#b8860b]/20">
                <Gem className="h-4 w-4 text-[#b8860b]" />
              </div>

              <span className="font-medium text-[#b8860b]">
                MahaVista Travel
              </span>

              <span className="text-[#8b7355]">•</span>

              <span className="text-[#8b7355]">Maharashtra Tourism</span>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};
const BookingTrendChart = () => {
  return (
    <div className="w-[650px] h-[67px] relative shrink-0">
      <svg
        viewBox="0 0 650 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D5B4F" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1D5B4F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The soft filled area (5 waves) */}
        <path
          d="M0,100 
             Q50,80 100,55 
             Q160,30 220,35 
             Q280,40 310,55 
             Q350,80 400,30 
             Q440,0 490,25 
             Q540,50 570,80 
             Q600,95 650,100 
             L650,100 L0,100 Z"
          fill="url(#tealGradient)"
          stroke="none"
        />

        {/* The dark teal curve line (5 waves, thin stroke) */}
        <path
          d="M0,100 
             Q50,80 100,55 
             Q160,30 220,35 
             Q280,40 310,55 
             Q350,80 400,30 
             Q440,0 490,25 
             Q540,50 570,80 
             Q600,95 650,100"
          fill="none"
          stroke="#1D5B4F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Dots (3 dots, matching the waves) */}
      <div className="absolute left-[23%] top-[20%] w-2 h-2 rounded-full bg-[#1D5B4F] border border-white shadow-sm" />
      <div className="absolute left-[55%] top-[45%] w-2 h-2 rounded-full bg-[#1D5B4F] border border-white shadow-sm" />
      <div className="absolute left-[75%] top-[30%] w-2 h-2 rounded-full bg-[#1D5B4F] border border-white shadow-sm" />
    </div>
  );
};
export default AdminDashboard;