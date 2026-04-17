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
export const addService = async (formData) => {
  // Axios will automatically set 'Content-Type': 'multipart/form-data'
  const res = await api.post("/services", formData);
  return res.data;
};

export const updateService = async (id, formData) => {
  const res = await api.patch(`/services/${id}`, formData);
  return res.data;
};

// Delete service
export const deleteService = async (id, username) => {
  const res = await api.delete(`/services/${id}/${username}`);
  return res.data;
};
