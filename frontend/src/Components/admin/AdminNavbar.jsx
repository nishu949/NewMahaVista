import React from "react";
import { Bell, User } from "lucide-react";

const AdminNavbar = ({ admin }) => {
  return (
    <header className="h-auto bg-gradient-to-r from-[#fff7df]/90 to-[#f8e8bd]/80 border-b-2 border-amber-300/40 flex items-center justify-between px-8 py-4 backdrop-blur-sm">
      
      {/* REPLACED WITH PAGE HEADER */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#b8860b]">
          <span className="h-2 w-2 rounded-full bg-[#b8860b] animate-pulse" />
          <span className="bg-[#fdf6e8] px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-bold">
            Travel Management
          </span>
        </div>

        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#2c1f0e] font-serif">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-[#8b7355]">
          Monitor your Maharashtra travel platform at a glance.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[#805217] hover:text-[#70420e] transition-all hover:scale-110">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
            <User className="w-4 h-4 text-[#b8860b]" />
          </div>
          <span className="text-[#70420e] text-sm font-bold">
            {admin?.full_name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;