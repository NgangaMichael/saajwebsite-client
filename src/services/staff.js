import api from "./api";

// Get all staffs
export const getStaffs = async () => {
  const res = await api.get("/staffs");
  return res.data;
};

// Get single staff
export const getStaffById = async (id) => {
  const res = await api.get(`/staffs/${id}`);
  return res.data;
};

// Add staff
export const addStaff = async (committeeData) => {
  const res = await api.post("/staffs", committeeData);
  return res.data;
};

// Update staff
export const updateStaff = async (id, committeeData) => {
  const res = await api.patch(`/staffs/${id}`, committeeData);
  return res.data;
};

// Delete staff
export const deleteStaff = async (id) => {
  const res = await api.delete(`/staffs/${id}`);
  return res.data;
};
