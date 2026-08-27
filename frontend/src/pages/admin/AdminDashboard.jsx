import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import AdminNavbar from "../../Components/admin/AdminNavbar";
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
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#dcefe4]" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#15966b] animate-spin" />
          </div>

          <p className="mt-5 text-sm font-semibold text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =================================================
  // STAT CARDS
  // =================================================

  const statCards = [
    {
      title: "Total Users",
      value: stats.total_users || 0,
      icon: Users,
      description: "Registered travelers",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Bookings",
      value: stats.total_bookings || 0,
      icon: BookOpen,
      description: "All reservations",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Cities",
      value: stats.total_cities || 0,
      icon: MapPin,
      description: "Destinations available",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.total_revenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: "Generated revenue",
      iconBg: "bg-emerald-50",
      iconColor: "text-[#15966b]",
    },
  ];

  // =================================================
  // BOOKING STATUS
  // =================================================

  const statusCards = [
    {
      title: "Pending",
      value: stats.pending_bookings || 0,
      icon: Clock,
      description: "Awaiting confirmation",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Confirmed",
      value: stats.confirmed_bookings || 0,
      icon: CheckCircle,
      description: "Upcoming confirmed trips",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed",
      value: stats.completed_bookings || 0,
      icon: Calendar,
      description: "Successfully completed trips",
      iconBg: "bg-emerald-50",
      iconColor: "text-[#15966b]",
    },
    {
      title: "Cancelled",
      value: stats.cancelled_bookings || 0,
      icon: XCircle,
      description: "Cancelled reservations",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  // =================================================
  // STATUS STYLES
  // =================================================

  const statusStyles = {
    pending: {
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },

    confirmed: {
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },

    completed: {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },

    cancelled: {
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  // =================================================
  // MAIN UI
  // =================================================

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#252a27] flex">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <AdminSidebar onLogout={handleLogout} />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="ml-64 flex-1 min-w-0">

        <AdminNavbar admin={admin} />

        <main className="px-6 py-7 lg:px-8">

          {/* ================================================= */}
          {/* PAGE HEADER */}
          {/* ================================================= */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2 text-sm font-semibold text-[#15966b]">

                <span className="h-2 w-2 rounded-full bg-[#15966b]" />

                Travel Management

              </div>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#222723]">

                Dashboard

              </h1>

              <p className="mt-1 text-sm text-gray-500">

                Monitor your Maharashtra travel platform at a glance.

              </p>

            </div>

            <div className="flex items-center gap-3">

              {/* Total Bookings */}

              <div className="rounded-2xl border border-[#e6e1d7] bg-white px-5 py-3 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">

                  Total Bookings

                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#252a27]">

                  {stats.total_bookings || 0}

                </p>

              </div>

              {/* Explore */}

              <button
                onClick={() => navigate("/home")}
                className="hidden sm:flex items-center gap-2 rounded-2xl bg-[#15966b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#117c59]"
              >

                Explore

                <ArrowUpRight className="w-4 h-4" />

              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* WELCOME BANNER */}
          {/* ================================================= */}

          <div className="mt-7 relative overflow-hidden rounded-3xl bg-[#063d2c] p-7 lg:p-8 shadow-sm">

            {/* Decorative elements */}

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="absolute right-32 bottom-0 h-32 w-32 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">

                    <Sparkles className="w-3.5 h-3.5" />

                    Admin Overview

                  </span>

                </div>

                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">

                  Welcome back,{" "}

                  <span className="text-emerald-300">

                    {admin?.full_name || "Admin"}

                  </span>

                  !

                </h2>

                <p className="mt-2 max-w-2xl text-sm text-emerald-100/70">

                  Here's what's happening across your MahaVista Travel
                  platform today.

                </p>

              </div>

              <div className="hidden md:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">

                <Activity className="h-8 w-8 text-emerald-300" />

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* MAIN STAT CARDS */}
          {/* ================================================= */}

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {statCards.map((card) => {

              const Icon = card.icon;

              return (

                <div
                  key={card.title}
                  className="group rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">

                        {card.title}

                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-[#252a27]">

                        {card.value}

                      </p>

                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}
                    >

                      <Icon
                        className={`h-5 w-5 ${card.iconColor}`}
                      />

                    </div>

                  </div>

                  <p className="mt-3 text-xs text-gray-500">

                    {card.description}

                  </p>

                </div>

              );

            })}

          </div>

          {/* ================================================= */}
          {/* BOOKING OVERVIEW */}
          {/* ================================================= */}

          <div className="mt-8">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-extrabold text-[#063d2c]">

                  Booking Overview

                </h2>

              </div>

              <p className="mt-1 text-sm text-gray-500">

                Current booking status across the platform.

              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {statusCards.map((card) => {

                const Icon = card.icon;

                return (

                  <div
                    key={card.title}
                    className="group rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}
                      >

                        <Icon
                          className={`h-5 w-5 ${card.iconColor}`}
                        />

                      </div>

                      <ArrowUpRight
                        className={`h-4 w-4 ${card.iconColor} opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                      />

                    </div>

                    <p className="mt-4 text-2xl font-extrabold text-[#252a27]">

                      {card.value}

                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-700">

                      {card.title}

                    </p>

                    <p className="mt-1 text-xs text-gray-500">

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

          <div className="mt-8 overflow-hidden rounded-3xl border border-[#eee9df] bg-white shadow-sm">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-[#eee9df] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f5ee]">

                    <BookOpen className="h-4 w-4 text-[#15966b]" />

                  </div>

                  <h2 className="text-lg font-extrabold text-[#252a27]">

                    Recent Bookings

                  </h2>

                </div>

                <p className="mt-2 ml-11 text-xs text-gray-400">

                  Latest reservations made by travelers.

                </p>

              </div>

              <button
                onClick={() => navigate("/admin/bookings")}
                className="group flex items-center gap-2 self-start rounded-2xl border border-[#e6e1d7] bg-white px-4 py-2.5 text-sm font-bold text-[#15966b] transition hover:border-[#15966b] hover:bg-[#f2f8f4] sm:self-auto"
              >

                View all

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

              </button>

            </div>

            {/* No bookings */}

            {stats.recent_bookings?.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2f8f4]">

                  <BookOpen className="h-6 w-6 text-[#15966b]" />

                </div>

                <h3 className="mt-5 font-bold text-gray-700">

                  No bookings yet

                </h3>

                <p className="mt-1 text-sm text-gray-400">

                  New reservations will appear here.

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b border-[#eee9df] bg-[#faf9f6] text-left">

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">

                        Traveler

                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">

                        Destination

                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">

                        Experience

                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">

                        Status

                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">

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
                            className="border-b border-[#f0ede7] last:border-0 transition hover:bg-[#fafcf9]"
                          >

                            {/* Traveler */}

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-sm font-extrabold text-[#15966b]">

                                  {(booking.full_name || "U")
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <p className="text-sm font-bold text-gray-800">

                                    {booking.full_name || "Unknown"}

                                  </p>

                                  <p className="text-xs text-gray-400">

                                    Traveler

                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* Destination */}

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3f1eb]">

                                  <MapPin className="h-4 w-4 text-[#15966b]" />

                                </div>

                                <span className="text-sm font-semibold text-gray-700">

                                  {booking.city || "—"}

                                </span>

                              </div>

                            </td>

                            {/* Experience */}

                            <td className="px-6 py-4">

                              <span className="text-sm text-gray-600">

                                {booking.experience || "—"}

                              </span>

                            </td>

                            {/* Status */}

                            <td className="px-6 py-4">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${status.bg} ${status.border} ${status.text}`}
                              >

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                />

                                {booking.status || "Pending"}

                              </span>

                            </td>

                            {/* Amount */}

                            <td className="px-6 py-4 text-right">

                              <div className="inline-flex items-center gap-1 text-sm font-extrabold text-[#15966b]">

                                <IndianRupee className="h-3.5 w-3.5" />

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
          {/* FOOTER SUMMARY */}
          {/* ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#eee9df] bg-white px-5 py-4 text-xs text-gray-400 sm:flex-row">

            <div className="flex items-center gap-2">

              <Users className="h-4 w-4" />

              <span>
                {stats.total_users || 0} registered travelers
              </span>

            </div>

            <div className="flex items-center gap-2">

              <MapPin className="h-4 w-4" />

              <span>
                {stats.total_cities || 0} Maharashtra destinations
              </span>

            </div>

            <span>
              MahaVista Travel • Maharashtra Tourism
            </span>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;