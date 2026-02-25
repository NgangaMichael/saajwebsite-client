import api from "./api";

// Get all folders
export const getFolders = async () => {
  const res = await api.get("/folders");
  return res.data;
};

// Get single folder
export const getFolderById = async (id) => {
  const res = await api.get(`/folders/${id}`);
  return res.data;
};

// Add folder
export const addFolder = async (committeeData) => {
  const res = await api.post("/folders", committeeData);
  return res.data;
};

// Update folder
export const updateFolder = async (id, committeeData) => {
  const res = await api.patch(`/folders/${id}`, committeeData);
  return res.data;
};

// Delete folder
export const deleteFolder = async (id, username) => {
  const res = await api.delete(`/folders/${id}/${username}`);
  return res.data;
};
