import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { getUsers, addUser as apiAddUser, updateUser, deleteUser as apiDeleteUser } from "../services/users";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit state
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

  // Add state
  const [adding, setAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    level: "",
    maritalStatus: "",
    committee: "",
    subCommittee: "",
    designation: "",
    subscription: "",
    fileNumber: "",
    approveStatus: "",
    waveSubscriptionStatus: "",
  });

  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Edit handlers
  // Edit handlers
const editUser = (user) => {
  setEditingUser(user);
  setFormData({
    username: user.username || "",
    email: user.email || "",
    password: user.password || "",
    age: user.age || "",
    gender: user.gender || "",
    level: user.level || "",
    maritalStatus: user.maritalStatus || "",
    committee: user.committee || "",
    subCommittee: user.subCommittee || "",
    designation: user.designation || "",
    subscription: user.subscription || "",
    fileNumber: user.fileNumber || "",
    approveStatus: user.approveStatus || "",
    waveSubscriptionStatus: user.waveSubscriptionStatus || "",
  });
};


  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveUser = async () => {
    try {
      const data = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? data.data : u))
        );
        closeEditModal();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "" });
  };

  // Add handlers
  const handleAddChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addUser = async () => {
    try {
      const data = await apiAddUser(newUser);
        setUsers((prev) => [...prev, data.data]);
        closeAddModal();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewUser({
      username: "",
      email: "",
      password: "",
      age: "",
      gender: "",
      level: "",
      maritalStatus: "",
      committee: "",
      subCommittee: "",
      designation: "",
      subscription: "",
      fileNumber: "",
      approveStatus: "",
      waveSubscriptionStatus: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div>
        <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>Add User</button>
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="h5">Users</h2>
      </div>

      <hr />
      
     
      {/* Table */}
      <div className="">
        <table className="table">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Username</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Committee</th>
              <th className="px-4 py-3 border">Designation</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 border">{idx+1}</td>
                  <td className="px-4 py-3 border">{user.username}</td>
                  <td className="px-4 py-3 border">{user.email}</td>
                  <td className="px-4 py-3 border">{user.committee || "-"}</td>
                  <td className="px-4 py-3 border">{user.designation || "-"}</td>
                  <td className="px-4 py-3 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border">
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

    </div>
  );
}
