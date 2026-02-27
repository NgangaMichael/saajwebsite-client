import api from "./api";

// Get all services
export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};

// Get single service
export const getServiceById = async (id) => {
  const res = await api.get(`/services/${id}`);
  return res.data;
};

// Add service
export const addService = async (committeeData) => {
  const res = await api.post("/services", committeeData);
  return res.data;
};

// Update service
export const updateService = async (id, committeeData) => {
  const res = await api.patch(`/services/${id}`, committeeData);
  return res.data;
};

// Delete service
export const deleteService = async (id, username) => {
  const res = await api.delete(`/services/${id}/${username}`);
  return res.data;
};
