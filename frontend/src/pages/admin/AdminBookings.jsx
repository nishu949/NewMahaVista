import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import AdminNavbar from "../../Components/admin/AdminNavbar";
import {
  Search,
  ChevronDown,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const AdminBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    city: "",
  });

  const [search, setSearch] = useState("");

  // =================================================
  // AUTH + INITIAL FETCH
  // =================================================

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

    fetchBookings();
  }, []);

  // =================================================
  // FETCH BOOKINGS
  // =================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      let url = `${API_URL}/api/admin/bookings?limit=100`;

      if (filters.status) {
        url += `&status=${filters.status}`;
      }

      if (filters.city) {
        url += `&city=${filters.city}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // STATUS UPDATE
  // =================================================

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);

      alert("Failed to update booking status");
    }
  };

  // =================================================
  // DELETE
  // =================================================

  const handleDelete = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this booking?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);

      alert("Failed to delete booking");
    }
  };

  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    navigate("/admin/login");
  };

  // =================================================
  // STATUS HELPERS
  // =================================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;

      case "confirmed":
        return <CheckCircle className="w-3.5 h-3.5" />;

      case "completed":
        return <Calendar className="w-3.5 h-3.5" />;

      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" />;

      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // =================================================
  // SEARCH
  // =================================================

  const filteredBookings = bookings.filter((booking) => {
    const query = search.toLowerCase();

    return (
      booking.full_name?.toLowerCase().includes(query) ||
      booking.email?.toLowerCase().includes(query) ||
      booking.city?.toLowerCase().includes(query) ||
      booking.experience?.toLowerCase().includes(query) ||
      booking._id?.toLowerCase().includes(query)
    );
  });

  // =================================================
  // COUNTS
  // =================================================

  const pendingCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;

  // =================================================
  // LOADING
  // =================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#dcefe4]" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#15966b] animate-spin" />
          </div>

          <p className="mt-5 text-sm font-semibold text-gray-500">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  // =================================================
  // MAIN UI
  // =================================================

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#252a27]">

      {/* SIDEBAR */}

      <AdminSidebar onLogout={handleLogout} />

      {/* CONTENT */}

      <div className="ml-64">

        <AdminNavbar admin={admin} />

        <main className="px-6 py-7 lg:px-8">

          {/* ========================================= */}
          {/* PAGE HEADER */}
          {/* ========================================= */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2 text-sm font-semibold text-[#15966b]">
                <span className="h-2 w-2 rounded-full bg-[#15966b]" />
                Travel Management
              </div>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#222723]">
                Bookings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor Maharashtra travel bookings.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-2xl border border-[#e6e1d7] bg-white px-5 py-3 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Total Bookings
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#252a27]">
                  {bookings.length}
                </p>

              </div>

              <button
                onClick={() => navigate("/home")}
                className="hidden sm:flex items-center gap-2 rounded-2xl bg-[#15966b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#117c59]"
              >
                Explore
                <ArrowUpRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* ========================================= */}
          {/* STAT CARDS */}
          {/* ========================================= */}

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Pending */}

            <div className="rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#252a27]">
                    {pendingCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Awaiting confirmation
              </p>

            </div>

            {/* Confirmed */}

            <div className="rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    Confirmed
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#252a27]">
                    {confirmedCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Upcoming confirmed trips
              </p>

            </div>

            {/* Completed */}

            <div className="rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#252a27]">
                    {completedCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#15966b]">
                  <Calendar className="w-5 h-5" />
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Successfully completed trips
              </p>

            </div>

          </div>

          {/* ========================================= */}
          {/* FILTER AREA */}
          {/* ========================================= */}

          <div className="mt-7 rounded-3xl border border-[#eee9df] bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 xl:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by name, email, city, experience or booking ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-[#ebe7de] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#15966b] focus:bg-white focus:ring-4 focus:ring-[#15966b]/10"
                />

              </div>

              {/* Status */}

              <div className="relative">

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value,
                    })
                  }
                  className="appearance-none rounded-2xl border border-[#ebe7de] bg-[#faf9f6] px-4 py-3 pr-10 text-sm font-medium text-gray-600 outline-none transition focus:border-[#15966b] focus:ring-4 focus:ring-[#15966b]/10"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              </div>

              {/* Apply */}

              <button
                onClick={fetchBookings}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#15966b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#117c59]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Apply Filters
              </button>

            </div>

          </div>

          {/* ========================================= */}
          {/* BOOKINGS TABLE */}
          {/* ========================================= */}

          <div className="mt-6 overflow-hidden rounded-3xl border border-[#eee9df] bg-white shadow-sm">

            {/* Table Header */}

            <div className="flex items-center justify-between border-b border-[#eee9df] px-6 py-5">

              <div>

                <h2 className="font-extrabold text-[#252a27]">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {filteredBookings.length} booking
                  {filteredBookings.length !== 1 ? "s" : ""} displayed
                </p>

              </div>

              <div className="hidden items-center gap-2 rounded-xl bg-[#f2f8f4] px-3 py-2 text-xs font-semibold text-[#15966b] sm:flex">
                <MapPin className="h-3.5 w-3.5" />
                Maharashtra
              </div>

            </div>

            {filteredBookings.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2f8f4] text-3xl">
                  📭
                </div>

                <h3 className="mt-5 font-bold text-gray-800">
                  No bookings found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filter.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead>

                    <tr className="border-b border-[#eee9df] bg-[#faf9f6] text-left">

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        #
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Traveller
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Destination
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Experience
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Travel Date
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBookings.map((booking, index) => (

                      <tr
                        key={booking._id || index}
                        className="group border-b border-[#f0ede7] transition hover:bg-[#fafcf9]"
                      >

                        {/* Number */}

                        <td className="px-6 py-5 text-sm font-semibold text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {/* Traveller */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-sm font-extrabold text-[#15966b]">
                              {booking.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-gray-800">
                                {booking.full_name}
                              </p>

                              <p className="mt-0.5 max-w-[190px] truncate text-xs text-gray-400">
                                {booking.email}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* City */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3f1eb] text-[#15966b]">
                              <MapPin className="h-4 w-4" />
                            </div>

                            <span className="text-sm font-bold text-gray-700">
                              {booking.city}
                            </span>

                          </div>

                        </td>

                        {/* Experience */}

                        <td className="max-w-[190px] px-6 py-5">

                          <p className="truncate text-sm font-medium text-gray-600">
                            {booking.experience}
                          </p>

                        </td>

                        {/* Date */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">

                            <Calendar className="h-4 w-4 text-gray-400" />

                            {new Date(
                              booking.travel_date
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}

                          </div>

                        </td>

                        {/* Amount */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-1 text-sm font-extrabold text-[#15966b]">

                            <IndianRupee className="h-3.5 w-3.5" />

                            {booking.total?.toLocaleString() ||
                              "0"}

                          </div>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <div className="relative inline-block">

                            <div
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                booking.status
                              )}`}
                            >

                              {getStatusIcon(
                                booking.status
                              )}

                              <select
                                value={
                                  booking.status ||
                                  "pending"
                                }
                                onChange={(e) =>
                                  handleStatusChange(
                                    booking._id,
                                    e.target.value
                                  )
                                }
                                className="cursor-pointer appearance-none bg-transparent pr-4 outline-none"
                              >

                                <option value="pending">
                                  Pending
                                </option>

                                <option value="confirmed">
                                  Confirmed
                                </option>

                                <option value="completed">
                                  Completed
                                </option>

                                <option value="cancelled">
                                  Cancelled
                                </option>

                              </select>

                              <ChevronDown className="pointer-events-none absolute right-1 h-3 w-3" />

                            </div>

                          </div>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/bookings/${booking._id}`
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7e3da] bg-white text-gray-500 transition hover:border-[#15966b] hover:bg-[#eff9f3] hover:text-[#15966b]"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  booking._id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1dddd] bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete Booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* ========================================= */}
          {/* FOOTER INFO */}
          {/* ========================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#eee9df] bg-white px-5 py-4 text-xs text-gray-400 sm:flex-row">

            <div className="flex items-center gap-2">

              <Users className="h-4 w-4" />

              <span>
                Showing {filteredBookings.length} of{" "}
                {bookings.length} bookings
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

export default AdminBookings;