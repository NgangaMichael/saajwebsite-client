import api from "./api"; // import your axios instance

// ------------------ USERS API ------------------

// Get all users
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// Add a new user
export const addUser = async (userData, username) => {
  const res = await api.post("/users", userData, username);
  return res.data;
};

// Update a user
export const updateUser = async (userId, userData, username) => {
  const res = await api.patch(`/users/${userId}/${username}`, userData);
  return res.data;
};

// Delete a user
export const deleteUser = async (userId, username) => {
  const res = await api.delete(`/users/${userId}/${username}`);
  return res.data;
};
