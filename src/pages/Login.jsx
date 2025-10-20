import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import bgImage from "../images/saajimage.avif";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

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
        if (user.level === "Level 1") {
          navigate("/dashboard/profile");
        } else {
          navigate("/dashboard/profile");
        }
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

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
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
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Register Here
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={registerData.age}
                      onChange={handleRegisterChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={registerData.gender}
                      onChange={handleRegisterChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={registerData.maritalStatus}
                      onChange={handleRegisterChange}
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option>Single</option>
                      <option>Married</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Member Type</label>
                    <select
                      name="membertype"
                      value={registerData.membertype}
                      onChange={handleRegisterChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option>Direct</option>
                      <option>Indirect</option>
                    </select>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit
                </button>
              </div>
            </form>
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
