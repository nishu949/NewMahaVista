import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MapPin,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
} from "lucide-react";

const AdminSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", path: "/admin/bookings", icon: BookOpen },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Cities", path: "/admin/cities", icon: MapPin },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r-2 border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b-2 border-amber-300/40">
        <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30">
          <Shield className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#70420e]">Admin</h1>
          <p className="text-xs text-[#9a6419]/70">Mystic Trails</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-amber-200/60 text-[#6b3f0d] border-2 border-amber-400/60"
                  : "text-[#805217] hover:bg-amber-100/70 hover:text-[#5d3509]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-8 bg-amber-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-amber-300/40 bg-gradient-to-t from-[#f8e8bd]/50 to-transparent">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#805217] hover:text-red-600 hover:bg-red-50/50 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;