import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { getUsers, addUser as apiAddUser, updateUser, deleteUser as apiDeleteUser } from "../services/users";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit state
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Add these to your state declarations
  const [filters, setFilters] = useState({
    email: "",
    phone: "",
    fileNumber: "",
    committee: "",
    designation: ""
  });

  // Add state
  const [adding, setAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    dob: "",
    idpassport: "",
    nationality: "",
    gender: "",
    level: "",
    staff: "No",
    maritalStatus: "",
    employmentstatus: "",
    occupation: "",
    committee: "",
    subCommittee: "",
    designation: "",
    subscription: "",
    fileNumber: "",
    membertype: "",
    approveStatus: "",
    waveSubscriptionStatus: "",
  });

  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
  try {
    const data = await getUsers();
    
    // ✅ Filter out users who are marked as staff
    // This assumes your staff users have { staff: "Yes" } 
    // or { designation: "Staff" }
    const nonStaffUsers = data.data.filter((user) => {
      const isStaffField = user.staff?.toLowerCase() === "yes";
      const isStaffDesignation = user.designation?.toLowerCase() === "staff";
      
      // Return true only if they are NOT staff
      return !isStaffField && !isStaffDesignation;
    });

    setUsers(nonStaffUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    return (
      (u.username?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (u.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
      (u.phone?.includes(filters.phone)) &&
      (u.fileNumber?.toLowerCase().includes(filters.fileNumber.toLowerCase())) &&
      (filters.committee === "" || u.committee === filters.committee) &&
      (filters.designation === "" || u.designation === filters.designation)
    );
  });

  // Extract unique values for the dropdowns
  const committees = [...new Set(users.map(u => u.committee).filter(Boolean))];
  const designations = [...new Set(users.map(u => u.designation).filter(Boolean))];

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiDeleteUser(id, storedUser.username);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  // Edit handlers
  // Edit handlers
const editUser = (user) => {
  setEditingUser(user);
  setFormData({
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    password: user.password || "",
    age: user.age || "",
    dob: user.dob || "",
    idpassport: user.idpassport || "",
    nationality: user.nationality || "",
    gender: user.gender || "",
    level: user.level || "",
    maritalStatus: user.maritalStatus || "",
    employmentstatus: user.employmentstatus || "",
    occupation: user.occupation || "",
    committee: user.committee || "",
    subCommittee: user.subCommittee || "",
    designation: user.designation || "",
    subscription: user.subscription || "",
    fileNumber: user.fileNumber || "",
    membertype: user.membertype || "",
    approveStatus: user.approveStatus || "",
    waveSubscriptionStatus: user.waveSubscriptionStatus || "",
  });
};


  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveUser = async () => {
    try {
      const data = await updateUser(editingUser.id, formData, storedUser.username);
        setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? data.data : u))
        );
        closeEditModal();
        toast.success(`User "${formData.username}" updated successfully`);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    }
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", phone: "" });
  };

  // Add handlers
  const handleAddChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addUser = async () => {
    try {
      const data = await apiAddUser(newUser, storedUser.username);
        setUsers((prev) => [...prev, data.data]);
        toast.success(`User "${newUser.username}" added successfully`);
        closeAddModal();
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error("Failed to add user");
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewUser({
      username: "",
      email: "",
      phone: "",
      password: "",
      age: "",
      dob: "",
      idpassport: "",
      nationality: "",
      gender: "",
      level: "",
      maritalStatus: "",
      employmentstatus: "",
      occupation: "",
      committee: "",
      subCommittee: "",
      designation: "",
      subscription: "",
      fileNumber: "",
      approveStatus: "",
      waveSubscriptionStatus: "",
    });
  };

  const handleSubscriptionToggle = async (user) => {
  const newStatus = user.subscription === "Active" ? "Inactive" : "Active";

  try {
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, subscription: newStatus } : u
      )
    );

    // Update backend
    await updateUser(user.id, storedUser.username, { subscription: newStatus });
    toast.info(
      `Subscription for ${user.username} set to ${newStatus}`
    );

    console.log(`Subscription for ${user.username} changed to ${newStatus}`);
  } catch (err) {
    console.error("Error updating subscription:", err);
    alert("Failed to update subscription. Please try again.");
    toast.error("Failed to update subscription");

    // Revert UI if update fails
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, subscription: user.subscription } : u
      )
    );
  }
};

