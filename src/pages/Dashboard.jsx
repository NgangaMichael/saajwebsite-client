import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Users,
  Puzzle,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Inbox,
  MessageSquare,
  Activity,
  Settings,
  Users2,
  List
} from "lucide-react";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // ✅ Get user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userLevel = storedUser?.level;
  const designation = storedUser?.designation?.toLowerCase(); // e.g. "staff"

  // ✅ Base navigation items
  const baseNavItems = [
    { to: "profile", label: "Profile", icon: <Settings size={20} />, color: "#228cc5ff" },
    { to: "users", label: "Users", icon: <Users size={20} />, color: "#22c55e" },
    { to: "committees", label: "Committees", icon: <Layers size={20} />, color: "#3b82f6" },
    { to: "subcommittees", label: "Sub-Committees", icon: <Puzzle size={20} />, color: "#ff6e07ff" },
    // { to: "documents", label: "SAAJ Documents", icon: <FileText size={20} />, color: "#f59e0b" },
    { to: "homedocs", label: "SAAJ Documents", icon: <FileText size={20} />, color: "#f59e0b" },
    { to: "logs", label: "Logs", icon: <Activity size={20} />, color: "#ec4899" },
    { to: "communication", label: "Send Message", icon: <MessageSquare size={20} />, color: "#8b5cf6" },
    // { to: "inbox", label: "Inbox", icon: <Inbox size={20} />, color: "#06b6d4" },
    { to: "staff", label: "Staff", icon: <Users2 size={20} />, color: "#b80c0cff" },
    { to: "survey", label: "Survey", icon: <List size={20} />, color: "#b80c6eff" },
  ];

  // ✅ Filter items based on level
  let navItems = [];

  if (userLevel === "Level 1") {
    navItems = baseNavItems.filter(
      (item) =>
        ["profile", "documents", "communication", "inbox"].includes(item.to)
    );
  } else if (userLevel === "Level 2") {
    navItems = baseNavItems.filter(
      (item) =>
        ["profile", "documents", "communication", "inbox", "committees", "subcommittees"].includes(item.to)
    );
  } else if (userLevel === "Level 3") {
    navItems = baseNavItems; // show all
  }

  // ✅ Add "Staff" only if designation is staff (for all levels)
  if (designation === "staff" && !navItems.find((i) => i.to === "staff")) {
    navItems.push(baseNavItems.find((i) => i.to === "staff"));
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <h4 className="text-center pt-4 fw-bold">
          SAAJ{" "}
          {!collapsed && (
            <span className="text-gray-400">NAIROBI</span>
          )}
        </h4>

        {/* Navigation */}
        <nav className="mt-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const currentRoute = location.pathname.split("/")[2];
            const isActive = currentRoute === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ textDecoration: "none", color: "white" }}
                className={`flex items-center px-4 py-2 hover:bg-gray-700 rounded transition ${
                  isActive ? "bg-gray-700" : ""
                }`}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="p-2 m-2 bg-red-700 rounded hover:bg-red-600 flex items-center justify-center"
        >
          <LogOut size={20} />
        </button>

        {/* Collapse Button */}
        <button
          className="p-2 m-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
