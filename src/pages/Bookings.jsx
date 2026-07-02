import React, { useEffect, useState } from "react";
import { Plus, Check, X, Info, Pencil, Building, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { 
  getBookings, 
  applyBooking, 
  updateBookingStatus, 
  getFacilities, 
  createFacility, 
  updateFacility, 
  deleteFacility 
} from "../services/bookings"; 
import { getCommittees } from "../services/committees";
import { getUsers } from "../services/users"; 

import BookingModal from "../components/BookingModal";
import FacilityModal from "../components/FacilityModal";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("bookings"); 
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [staffList, setStaffList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [selectedFacility, setSelectedFacility] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isLevel3 = loggedInUser?.level === "Level 3";
  const isLevel2 = loggedInUser?.level === "Level 2";
  
  // Check if the logged-in user is a Staff member
  const isStaffDesignation = loggedInUser?.designation === "Staff";

  const userCommitteeNorm = loggedInUser?.committee?.toLowerCase() || loggedInUser?.subCommittee?.toLowerCase() || "";
  const hasFacilityAssetAuthority = isLevel3 || (isLevel2 && userCommitteeNorm.trim() !== "");

  const loadData = async () => {
    try {
      const [bookingsData, facilitiesRes, committeesRes, usersRes] = await Promise.all([
        getBookings(),
        getFacilities(),
        getCommittees(),
        getUsers()
      ]);

      setBookings(bookingsData.data || bookingsData);
      setFacilities(facilitiesRes.data || facilitiesRes);
      setCommittees(committeesRes.data || committeesRes);

      const rawUsers = usersRes.data || usersRes;
      const filteredStaff = Array.isArray(rawUsers) 
        ? rawUsers.filter(u => u.designation === "Staff") 
        : [];
      setStaffList(filteredStaff);

    } catch (err) {
      console.error("Error loading panel data:", err);
      toast.error("Failed to load dashboard context records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Booking Lifecycle Handlers ---
  const handleCreateOrUpdateBooking = async (formData) => {
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
          committeeTarget: formData.committee || loggedInUser?.committee || "Sports", 
        };
        await applyBooking(payload);
        toast.success("Booking request submitted successfully!");
      }
      closeModal("bookingModal");
      loadData();
    } catch (err) {
      console.error(err);
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
        loadData();
      } catch (err) {
        console.error(err);
        toast.error("Action failed.");
      }
    }
  };

  // --- Facility Asset Lifecycle Handlers ---
  const handleSaveFacility = async (facilityData) => {
    const incomingCommittee = facilityData.committee?.toLowerCase() || "";
    
    if (isLevel2 && !userCommitteeNorm.includes(incomingCommittee) && !incomingCommittee.includes(userCommitteeNorm)) {
      toast.error(`Unauthorized! You can only configure facilities under your assigned "${loggedInUser?.committee || loggedInUser?.subCommittee}" scope.`);
      return;
    }

    setSubmitting(true);
    try {
      if (selectedFacility) {
        await updateFacility(selectedFacility.id, facilityData);
        toast.success(`Facility "${facilityData.name}" updated successfully.`);
      } else {
        await createFacility(facilityData);
        toast.success("New facility configured successfully!");
      }
      closeModal("facilityModal");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to store facility changes.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFacility = async (facilityId, name) => {
    if (window.confirm(`Are you sure you want to completely drop "${name}" from operational assets?`)) {
      try {
        await deleteFacility(facilityId, loggedInUser?.username);
        toast.success("Facility dropped successfully");
        loadData();
      } catch (err) {
        console.error(err);
        toast.error("Could not complete asset removal.");
      }
    }
  };

  const openEditFacility = (facility) => {
    setSelectedFacility(facility);
    const modalEl = new window.bootstrap.Modal(document.getElementById("facilityModal"));
    modalEl.show();
  };

  const closeModal = (modalId) => {
    if (modalId === "bookingModal") setSelectedBooking(null);
    if (modalId === "facilityModal") setSelectedFacility(null);
    
    const modalEl = document.getElementById(modalId);
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading Bookings Ecosystem...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Dynamic Action Ribbon */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <ul className="nav nav-pills gap-1">
          <li className="nav-item">
            <button 
              className={`btn btn-sm ${activeTab === "bookings" ? "btn-dark active" : "btn-outline-dark"}`} 
              onClick={() => setActiveTab("bookings")}
            >
              Event Allocations
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`btn btn-sm ${activeTab === "facilities" ? "btn-dark active" : "btn-outline-dark"}`} 
              onClick={() => setActiveTab("facilities")}
            >
              Facilities List ({facilities.length})
            </button>
          </li>
        </ul>
        
        <div className="d-flex gap-2">
          {hasFacilityAssetAuthority && (
            <button 
              className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
              data-bs-toggle="modal"
              data-bs-target="#facilityModal"
              onClick={() => setSelectedFacility(null)}
            >
              <Building size={16} /> Create Facility
            </button>
          )}
          
          <button 
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            data-bs-toggle="modal"
            data-bs-target="#bookingModal"
            onClick={() => setSelectedBooking(null)} 
          >
            <Plus size={16} /> Request Booking
          </button>
        </div>
      </div>

      <hr />

      {/* --- RENDER VIEW TAB: BOOKINGS --- */}
      {activeTab === "bookings" && (
        <>
          {isLevel2 && userCommitteeNorm && (
            <div className="alert alert-info d-flex align-items-center gap-2 py-2" role="alert">
              <Info size={18} />
              <div>
                <strong>Committee Filter Active:</strong> You have administrative privileges for items assigned to the <strong>{loggedInUser?.committee || loggedInUser?.subCommittee}</strong> scope. All other records are read-only.
              </div>
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
                  <tr><td colSpan={7} className="text-center text-muted italic py-3">No allocation requests logged.</td></tr>
                ) : (
                  bookings.map((b, idx) => {
                    const isOwner = b.userId === loggedInUser?.id;
                    const isPending = b.status === "Pending";

                    const matchedFacility = facilities.find(
                      (f) => f.name?.toLowerCase() === b.facility?.toLowerCase()
                    );
                    const facilityCommittee = matchedFacility?.committee?.toLowerCase() || "";
                    const bookingDirectCommittee = (b.committeeTarget || b.committee || "").toLowerCase();

                    const isRowCommitteeManager = 
                      userCommitteeNorm && 
                      (userCommitteeNorm.includes(facilityCommittee) || 
                       facilityCommittee.includes(userCommitteeNorm) || 
                       userCommitteeNorm.includes(bookingDirectCommittee) || 
                       bookingDirectCommittee.includes(userCommitteeNorm));

                    // Check if the user is the assigned staff member for this facility
                    const isAssignedFacilityStaff = 
                      isStaffDesignation && 
                      matchedFacility?.staff && 
                      matchedFacility.staff.toLowerCase() === loggedInUser?.username?.toLowerCase();

                    // Rule for full row access (Edit, Accept, Decline)
                    const hasFullRowAccess = isLevel3 || (isLevel2 && isRowCommitteeManager) || isAssignedFacilityStaff;

                    // STRICT RULE: If they are a Staff member, they can ONLY see actions if they are assigned to this facility OR if they created the booking.
                    // Otherwise (Level 2 & Level 3), they always see actions.
                    const canSeeAnyActions = !isStaffDesignation || isAssignedFacilityStaff || isOwner;

                    return (
                      <tr key={b.id || idx}>
                        <td>{idx + 1}</td>
                        <td>{b.username || "System User"}</td>
                        <td>
                          <strong>{b.title}</strong>
                          {b.description && <small className="d-block text-muted">{b.description}</small>}
                        </td>
                        <td>
                          {b.facility}
                          {(matchedFacility || b.committeeTarget) && (
                            <span className="d-block badge bg-light text-secondary border float-start mt-1 font-monospace px-1 py-0.5" style={{ fontSize: "10px" }}>
                              {matchedFacility?.committee || b.committeeTarget}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="d-block text-nowrap">{b.bookingDate}</span>
                          <small className="text-muted">{b.startTime} - {b.endTime}</small>
                        </td>
                        <td>
                          <span className={`badge ${b.status === "Approved" ? "bg-success" : b.status === "Declined" ? "bg-danger" : "bg-warning text-dark"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {canSeeAnyActions ? (
                              <>
                                <button
                                  onClick={() => setSelectedBooking(b)}
                                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                                  data-bs-toggle="modal"
                                  data-bs-target="#bookingModal"
                                >
                                  <Pencil size={14} /> 
                                  {isPending && (isOwner || hasFullRowAccess) ? "Edit" : "View"}
                                </button>

                                {hasFullRowAccess && isPending && (
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
                              </>
                            ) : (
                              <span className="text-muted small italic">Not Allowed</span>
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
        </>
      )}

      {/* --- RENDER VIEW TAB: FACILITIES (CRUD PANEL) --- */}
      {activeTab === "facilities" && (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Asset Identity</th>
                <th>Physical Location Setup</th>
                <th>Oversight Committee Authority</th>
                <th>Allocated Staff Column</th>
                {hasFacilityAssetAuthority && <th className="text-center">Administration Actions</th>}
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan={hasFacilityAssetAuthority ? 6 : 5} className="text-center text-muted italic py-3">
                    No operating facilities registered. Click "Create Facility" to add one.
                  </td>
                </tr>
              ) : (
                facilities.map((f, idx) => {
                  const facilityCommittee = f.committee?.toLowerCase() || "";
                  const canManageAsset = isLevel3 || 
                    (isLevel2 && (userCommitteeNorm.includes(facilityCommittee) || facilityCommittee.includes(userCommitteeNorm)));

                  return (
                    <tr key={f.id || idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{f.name}</strong></td>
                      <td>{f.location}</td>
                      <td><span className="badge bg-info text-dark">{f.committee}</span></td>
                      <td>
                        {f.staff ? (
                          <span className="fw-semibold text-primary">{f.staff}</span>
                        ) : (
                          <span className="text-muted small italic">Vacant</span>
                        )}
                      </td>
                      {hasFacilityAssetAuthority && (
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {canManageAsset ? (
                              <>
                                <button
                                  onClick={() => openEditFacility(f)}
                                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                  title="Modify Facility Metadata"
                                >
                                  <Pencil size={14} /> Update
                                </button>
                                <button
                                  onClick={() => handleDeleteFacility(f.id, f.name)}
                                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                  title="Purge Operational Asset"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </>
                            ) : (
                              <span className="text-muted small italic">Read-Only View</span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <BookingModal 
        booking={selectedBooking} 
        onSave={handleCreateOrUpdateBooking} 
        onClose={() => closeModal("bookingModal")} 
        submitting={submitting} 
      />

      <FacilityModal 
        facility={selectedFacility} 
        committees={committees} 
        staffList={staffList} 
        onSave={handleSaveFacility} 
        onClose={() => closeModal("facilityModal")} 
        submitting={submitting} 
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}