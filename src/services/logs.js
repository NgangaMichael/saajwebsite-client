import api from "./api";

// Get all logs
export const getLogs = async () => {
  const res = await api.get("/logs");
  return res.data;
};

// Get single log
export const getLogById = async (id) => {
  const res = await api.get(`/logs/${id}`);
  return res.data;
};

// Add log
export const addLog = async (committeeData) => {
  const res = await api.post("/logs", committeeData);
  return res.data;
};

// Update log
export const updateLog = async (id, committeeData) => {
  const res = await api.patch(`/logs/${id}`, committeeData);
  return res.data;
};

// Delete log
export const deleteLog = async (id) => {
  const res = await api.delete(`/logs/${id}`);
  return res.data;
};
