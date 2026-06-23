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
  // expects statusPayload to look like: { status: 'Approved' } or { status: 'Declined' }
  const res = await api.patch(`/bookings/${bookingId}/status`, statusPayload);
  return res.data;
};