const handleDateSelection = async (user, event) => {
  // Get the button position
  const rect = event.currentTarget.getBoundingClientRect();

  // Create an invisible date input
  const input = document.createElement("input");
  input.type = "date";
  input.style.position = "fixed";
  input.style.left = `${rect.right + -90}px`; // appear to the right of the button
  input.style.top = `${rect.top}px`;
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);

  // Open date picker after short delay
  setTimeout(() => (input.showPicker ? input.showPicker() : input.click()), 10);

  input.onchange = async (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      document.body.removeChild(input);
      return;
    }

    const confirmUpdate = window.confirm(
      `Do you want to update ${user.username}'s subdate to ${selectedDate}?`
    );

    if (confirmUpdate) {
      try {
        // Update UI optimistically
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, subdate: selectedDate } : u
          )
        );

        // Backend update
        await updateUser(user.id, { subdate: selectedDate }, storedUser.username);
        console.log(`Subdate for ${user.username} updated to ${selectedDate}`);
      } catch (err) {
        console.error("Error updating subdate:", err);
        alert("Failed to update subdate. Please try again.");

        // Revert on error
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, subdate: user.subdate } : u
          )
        );
      }
    }

    // Cleanup
    document.body.removeChild(input);
  };
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  // Helper to update filter state
  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="">
      {/* Header */}
      {/* Header & Filters */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Users Management</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
            <Plus size={16} className="me-1" /> Add User
          </button>
        </div>

        <div className="row g-2 bg-light p-3 rounded border">
          {/* Username Search */}
          <div className="col-md-2">
            <input
              className="form-control form-control-sm"
              type="text"
              placeholder="Search Username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Email Search */}
          <div className="col-md-2">
            <input
              className="form-control form-control-sm"
              name="email"
              type="text"
              placeholder="Search Email..."
              value={filters.email}
              onChange={handleFilterChange}
            />
          </div>

          {/* Phone Search */}
          <div className="col-md-2">
            <input
              className="form-control form-control-sm"
              name="phone"
              type="text"
              placeholder="Search Phone..."
              value={filters.phone}
              onChange={handleFilterChange}
            />
          </div>

          {/* File Number Search */}
          <div className="col-md-2">
            <input
              className="form-control form-control-sm"
              name="fileNumber"
              type="text"
              placeholder="Member NO..."
              value={filters.fileNumber}
              onChange={handleFilterChange}
            />
          </div>

          {/* Committee Dropdown */}
          <div className="col-md-2">
            <select 
              className="form-select form-select-sm" 
              name="committee" 
              value={filters.committee} 
              onChange={handleFilterChange}
            >
              <option value="">All Committees</option>
              {committees.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Designation Dropdown */}
          <div className="col-md-2">
            <select 
              className="form-select form-select-sm" 
              name="designation" 
              value={filters.designation} 
              onChange={handleFilterChange}
            >
              <option value="">All Designations</option>
              {designations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <hr />
      
     
      {/* Table */}
      <div className="">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Member NO</th>
              <th scope="col">Member</th>
              <th scope="col">Sub-Committee</th>
              <th scope="col">Designation</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 italic">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                >
                  <td>{idx+1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.fileNumber}</td>
                  {/* <td>{user.membertype}</td> */}
                  <td
                    style={{
                      color: user.membertype === "Direct" ? "green" : "red",
                      fontWeight: "500",
                    }}
                  >
                    {user.membertype}
                  </td>
                  <td>{user.committee || "-"}</td>
                  <td>{user.designation || "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`${user.id}`)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => editUser(user)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit user"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" style={{
                          boxShadow: "0 0 5px 2px rgba(0, 123, 255, 0.6)", // Blue glow
                          borderColor: "#007bff", // Optional: blue border
                        }} />
                      </div> */}

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={user.subscription === "Active"}
                          onChange={() => handleSubscriptionToggle(user)}
                          title={user.subscription === "Active" ? "Active" : "Inactive"}
                          style={{
                            boxShadow: user.subscription === "Active"
                              ? "0 0 5px 2px rgba(40, 167, 69, 0.6)" // Green glow when active
                              : "0 0 5px 2px rgba(220, 53, 69, 0.4)", // Red glow when inactive
                            borderColor: user.subscription === "Active" ? "#28a745" : "#dc3545",
                            cursor: "pointer",
                            transform: "scale(1.2)",
                          }}
                        />
                      </div>

                      <div className="position-relative">
                        <button
                          onClick={(e) => handleDateSelection(user, e)}
                          className="btn btn-light border shadow-sm"
                          title="Select and update subdate"
                        >
                          <i className="fa fa-calendar"></i>
                        </button>
                      </div>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
        {adding && (
        <AddUserModal
            newUser={newUser}
            handleAddChange={handleAddChange}
            addUser={addUser}
            closeAddModal={closeAddModal}
        />
        )}

        {/* Edit User Modal */}
        {editingUser && (
        <EditUserModal
            formData={formData}
            handleEditChange={handleEditChange}
            saveUser={saveUser}
            closeEditModal={closeEditModal}
        />
        )}
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
}
