import api from "./api";

// Apply for loan
export const applyLoan = async (loanData) => {
  console.log("✅ applyLoan request:", loanData);
  const res = await api.post("/loans", loanData);
  console.log("✅ applyLoan response:", res.data);
  return res.data;
};

// Get all loans
export const getLoans = async () => {
  const res = await api.get("/loans");
  console.log("✅ getLoans response:", res.data);
  return res.data;
};

// Get loans by user
export const getLoansByUser = async (userId) => {
  const res = await api.get(`/loans/user/${userId}`);
  console.log(`✅ getLoansByUser(${userId}) response:`, res.data);
  return res.data;
};

// Update loan status
export const updateLoan = async (loanId, payload) => {
  console.log("🟢 updateLoan payload:", payload);
  const res = await api.patch(`/loans/${loanId}`, payload);
  console.log(`✅ updateLoan(${loanId}) response:`, res.data);
  return res.data;
};

// Delete loan
export const deleteLoan = async (loanId) => {
  const res = await api.delete(`/loans/${loanId}`);
  console.log(`✅ deleteLoan(${loanId}) response:`, res.data);
  return res.data;
};