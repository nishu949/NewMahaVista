import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Shield, ArrowLeft, MapPin } from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOGIN FUNCTIONALITY — UNCHANGED
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store admin data
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f3ed]">

      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/maharashtra-hero.jpeg')",
        }}
      />

      {/* Cinematic overlay */}

      <div className="absolute inset-0 bg-[#211a15]/70" />

      {/* Soft gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#211a15]/80 via-[#5b3525]/55 to-[#b65d2a]/35" />

      {/* Decorative circles */}

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#e39a6e]/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#f4c6a8]/10 blur-3xl" />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12">

        <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-md lg:grid-cols-2">

          {/* =================================================
              LEFT — BRANDING
          ================================================= */}

          <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden p-10 lg:flex">

            {/* Image overlay */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#241913]/40 via-transparent to-[#241913]/70" />

            <div className="relative z-10">

              {/* Brand */}

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md">
                  <MapPin className="h-5 w-5 text-[#f3b38d]" />
                </div>

                <div>

                  <p className="text-sm font-bold tracking-wide text-white">
                    MahaVista
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                    Travel Maharashtra
                  </p>

                </div>

              </div>

            </div>

            {/* Main text */}

            <div className="relative z-10 max-w-lg">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">

                <Shield className="h-4 w-4 text-[#f0a16f]" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
                  Secure Admin Portal
                </span>

              </div>

              <h1 className="font-serif text-5xl font-bold leading-[1.05] text-white xl:text-6xl">
                Manage the
                <span className="block text-[#f0a16f]">
                  journey.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/75">
                Manage destinations, bookings, experiences and
                everything that makes Maharashtra worth exploring.
              </p>

            </div>

            {/* Bottom */}

            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div className="h-px w-12 bg-[#e39a6e]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Maharashtra • India
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT — LOGIN
          ================================================= */}

          <div className="flex items-center justify-center bg-[#fbf8f4]/95 p-6 sm:p-10 lg:p-14">

            <div className="w-full max-w-md">

              {/* Mobile brand */}

              <div className="mb-8 flex items-center gap-3 lg:hidden">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e5da]">
                  <MapPin className="h-5 w-5 text-[#b65d2a]" />
                </div>

                <div>

                  <p className="text-sm font-bold text-[#302a25]">
                    MahaVista
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8e84]">
                    Travel Maharashtra
                  </p>

                </div>

              </div>

              {/* Header */}

              <div>

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5e5da]">
                  <Shield className="h-7 w-7 text-[#b65d2a]" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b65d2a]">
                  Administration
                </p>

                <h2 className="mt-2 font-serif text-4xl font-bold text-[#302a25]">
                  Welcome back.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#817970]">
                  Sign in to manage your MahaVista Travel platform.
                </p>

              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#6f665e]">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a3958b]" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@mystictrails.com"
                      className="w-full rounded-2xl border border-[#e5dbd1] bg-[#f7f3ed] py-4 pl-12 pr-4 text-sm text-[#302a25] outline-none transition placeholder:text-[#b4aaa1] focus:border-[#c87846] focus:bg-white focus:ring-4 focus:ring-[#c87846]/10"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#6f665e]">
                    Password
                  </label>

                  <div className="relative">

                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a3958b]" />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-[#e5dbd1] bg-[#f7f3ed] py-4 pl-12 pr-4 text-sm text-[#302a25] outline-none transition placeholder:text-[#b4aaa1] focus:border-[#c87846] focus:bg-white focus:ring-4 focus:ring-[#c87846]/10"
                    />

                  </div>

                </div>

                {/* ERROR */}

                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-[#efc8c3] bg-[#fff2f0] px-4 py-3.5 text-sm text-[#b83c34]">

                    <span className="mt-0.5">
                      ⚠️
                    </span>

                    <span>
                      {error}
                    </span>

                  </div>
                )}

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#b65d2a] py-4 text-sm font-bold text-white shadow-[0_12px_25px_rgba(182,93,42,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#a65022] hover:shadow-[0_16px_30px_rgba(182,93,42,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </button>

              </form>

              {/* SECURITY NOTE */}

              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#f5f0e9] p-4">

                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#b65d2a]" />

                <p className="text-xs leading-5 text-[#817970]">
                  This area is restricted to authorized MahaVista
                  administrators. Your session is securely authenticated.
                </p>

              </div>

              {/* BACK */}

              <button
                onClick={() => navigate("/home")}
                className="mx-auto mt-7 flex items-center gap-2 text-sm font-semibold text-[#82776e] transition hover:text-[#b65d2a]"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to Home
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;