import api from "./api";

// Get all profiles
export const getProfiles = async () => {
  const res = await api.get("/profiles");
  return res.data;
};

// Get single profile
export const getProfileById = async (id) => {
  const res = await api.get(`/profiles/${id}`);
  return res.data;
};

// Add profile
export const addProfile = async (committeeData) => {
  const res = await api.post("/profiles", committeeData);
  return res.data;
};

// Update profile
export const updateProfile = async (id, committeeData) => {
  const res = await api.patch(`/profiles/${id}`, committeeData);
  return res.data;
};

// Delete profile
export const deleteProfile = async (id) => {
  const res = await api.delete(`/profiles/${id}`);
  return res.data;
};
