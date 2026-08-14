import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NewLogo1 from "../assets/images/NewLogo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const checkLoginStatus = () => {
      const status = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(status === "true");
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const menu = [
    { name: "Home", path: "/home" },
    { name: "Explore Map", path: "/map" },
    { name: "Heritage Quiz", path: "/quiz" },
    { name: "Bazaar", path: "/shop" },
    { name: "Artist Shows", path: "/artisans" },
        ...(isLoggedIn
      ? [{ name: "Your Bookings", path: "/your-bookings" }]
      : []),
  
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="w-full bg-background text-on-surface">
      <nav className="bg-[#174C1A]/90 backdrop-blur-xl sticky top-0 z-50 w-full">
      
        <div className="flex justify-between items-center w-full px-6 md:px-10 py-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-24 h-24">
              
              <svg
                width="100"
                height="100"
                viewBox="0 0 120 120"
                className="absolute opacity-10 animate-spin-slow"
              >
                <circle cx="60" cy="60" r="55" fill="none" stroke="#d4a373" strokeWidth="1" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#d4a373" strokeWidth="0.5" />
                <path
                  d="M60 10 L75 40 L105 45 L80 65 L90 95 L60 80 L30 95 L40 65 L15 45 L45 40 Z"
                  fill="none"
                  stroke="#d4a373"
                  strokeWidth="1"
                />
              </svg>

              <div className="absolute w-20 h-20 bg-[#d4a373]/10 rounded-full blur-lg" />

              <img
                src={NewLogo1}
                alt="Mystic Trails of Maharashtra logo"
                className="w-20 h-20 object-cover rounded-full z-10 animate-logo hover:scale-105 transition duration-300"
              />
            </div>

           <div className="text-2xl md:text-3xl lg:text-2xl font-display font-bold text-[#D4A574] animate-glow tracking-wide">
  Mystic Trails of Maharashtra
</div>
          </div>

          {/* Menu */}
        <div className="hidden md:flex items-center gap-10">
  {menu.map((item) => (
    <NavLink
      key={item.name}
      to={item.path}
      className={({ isActive }) =>
        `font-sans uppercase tracking-wider text-base md:text-lg font-semibold transition-all duration-300 ${
          isActive
            ? "text-[#f5f5dc] border-b-2 border-[#d4a373] pb-1 font-bold"
            : "text-[#f5f5dc]/90 hover:text-[#d4a373] hover:scale-105"
        }`
      }
    >
      {item.name}
    </NavLink>
  ))}
</div>

          {/* Login / Logout */}
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <span className="hidden md:inline text-[#f5f5dc] text-sm">
                Hi, {localStorage.getItem("user")}
              </span>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#d4a373] text-black px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap');

          .font-display {
            font-family: 'Cinzel Decorative', cursive;
          }

          @keyframes logoAnim {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 5px #d4a373);
            }
            50% {
              transform: scale(1.08);
              filter: drop-shadow(0 0 16px #d4a373);
            }
          }

          @keyframes glowPulse {
            0%, 100% {
              text-shadow: 0 0 5px rgba(212,165,116,0.3),
                           0 0 10px rgba(212,165,116,0.2);
            }
            50% {
              text-shadow: 0 0 10px rgba(212,165,116,0.6),
                           0 0 20px rgba(212,165,116,0.4);
            }
          }

          .animate-logo {
            animation: logoAnim 2s infinite;
          }

          .animate-glow {
            animation: glowPulse 2.5s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin 12s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;