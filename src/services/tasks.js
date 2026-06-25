import axios from "axios";

// Adjust baseUrl if your configuration handles it globally via an instance
const API_URL = "http://localhost:8080/api/tasks";

export const getTasks = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const createTask = async (payload) => {
  const response = await axios.post(API_URL, payload);
  return response.data;
};

export const updateTaskStatus = async (taskId, payload) => {
  const response = await axios.patch(`${API_URL}/${taskId}`, payload);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/${taskId}`);
  return response.data;
};