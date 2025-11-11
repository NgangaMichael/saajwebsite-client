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
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Add state
  const [adding, setAdding] = useState(false);
  const [newComm, setNewComm] = useState({
    title: "",
    info: "",
    sender: storedUser.username,
    sendto: "",
    sendtoid: "",
  });

  // Edit state
  const [editingComm, setEditingComm] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    info: "",
    sender: storedUser.username,
    sendto: "",
    sendtoid: "",
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
      await apiDeleteCommunication(id, storedUser.username);
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
      title: "",
      info: "",
      sender: storedUser.username,
      sendto: "",
      sendtoid: "",
    });
  };

  // Edit
  const editComm = (comm) => {
    setEditingComm(comm);
    setFormData({
      title: comm.title || "",
      info: comm.info || "",
      sendto: comm.sendto || "",
      sendtoid: comm.sendtoid || "",
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
      title: "",
      info: "",
      sender: storedUser.username,
      sendto: "",
      sendtoid: "",
    });
  };

  // View
  const viewComm = (comm) => {
    setViewingComm(comm);
  };

  const closeViewModal = () => {
    setViewingComm(null);
  };

  // const filteredCommunications = communications.filter((u) =>
  //   u.title?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredCommunications = communications.filter((comm) => {
  // Level 1 users see all
  if (storedUser.level === "Level 3") return true;

  // Global messages (All)
  if (comm.sendto === "all" || comm.sendtoid === "0") return true;

  // Personal messages by username or ID
  if (comm.sendto === storedUser.username || comm.sendtoid == storedUser.id) return true;

  // Committee-targeted messages
  if (comm.sendto === storedUser.committee) return true;

  // Otherwise not visible
  return false;
}).filter((comm) =>
  comm.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>Add Communication</button> */}
        {storedUser.level === "Level 3" && (
          <button
            className="btn btn-primary btn-sm float-end"
            onClick={() => setAdding(true)}
          >
            Add Communication
          </button>
        )}

        
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
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Send To</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunications.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No communications found
                </td>
              </tr>
            ) : (
              filteredCommunications.map((comm, idx) => (
                <tr
                  key={comm.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  <td>{idx+1}</td>
                  <td>{comm.title}</td>
                  <td>{comm.sendto}</td>
                  <td>{new Date(comm.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-center gap-3">
                      {/* View is visible to everyone */}
                      <button
                        onClick={() => viewComm(comm)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View communication"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit and Delete only for Level 3 */}
                      {storedUser.level === "Level 3" && (
                        <>
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
                        </>
                      )}
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
            <h5 className="text-success"><u>Communication Details</u></h5>

            <div className="space-y-3">
              <div>
                <label className="font-semibold">Sent By: {viewingComm.sender}</label>
              </div>
              <div>
                <label className="font-semibold">Title: {viewingComm.title}</label>
              </div>
              <div>
                <label className="text-success">Info:</label>
                <p className="whitespace-pre-wrap">{viewingComm.info}</p>
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
