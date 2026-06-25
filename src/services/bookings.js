import api from "./api";

// Fetch bookings list
export const getBookings = async () => {
  const res = await api.get("/bookings");
  return res.data;
};

// Request a new booking allocation
export const applyBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

// Approve or Decline a booking (Level 2 Committee Action)
export const updateBookingStatus = async (bookingId, statusPayload) => {
  const res = await api.patch(`/bookings/${bookingId}/status`, statusPayload);
  return res.data;
};

// ✅ ADD THESE RUNTIME ASSIGNMENT CALLS TO MAP DYNAMIC FACILITIES
export const getFacilities = async () => {
  const res = await api.get("/facilities");
  return res.data;
};

export const createFacility = async (facilityData) => {
  const res = await api.post("/facilities", facilityData);
  return res.data;
};

export const updateFacility = async (facilityId, facilityData) => {
  const res = await api.patch(`/facilities/${facilityId}`, facilityData);
  return res.data;
};

export const deleteFacility = async (facilityId, username) => {
  const res = await api.delete(`/facilities/${facilityId}/${username}`);
  return res.data;
};