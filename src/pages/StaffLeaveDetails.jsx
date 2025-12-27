import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeavesByStaff, updateLeave } from "../services/staff"; // ✅
import { ArrowLeft, Check, X } from "lucide-react";

export default function StaffLeaveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const adminName = localStorage.getItem("username") || "Admin"; // ✅ fallback

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
                    {leave.status === "Pending" && (
                      <div className="d-flex gap-2">
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
