import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, FileText, Layers, ChevronLeft, ChevronRight, LogOut, Inbox, MessageSquare, Activity } from "lucide-react";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Base navigation items
  const baseNavItems = [
    { to: "users", label: "Users", icon: <Users size={20} /> },
    { to: "committees", label: "Committees", icon: <Layers size={20} /> },
    { to: "documents", label: "Documents", icon: <FileText size={20} /> },
    { to: "logs", label: "Logs", icon: <Activity size={20} /> },
    { to: "communication", label: "Communication", icon: <MessageSquare size={20} /> },
    { to: "inbox", label: "Inbox", icon: <Inbox size={20} /> },
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
        {/* Collapse Button */}
        <button
          className="p-2 m-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Nav */}
        <nav className="mt-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center px-4 py-2 hover:bg-gray-700 rounded transition ${
                location.pathname.includes(item.to) ? "bg-gray-700" : ""
              }`}
            >
              {item.icon}
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.clear(); // clear auth data
              window.location.href = "/login"; // redirect to login
            }}
            className="mt-auto flex items-center justify-center px-4 py-2 w-full hover:bg-red-600 rounded transition"
          >
            <LogOut className="text-red-500 hover:text-white" size={20} />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
