import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLoansByUser, updateLoan } from "../services/loans"; // Ensure this path is correct
import { ArrowLeft, Check, X } from "lucide-react";

export default function StaffLoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const adminName = localStorage.getItem("username") || "Admin";

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
                  <td><strong>${loan.amount}</strong></td>
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
                    {loan.status === "Pending" && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(loan.id, "Approved")} disabled={updatingId === loan.id}><Check size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(loan.id, "Rejected")} disabled={updatingId === loan.id}><X size={14} /></button>
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