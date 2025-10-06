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

export default function Committees() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add state
  const [adding, setAdding] = useState(false);
  const [newCommittee, setNewCommittee] = useState({
    name: "",
    head: "",
    subCommittee: "",
    totalMembers: "",
    description: "",
  });

  // Edit state
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    subCommittee: "",
    totalMembers: "",
    description: "",
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
      await apiDeleteCommittee(id);
      setCommittees((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting committee:", err);
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
      closeAddModal();
    } catch (err) {
      console.error("Error adding committee:", err);
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewCommittee({
      name: "",
      head: "",
      subCommittee: "",
      totalMembers: "",
      description: "",
    });
  };

  // Edit
  const editCommittee = (committee) => {
    setEditingCommittee(committee);
    setFormData({
      name: committee.name || "",
      head: committee.head || "",
      subCommittee: committee.subCommittee || "",
      totalMembers: committee.totalMembers || "",
      description: committee.description || "",
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
    } catch (err) {
      console.error("Error updating committee:", err);
    }
  };

  const closeEditModal = () => {
    setEditingCommittee(null);
    setFormData({
      name: "",
      head: "",
      subCommittee: "",
      totalMembers: "",
      description: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading committees...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Committees</h2>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={18} /> Add Committee
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Head</th>
              <th className="px-4 py-3 border">Members</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {committees.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  No committees found
                </td>
              </tr>
            ) : (
              committees.map((committee, idx) => (
                <tr
                  key={committee.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 border">{idx+1}</td>
                  <td className="px-4 py-3 border">{committee.name}</td>
                  <td className="px-4 py-3 border">{committee.head}</td>
                  <td className="px-4 py-3 border">{committee.totalMembers || "-"}</td>
                  <td className="px-4 py-3 border">
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
    </div>
  );
}
