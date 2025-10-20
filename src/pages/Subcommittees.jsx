// src/pages/subcommittees.jsx
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getsubCommittees,
  addsubCommittee as apiAddCommittee,
  updatesubCommittee,
  deletesubCommittee as apiDeleteCommittee,
} from "../services/subcommittees";
import AddSubCommitteeModal from "../components/AddSubcommitteeModel";
import EditSubCommitteeModal from "../components/EditSubcommitteeModel";

export default function Subcommittees() {
  const [subcommittees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Add state
  const [adding, setAdding] = useState(false);
  const [newSubCommittee, setNewCommittee] = useState({
    name: "",
    head: "",
    committee: "",
    totalMembers: "",
    description: "",
  });

  // Edit state
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    committee: "",
    totalMembers: "",
    description: "",
  });

  const navigate = useNavigate();

  // Fetch subcommittees
  const fetchCommittees = async () => {
    try {
      const data = await getsubCommittees();
      setCommittees(data.data);
    } catch (err) {
      console.error("Error fetching subcommittees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  // Delete
  const deletesubCommittee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcommittee?")) return;
    try {
      await apiDeleteCommittee(id, storedUser.username);
      setCommittees((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting subcommittee:", err);
    }
  };

  // Add
  const handleAddChange = (e) => {
    setNewCommittee((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addsubCommittee = async () => {
    try {
      const data = await apiAddCommittee(newSubCommittee);
      setCommittees((prev) => [...prev, data.data]);
      closeAddModal();
    } catch (err) {
      console.error("Error adding subcommittee:", err);
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewCommittee({
      name: "",
      head: "",
      committee: "",
      totalMembers: "",
      description: "",
    });
  };

  // Edit
  const editCommittee = (subcommittee) => {
    setEditingCommittee(subcommittee);
    setFormData({
      name: subcommittee.name || "",
      head: subcommittee.head || "",
      committee: subcommittee.committee || "",
      totalMembers: subcommittee.totalMembers || "",
      description: subcommittee.description || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveSubCommittee = async () => {
    try {
      const data = await updatesubCommittee(editingCommittee.id, formData);
      setCommittees((prev) =>
        prev.map((c) => (c.id === editingCommittee.id ? data.data : c))
      );
      closeEditModal();
    } catch (err) {
      console.error("Error updating subcommittee:", err);
    }
  };

  const closeEditModal = () => {
    setEditingCommittee(null);
    setFormData({
      name: "",
      head: "",
      committee: "",
      totalMembers: "",
      description: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading subcommittees...</p>
      </div>
    );
  }

  const filteredCommittees = subcommittees.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      {/* Header */}
      <div>
        <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>Add Subcommittee</button>
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search by head..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="h5">Subcommittees</h2>
      </div>

      <hr />

      {/* Table */}
      <div className="">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Subcommittee</th>
              <th scope="col">Head</th>
              <th scope="col">Committee</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommittees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No subcommittees found
                </td>
              </tr>
            ) : (
              filteredCommittees.map((subcommittee, idx) => (
                <tr
                  key={subcommittee.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td>{idx+1}</td>
                  <td>{subcommittee.name}</td>
                  <td>{subcommittee.head}</td>
                  <td>{subcommittee.committee}</td>
                  <td>{new Date(subcommittee.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`${subcommittee.id}`)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => editCommittee(subcommittee)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit subcommittee"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deletesubCommittee(subcommittee.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete subcommittee"
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
        <AddSubCommitteeModal
          newSubCommittee={newSubCommittee}
          handleAddChange={handleAddChange}
          addsubCommittee={addsubCommittee}
          closeAddModal={closeAddModal}
        />
      )}

      {/* Edit Modal */}
      {editingCommittee && (
        <EditSubCommitteeModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveSubCommittee={saveSubCommittee}
          closeEditModal={closeEditModal}
        />
      )}
    </div>
  );
}
