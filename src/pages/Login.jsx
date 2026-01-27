import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import bgImage from "../images/saajimage.avif";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [showPassword, setShowPassword] = useState(false);

  // Registration state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    level: "Level 1",
    maritalStatus: "",
    committee: "",
    subCommittee: "",
    designation: "",
    subscription: "Inactive",
    fileNumber: "",
    membertype: "Direct",
    approveStatus: "Pending",
    waveSubscriptionStatus: "Off",
  });

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });

      localStorage.setItem("auth", "true");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.status === 200) {
      const user = res.data.user;
      console.log("Logged in user:", user);

      if (user.subdate) {
      // Normalize dates to only YYYY-MM-DD
      const todayStr = new Date().toISOString().split("T")[0];
      const subDateStr = new Date(user.subdate).toISOString().split("T")[0];

      const isExpired = subDateStr <= todayStr;

      if (isExpired) {
        try {
          await api.patch(`/users/${user.id}`, {
            approveStatus: "Not Approved",
            subscription: "Inactive",
          });

          user.approveStatus = "Not Approved";
          user.subscription = "Inactive";

          alert("⚠️ Your subscription has expired. Please renew to regain access.");
        } catch (err) {
          console.error("Error updating expired subscription:", err);
        }
      }
    }

  if (user.subscription === "Inactive") {
  alert("Your account is inactive. Please contact admin for renewal.");
  return;
}

  // Save updated user locally
  localStorage.setItem("user", JSON.stringify(user));

  // Navigate based on level
  navigate("/dashboard/profile");
}

    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || "Login failed");
      } else {
        alert("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle registration input change
  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle registration submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", registerData);

      if (res.status === 201 || res.status === 200) {
        alert("✅ Thank you for registering! The admin will review your details.");

        // Reset form
        setRegisterData({
          username: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          level: "Level 1",
          maritalStatus: "",
          committee: "",
          subCommittee: "",
          designation: "Member",
          subscription: "Inactive",
          fileNumber: "",
          membertype: "",
          approveStatus: "Pending",
          waveSubscriptionStatus: "Off",
        });

        // Close modal manually (Bootstrap 5)
        const modalEl = document.getElementById("exampleModal");
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Login Card */}
      <div
        className="shadow-lg rounded-lg p-8 w-full max-w-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      >
        <h2 className="h2 text-center text-success fw-bold">SAAJ NAIROBI</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="position-relative">
            <label className="form-label">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              className="form-control pe-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "38px",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="text-center mt-3 text-primary text-sm"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{ cursor: "pointer" }}
        >
          Don’t have an account? <span className="fw-bold">Register Here</span>
        </p>
      </div>

      {/* Registration Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header position-relative">
              <h1
                className="position-absolute start-50 translate-middle-x text-success fw-bold"
                id="exampleModalLabel"
              >
                SAAJ NAIROBI
              </h1>

              <button
                type="button"
                className="btn-close ms-auto"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div class="modal-body">
            <p>To be added to the system, please send your request to <span className="fw-bold">admin@saaj.co.ke </span>
Our team will review and activate your access. </p>
          </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="absolute bottom-2 text-center text-white w-full"
        style={{ fontSize: "0.8rem" }}
      >
        <p>Copyright &copy; {currentYear} All rights reserved</p>
        <p style={{ marginTop: "-0.3rem" }}>
          Powered by{" "}
          <a
            href="https://www.aptech.co.ke"
            className="fw-bold text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            AP Tech Kenya
          </a>
        </p>
      </footer>
    </div>
  );
}
