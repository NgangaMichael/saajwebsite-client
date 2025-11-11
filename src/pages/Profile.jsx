import React, { useEffect, useState } from "react";
import { addTransactioncode } from "../services/transactioncode";
import money from "../images/money.avif";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const currentYear = new Date().getFullYear();

  const [transactionCode, setTransactionCode] = useState(""); // for input value
  const [loading, setLoading] = useState(false); // for loading spinner
  const [message, setMessage] = useState(""); // for success/error message


  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = () => {
    setUser(formData);
    localStorage.setItem("user", JSON.stringify(formData));
    setShowEditModal(false);
  };

  // ✅ Submit transaction code
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!transactionCode.trim()) {
      setMessage("Please enter a transaction code.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Send { userid, code } to backend
      const payload = {
        userid: user.id, // assuming your user object has an id
        code: transactionCode,
      };

      await addTransactioncode(payload);

      setMessage("✅ Transaction submitted successfully!");
      setTransactionCode(""); // clear input
      setTimeout(() => {
        setShowMoneyModal(false);
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit transaction. Try again.");
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div className="position-relative min-vh-100 d-flex flex-column justify-content-between">
      <div className="container">
        {/* Header */}
        <div>
          <button
            className="btn btn-primary btn-sm float-end"
            onClick={() => setShowMoneyModal(true)}
          >
            Pay Lawajam
          </button>
          <h2 className="h5">My Profile</h2>
        </div>

        <hr />

        {/* Profile Card */}
        <div className="card border-0 shadow-lg rounded-4 p-4">
          <div className="row">
            {/* Profile Picture */}
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center text-center">
              <img
                src="https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=870&auto=format&fit=crop"
                alt="Profile"
                className="rounded-circle border border-3 border-primary shadow-sm"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <h5 className="mt-3 mb-0 text-primary fw-bold">{user.designation}</h5>
              <small className="text-muted fw-bold">{user.username}</small>
            </div>

            {/* Details Section */}
            <div className="col-md-8">
              <div className="card border-0 bg-light p-3 rounded-3 shadow-sm">
                {[
                  { label: "Email", key: "email" },
                  { label: "Designation", key: "designation" },
                  { label: "Level", key: "level" },
                  { label: "Age", key: "age" },
                  { label: "File Number", key: "fileNumber" },
                  { label: "Gender", key: "gender" },
                  { label: "Marital Status", key: "maritalStatus" },
                  { label: "Name", key: "username" },
                  { label: "Comittee", key: "committee" },
                  { label: "Sub-Committee", key: "subCommittee" },
                ].map((item) => (
                  <div className="row mb-2" key={item.key}>
                    <div className="col-sm-4 fw-semibold text-secondary">
                      {item.label}:
                    </div>
                    <div className="col-sm-8">{user[item.key]}</div>
                  </div>
                ))}

                <div className="row mb-2">
                  <div className="col-sm-4 fw-semibold text-secondary">
                    Subscription:
                  </div>
                  <div className="col-sm-8">
                    <span
                      className={`badge ${
                        user.subscription === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {user.subscription}
                    </span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-sm-4 fw-semibold text-secondary">
                    Subscription renewal Date:
                  </div>
                  <div className="col-sm-8">
                    <p className="text-primary fw-bold">
                      {new Date(
                        new Date().getFullYear() + 1,
                        0,
                        1
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-4 fw-semibold text-secondary">
                    Approval Status:
                  </div>
                  <div className="col-sm-8">
                    <span
                      className={`badge ${
                        user.approveStatus === "Approved"
                          ? "bg-primary"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {user.approveStatus}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-outline-primary px-4"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger px-4"
                    onClick={() => {
                      localStorage.clear(); // clear auth data
                      window.location.href = "/login"; // redirect to login
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💰 Money Modal */}
      {showMoneyModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pay Lawajam Via Mpesa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowMoneyModal(false)}
                ></button>
              </div>
              <div
                className="modal-body text-center text-light"
                style={{ backgroundColor: "green" }}
              >
                <h2>Paybill: 4182843</h2>
                <h2>Account: “Lawajam”</h2>

                <form onSubmit={handleTransactionSubmit}>
                  <div className="mb-3 text-start">
                    <label htmlFor="code" className="form-label">
                      Transaction Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                      placeholder="Enter Mpesa code"
                    />
                  </div>

                  {message && (
                    <p
                      className={`fw-bold ${
                        message.includes("✅") ? "text-light" : "text-warning"
                      }`}
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus || ""}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="text-center"
        style={{
          fontSize: "0.8rem",
        }}
      >
        <p className="mb-1">
          Copyright &copy; {currentYear} All rights reserved
        </p>
        <p className="mb-0" style={{ marginTop: "-0.3rem" }}>
          Powered by{" "}
          <a
            href="https://www.aptech.co.ke"
            className="fw-bold"
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
