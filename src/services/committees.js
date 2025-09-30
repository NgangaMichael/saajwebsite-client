import api from "./api";

// Get all committees
export const getCommittees = async () => {
  const res = await api.get("/committees");
  return res.data;
};

// Get single committee
export const getCommitteeById = async (id) => {
  const res = await api.get(`/committees/${id}`);
  return res.data;
};

// Add committee
export const addCommittee = async (committeeData) => {
  const res = await api.post("/committees", committeeData);
  return res.data;
};

// Update committee
export const updateCommittee = async (id, committeeData) => {
  const res = await api.patch(`/committees/${id}`, committeeData);
  return res.data;
};

// Delete committee
export const deleteCommittee = async (id) => {
  const res = await api.delete(`/committees/${id}`);
  return res.data;
};
