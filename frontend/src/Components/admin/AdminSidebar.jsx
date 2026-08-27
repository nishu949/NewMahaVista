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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-900 to-teal-900 border-r border-white/10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="p-2 bg-emerald-500/20 rounded-xl">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Admin</h1>
          <p className="text-xs text-emerald-200/60">Mystic Trails</p>
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
                  ? "bg-emerald-500/20 text-white border border-emerald-500/30"
                  : "text-emerald-200/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-8 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;