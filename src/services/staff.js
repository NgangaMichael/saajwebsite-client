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

// ------------------ LEAVE API ------------------

// Apply for leave
export const applyLeave = async (leaveData) => {
  console.log("✅ applyLeave response:", leaveData);
  const res = await api.post("/leaves", leaveData);
  return res.data;
};

// Get all leaves for a staff
export const getLeavesByStaff = async () => {
  const res = await api.get(`/leaves`);
  console.log(`✅ getLeavesByStaff response:`, res.data);
  return res.data;
};

// Approve/Reject leave (for admin side, optional)
// Approve/Reject leave
export const updateLeave = async (leaveId, payload) => {
  console.log("🟢 updateLeave payload:", payload);
  const res = await api.patch(`/leaves/${leaveId}`, payload);
  console.log(`✅ updateLeave(${leaveId}) response:`, res.data);
  return res.data;
};


// Delete leave (optional)
export const deleteLeave = async (leaveId) => {
  const res = await api.delete(`/leaves/${leaveId}`);
  console.log(`✅ deleteLeave(${leaveId}) response:`, res.data);
  return res.data;
};