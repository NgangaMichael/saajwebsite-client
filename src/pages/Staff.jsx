import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/users";
import { applyLeave } from "../services/staff";
import { applyLoan } from "../services/loans";  // ✅ Import from loans service
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loanForm, setLoanForm] = useState({
    amount: "",
    purpose: "",
    repaymentMonths: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // ✅ Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch staff users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      const staffUsers = data.data.filter((user) => user.designation === "Staff");

      // ✅ Filter based on logged-in user's designation
      if (loggedInUser?.designation === "Staff") {
        // Show only the logged-in staff
        const self = staffUsers.filter((u) => u.id === loggedInUser.id);
        setUsers(self);
      } else {
        // Admin or higher-level users see all staff
        setUsers(staffUsers);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle form input
  const handleChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleLoanChange = (e) => {
    setLoanForm({ ...loanForm, [e.target.name]: e.target.value });
  };

  const handleSubmitLoan = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      toast.error("No staff selected");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: selectedStaff.id,
        amount: parseFloat(loanForm.amount),
        purpose: loanForm.purpose,
        repaymentMonths: parseInt(loanForm.repaymentMonths),
        reason: loanForm.reason,
        status: "Pending",
      };

      await applyLoan(payload);
      toast.success("Loan application submitted successfully");

      setLoanForm({
        amount: "",
        purpose: "",
        repaymentMonths: "",
        reason: "",
      });

      const modalEl = document.getElementById("loanModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error("Error submitting loan:", err);
      toast.error("Failed to submit loan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle leave submission
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      toast.error("No staff selected");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...leaveForm,
        userId: selectedStaff.id,
        status: "Pending",
      };

      await applyLeave(payload);
      toast.success("Leave application submitted successfully");

      setLeaveForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      // ✅ Close modal manually
      const modalEl = document.getElementById("leaveModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error("Error submitting leave:", err);
      toast.error("Failed to submit leave. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading Staff...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        {loggedInUser?.designation !== "Staff" && (
          <input
            className="form-control float-end w-25 form-control-sm mx-2"
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        <h2 className="h5">Staff</h2>
      </div>

      <hr />

      {/* Table */}
      <div>
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 italic">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.designation || "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  {/* <td>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/staff/${user.id}`)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#leaveModal"
                        onClick={() => setSelectedStaff(user)}
                      >
                        Apply Leave
                      </button>
                    </div>
                  </td> */}

                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/staff/${user.id}`)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#leaveModal"
                        onClick={() => setSelectedStaff(user)}
                      >
                        Apply Leave
                      </button>

                      {/* ✅ NEW: Apply Loan Button */}
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#loanModal"
                        onClick={() => setSelectedStaff(user)}
                      >
                        Apply Loan
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Apply Leave Modal */}
      <div
        className="modal fade"
        id="leaveModal"
        tabIndex="-1"
        aria-labelledby="leaveModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="leaveModalLabel">
                Apply for Leave
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmitLeave}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Leave Type</label>
                  <select
                    name="leaveType"
                    className="form-select"
                    value={leaveForm.leaveType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Leave Type --</option>
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Maternity">Maternity Leave</option>
                    <option value="Compassionate">Compassionate Leave</option>
                    <option value="Study">Study Leave</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={leaveForm.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control"
                    value={leaveForm.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Reason</label>
                  <textarea
                    name="reason"
                    className="form-control"
                    rows="3"
                    placeholder="State your reason for leave..."
                    value={leaveForm.reason}
                    onChange={handleChange}
                    required
                  ></textarea>
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
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Apply Loan Modal */}
      <div
        className="modal fade"
        id="loanModal"
        tabIndex="-1"
        aria-labelledby="loanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="loanModalLabel">
                Apply for Loan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmitLoan}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Loan Amount (KES)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    placeholder="Enter amount (e.g., 50000)"
                    value={loanForm.amount}
                    onChange={handleLoanChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Purpose</label>
                  <select
                    name="purpose"
                    className="form-select"
                    value={loanForm.purpose}
                    onChange={handleLoanChange}
                    required
                  >
                    <option value="">-- Select Purpose --</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Education">Education</option>
                    <option value="Medical">Medical</option>
                    <option value="Housing">Housing</option>
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Repayment Period (Months)</label>
                  <input
                    type="number"
                    name="repaymentMonths"
                    className="form-control"
                    placeholder="Enter number of months (e.g., 12)"
                    value={loanForm.repaymentMonths}
                    onChange={handleLoanChange}
                    min="1"
                    max="60"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Reason</label>
                  <textarea
                    name="reason"
                    className="form-control"
                    rows="3"
                    placeholder="Provide details about why you need this loan..."
                    value={loanForm.reason}
                    onChange={handleLoanChange}
                    required
                  ></textarea>
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
                <button
                  type="submit"
                  className="btn btn-success btn-sm"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Loan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
