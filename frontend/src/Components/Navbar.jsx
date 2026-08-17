import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NewLogo1 from "../assets/images/NewLogo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const checkLoginStatus = () => {
      const status = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(status === "true");
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    // Check if we're on home page and have a hash
    const hash = window.location.hash;
    if (hash && (window.location.pathname === "/home" || window.location.pathname === "/")) {
      setActiveSection(hash.replace('#', ''));
      setTimeout(() => {
        scrollToSection(hash.replace('#', ''));
      }, 300);
    }

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Menu items with section IDs for scrolling on homepage
  const menu = [
    { name: "Explore Map", path: "/home", sectionId: "map-section" },
    // { name: "Heritage Quiz", path: "/home", sectionId: "quiz-section" },
    { name: "Bazaar", path: "/home", sectionId: "shop-section" },
    { name: "Kids Corner", path: "/home", sectionId: "kids-section" },
    { name: "Artist Shows", path: "/home", sectionId: "artist-section" },
    ...(isLoggedIn
      ? [{ name: "Your Bookings", path: "/home", sectionId: "bookings-section" }]
      : []),
  ];

  // Smooth scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Handle navigation click
  const handleNavClick = (e, item) => {
    e.preventDefault();
    
    // Always navigate to home first if not already there
    if (window.location.pathname !== "/home" && window.location.pathname !== "/") {
      navigate(`/home#${item.sectionId}`);
      setTimeout(() => {
        scrollToSection(item.sectionId);
      }, 300);
    } else {
      // If on home page, just scroll
      scrollToSection(item.sectionId);
      // Update URL hash without causing navigation
      window.history.pushState(null, '', `#${item.sectionId}`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-50/50 to-orange-50/30">
      <nav className="bg-gradient-to-r from-white/95 via-amber-50/90 to-white/95 backdrop-blur-xl sticky top-0 z-50 w-full border-b-2 border-amber-200/50 shadow-sm shadow-amber-200/20">
        <div className="flex justify-between items-center w-full px-6 md:px-10 py-3">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative flex items-center justify-center w-20 h-20 group">
              <svg
                width="100"
                height="100"
                viewBox="0 0 120 120"
                className="absolute opacity-20 group-hover:opacity-30 transition-opacity duration-700"
              >
                <circle cx="60" cy="60" r="55" fill="none" stroke="#8B4513" strokeWidth="1" strokeDasharray="3 6" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#CD853F" strokeWidth="1" />
                <circle cx="60" cy="60" r="35" fill="none" stroke="#DAA520" strokeWidth="0.5" />
                <path
                  d="M60 15 L65 30 L80 30 L68 40 L73 55 L60 47 L47 55 L52 40 L40 30 L55 30 Z"
                  fill="none"
                  stroke="#B8860B"
                  strokeWidth="1"
                />
                <path
                  d="M30 80 L35 70 L45 75 L40 85 L30 80 Z"
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="0.8"
                />
                <path
                  d="M90 80 L85 70 L75 75 L80 85 L90 80 Z"
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="0.8"
                />
              </svg>

              <div className="absolute w-16 h-16 bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-400/20 transition-all duration-500" />

              <img
                src={NewLogo1}
                alt="Mystic Trails of Maharashtra logo"
                className="w-16 h-16 object-cover rounded-full z-10 animate-logo hover:scale-110 transition-all duration-500 hover:rotate-3 cursor-pointer shadow-lg shadow-amber-400/20 border-2 border-amber-200/50"
                onClick={() => {
                  navigate("/home");
                  setActiveSection("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>

            <div className="hidden lg:block">
              <div className="text-xl font-display font-bold text-amber-900 animate-glow tracking-wider leading-tight">
                Mystic Trails
              </div>
              <div className="text-[10px] text-amber-700/70 tracking-[0.3em] font-semibold uppercase mt-0.5 flex items-center gap-2">
                <span className="w-4 h-px bg-amber-400/50"></span>
                of Maharashtra
                <span className="w-4 h-px bg-amber-400/50"></span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menu.map((item) => (
              <a
                key={item.name}
                href={`#${item.sectionId}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative px-5 py-2.5 font-sans font-bold text-sm tracking-wider transition-all duration-300 group rounded-lg whitespace-nowrap cursor-pointer ${
                  activeSection === item.sectionId
                    ? "text-amber-900 bg-amber-100/60"
                    : "text-amber-800/70 hover:text-amber-900 hover:bg-amber-50/80"
                }`}
              >
                <span className="relative z-10 inline-block">
                  {item.name}
                </span>
                {activeSection === item.sectionId && (
                  <>
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-200/50 to-orange-200/50 border-2 border-amber-300/60" />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full w-8" />
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/40" />
                  </>
                )}
                {activeSection !== item.sectionId && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full w-0 group-hover:w-6" />
                )}
              </a>
            ))}
          </div>

          {/* Login / Logout */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-2 text-amber-800/90 text-sm font-semibold bg-amber-50/80 px-4 py-2 rounded-full border-2 border-amber-200/50 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/40" />
                <span>Hi, {localStorage.getItem("user")}</span>
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="relative px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 overflow-hidden group bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-md shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 border-2 border-rose-400/30 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base">✕</span>
                  <span>Logout</span>
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="relative px-7 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105 active:scale-95 border-2 border-amber-400/30 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base">✦</span>
                  <span>Login</span>
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-all duration-300" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          .font-display {
            font-family: 'Cinzel Decorative', cursive;
          }

          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          nav {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          @keyframes logoAnim {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.2));
            }
            50% {
              transform: scale(1.05);
              filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.5));
            }
          }

          @keyframes glowPulse {
            0%, 100% {
              text-shadow: 0 0 10px rgba(180, 83, 9, 0.1),
                           0 0 20px rgba(180, 83, 9, 0.05);
            }
            50% {
              text-shadow: 0 0 20px rgba(180, 83, 9, 0.2),
                           0 0 40px rgba(180, 83, 9, 0.1);
            }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-logo {
            animation: logoAnim 3s ease-in-out infinite;
          }

          .animate-glow {
            animation: glowPulse 3s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin 20s linear infinite;
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;