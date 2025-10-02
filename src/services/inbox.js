import api from "./api";

// Get all inboxes
export const getInboxes = async () => {
  const res = await api.get("/inboxes");
  return res.data;
};

// Get single inbox
export const getInboxById = async (id) => {
  const res = await api.get(`/inboxes/${id}`);
  return res.data;
};

// Add inbox
export const addInbox = async (committeeData) => {
  const res = await api.post("/inboxes", committeeData);
  return res.data;
};

// Update inbox
export const updateInbox = async (id, committeeData) => {
  const res = await api.patch(`/inboxes/${id}`, committeeData);
  return res.data;
};

// Delete inbox
export const deleteInbox = async (id) => {
  const res = await api.delete(`/inboxes/${id}`);
  return res.data;
};
