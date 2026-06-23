import React, { useEffect, useState } from "react";
import { Plus, Check, X, Info, Pencil } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getBookings, applyBooking, updateBookingStatus } from "../services/bookings"; 
import BookingModal from "../components/BookingModal";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); 

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  
  // ✅ Level 2 + (Sports OR Community Recreational Facilities)
  // ✅ Level 2 + Target Committee Check (handles the combined string accurately)
  const hasTargetCommittee = 
    ["sports", "community recreational facilities", "sports and community recreational facilities"].includes(loggedInUser?.committee?.toLowerCase()) ||
    ["sports", "community recreational facilities", "sports and community recreational facilities"].includes(loggedInUser?.subCommittee?.toLowerCase());

  const isAuthorizedReviewer = loggedInUser?.level === "Level 2" && hasTargetCommittee;

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      const rawList = data.data || data;
      
      // ✅ Everyone sees all bookings now
      setBookings(rawList);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedBooking) {
        await updateBookingStatus(selectedBooking.id, { ...formData });
        toast.success("Booking request altered successfully!");
      } else {
        const payload = {
          ...formData,
          userId: loggedInUser?.id,
          username: loggedInUser?.username,
          status: "Pending",
          committeeTarget: loggedInUser?.committee || "Sports", 
        };
        await applyBooking(payload);
        toast.success("Booking request submitted successfully!");
      }

      const modalEl = document.getElementById("bookingModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error("Persistence Error:", err);
      toast.error("Failed to save booking request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) {
      try {
        await updateBookingStatus(bookingId, { status: newStatus });
        toast.success(`Booking ${newStatus} successfully!`);
        fetchBookings();
      } catch (err) {
        console.error("Status error:", err);
        toast.error("Action failed.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading Bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Bookings Management</h2>
        
        <button 
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          data-bs-toggle="modal"
          data-bs-target="#bookingModal"
          onClick={() => setSelectedBooking(null)} 
        >
          <Plus size={16} /> Request Booking
        </button>
      </div>

      <hr />

      {/* ✅ Banner shows for either eligible committee */}
      {isAuthorizedReviewer && (
        <div className="alert alert-info d-flex align-items-center gap-2 py-2" role="alert">
          <Info size={18} />
          <div><strong>Committee Reviewer View:</strong> You are authorized to Accept or Decline pending applications.</div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Applicant</th>
              <th>Event Title</th>
              <th>Facility</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted italic py-3">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b, idx) => {
                // ✅ Check ownership dynamically for editing rights
                const isOwner = b.userId === loggedInUser?.id;

                return (
                  <tr key={b.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{b.username || "System User"}</td>
                    <td>
                      <strong>{b.title}</strong>
                      {b.description && <small className="d-block text-muted">{b.description}</small>}
                    </td>
                    <td>{b.facility}</td>
                    <td>
                      <span className="d-block text-nowrap">{b.bookingDate}</span>
                      <small className="text-muted">{b.startTime} - {b.endTime}</small>
                    </td>
                    <td>
                      <span className={`badge ${
                        b.status === "Approved" ? "bg-success" : 
                        b.status === "Declined" ? "bg-danger" : "bg-warning text-dark"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {/* Users can view any record, but edit only their own pending requests */}
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          data-bs-toggle="modal"
                          data-bs-target="#bookingModal"
                          title={isOwner && b.status === "Pending" ? "Edit Request" : "View Details"}
                        >
                          <Pencil size={14} /> {isOwner && b.status === "Pending" ? "Edit" : "View"}
                        </button>

                        {/* ✅ Resolution Controls restricted to L2 + targeted committees */}
                        {isAuthorizedReviewer && b.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(b.id, "Approved")}
                              className="btn btn-success btn-sm d-flex align-items-center gap-1"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(b.id, "Declined")}
                              className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            >
                              <X size={14} /> Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BookingModal 
        booking={selectedBooking}
        onSave={handleCreateOrUpdate}
        onClose={() => setSelectedBooking(null)}
        submitting={submitting}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}