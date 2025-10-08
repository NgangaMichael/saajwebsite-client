import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import {
  getCommunications,
  addCommunication as apiAddCommunication,
  updateCommunication,
  deleteCommunication as apiDeleteCommunication,
} from "../services/communication";
import AddCommunicationModal from "../components/AddCommunicationModal";
import EditCommunicationModal from "../components/EditCommunicationModal";

export default function Communication() {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add state
  const [adding, setAdding] = useState(false);
  const [newComm, setNewComm] = useState({
    memberNumber: "",
    title: "",
    info: "",
    level: "low",
    postedBy: "",
    to: "",
  });

  // Edit state
  const [editingComm, setEditingComm] = useState(null);
  const [formData, setFormData] = useState({
    memberNumber: "",
    title: "",
    info: "",
    level: "low",
    postedBy: "",
    to: "",
  });

  // View state
  const [viewingComm, setViewingComm] = useState(null);

  // Fetch communications
  const fetchCommunications = async () => {
    try {
      const data = await getCommunications();
      setCommunications(data.data);
    } catch (err) {
      console.error("Error fetching communications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, []);

  // Delete
  const deleteComm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this communication?")) return;
    try {
      await apiDeleteCommunication(id);
      setCommunications((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting communication:", err);
    }
  };

  // Add
  const handleAddChange = (e) => {
    setNewComm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addComm = async () => {
    try {
      const data = await apiAddCommunication(newComm);
      setCommunications((prev) => [...prev, data.data]);
      closeAddModal();
    } catch (err) {
      console.error("Error adding communication:", err);
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewComm({
      memberNumber: "",
      title: "",
      info: "",
      level: "low",
      postedBy: "",
      to: "",
    });
  };

  // Edit
  const editComm = (comm) => {
    setEditingComm(comm);
    setFormData({
      memberNumber: comm.memberNumber || "",
      title: comm.title || "",
      info: comm.info || "",
      level: comm.level || "low",
      postedBy: comm.postedBy || "",
      to: comm.to || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveComm = async () => {
    try {
      const data = await updateCommunication(editingComm.id, formData);
      setCommunications((prev) =>
        prev.map((c) => (c.id === editingComm.id ? data.data : c))
      );
      closeEditModal();
    } catch (err) {
      console.error("Error updating communication:", err);
    }
  };

  const closeEditModal = () => {
    setEditingComm(null);
    setFormData({
      memberNumber: "",
      title: "",
      info: "",
      level: "low",
      postedBy: "",
      to: "",
    });
  };

  // View
  const viewComm = (comm) => {
    setViewingComm(comm);
  };

  const closeViewModal = () => {
    setViewingComm(null);
  };

  const filteredCommunications = communications.filter((u) =>
    u.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading communications...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div>
        <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>Add Communication</button>
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="h5">Inbox</h2>
      </div>

      <hr />

      <div className="">
        <table className="table">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Title</th>
              <th className="px-4 py-3 border">Level</th>
              <th className="px-4 py-3 border">To</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  No communications found
                </td>
              </tr>
            ) : (
              filteredCommunications.map((comm, idx) => (
                <tr
                  key={comm.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 border">{idx+1}</td>
                  <td className="px-4 py-3 border">{comm.title}</td>
                  <td className="px-4 py-3 border">{comm.level}</td>
                  <td className="px-4 py-3 border">{comm.to}</td>
                  <td className="px-4 py-3 border">{new Date(comm.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => viewComm(comm)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View communication"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => editComm(comm)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit communication"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteComm(comm.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete communication"
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
        <AddCommunicationModal
          newComm={newComm}
          handleAddChange={handleAddChange}
          addComm={addComm}
          closeAddModal={closeAddModal}
        />
      )}

      {/* Edit Modal */}
      {editingComm && (
        <EditCommunicationModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveComm={saveComm}
          closeEditModal={closeEditModal}
        />
      )}

      {/* View Modal */}
      {viewingComm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Communication Details</h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold">Member Number:</label>
                <p>{viewingComm.memberNumber}</p>
              </div>
              <div>
                <label className="font-semibold">Title:</label>
                <p>{viewingComm.title}</p>
              </div>
              <div>
                <label className="font-semibold">Info:</label>
                <p className="whitespace-pre-wrap">{viewingComm.info}</p>
              </div>
              <div>
                <label className="font-semibold">Level:</label>
                <p>{viewingComm.level}</p>
              </div>
              <div>
                <label className="font-semibold">Posted By:</label>
                <p>{viewingComm.postedBy}</p>
              </div>
              <div>
                <label className="font-semibold">To:</label>
                <p>{viewingComm.to}</p>
              </div>
              <div>
                <label className="font-semibold">Created At:</label>
                <p>{new Date(viewingComm.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="font-semibold">Updated At:</label>
                <p>{new Date(viewingComm.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
