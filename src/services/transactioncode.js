import api from "./api";

// Get all transactioncodes
export const getTransactioncodes = async () => {
  const res = await api.get("/transactioncodes");
  return res.data;
};

// Get single transactioncode
export const getTransactioncodeById = async (id) => {
  const res = await api.get(`/transactioncodes/${id}`);
  return res.data;
};

// Add transactioncode
export const addTransactioncode = async (committeeData) => {
  const res = await api.post("/transactioncodes", committeeData);
  return res.data;
};

// Update transactioncode
export const updateTransactioncode = async (id, committeeData) => {
  const res = await api.patch(`/transactioncodes/${id}`, committeeData);
  return res.data;
};

// Delete transactioncode
export const deleteTransactioncode = async (id, username) => {
  const res = await api.delete(`/transactioncodes/${id}/${username}`);
  return res.data;
};
