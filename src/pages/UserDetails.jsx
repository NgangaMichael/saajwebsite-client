import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getTransactioncodes, updateTransactioncode } from "../services/transactioncode";
import { getUserById } from "../services/users";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [loading, setLoading] = useState(true);

  const numericId = Number(id);

  /** ✅ Fetch user info */
  const fetchUser = async () => {
    try {
      const res = await getUserById(numericId);
      setUser(res.user);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Fetch all transactions and filter by user */
  const fetchTransactions = async () => {
    try {
      const res = await getTransactioncodes();
      const userTx = res.data.filter((t) => Number(t.userid) === numericId);
      setTransactions(userTx);
      setFilteredTransactions(userTx);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  /** ✅ Filter transactions by code or receiptno */
  const handleFilterChange = (value) => {
    setFilterValue(value);
    if (!value.trim()) {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (t) =>
          t.code.toLowerCase().includes(value.toLowerCase()) ||
          t.receiptno.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };

  /** ✅ Handle receipt update */
  const handleReceiptSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    try {
      await updateTransactioncode(selectedTransaction.id, { receiptno: receiptNumber });

      // Update in state
      const updated = transactions.map((t) =>
        t.id === selectedTransaction.id ? { ...t, receiptno: receiptNumber } : t
      );
      setTransactions(updated);
      setFilteredTransactions(updated);

      // Reset
      setReceiptNumber("");
      setSelectedTransaction(null);

      // Close modal (Bootstrap CDN version)
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("receiptModal")
      );
      modal.hide();
    } catch (err) {
      console.error("Error updating transaction:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, [numericId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow p-6 max-w-lg mb-5">
        <h4 className="text-2xl font-semibold mb-4">Name: {user.username}</h4>
        <div className="row">
          <div className="col-6">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender || "-"}</p>
              <p><strong>Committee:</strong> {user.committee || "-"}</p>
              <p><strong>Sub-Committee:</strong> {user.subCommittee || "-"}</p>
              <p><strong>Approve Status:</strong> {user.approveStatus || "-"}</p>
          </div>
          <div className="col-6">
              <p><strong>Designation:</strong> {user.designation}</p>
              <p><strong>Marital Status:</strong> {user.maritalStatus || "-"}</p>
              <p><strong>Subscription:</strong> {user.subscription || "-"}</p>
              <p><strong>Membertype:</strong> {user.membertype || "-"}</p>
              <p><strong>File Number:</strong> {user.fileNumber || "-"}</p>
              <p><strong>Expiry Date:</strong> {user.subdate || "-"}</p>
          </div>
        </div>
       
      </div>

      {/* Transaction Section */}
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Transactions</h5>
        </div>

        {/* Filter Input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by code or receipt no..."
            value={filterValue}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Receipt No</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t, index) => (
                  <tr key={t.id}>
                    <td>{index + 1}</td>
                    <td>{t.code}</td>
                    <td>{t.receiptno || "-"}</td>
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#receiptModal"
                        onClick={() => {
                          setSelectedTransaction(t);
                          setReceiptNumber(t.receiptno || "");
                        }}
                      >
                        Add/Edit Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="receiptModal"
        tabIndex="-1"
        aria-labelledby="receiptModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleReceiptSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="receiptModalLabel">
                  {selectedTransaction
                    ? `Update Receipt for Code: ${selectedTransaction.code}`
                    : "Update Receipt Number"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Receipt Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
