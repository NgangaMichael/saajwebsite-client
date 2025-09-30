import api from "./api"; // import your axios instance

// ------------------ USERS API ------------------

// Get all users
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// Add a new user
export const addUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

// Update a user
export const updateUser = async (userId, userData) => {
  const res = await api.patch(`/users/${userId}`, userData);
  return res.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};
