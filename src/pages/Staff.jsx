import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/users";
import { applyLeave } from "../services/staff";

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

  // ✅ Handle leave submission
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return alert("No staff selected!");

    setSubmitting(true);
    try {
      const payload = {
        ...leaveForm,
        userId: selectedStaff.id,
        status: "Pending",
      };

      await applyLeave(payload);
      alert("Leave application submitted successfully!");

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
      alert("Failed to submit leave. Try again.");
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
                  <td>
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
    </div>
  );
}
