import { useEffect, useState } from "react";
import { Folder, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDocuments } from "../services/documents";
import AddDocumentModal from "../components/AddDocumentModal";
import { getCommittees } from "../services/committees";
import { getsubCommittees } from "../services/subcommittees";
import { ToastContainer, toast } from "react-toastify";
import {
  addDocument as apiAddDocument,
} from "../services/documents";
import { addFolder, getFolders, updateFolder, deleteFolder } from "../services/folder";

export default function Homedocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [committees, setCommittees] = useState([]);
  const [subcommittees, setSubcommittees] = useState([]);
  const navigate = useNavigate();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userLevel = storedUser?.level || "";

  const [newDoc, setNewDoc] = useState({
    documentName: "",
    uploadedBy: storedUser?.username || storedUser?.email || "",
    description: "",
    file: null,
    type: "",
    status: 1,
    committeeId: "",
    subcommitteeId: "",
  });

  const fetchFolders = async () => {
    try {
      const res = await getFolders();
      setFolders(res.data || res);
    } catch (err) {
      console.error("Error loading folders:", err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);


  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDocuments();
        setDocs(data.data || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    fetchCommittees();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        setFolders(res.data || res);
      } catch (err) {
        console.error("Error loading folders:", err);
      }
    };
    fetchFolders();
  }, []);

  // Extract unique types from documents to create "Folders"
  const folderTypes = [...new Set(docs.map((doc) => doc.type).filter(Boolean))].sort();

  const openFolder = (type) => {
    // Navigate to the existing documents route with a query parameter
    navigate(`/dashboard/documents?type=${encodeURIComponent(type)}`);
  };

  const fetchCommittees = async () => {
    try {
      const res = await getCommittees();
      setCommittees(res.data || res);
    } catch (err) {
      console.error("Error loading committees:", err);
    }
  };

  const fetchSubcommittees = async (committeeId) => {
    try {
      const res = await getsubCommittees(committeeId);
      setSubcommittees(res.data || res);
    } catch (err) {
      console.error("Error loading subcommittees:", err);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewDoc((prev) => ({ ...prev, [name]: value }));

    if (name === "committeeId") {
      fetchSubcommittees(value);
      setNewDoc((prev) => ({ ...prev, subcommitteeId: "" }));
    }
  };

  const handleFileChange = (e) => {
      setNewDoc((prev) => ({ ...prev, file: e.target.files[0] }));
    };
  
    const addDocument = async () => {
      try {
        const form = new FormData();
        form.append("committeeId", newDoc.committeeId);
        form.append("subcommitteeId", newDoc.subcommitteeId);
        form.append("documentName", newDoc.documentName);
        form.append("uploadedBy", newDoc.uploadedBy);
        form.append("description", newDoc.description);
        form.append("type", newDoc.type);
        form.append("status", newDoc.status);
        if (newDoc.file) form.append("file", newDoc.file);
  
        const data = await apiAddDocument(form);
        setDocs((prev) => [...prev, data.data]);
  
        toast.success(`Document "${newDoc.documentName}" added successfully`);
  
        setAdding(false);
        setNewDoc({
          documentName: "",
          uploadedBy: storedUser?.username || "",
          description: "",
          file: null,
          type: "",
          status: 1,
        });
      } catch (err) {
        console.error("Error adding:", err);
        toast.error("Failed to add document");
      }
    };

    const handleCreateFolder = async (e) => {
      e.preventDefault();
      if (!newFolderName.trim()) return toast.error("Folder name is required");

      try {
        await addFolder({ foldername: newFolderName });
        toast.success(`Folder "${newFolderName}" created successfully`);
        setNewFolderName("");
        setIsFolderModalOpen(false);
        // Optional: Refresh docs or folder types if folders impact the UI immediately
      } catch (err) {
        console.error("Error creating folder:", err);
        toast.error("Failed to create folder");
      }
    };

    // DELETE FOLDER
  const handleDeleteFolder = async (e, folderId, folderName) => {
    e.stopPropagation(); // Prevent opening the folder
    if (!window.confirm(`Are you sure you want to delete the folder "${folderName}"?`)) return;

    try {
      await deleteFolder(folderId, storedUser.username);
      toast.success("Folder deleted");
      fetchFolders(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete folder");
    }
  };

  // TRIGGER EDIT MODAL
  const openEditModal = (e, folder) => {
    e.stopPropagation(); // Prevent opening the folder
    setEditingFolder(folder);
    setNewFolderName(folder.foldername);
    setIsFolderModalOpen(true);
  };

  // HANDLE SAVE (ADD or UPDATE)
  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return toast.error("Folder name is required");

    try {
      if (editingFolder) {
        // ✅ This calls the PATCH route
        await updateFolder(editingFolder.id, { foldername: newFolderName });
        toast.success("Folder updated successfully");
      } else {
        // ✅ This calls the POST route
        await addFolder({ foldername: newFolderName });
        toast.success("Folder created successfully");
      }
      
      // Reset everything
      setNewFolderName("");
      setEditingFolder(null);
      setIsFolderModalOpen(false);
      fetchFolders(); 
    } catch (err) {
      console.error("Folder Action Error:", err);
      toast.error("Action failed");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading Folders...</div>;

  return (
    <div className="container mt-4">
      {userLevel !== "Level 1" && (
        <div>
          {/* Create Folder Button */}
          <button 
            className="btn btn-outline-primary btn-sm float-end mx-2" 
            onClick={() => setIsFolderModalOpen(true)}
          >
            + Create Folder
          </button>
          <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>
            Add Document
          </button>
        </div>
      )}

      <h2 className="mb-4 h4">Document Library</h2>

      <hr />
      
      <div className="row g-4">
        {folders.map((folder, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <div 
              className="card h-100 text-center border-0 shadow-sm hover-shadow position-relative" 
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              onClick={() => openFolder(folder.foldername)}
            >
              {/* ✅ ACTION ICONS (Hidden for Level 1) */}
              {userLevel !== "Level 1" && (
                <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                  <button 
                    className="btn btn-light btn-sm text-primary shadow-sm p-1"
                    onClick={(e) => openEditModal(e, folder)}
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    className="btn btn-light btn-sm text-danger shadow-sm p-1"
                    onClick={(e) => handleDeleteFolder(e, folder.id, folder.foldername)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              <div className="card-body py-5">
                <div className="d-flex justify-content-center mb-3">
                  <Folder size={80} className="text-warning" fill="#ffc107" fillOpacity={0.2} />
                </div>
                <h5 className="card-title text-dark mb-0 text-truncate px-3">
                  {folder.foldername}
                </h5>
                <p className="text-muted small mt-2">
                  {docs.filter(d => d.type === folder.foldername).length} Documents
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          background-color: #f8f9fa;
        }
      `}</style>

      {/* Modals */}
      {adding && (
        <AddDocumentModal
          newDoc={newDoc}
          handleAddChange={handleAddChange}
          handleFileChange={handleFileChange}
          addDocument={addDocument}
          closeAddModal={() => setAdding(false)}
          committees={committees}
          subcommittees={subcommittees}
          folders={folders}
        />
      )}

      {/* MODAL FOR ADD/EDIT */}
      {isFolderModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingFolder ? `Edit Folder: ${editingFolder.foldername}` : "Create New Folder"}
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setIsFolderModalOpen(false);
                  setEditingFolder(null);
                  setNewFolderName("");
                }}></button>
              </div>
              <form onSubmit={handleFolderSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label font-weight-bold">Folder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setIsFolderModalOpen(false);
                      setEditingFolder(null);
                      setNewFolderName("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingFolder ? "Update Folder" : "Save Folder"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}