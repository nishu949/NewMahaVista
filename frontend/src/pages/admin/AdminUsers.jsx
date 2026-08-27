import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import AdminNavbar from "../../Components/admin/AdminNavbar";
import {
  Search,
  User,
  Mail,
  Calendar,
  Trash2,
  Eye,
  Users,
  ArrowUpRight,
  UserRound,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
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

    fetchUsers();
  }, []);

  // =================================================
  // FETCH USERS
  // =================================================

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      let url = `${API_URL}/api/admin/users?limit=100`;

      if (search) {
        url += `&search=${search}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // DELETE USER
  // =================================================

  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);

      alert("Failed to delete user");
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
  // SEARCH
  // =================================================

  const handleSearch = (e) => {
    e.preventDefault();

    fetchUsers();
  };

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
            Loading users...
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

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <AdminSidebar onLogout={handleLogout} />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="ml-64">

        <AdminNavbar admin={admin} />

        <main className="px-6 py-7 lg:px-8">

          {/* ================================================= */}
          {/* PAGE HEADER */}
          {/* ================================================= */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              {/* Section Label */}

              <div className="flex items-center gap-2 text-sm font-semibold text-[#15966b]">

                <span className="h-2 w-2 rounded-full bg-[#15966b]" />

                User Management

              </div>

              {/* Title */}

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#222723]">
                Users
              </h1>

              {/* Description */}

              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor registered MahaVista travelers.
              </p>

            </div>

            {/* Header Stats */}

            <div className="flex items-center gap-3">

              <div className="rounded-2xl border border-[#e6e1d7] bg-white px-5 py-3 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Total Users
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#252a27]">
                  {users.length}
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

          {/* ================================================= */}
          {/* USER STAT CARD */}
          {/* ================================================= */}

          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Total Users */}

            <div className="rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    Registered Users
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#252a27]">
                    {users.length}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#15966b]">
                  <Users className="w-5 h-5" />
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Travelers registered on the platform
              </p>

            </div>

            {/* Active Directory */}

            <div className="rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    User Directory
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#252a27]">
                    Active
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f8f4] text-[#15966b]">
                  <UserRound className="w-5 h-5" />
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Centralized traveler management
              </p>

            </div>

            {/* Search Status */}

            <div className="rounded-3xl border border-[#eee9df] bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                    Search Results
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#252a27]">
                    {users.length}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Search className="w-5 h-5" />
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Users currently displayed
              </p>

            </div>

          </div>

          {/* ================================================= */}
          {/* SEARCH AREA */}
          {/* ================================================= */}

          <form
            onSubmit={handleSearch}
            className="mt-7 rounded-3xl border border-[#eee9df] bg-white p-4 shadow-sm"
          >

            <div className="flex flex-col gap-3 md:flex-row">

              {/* Search Input */}

              <div className="relative flex-1">

                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-[#ebe7de] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#15966b] focus:bg-white focus:ring-4 focus:ring-[#15966b]/10"
                />

              </div>

              {/* Search Button */}

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#15966b] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#117c59]"
              >

                <Search className="h-4 w-4" />

                Search

              </button>

            </div>

          </form>

          {/* ================================================= */}
          {/* USERS TABLE */}
          {/* ================================================= */}

          <div className="mt-6 overflow-hidden rounded-3xl border border-[#eee9df] bg-white shadow-sm">

            {/* Table Header */}

            <div className="flex flex-col gap-3 border-b border-[#eee9df] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f5ee]">
                    <Users className="h-4 w-4 text-[#15966b]" />
                  </div>

                  <h2 className="font-extrabold text-[#252a27]">
                    Registered Users
                  </h2>

                </div>

                <p className="mt-1 ml-11 text-xs text-gray-400">
                  {users.length} user
                  {users.length !== 1 ? "s" : ""} displayed
                </p>

              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#f2f8f4] px-3 py-2 text-xs font-semibold text-[#15966b]">

                <User className="h-3.5 w-3.5" />

                Traveler Directory

              </div>

            </div>

            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {users.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2f8f4] text-[#15966b]">

                  <User className="h-7 w-7" />

                </div>

                <h3 className="mt-5 font-bold text-gray-800">
                  No users found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search query.
                </p>

              </div>

            ) : (

              /* ================================================= */
              /* TABLE */
              /* ================================================= */

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b border-[#eee9df] bg-[#faf9f6] text-left">

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        #
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Traveller
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Email
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map((user, index) => (

                      <tr
                        key={user._id || index}
                        className="group border-b border-[#f0ede7] transition hover:bg-[#fafcf9]"
                      >

                        {/* Number */}

                        <td className="px-6 py-5 text-sm font-semibold text-gray-400">

                          {String(index + 1).padStart(2, "0")}

                        </td>

                        {/* User */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[#15966b]">

                              <User className="h-4 w-4" />

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-gray-800">

                                {user.full_name || "Unknown"}

                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">

                                Registered traveler

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Email */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3f1eb] text-[#15966b]">

                              <Mail className="h-4 w-4" />

                            </div>

                            <span className="text-sm font-medium text-gray-600">

                              {user.email}

                            </span>

                          </div>

                        </td>

                        {/* Joined */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">

                            <Calendar className="h-4 w-4 text-gray-400" />

                            {user.created_at
                              ? new Date(
                                  user.created_at
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}

                          </div>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-center gap-2">

                            {/* View */}

                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/users/${user._id}`
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7e3da] bg-white text-gray-500 transition hover:border-[#15966b] hover:bg-[#eff9f3] hover:text-[#15966b]"
                              title="View Details"
                            >

                              <Eye className="h-4 w-4" />

                            </button>

                            {/* Delete */}

                            <button
                              onClick={() =>
                                handleDelete(user._id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1dddd] bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete User"
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

          {/* ================================================= */}
          {/* FOOTER INFO */}
          {/* ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#eee9df] bg-white px-5 py-4 text-xs text-gray-400 sm:flex-row">

            <div className="flex items-center gap-2">

              <Users className="h-4 w-4" />

              <span>
                Showing {users.length} of {users.length} users
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

export default AdminUsers;