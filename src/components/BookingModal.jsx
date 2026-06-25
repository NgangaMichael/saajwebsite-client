import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { getFacilities } from "../services/bookings";

export default function BookingModal({ booking, onSave, onClose, submitting }) {
  const [form, setForm] = useState({ title: "", bookingDate: "", startTime: "", endTime: "", facility: "", description: "" });
  const [facilities, setFacilities] = useState([]);

  const todayStr = new Date().toISOString().split("T")[0]; 
  const isReadOnly = booking && booking.status !== "Pending";

  useEffect(() => {
    getFacilities()
      .then((res) => {
        const list = res.data || res;
        setFacilities(list);
        if (list.length > 0 && !booking) {
          setForm(prev => ({ ...prev, facility: list[0].name }));
        }
      })
      .catch(err => console.error(err));
  }, [booking]);

  useEffect(() => {
    if (booking) {
      setForm({
        title: booking.title || "",
        bookingDate: booking.bookingDate || "",
        startTime: booking.startTime || "",
        endTime: booking.endTime || "",
        facility: booking.facility || "",
        description: booking.description || "",
      });
    } else {
      setForm({ title: "", bookingDate: "", startTime: "", endTime: "", facility: facilities[0]?.name || "", description: "" });
    }
  }, [booking, facilities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === "startTime" && updated.endTime && value > updated.endTime) {
        updated.endTime = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the matching facility configuration out along with the form
    const selectedDetails = facilities.find(f => f.name === form.facility);
    onSave(form, selectedDetails?.committee || "Sports");
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
                <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required disabled={isReadOnly} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Facility (Dynamic)</label>
                <select name="facility" className="form-select" value={form.facility} onChange={handleChange} required disabled={isReadOnly}>
                  {facilities.map(f => <option key={f.id} value={f.name}>{f.name} ({f.location})</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Date</label>
                <input type="date" name="bookingDate" className="form-control" min={todayStr} value={form.bookingDate} onChange={handleChange} required disabled={isReadOnly} />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Start Time</label>
                  <input type="time" name="startTime" className="form-control" value={form.startTime} onChange={handleChange} required disabled={isReadOnly} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">End Time</label>
                  <input type="time" name="endTime" className="form-control" min={form.startTime} value={form.endTime} onChange={handleChange} required disabled={isReadOnly} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Purpose / Additional Notes</label>
                <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} disabled={isReadOnly}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={onClose}>Cancel</button>
              {!isReadOnly && <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? "Saving..." : booking ? "Update Booking" : "Submit Booking"}</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}