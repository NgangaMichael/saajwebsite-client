import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Committees from "../pages/Comittees";
import Documents from "../pages/Documents";
import UserDetails from "../pages/UserDetails";
import CommitteeDetails from "../pages/CommitteeDetails";
import Logs from "../pages/Logs";
import Communication from "../pages/Communication";
import Inbox from "../pages/Inbox";
import Profile from "../pages/Profile";
import Staff from "../pages/Staff";
import StaffLeaveDetails from "../pages/StaffLeaveDetails";
import Subcommittees from "../pages/Subcommittees";
import Homedocs from "../pages/Homedocs";
import StaffLoanDetails from "../pages/StaffLoanDetails";

function PrivateRoute({ children }) {
  // Better: check token instead of "auth"
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Nested inside Dashboard */}
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="committees" element={<Committees />} />
          <Route path="subcommittees" element={<Subcommittees />} />
          <Route path="documents" element={<Documents />} />
          <Route path="homedocs" element={<Homedocs />} />
          <Route path="logs" element={<Logs />} />
          <Route path="communication" element={<Communication />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile" element={<Profile />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/:id" element={<StaffLeaveDetails />} />
          <Route path="staff/loans/:id" element={<StaffLoanDetails />} /> {/* Add this line */}
          <Route path="committees/:id" element={<CommitteeDetails />} />
          <Route
            index
            element={<h2 className="text-xl">Select an option from the sidebar</h2>}
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
