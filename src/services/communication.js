import api from "./api";

// Get all communications
export const getCommunications = async () => {
  const res = await api.get("/communications");
  return res.data;
};

// Get single communication
export const getCommunicationById = async (id) => {
  const res = await api.get(`/communications/${id}`);
  return res.data;
};

// Add communication
export const addCommunication = async (data) => {
  console.log("Adding communication with data:", data);
  const res = await api.post("/communications", data);
  return res.data;
};

// Update communication
export const updateCommunication = async (id, data) => {
  const res = await api.patch(`/communications/${id}`, data);
  return res.data;
};

// Delete communication
export const deleteCommunication = async (id, username) => {
  const res = await api.delete(`/communications/${id}/${username}`);
  return res.data;
};
