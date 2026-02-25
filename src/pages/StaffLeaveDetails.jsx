import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeavesByStaff, updateLeave, deleteLeave } from "../services/staff";
import { ArrowLeft, Check, X, Pencil, Trash2 } from "lucide-react";

export default function StaffLeaveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const adminName = localStorage.getItem("username") || "Admin";

  const [editingLeave, setEditingLeave] = useState(null); // Track the leave being edited
  const [editFormData, setEditFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  // Open Edit Modal and pre-fill data
  const handleEditClick = (leave) => {
    setEditingLeave(leave);
    setEditFormData({
      leaveType: leave.leaveType,
      startDate: leave.startDate.split('T')[0], // Ensure YYYY-MM-DD format for input
      endDate: leave.endDate.split('T')[0],
      reason: leave.reason
    });
    // If using Bootstrap Modal via ID
    const modal = new window.bootstrap.Modal(document.getElementById('editLeaveModal'));
    modal.show();
  };

  // Submit the updated leave
  const handleUpdateLeave = async (e) => {
    e.preventDefault();
    setUpdatingId(editingLeave.id);
    try {
      await updateLeave(editingLeave.id, editFormData);
      alert("Leave updated successfully!");
      
      // Close modal
      const modalEl = document.getElementById('editLeaveModal');
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      
      fetchLeaves(); // Refresh table
    } catch (err) {
      console.error("Error updating leave:", err);
      alert("Failed to update leave.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Fetch staff leaves
  const fetchLeaves = async () => {
    try {
      const res = await getLeavesByStaff(id);
      console.log('leave details', res);

      // Filter to ensure only leaves matching the URL 'id' are shown
      const filteredData = res.data.filter(leave => Number(leave.userId) === Number(id));
      
      setLeaves(filteredData);
    } catch (err) {
      console.error("Error fetching staff leaves:", err);
      setError("Failed to load leaves.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [id]);

  // ✅ Approve / Reject Leave
  const handleUpdateStatus = async (leaveId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this leave?`)) return;

    setUpdatingId(leaveId);
    try {
      await updateLeave(leaveId, {
        status: newStatus,
        approvedBy: adminName,
      });

      // Refresh the data
      await fetchLeaves();
    } catch (err) {
      console.error("Error updating leave:", err);
      alert("Failed to update leave status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Handle Delete Leave (Level 3 only)
const handleDeleteLeave = async (leaveId) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  
  if (loggedInUser?.level !== "Level 3") {
    alert("Unauthorized: Only Level 3 can delete applications.");
    return;
  }

  if (!window.confirm("Are you sure you want to permanently delete this application?")) return;

  try {
    await deleteLeave(leaveId);
    setLeaves(leaves.filter(l => l.id !== leaveId));
    alert("Leave application deleted.");
  } catch (err) {
    console.error("Error deleting leave:", err);
    alert("Failed to delete leave.");
  }
};

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Leave Applications</h4>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button 
          className="btn btn-success btn-sm" 
          onClick={() => navigate(`/dashboard/staff/loans/${id}`)}
        >
          Loans
        </button>
      </div>

      <hr />

      {loading ? (
        <div className="text-center py-5 text-muted">Loading leave data...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-4 text-muted">
          No leave applications found for this staff.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, idx) => (
                <tr key={leave.id}>
                  <td>{idx + 1}</td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>
                    {(() => {
                      const start = new Date(leave.startDate);
                      const end = new Date(leave.endDate);
                      const diffTime = end - start;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start & end days
                      return diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : "-";
                    })()}
                  </td>
                  <td>{leave.reason || "-"}</td>
                  <td>
                    <span
                      className={`badge text-bg-${
                        leave.status === "Approved"
                          ? "success"
                          : leave.status === "Rejected"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td>{leave.approvedBy || "-"}</td>
                  <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {/* Management Actions (Approve/Reject) */}
                      {leave.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleUpdateStatus(leave.id, "Approved")}
                            disabled={updatingId === leave.id}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleUpdateStatus(leave.id, "Rejected")}
                            disabled={updatingId === leave.id}
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      )}

                      {/* Administrative Actions (Edit/Delete) - Level 3 only */}
                      {JSON.parse(localStorage.getItem("user"))?.level === "Level 3" && (
                        <>
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800 transition bg-transparent border-0 d-flex align-items-center"
                            title="Edit Leave"
                            onClick={() => handleEditClick(leave)} // Updated this
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-800 transition bg-transparent border-0 d-flex align-items-center"
                            title="Delete Leave"
                            onClick={() => handleDeleteLeave(leave.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Edit Leave Modal */}
<div className="modal fade" id="editLeaveModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Edit Leave Application</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form onSubmit={handleUpdateLeave}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Leave Type</label>
            <select 
              className="form-select"
              value={editFormData.leaveType}
              onChange={(e) => setEditFormData({...editFormData, leaveType: e.target.value})}
              required
            >
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Compassionate">Compassionate Leave</option>
              <option value="Study">Study Leave</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input 
              type="date" 
              className="form-control"
              value={editFormData.startDate}
              onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input 
              type="date" 
              className="form-control"
              value={editFormData.endDate}
              onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea 
              className="form-control" 
              rows="3"
              value={editFormData.reason}
              onChange={(e) => setEditFormData({...editFormData, reason: e.target.value})}
              required
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={updatingId !== null}>
            {updatingId !== null ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    </div>
  );
}
