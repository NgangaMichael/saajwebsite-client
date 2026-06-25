import React, { useState, useEffect } from "react";
import { Building } from "lucide-react";

export default function FacilityModal({ facility, committees = [], onSave, onClose, submitting }) {
  const [form, setForm] = useState({ name: "", location: "", committee: "" });

  // Sync component internal form parameters state
  useEffect(() => {
    if (facility) {
      setForm({
        name: facility.name || "",
        location: facility.location || "",
        committee: facility.committee || (committees[0]?.name || ""),
      });
    } else {
      setForm({
        name: "",
        location: "",
        committee: committees[0]?.name || "",
      });
    }
  }, [facility, committees]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal fade" id="facilityModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 d-flex align-items-center gap-2">
              <Building size={20} /> 
              {facility ? "Edit Operational Asset" : "Create New System Facility"}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Facility Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="e.g., Nyayo Gymnasium" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Physical Location</label>
                <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} required placeholder="e.g., Indoor Arena, Court A" />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Assign Oversight Committee</label>
                <select name="committee" className="form-select" value={form.committee} onChange={handleChange} required>
                  {committees.length === 0 ? (
                    <option value="">No committees found</option>
                  ) : (
                    committees.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success btn-sm" disabled={submitting || committees.length === 0}>
                {submitting ? "Saving..." : facility ? "Update Asset" : "Save Facility"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}