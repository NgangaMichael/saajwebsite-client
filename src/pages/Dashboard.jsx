import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, FileText, Layers, ChevronLeft, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "users", label: "Users", icon: <Users size={20} /> },
    { to: "committees", label: "Committees", icon: <Layers size={20} /> },
    { to: "documents", label: "Documents", icon: <FileText size={20} /> },
  ];

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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
