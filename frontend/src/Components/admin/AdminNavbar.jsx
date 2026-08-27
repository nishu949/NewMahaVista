import React from "react";
import { Bell, User } from "lucide-react";

const AdminNavbar = ({ admin }) => {
  return (
    <header className="h-16 bg-white/5 border-b border-white/10 flex items-center justify-between px-8">
      <div>
        <h2 className="text-white font-semibold">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-emerald-200/60 hover:text-white transition">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-white text-sm font-medium">
            {admin?.full_name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;