import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { getSurveys } from "../services/survery";
import { getCommunications } from "../services/communication"; // ✅ Import this
import {
  Users, Puzzle, FileText, Layers, ChevronLeft, ChevronRight,
  LogOut, MessageSquare, Activity, Settings, Users2, List, Server
} from "lucide-react";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [pendingSurveys, setPendingSurveys] = useState(0);
  const [pendingMessages, setPendingMessages] = useState(0); // ✅ New State

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userLevel = storedUser?.level;
  const designation = storedUser?.designation?.toLowerCase();

  const baseNavItems = [
    { to: "profile", label: "Profile", icon: <Settings size={20} />, color: "#228cc5ff" },
    { to: "users", label: "Users", icon: <Users size={20} />, color: "#22c55e" },
    { to: "committees", label: "Sub-Committees", icon: <Layers size={20} />, color: "#3b82f6" },
    { to: "subcommittees", label: "Departments", icon: <Puzzle size={20} />, color: "#ff6e07ff" },
    { to: "homedocs", label: "SAAJ Documents", icon: <FileText size={20} />, color: "#f59e0b" },
    { to: "logs", label: "Logs", icon: <Activity size={20} />, color: "#ec4899" },
    { to: "communication", label: "Messages", icon: <MessageSquare size={20} />, color: "#8b5cf6" },
    { to: "staff", label: "Staff", icon: <Users2 size={20} />, color: "#b80c0cff" },
    { to: "service", label: "Services", icon: <Server size={20} />, color: "rgb(12, 167, 184)" },
    { to: "survey", label: "Survey", icon: <List size={20} />, color: "#b80c6eff" },
  ];

  const isStaffMember = storedUser?.staff === "yes";
  let navItems = [];

  if (isStaffMember) {
    navItems = baseNavItems.filter((item) => ["profile", "staff"].includes(item.to));
  } else {
    if (userLevel === "Level 1") {
      navItems = baseNavItems.filter((item) => ["profile", "homedocs", "committees", "communication", "survey", "service"].includes(item.to));
    } else if (userLevel === "Level 2") {
      navItems = baseNavItems.filter((item) => ["profile", "homedocs", "communication", "committees", "subcommittees", "survey"].includes(item.to));
    } else if (userLevel === "Level 3") {
      navItems = baseNavItems;
    }
  }

  if (designation === "staff" && !navItems.find((i) => i.to === "staff")) {
    navItems.push(baseNavItems.find((i) => i.to === "staff"));
  }

  // ✅ Combined Fetch for Survey & Message Counts
  const fetchCounts = async () => {
    try {
      if (!storedUser?.id) return;

      // 1. Fetch Surveys
      const surveyRes = await getSurveys(storedUser.id);
      setPendingSurveys(surveyRes.data.filter(s => !s.alreadySubmitted).length);

      // 2. Fetch Communications
      const commsRes = await getCommunications();
      const allMessages = commsRes.data || [];
      const readIds = JSON.parse(localStorage.getItem(`read_msgs_${storedUser.id}`)) || [];

      const unreadCount = allMessages.filter((comm) => {
        const isVisible = 
          storedUser.level === "Level 3" ||
          comm.sendto === "All" || 
          comm.sendtoid === "0" ||
          comm.sendtoid == storedUser.id || 
          comm.sendto === storedUser.username ||
          comm.sendto === storedUser.committee;

        const isUnread = !readIds.includes(comm.id) && comm.sender !== storedUser.username;
        return isVisible && isUnread;
      }).length;

      setPendingMessages(unreadCount);
    } catch (err) {
      console.error("Failed to fetch notification counts", err);
    }
  };

  useEffect(() => {
    fetchCounts();
    // Listen for storage changes (when user marks message as read in Communication page)
    window.addEventListener("storage", fetchCounts);
    return () => window.removeEventListener("storage", fetchCounts);
  }, [storedUser?.id]);

  return (
    <div className="h-screen flex">
      <div className={`bg-gray-800 text-white transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-64"}`}>
        <h4 className="text-center pt-4 fw-bold">SAAJ {!collapsed && <span className="text-gray-400">NAIROBI</span>}</h4>

        <nav className="mt-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const currentRoute = location.pathname.split("/")[2];
            const isActive = currentRoute === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ textDecoration: "none", color: "white" }}
                className={`flex items-center px-4 py-2 hover:bg-gray-700 rounded transition relative ${isActive ? "bg-gray-700" : ""}`}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                {!collapsed && (
                  <div className="flex justify-between items-center w-full">
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                    <div className="flex gap-1">
                        {/* Survey Badge */}
                        {item.to === "survey" && pendingSurveys > 0 && (
                        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingSurveys}</span>
                        )}
                        {/* Message Badge ✅ */}
                        {item.to === "communication" && pendingMessages > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingMessages}</span>
                        )}
                    </div>
                  </div>
                )}

                {/* ✅ DOTS IF COLLAPSED */}
                {collapsed && (
                    <>
                        {item.to === "survey" && pendingSurveys > 0 && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-gray-800"></div>
                        )}
                        {item.to === "communication" && pendingMessages > 0 && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border border-gray-800"></div>
                        )}
                    </>
                )}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="p-2 m-2 bg-red-700 rounded hover:bg-red-600 flex items-center justify-center">
          <LogOut size={20} />
        </button>

        <button className="p-2 m-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}