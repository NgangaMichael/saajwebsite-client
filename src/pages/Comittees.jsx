// src/pages/Committees.jsx
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCommittees,
  addCommittee as apiAddCommittee,
  updateCommittee,
  deleteCommittee as apiDeleteCommittee,
} from "../services/committees";
import AddCommitteeModal from "../components/AddCommitteeModal";
import EditCommitteeModal from "../components/EditCommitteeModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Committees() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Add state
  const [adding, setAdding] = useState(false);
  const [newCommittee, setNewCommittee] = useState({
    name: "",
    head: "",
    subCommittee: "",
  });

  // Edit state
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    subCommittee: "",
  });

  const navigate = useNavigate();

  // Fetch committees
  const fetchCommittees = async () => {
    try {
      const data = await getCommittees();
      setCommittees(data.data);
    } catch (err) {
      console.error("Error fetching committees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  // Delete
  const deleteCommittee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this committee?")) return;
    try {
      await apiDeleteCommittee(id, storedUser.username);
      setCommittees((prev) => prev.filter((c) => c.id !== id));
          toast.success("Committee deleted successfully");
    } catch (err) {
      console.error("Error deleting committee:", err);
          toast.error("Failed to delete committee");
    }
  };

  // Add
  const handleAddChange = (e) => {
    setNewCommittee((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addCommittee = async () => {
    try {
      const data = await apiAddCommittee(newCommittee);
      setCommittees((prev) => [...prev, data.data]);
          toast.success(`Committee "${newCommittee.name}" created successfully`);
      closeAddModal();
    } catch (err) {
      console.error("Error adding committee:", err);
          toast.error("Failed to create committee");
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewCommittee({
      name: "",
      head: "",
      subCommittee: "",
    });
  };

  // Edit
  const editCommittee = (committee) => {
    setEditingCommittee(committee);
    setFormData({
      name: committee.name || "",
      head: committee.head || "",
      subCommittee: committee.subCommittee || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveCommittee = async () => {
    try {
      const data = await updateCommittee(editingCommittee.id, formData);
      setCommittees((prev) =>
        prev.map((c) => (c.id === editingCommittee.id ? data.data : c))
      );
      closeEditModal();
          toast.success(`Committee "${formData.name}" updated successfully`);
    } catch (err) {
      console.error("Error updating committee:", err);
          toast.error("Failed to update committee");
    }
  };

  const closeEditModal = () => {
    setEditingCommittee(null);
    setFormData({
      name: "",
      head: "",
      subCommittee: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading committees...</p>
      </div>
    );
  }

  const filteredCommittees = committees.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      {/* Header */}
      <div>
        <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>Add Committee</button>
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search by head..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="h5">Committees</h2>
      </div>

      <hr />

      {/* Table */}
      <div className="">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Committee</th>
              <th scope="col">Head</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommittees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No committees found
                </td>
              </tr>
            ) : (
              filteredCommittees.map((committee, idx) => (
                <tr
                  key={committee.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td>{idx+1}</td>
                  <td>{committee.name}</td>
                  <td>{committee.head}</td>
                  <td>{new Date(committee.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`${committee.id}`)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => editCommittee(committee)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit committee"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteCommittee(committee.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete committee"
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

      {/* Add Modal */}
      {adding && (
        <AddCommitteeModal
          newCommittee={newCommittee}
          handleAddChange={handleAddChange}
          addCommittee={addCommittee}
          closeAddModal={closeAddModal}
        />
      )}

      {/* Edit Modal */}
      {editingCommittee && (
        <EditCommitteeModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveCommittee={saveCommittee}
          closeEditModal={closeEditModal}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
