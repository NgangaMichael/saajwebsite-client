import api from "./api";

// Get all subcommittees
export const getsubCommittees = async () => {
  const res = await api.get("/subcommittees");
  return res.data;
};

// Get single subcommittee
export const getsubCommitteeById = async (id) => {
  const res = await api.get(`/subcommittees/${id}`);
  return res.data;
};

// Add subcommittee
export const addsubCommittee = async (committeeData) => {
  const res = await api.post("/subcommittees", committeeData);
  return res.data;
};

// Update subcommittee
export const updatesubCommittee = async (id, committeeData) => {
  const res = await api.patch(`/subcommittees/${id}`, committeeData);
  return res.data;
};

// Delete subcommittee
export const deletesubCommittee = async (id, username) => {
  const res = await api.delete(`/subcommittees/${id}/${username}`);
  return res.data;
};
