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
