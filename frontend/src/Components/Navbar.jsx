import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NewLogo1 from "../assets/images/NewLogo1.png";
import { useLanguage } from "../context/LanguageContext"; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  const { lang, changeLanguage, t } = useLanguage(); 

  // ✅ NEW: Helper to show full language name on the button
  const languageDisplayName = {
    en: "English",
    hi: "हिन्दी",
    mr: "मराठी"
  };

  // ================= LOGIN STATUS =================
  useEffect(() => {
    const checkLoginStatus = () => {
      const status = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(status === "true");
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    const hash = window.location.hash;

    if (
      hash &&
      (window.location.pathname === "/home" ||
        window.location.pathname === "/")
    ) {
      const sectionId = hash.replace("#", "");
      setActiveSection(sectionId);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    }

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // ================= MENU ITEMS =================
  const menu = [
    {
      name: "Explore Map",
      translationKey: "exploreMap",
      path: "/home",
      sectionId: "map-section",
    },
    {
      name: "Calendar",
      translationKey: "calendar", 
      path: "/festivals",
      sectionId: null,
    },
    {
      name: "Bazaar",
      translationKey: "bazaar", 
      path: "/home",
      sectionId: "shop-section",
    },
    {
      name: "Kids Corner",
      translationKey: "kids", 
      path: "/home",
      sectionId: "kids-section",
    },
    {
      name: "Recommendation",
      translationKey: "recommendation",
      path: "/recommendations",
      sectionId: "recommendation-card",
    },
    ...(isLoggedIn
      ? [
          {
            name: "Your Bookings",
            translationKey: "bookings", 
            path: "/my-bookings",
            sectionId: "bookings-section",
          },
        ]
      : []),
  ];

  // ================= SMOOTH SCROLL =================
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ================= NAVIGATION =================
  const handleNavClick = (e, item) => {
    e.preventDefault();

    if (item.path === "/my-bookings") {
      navigate("/my-bookings");
      setActiveSection("bookings-section");
      return;
    }

    if (item.path === "/recommendations") {
      navigate("/recommendations");
      setActiveSection("recommendation-card");
      return;
    }

    if (item.path === "/festivals") {
      navigate("/festivals");
      setActiveSection("");
      return;
    }

    if (
      window.location.pathname !== "/home" &&
      window.location.pathname !== "/"
    ) {
      navigate(`/home#${item.sectionId}`);
      setTimeout(() => {
        scrollToSection(item.sectionId);
      }, 300);
    } else {
      scrollToSection(item.sectionId);
      window.history.pushState(null, "", `#${item.sectionId}`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-100/80 via-orange-50/70 to-amber-50/60">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <nav
        className="
          sticky top-0 z-50 w-full
          bg-gradient-to-r from-[#fff7df]/98 via-[#f8e8bd]/96 to-[#fff2d2]/98
          backdrop-blur-xl border-b-2 border-amber-300/80
          shadow-[0_5px_25px_rgba(146,91,15,0.14)]
        "
      >
        <div className="flex justify-between items-center w-full px-5 md:px-8 lg:px-10 py-2.5">
          
          {/* LOGO SECTION */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative flex items-center justify-center w-[76px] h-[76px] group">
              <svg width="96" height="96" viewBox="0 0 120 120" className="absolute opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                <circle cx="60" cy="60" r="55" fill="none" stroke="#8B4513" strokeWidth="1.2" strokeDasharray="3 6" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#B86F20" strokeWidth="1" />
                <circle cx="60" cy="60" r="35" fill="none" stroke="#C58A18" strokeWidth="0.7" />
                <path d="M60 15 L65 30 L80 30 L68 40 L73 55 L60 47 L47 55 L52 40 L40 30 L55 30 Z" fill="none" stroke="#9A6912" strokeWidth="1" />
                <path d="M30 80 L35 70 L45 75 L40 85 L30 80 Z" fill="none" stroke="#8B4513" strokeWidth="0.8" />
                <path d="M90 80 L85 70 L75 75 L80 85 L90 80 Z" fill="none" stroke="#8B4513" strokeWidth="0.8" />
              </svg>

              <div className="absolute w-16 h-16 bg-amber-500/15 rounded-full blur-xl group-hover:bg-amber-500/25 transition-all duration-500" />

              <img
                src={NewLogo1}
                alt="MahaVista logo"
                className="w-16 h-16 object-cover rounded-full z-10 animate-logo hover:scale-110 transition-all duration-500 hover:rotate-3 cursor-pointer shadow-[0_5px_18px_rgba(132,82,12,0.25)] border-2 border-amber-300/80"
                onClick={() => {
                  navigate("/home");
                  setActiveSection("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>

            {/* BRAND */}
            <div className="hidden lg:block">
              <div className="text-xl font-display font-bold text-[#70420e] animate-glow tracking-wider leading-tight">
                MahaVista
              </div>
              <div className="text-[10px] text-[#9a6419] tracking-[0.3em] font-semibold uppercase mt-0.5 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-500/60" />
                Exploring Maharashtra
                <span className="w-4 h-px bg-amber-500/60" />
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="hidden md:flex items-center gap-1">
            {menu.map((item) => (
              <a
                key={item.name}
                href={`#${item.sectionId}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`
                  relative px-5 py-2.5 font-sans font-bold text-sm tracking-wider transition-all duration-300 group rounded-lg whitespace-nowrap cursor-pointer
                  ${activeSection === item.sectionId ? "text-[#6b3f0d] bg-amber-200/75" : "text-[#805217] hover:text-[#5d3509] hover:bg-amber-100/90"}
                `}
              >
                <span className="relative z-10 inline-block">
                  {t(item.translationKey)}
                </span>

                {activeSection === item.sectionId && (
                  <>
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-300/40 via-orange-200/50 to-amber-300/40 border-2 border-amber-400/70" />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-300 rounded-full w-8 shadow-sm shadow-amber-500/50" />
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-600 shadow-lg shadow-amber-600/50" />
                  </>
                )}

                {activeSection !== item.sectionId && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-300 rounded-full w-0 group-hover:w-6" />
                )}
              </a>
            ))}
          </div>

          {/* LOGIN / LOGOUT & LANGUAGE */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* =================================================
                ✅ LANGUAGE DROPDOWN (Updated to show full names)
            ================================================= */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-100/90 text-[#70420e] border-2 border-amber-300/70 font-semibold text-sm hover:bg-amber-200/90 transition-all">
                🌐 <span>{languageDisplayName[lang]}</span> {/* ✅ CHANGED HERE */}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-amber-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button onClick={() => changeLanguage("en")} className={`block w-full text-left px-4 py-2 text-sm hover:bg-amber-50 rounded-t-xl ${lang === "en" ? "font-bold text-[#70420e]" : "text-gray-700"}`}>English</button>
                <button onClick={() => changeLanguage("mr")} className={`block w-full text-left px-4 py-2 text-sm hover:bg-amber-50 ${lang === "mr" ? "font-bold text-[#70420e]" : "text-gray-700"}`}>मराठी</button>
                <button onClick={() => changeLanguage("hi")} className={`block w-full text-left px-4 py-2 text-sm hover:bg-amber-50 rounded-b-xl ${lang === "hi" ? "font-bold text-[#70420e]" : "text-gray-700"}`}>हिन्दी</button>
              </div>
            </div>
            {/* ================================================= */}

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-2 text-[#70420e] text-sm font-semibold bg-amber-100/90 px-4 py-2 rounded-full border-2 border-amber-300/70 shadow-sm shadow-amber-400/10 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/40" />
                <span>
                  {t("hi")}, {localStorage.getItem("user")}
                </span>
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="relative px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 overflow-hidden group bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-md shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 border-2 border-rose-400/30 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base">✕</span>
                  <span>{t("logout")}</span> 
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="relative px-7 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 overflow-hidden group bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:via-orange-600 hover:to-orange-600 text-white shadow-md shadow-amber-600/35 hover:shadow-amber-600/55 hover:scale-105 active:scale-95 border-2 border-amber-400/40 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base">✦</span>
                  <span>{t("login")}</span> 
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-all duration-300" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* STYLES REMAIN EXACTLY THE SAME */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .font-display { font-family: 'Cinzel Decorative', cursive; }
          * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          nav { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          @keyframes logoAnim {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.20)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.50)); }
          }
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 10px rgba(146, 82, 12, 0.10), 0 0 20px rgba(146, 82, 12, 0.05); }
            50% { text-shadow: 0 0 20px rgba(146, 82, 12, 0.22), 0 0 40px rgba(146, 82, 12, 0.10); }
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-logo { animation: logoAnim 3s ease-in-out infinite; }
          .animate-glow { animation: glowPulse 3s ease-in-out infinite; }
          .animate-spin-slow { animation: spin 20s linear infinite; }
          html { scroll-behavior: smooth; }
        `}
      </style>
    </div>
  );
};

export default Navbar;