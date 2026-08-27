import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import AdminNavbar from "../../Components/admin/AdminNavbar";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  CalendarDays,
  Wallet,
  Clock3,
  Building2,
  Sparkles,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const AdminCities = () => {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    subtitle: "",
    description: "",
    image: "",
    best_time: "",
    highlights: "",
    budget: "",
    duration: "",
  });

  // =========================================================
  // AUTHENTICATION
  // =========================================================

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

    fetchCities();
  }, []);

  // =========================================================
  // FETCH CITIES
  // =========================================================

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/cities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data = await response.json();

      setCities(data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SUBMIT CITY
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      const url = editingCity
        ? `${API_URL}/api/admin/cities/${editingCity._id}`
        : `${API_URL}/api/admin/cities`;

      const method = editingCity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save city");
      }

      setShowModal(false);
      setEditingCity(null);

      setFormData({
        name: "",
        slug: "",
        tagline: "",
        subtitle: "",
        description: "",
        image: "",
        best_time: "",
        highlights: "",
        budget: "",
        duration: "",
      });

      fetchCities();
    } catch (error) {
      console.error("Error saving city:", error);
      alert("Failed to save city");
    }
  };

  // =========================================================
  // DELETE CITY
  // =========================================================

  const handleDelete = async (cityId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this city?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/cities/${cityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete city");
      }

      fetchCities();
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("Failed to delete city");
    }
  };

  // =========================================================
  // EDIT CITY
  // =========================================================

  const handleEdit = (city) => {
    setEditingCity(city);

    setFormData({
      name: city.name || "",
      slug: city.slug || "",
      tagline: city.tagline || "",
      subtitle: city.subtitle || "",
      description: city.description || "",
      image: city.image || "",
      best_time: city.best_time || "",
      highlights: city.highlights || "",
      budget: city.budget || "",
      duration: city.duration || "",
    });

    setShowModal(true);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    navigate("/admin/login");
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setEditingCity(null);

    setFormData({
      name: "",
      slug: "",
      tagline: "",
      subtitle: "",
      description: "",
      image: "",
      best_time: "",
      highlights: "",
      budget: "",
      duration: "",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#d97706] animate-spin" />

            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#d97706]" />
            </div>
          </div>

          <p className="text-gray-500 mt-5 font-medium">
            Loading destinations...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex">

      {/* SIDEBAR */}
      <AdminSidebar onLogout={handleLogout} />

      {/* CONTENT */}
      <div className="ml-64 flex-1">

        {/* NAVBAR */}
        <AdminNavbar admin={admin} />

        <main className="p-6 lg:p-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                    Destination Management
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#242424] tracking-tight">
                  Cities
                </h1>

                <p className="text-gray-500 mt-2 max-w-xl">
                  Manage Maharashtra destinations, travel information,
                  images and booking details from one place.
                </p>

              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#d97706] hover:bg-[#b45309] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add New City
              </button>

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            {/* Total Cities */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Total Cities
                  </p>

                  <p className="text-3xl font-extrabold text-[#242424] mt-2">
                    {cities.length}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>

              </div>

              <p className="text-xs text-gray-400 mt-3">
                Destinations currently available
              </p>

            </div>

            {/* Total Bookings */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Total Bookings
                  </p>

                  <p className="text-3xl font-extrabold text-[#242424] mt-2">
                    {cities.reduce(
                      (total, city) =>
                        total + (city.booking_count || 0),
                      0
                    )}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>

              </div>

              <p className="text-xs text-gray-400 mt-3">
                Bookings across destinations
              </p>

            </div>

            {/* Platform */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Platform
                  </p>

                  <p className="text-3xl font-extrabold text-[#242424] mt-2">
                    Active
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>

              </div>

              <p className="text-xs text-gray-400 mt-3">
                Maharashtra travel destinations
              </p>

            </div>

          </div>

          {/* =================================================
              CITY GRID
          ================================================= */}

          {cities.length === 0 ? (

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-orange-400" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-6">
                No cities added yet
              </h3>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Start building your Maharashtra travel catalog
                by adding your first destination.
              </p>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl font-bold transition"
              >
                <Plus className="w-5 h-5" />
                Add First City
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {cities.map((city) => (

                <div
                  key={city._id}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >

                  {/* IMAGE */}

                  <div className="relative h-52 bg-gray-100 overflow-hidden">

                    {city.image ? (

                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center bg-orange-50">
                        <MapPin className="w-14 h-14 text-orange-300" />
                      </div>

                    )}

                    {/* IMAGE OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* CITY NAME */}

                    <div className="absolute left-5 bottom-5 right-5">

                      <div className="flex items-end justify-between gap-3">

                        <div>

                          <p className="text-white/70 text-xs font-medium mb-1">
                            Maharashtra
                          </p>

                          <h3 className="text-white font-extrabold text-2xl">
                            {city.name}
                          </h3>

                        </div>

                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700">
                          {city.slug}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* CARD CONTENT */}

                  <div className="p-5">

                    {/* TAGLINE */}

                    {city.tagline && (

                      <p className="text-gray-700 font-semibold text-sm leading-6 line-clamp-2">
                        {city.tagline}
                      </p>

                    )}

                    {/* SUBTITLE */}

                    {city.subtitle && (

                      <p className="text-gray-400 text-xs mt-1">
                        {city.subtitle}
                      </p>

                    )}

                    {/* DETAILS */}

                    <div className="grid grid-cols-3 gap-2 mt-5">

                      <div className="rounded-xl bg-[#fafafa] border border-gray-100 p-3">

                        <CalendarDays className="w-4 h-4 text-orange-500 mb-2" />

                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Best Time
                        </p>

                        <p className="text-xs font-bold text-gray-700 mt-1 truncate">
                          {city.best_time || "N/A"}
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#fafafa] border border-gray-100 p-3">

                        <Wallet className="w-4 h-4 text-blue-500 mb-2" />

                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Budget
                        </p>

                        <p className="text-xs font-bold text-gray-700 mt-1 truncate">
                          {city.budget || "N/A"}
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#fafafa] border border-gray-100 p-3">

                        <Clock3 className="w-4 h-4 text-purple-500 mb-2" />

                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          Duration
                        </p>

                        <p className="text-xs font-bold text-gray-700 mt-1 truncate">
                          {city.duration || "N/A"}
                        </p>

                      </div>

                    </div>

                    {/* FOOTER */}

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

                      <div>

                        <p className="text-xs text-gray-400">
                          Bookings
                        </p>

                        <p className="text-sm font-extrabold text-gray-800 mt-0.5">
                          {city.booking_count || 0}
                        </p>

                      </div>

                      <div className="flex items-center gap-2">

                        {/* EDIT */}

                        <button
                          onClick={() => handleEdit(city)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition"
                          title="Edit City"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() => handleDelete(city._id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                          title="Delete City"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </main>

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden">

            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>

                  <h2 className="text-xl font-extrabold text-gray-900">
                    {editingCity
                      ? "Edit City"
                      : "Add New City"}
                  </h2>

                </div>

                <p className="text-xs text-gray-400 mt-1 ml-11">
                  Add destination information for your travelers.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCity(null);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="overflow-y-auto max-h-[calc(92vh-90px)]">

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                {/* BASIC INFO */}

                <div>

                  <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* CITY NAME */}

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        City Name *
                      </label>

                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                        placeholder="e.g. Pune"
                      />

                    </div>

                    {/* SLUG */}

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Slug *
                      </label>

                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "-"),
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                        placeholder="e.g. pune"
                      />

                    </div>

                  </div>

                </div>

                {/* TAGLINE */}

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Tagline
                  </label>

                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                    placeholder="e.g. Queen of the Deccan"
                  />

                </div>

                {/* SUBTITLE */}

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Subtitle
                  </label>

                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                    placeholder="e.g. Cultural Capital of Maharashtra"
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition resize-none"
                    placeholder="Describe the city..."
                  />

                </div>

                {/* IMAGE */}

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                    placeholder="https://example.com/image.jpg"
                  />

                  {/* IMAGE PREVIEW */}

                  {formData.image && (

                    <div className="mt-3 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">

                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>

                  )}

                </div>

                {/* TRAVEL DETAILS */}

                <div>

                  <h3 className="text-sm font-bold text-gray-800 mb-3">
                    Travel Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* BEST TIME */}

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Best Time
                      </label>

                      <input
                        type="text"
                        value={formData.best_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            best_time: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                        placeholder="Oct - Mar"
                      />

                    </div>

                    {/* BUDGET */}

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Budget
                      </label>

                      <input
                        type="text"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budget: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                        placeholder="$$ - $$$"
                      />

                    </div>

                    {/* DURATION */}

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Duration
                      </label>

                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition"
                        placeholder="2-3 days"
                      />

                    </div>

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-gray-100">

                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCity(null);
                    }}
                    className="sm:w-32 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#d97706] hover:bg-[#b45309] text-white font-bold rounded-xl transition shadow-lg shadow-orange-200"
                  >
                    {editingCity
                      ? "Update City"
                      : "Add City"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminCities;