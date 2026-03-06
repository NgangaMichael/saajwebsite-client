import React, { useEffect, useState } from "react";
import { Eye, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers, addUser as apiAddUser, deleteUser, updateUser } from "../services/users";
import AddUserModal from "../components/AddUserModal";
import { applyLeave } from "../services/staff";
import { applyLoan } from "../services/loans";
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
    days: "",
  });
  const [adding, setAdding] = useState(false);

  const [loanForm, setLoanForm] = useState({
    amount: "",
    purpose: "",
    repaymentMonths: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  const [newStaff, setNewStaff] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    dob: "",
    idpassport: "",
    nationality: "",
    gender: "",
    level: "Level 1",
    maritalStatus: "",
    employmentstatus: "Employed",
    occupation: "",
    committee: "",
    subCommittee: "",
    designation: "Staff", // ✅ Automatically set to Staff
    staff: "yes",
    subscription: "Active",
    membertype: "Direct",
    fileNumber: "",
    approveStatus: "Approved",
    waveSubscriptionStatus: "No",
  });

  const navigate = useNavigate();

  // ✅ Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch staff users
  const fetchUsers = async () => {
  try {
    const data = await getUsers();
    const staffUsers = data.data.filter((user) => user.designation === "Staff");

    // ✅ Logic Update: Level 3 Staff can see everyone, lower levels see only self
    if (loggedInUser?.designation === "Staff" && loggedInUser?.level !== "Level 3") {
      const self = staffUsers.filter((u) => u.id === loggedInUser.id);
      setUsers(self);
    } else {
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
        days: "",
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

  // Handle Input Changes
  const handleAddChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  // Submit New Staff
  const saveNewStaff = async () => {
    try {
      const response = await apiAddUser(newStaff);
      setUsers((prev) => [...prev, response.data]);
      toast.success("Staff member created successfully!");
      setAdding(false);
      // Reset form
      setNewStaff({ ...newStaff, username: "", email: "", password: "", phone: "" }); 
    } catch (err) {
      console.error("Error adding staff:", err);
      toast.error("Failed to create staff member");
    }
  };

  // ✅ Handle Delete Staff
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this staff member?")) {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("Staff member deleted successfully");
    } catch (err) {
      console.error("Error deleting staff:", err);
      toast.error("Failed to delete staff member");
    }
  }
};

// ✅ Handle Update Staff
const handleUpdateStaff = async () => {
  try {
    const response = await updateUser(editStaff.id, editStaff);
    setUsers(users.map((u) => (u.id === editStaff.id ? response.data : u)));
    toast.success("Staff updated successfully!");
    setEditing(false);
  } catch (err) {
    console.error("Error updating staff:", err);
    toast.error("Failed to update staff");
  }
};

  return (
    <div>
      {/* Header */}
      <div>
          {(loggedInUser?.designation !== "Staff" || loggedInUser?.level === "Level 3") && (
          <div> 
            <input
              className="form-control float-end w-25 form-control-sm mx-2"
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 float-end" onClick={() => setAdding(true)}>
              <Plus size={16} /> Add Staff
            </button>
          </div>
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

                      {/* ✅ Edit Button */}
                      {/* ✅ Only Level 3 can Edit */}
                        {loggedInUser?.level === "Level 3" && (
                          <button
                            onClick={() => {
                              setEditStaff(user);
                              setEditing(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit Staff"
                          >
                            <Pencil size={18} />
                          </button>
                        )}

                        {/* ✅ Only Level 3 can Delete */}
                        {loggedInUser?.level === "Level 3" && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete Staff"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#leaveModal"
                        onClick={() => setSelectedStaff(user)}
                      >
                        Leave
                      </button>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#loanModal"
                        onClick={() => setSelectedStaff(user)}
                      >
                        Loan
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
                  <label className="form-label fw-semibold">Total Days (Manual)</label>
                  <input
                    type="number"
                    name="days"
                    className="form-control"
                    placeholder="e.g. 5"
                    value={leaveForm.days}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">You can manually adjust this if needed.</small>
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

      {adding && (
        <AddUserModal
          newUser={newStaff}
          handleAddChange={handleAddChange}
          addUser={saveNewStaff}
          closeAddModal={() => setAdding(false)}
        />
      )}

      {/* ✅ Edit Modal (Assuming AddUserModal can be repurposed) */}
      {editing && (
        <AddUserModal
          newUser={editStaff}
          isEditing={true} // You might need to add this prop to your modal
          handleAddChange={(e) => setEditStaff({ ...editStaff, [e.target.name]: e.target.value })}
          addUser={handleUpdateStaff}
          closeAddModal={() => setEditing(false)}
        />
      )}
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
