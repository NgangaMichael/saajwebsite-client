import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { deleteLoan } from "../services/loans";
import { getLoansByUser, updateLoan } from "../services/loans";
import { ArrowLeft, Check, X } from "lucide-react";

export default function StaffLoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const adminName = localStorage.getItem("username") || "Admin";

  const [editingLoan, setEditingLoan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    purpose: "",
    repaymentMonths: "",
    reason: ""
  });

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // Handle Edit Click
  const handleEditClick = (loan) => {
    setEditingLoan(loan);
    setEditFormData({
      amount: loan.amount,
      purpose: loan.purpose,
      repaymentMonths: loan.repaymentMonths,
      reason: loan.reason || ""
    });
    const modal = new window.bootstrap.Modal(document.getElementById('editLoanModal'));
    modal.show();
  };

  // Submit Update
  const handleUpdateLoan = async (e) => {
    e.preventDefault();
    setUpdatingId(editingLoan.id);
    try {
      await updateLoan(editingLoan.id, editFormData);
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('editLoanModal'));
      modal.hide();
      fetchLoans();
    } catch (err) {
      alert("Failed to update loan.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete
  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm("Are you sure you want to delete this loan application?")) return;
    try {
      await deleteLoan(loanId);
      setLoans(loans.filter(l => l.id !== loanId));
    } catch (err) {
      alert("Failed to delete loan.");
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await getLoansByUser(id);
      // Backend should already filter by userId, but we filter here as a safety net
      const filteredData = res.data.filter(loan => Number(loan.userId) === Number(id));
      setLoans(filteredData);
    } catch (err) {
      console.error("Error fetching staff loans:", err);
      setError("Failed to load loan data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [id]);

  const handleUpdateStatus = async (loanId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this loan?`)) return;
    setUpdatingId(loanId);
    try {
      await updateLoan(loanId, { status: newStatus, approvedBy: adminName });
      await fetchLoans();
    } catch (err) {
      alert("Failed to update loan status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Loan Applications</h4>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <hr />

      {loading ? (
        <div className="text-center py-5 text-muted">Loading loan data...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : loans.length === 0 ? (
        <div className="text-center py-4 text-muted">No loan applications found for this staff.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Repayment (Months)</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, idx) => (
                <tr key={loan.id}>
                  <td>{idx + 1}</td>
                  <td><strong>Ksh: {loan.amount}</strong></td>
                  <td>{loan.purpose}</td>
                  <td>{loan.repaymentMonths}</td>
                  <td>
                    <span className={`badge text-bg-${loan.status === "Approved" ? "success" : loan.status === "Rejected" ? "danger" : "warning"}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td>{loan.approvedBy || "-"}</td>
                  <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {loan.status === "Pending" && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(loan.id, "Approved")} disabled={updatingId === loan.id} title="Approve">
                            <Check size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(loan.id, "Rejected")} disabled={updatingId === loan.id} title="Reject">
                            <X size={14} />
                          </button>
                        </>
                      )}

                      {/* Level 3 Administrative Actions */}
                      {loan.status === "Pending" && loggedInUser?.level === "Level 3" && (
                        <>
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800 transition bg-transparent border-0" 
                            onClick={() => handleEditClick(loan)}
                            title="Edit Loan"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-800 transition bg-transparent border-0" 
                            onClick={() => handleDeleteLoan(loan.id)}
                            title="Delete Loan"
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

      {/* ✅ Edit Loan Modal */}
      <div className="modal fade" id="editLoanModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Loan Application</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateLoan}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purpose</label>
                  <select 
                    className="form-select"
                    value={editFormData.purpose}
                    onChange={(e) => setEditFormData({...editFormData, purpose: e.target.value})}
                    required
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Education">Education</option>
                    <option value="Medical">Medical</option>
                    <option value="Housing">Housing</option>
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Repayment Period (Months)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={editFormData.repaymentMonths}
                    onChange={(e) => setEditFormData({...editFormData, repaymentMonths: e.target.value})}
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