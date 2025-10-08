import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, FileText, Layers, ChevronLeft, ChevronRight, LogOut, Inbox, MessageSquare, Activity, Settings, Users2 } from "lucide-react";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Base navigation items
  const baseNavItems = [
    { to: "profile", label: "Profile", icon: <Settings size={20} />, color: "#228cc5ff" },       // green
    { to: "users", label: "Users", icon: <Users size={20} />, color: "#22c55e" },       // green
    { to: "committees", label: "Committees", icon: <Layers size={20} />, color: "#3b82f6" }, // blue
    { to: "documents", label: "SAAJ Documents", icon: <FileText size={20} />, color: "#f59e0b" }, // amber
    { to: "logs", label: "Logs", icon: <Activity size={20} />, color: "#ec4899" },      // pink
    { to: "communication", label: "Send Messsage", icon: <MessageSquare size={20} />, color: "#8b5cf6" }, // purple
    { to: "inbox", label: "Inbox", icon: <Inbox size={20} />, color: "#06b6d4" },       // cyan
    { to: "staff", label: "Staff", icon: <Users2 size={20} />, color: "#b80c0cff" },       // cyan
  ];


  // Restrict menu based on user level
  const navItems =
    storedUser?.level === "Level 1"
      ? baseNavItems.filter((item) => item.to === "documents") // only documents for Level 1
      : baseNavItems;

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        

        <h4 className="text-center pt-4 fw-bold">SAAJ <span> {!collapsed && (
            <span className="">NAIROBI</span>
          )} </span>
        </h4>
        {/* Nav */}
        <nav className="mt-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{ textDecoration: "none", color: "white" }} //
              className={`flex items-center px-4 py-2 hover:bg-gray-700 rounded transition ${
                location.pathname.includes(item.to) ? "bg-gray-700" : ""
              }`}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.clear(); // clear auth data
              window.location.href = "/login"; // redirect to login
            }}
            className="p-2 m-2 bg-red-700 rounded hover:bg-red-600 flex items-center justify-center"
          >
            <LogOut className="text-white-500 hover:text-white" size={20} />
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
