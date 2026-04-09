import api from "./api";

/**
 * Get all surveys for a user
 * Backend flags alreadySubmitted
 */
export const getSurveys = async (userId) => {
  const res = await api.get(`/survey?userId=${userId}`);
  return res.data;
};

export const getSurveyById = async (id) => {
  const res = await api.get(`/survey/${id}`);
  return res.data;
};

/**
 * Create survey (Admin)
 */
export const createSurvey = async (payload) => {
  // console.log("Creating survey with payload:", payload);
  const res = await api.post("/survey", payload);
  return res.data;
};

/**
 * Submit survey response (Member)
 */
export const submitSurveyResponse = async (payload) => {
  const res = await api.post("/survey/respond", payload);
  return res.data;
};

/**
 * Update an existing survey (Admin)
 * @param {string|number} id - The Survey ID
 * @param {object} payload - The updated title, description, and questions
 */
export const updateSurvey = async (id, payload) => {
  const res = await api.put(`/survey/${id}`, payload);
  return res.data;
};

/**
 * Delete a survey (Admin)
 * @param {string|number} id - The Survey ID
 */
export const deleteSurvey = async (id) => {
  const res = await api.delete(`/survey/${id}`);
  return res.data;
};