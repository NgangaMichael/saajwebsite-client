import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  getCommunications,
  addCommunication as apiAddCommunication,
  updateCommunication,
  deleteCommunication as apiDeleteCommunication,
  getCommunicationThread, // Ensure this is imported
} from "../services/communication";
import AddCommunicationModal from "../components/AddCommunicationModal";
import EditCommunicationModal from "../components/EditCommunicationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Communication() {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [thread, setThread] = useState([]);

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
      toast.success("Communication deleted successfully");
    } catch (err) {
      console.error("Error deleting communication:", err);
      toast.error("Failed to delete communication");
    }
  };

  // Add Logic
  const handleAddChange = (e) => {
    setNewComm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addComm = async () => {
    try {
      const data = await apiAddCommunication(newComm);
      setCommunications((prev) => [data.data, ...prev]); // Add to top
      toast.success('Communication sent successfully!');
      closeAddModal();
    } catch (err) {
      console.error("Error adding communication:", err);
      toast.error('Failed to send communication');
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

  // Edit Logic
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
      toast.success('Communication updated successfully!');
      closeEditModal();
    } catch (err) {
      console.error("Error updating communication:", err);
      toast.error('Failed to update communication');
    }
  };

  const closeEditModal = () => {
    setEditingComm(null);
    setFormData({ title: "", info: "", sender: storedUser.username, sendto: "", sendtoid: "" });
  };

  // View & Mark Read Logic
  const viewComm = async (comm) => {
    setViewingComm(comm);
    
    // ✅ Handle LocalStorage Read Status
    const storageKey = `read_msgs_${storedUser.id}`;
    const readMessages = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (!readMessages.includes(comm.id)) {
      const updatedReadList = [...readMessages, comm.id];
      localStorage.setItem(storageKey, JSON.stringify(updatedReadList));
      
      // ✅ Trigger Sidebar Update
      window.dispatchEvent(new Event("storage")); 
    }

    try {
      const data = await getCommunicationThread(comm.parentId || comm.id);
      setThread(data.data);
    } catch (err) {
      console.error("Error fetching thread:", err);
      setThread([comm]);
    }
  };

  const closeViewModal = () => {
    setViewingComm(null);
    setThread([]);
  };

  // ✅ Filter and Sort Logic (LATEST ON TOP)
  const filteredCommunications = communications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest First
    .filter((comm) => {
      if (storedUser.level === "Level 3") return true;
      if (comm.sendto === "All" || comm.sendtoid === "0") return true;
      if (comm.sendtoid == storedUser.id || comm.sendto === storedUser.username) return true;
      if (comm.sendto === storedUser.committee) return true;
      if (comm.sender === storedUser.username) return true;
      return false;
    })
    .filter((comm) =>
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
        {(storedUser.level === "Level 3" || storedUser.level === "Level 1") && (
          <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>
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

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Sender</th>
              <th scope="col">Send To</th>
              <th scope="col">Date</th>
              <th scope="col" className="text-center">Actions</th>
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
              filteredCommunications.map((comm, idx) => {
                // ✅ Check Read Status per item
                const readList = JSON.parse(localStorage.getItem(`read_msgs_${storedUser.id}`)) || [];
                const isRead = readList.includes(comm.id) || comm.sender === storedUser.username;

                return (
                  <tr
                    key={comm.id}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 ${
                      !isRead ? "font-bold border-l-4 border-blue-500" : "text-gray-600"
                    }`}
                  >
                    <td>{idx + 1}</td>
                    <td>
                      {comm.title} 
                      {!isRead && (
                        <span className="ml-2 badge bg-primary" style={{ fontSize: '10px' }}>New</span>
                      )}
                    </td>
                    <td>{comm.sender}</td>
                    <td>{comm.sendto}</td>
                    <td>{new Date(comm.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => viewComm(comm)}
                          className="text-green-600 hover:text-green-800 transition"
                          title="View communication"
                        >
                          <Eye size={18} />
                        </button>

                        {storedUser.level === "Level 3" && (
                          <>
                            <button onClick={() => editComm(comm)} className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => deleteComm(comm.id)} className="text-red-600 hover:text-red-800 transition" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </>
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

      {/* Modals remain the same */}
      {adding && (
        <AddCommunicationModal
          newComm={newComm}
          handleAddChange={handleAddChange}
          addComm={addComm}
          closeAddModal={closeAddModal}
          userLevel={storedUser.level}
        />
      )}

      {editingComm && (
        <EditCommunicationModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveComm={saveComm}
          closeEditModal={closeEditModal}
          userLevel={storedUser.level}
        />
      )}

      {/* View Modal */}
      {viewingComm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h5 className="text-success border-b pb-2 mb-4 font-bold">Conversation History</h5>
            <div className="space-y-4">
              {thread.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-lg ${msg.sender === storedUser.username ? 'bg-blue-50 ml-10 border-l-4 border-blue-500' : 'bg-gray-50 mr-10 border-l-4 border-green-500'}`}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{msg.sender}</span>
                    <span className="text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="font-semibold text-sm">{msg.title}</div>
                  <p className="whitespace-pre-wrap text-sm mt-1">{msg.info}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => {
                  setNewComm({
                    title: `RE: ${viewingComm.title}`,
                    info: "",
                    sender: storedUser.username,
                    sendto: viewingComm.sender,
                    sendtoid: viewingComm.senderId || "0",
                    parentId: viewingComm.parentId || viewingComm.id,
                  });
                  setAdding(true);
                  closeViewModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reply
              </button>
              <button onClick={closeViewModal} className="px-4 py-2 bg-gray-500 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}