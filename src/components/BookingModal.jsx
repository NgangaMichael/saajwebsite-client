import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function BookingModal({ 
  booking, 
  onSave, 
  onClose, 
  submitting 
}) {
  const [form, setForm] = useState({
    title: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    facility: "Sports Ground",
    description: "",
  });

  // Check if this booking can be edited (Only editable if new OR still Pending)
  const isReadOnly = booking && booking.status !== "Pending";

  // Sync form state when the active booking changes
  useEffect(() => {
    if (booking) {
      setForm({
        title: booking.title || "",
        bookingDate: booking.bookingDate || "",
        startTime: booking.startTime || "",
        endTime: booking.endTime || "",
        facility: booking.facility || "Sports Ground",
        description: booking.description || "",
      });
    } else {
      // Clear form for fresh new application
      setForm({
        title: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        facility: "Sports Ground",
        description: "",
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 d-flex align-items-center gap-2">
              <Calendar size={20} /> 
              {booking ? `Edit Booking Request (${booking.status})` : "Request Facility Booking"}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {isReadOnly && (
                <div className="alert alert-warning py-2 small mb-3">
                  This request has already been <strong>{booking.status.toLowerCase()}</strong> and can no longer be modified.
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Event / Booking Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g., Staff Football Match"
                  value={form.title}
                  onChange={handleChange}
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Select Facility</label>
                <select
                  name="facility"
                  className="form-select"
                  value={form.facility}
                  onChange={handleChange}
                  required
                  disabled={isReadOnly}
                >
                  <option value="Swimming Pool">Swimming Pool</option>
                  <option value="Multi-Purpose Hall">Multi-Purpose Hall</option>
                  <option value="JIC">JIC</option>
                  <option value="Imambargahs">Imambargahs</option>
                  <option value="Jamaat office Meeting room for Meeting">Jamaat office Meeting room for Meeting</option>
                  <option value="Nairobi Jaffery Sports Club">Nairobi Jaffery Sports Club</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  className="form-control"
                  value={form.bookingDate}
                  onChange={handleChange}
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    className="form-control"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    className="form-control"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Purpose / Additional Notes</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Provide details for the Sports committee review..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={isReadOnly}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={onClose}>
                Cancel
              </button>
              {!isReadOnly && (
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? "Saving..." : booking ? "Update Booking" : "Submit Booking"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}