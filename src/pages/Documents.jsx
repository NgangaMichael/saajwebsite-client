import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import api from "../services/api";
import {
  getDocuments,
  addDocument as apiAddDocument,
  updateDocument,
  deleteDocument as apiDeleteDocument,
} from "../services/documents";
import AddDocumentModal from "../components/AddDocumentModal";
import EditDocumentModal from "../components/EditDocumentModal";
import { getCommittees } from "../services/committees";
import { getsubCommittees } from "../services/subcommittees";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [committees, setCommittees] = useState([]);
  const [subcommittees, setSubcommittees] = useState([]);

  const [searchParams] = useSearchParams();
  const urlType = searchParams.get("type");

  // Filter states
  const [filterCommittee, setFilterCommittee] = useState("");
  const [filterSubcommittee, setFilterSubcommittee] = useState("");
  // const [filterType, setFilterType] = useState("");

  const [filterType, setFilterType] = useState(urlType || "");

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userLevel = storedUser?.level || "";

  const [newDoc, setNewDoc] = useState({
    documentName: "",
    uploadedBy: storedUser?.username || storedUser?.email || "",
    description: "",
    file: null,
    type: "",
    status: 0,
    committeeId: "",
    subcommitteeId: "",
  });

  const [formData, setFormData] = useState({
    documentName: "",
    uploadedBy: "",
    description: "",
  });

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

  // Fetch documents
  const fetchDocs = async () => {
    try {
      const data = await getDocuments();
      setDocs(data.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchCommittees();
  }, []);

  // Delete
  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await apiDeleteDocument(id, storedUser.username);
      setDocs((prev) => prev.filter((d) => d.id !== id));
          toast.success("Document deleted successfully");
    } catch (err) {
      console.error("Error deleting:", err);
          toast.error("Failed to delete document");
    }
  };

  // Add handlers
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
        status: 0,
      });
    } catch (err) {
      console.error("Error adding:", err);
          toast.error("Failed to add document");
    }
  };

  // Edit handlers
  const editDoc = (doc) => {
    setEditingDoc(doc);
    setFormData({
      documentName: doc.documentName || "",
      uploadedBy: doc.uploadedBy || "",
      description: doc.description || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveDocument = async () => {
    try {
      const data = await updateDocument(editingDoc.id, formData);
      setDocs((prev) => prev.map((d) => (d.id === editingDoc.id ? data.data : d)));
          toast.success(`Document "${formData.documentName}" updated successfully`);
      setEditingDoc(null);
    } catch (err) {
      console.error("Error updating:", err);
          toast.error("Failed to update document");
    }
  };

  // View
  const viewDocument = (doc) => {
    if (doc.path) {
      window.open(`${api.defaults.baseURL}${doc.path}`, "_blank");
    } else {
      alert("No document file found!");
    }
  };

  const handleStatusToggle = async (doc) => {
    const newStatus = doc.status === 1 ? 0 : 1;
    try {
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: newStatus } : d))
      );
      await updateDocument(doc.id, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleStatusToggle2 = async (doc) => {
    const newStatus = doc.status2 === 1 ? 0 : 1;
    try {
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status2: newStatus } : d))
      );
      await updateDocument(doc.id, { status2: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCommittee("");
    setFilterSubcommittee("");
    setFilterType("");
    setSearchTerm("");
  };

  // Get unique document types for filter dropdown
  const uniqueTypes = [...new Set(docs.map(doc => doc.type).filter(Boolean))];

  // Enhanced filtering logic
  const filteredDocuments = docs
    .filter((doc) => {
      // Search term filter
      const matchesSearch = doc.documentName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Committee filter
      const matchesCommittee = !filterCommittee || doc.committee === filterCommittee;
      
      // Subcommittee filter
      const matchesSubcommittee = !filterSubcommittee || doc.subcommittee === filterSubcommittee;
      
      // Type filter
      const matchesType = !filterType || doc.type === filterType;

      return matchesSearch && matchesCommittee && matchesSubcommittee && matchesType;
    })
    .filter((doc) => {
      // Level-based visibility
      if (userLevel === "Level 3") return true;
      if (userLevel === "Level 2" && (doc.status === 1 || doc.status2 === 1)) return true;
      if (userLevel === "Level 1" && doc.status === 1) return true;
      return false;
    });

  if (loading) return <p className="p-6">Loading documents...</p>;

  return (
    <div className="">
      <div>
        {userLevel !== "Level 1" && (
          <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>
            Add Document
          </button>
        )}
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2 className="h5">Documents</h2>
      </div>

      <hr />

      {/* Filter Section */}
      <div className="mb-3 p-3 bg-light rounded">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small mb-1">Filter by Committee</label>
            <select
              className="form-select form-select-sm"
              value={filterCommittee}
              onChange={(e) => {
                setFilterCommittee(e.target.value);
                setFilterSubcommittee(""); // Reset subcommittee when committee changes
              }}
            >
              <option value="">All Committees</option>
              {committees.map((committee) => (
                <option key={committee.id} value={committee.name}>
                  {committee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small mb-1">Filter by Sub-Committee</label>
            <select
              className="form-select form-select-sm"
              value={filterSubcommittee}
              onChange={(e) => setFilterSubcommittee(e.target.value)}
            >
              <option value="">All Sub-Committees</option>
              {docs
                .map(doc => doc.subcommittee)
                .filter((value, index, self) => value && self.indexOf(value) === index)
                .sort()
                .map((subcommittee, idx) => (
                  <option key={idx} value={subcommittee}>
                    {subcommittee}
                  </option>
                ))}
            </select>
          </div>

          {/* <div className="col-md-3">
            <label className="form-label small mb-1">Filter by Type</label>
            <select
              className="form-select form-select-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {uniqueTypes.sort().map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div> */}

          <div className="col-md-3">
            <button
              className="btn btn-secondary btn-sm w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Document</th>
              <th scope="col">Uploaded By</th>
              <th scope="col">Type</th>
              <th scope="col">Committee</th>
              <th scope="col">Sub-Committee</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, idx) => (
              <tr
                key={doc.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td>{idx + 1}</td>
                <td>{doc.documentName}</td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.type || "-"}</td>
                <td>{doc.committee || "-"}</td>
                <td>{doc.subcommittee || "-"}</td>
                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => viewDocument(doc)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    {userLevel !== "Level 1" && (
                      <>
                        <button
                          onClick={() => editDoc(doc)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>

                        {storedUser?.level === "Level 3" && (
                          <input
                            className="form-check-input ms-2"
                            type="checkbox"
                            checked={doc.status === 1}
                            onChange={() => handleStatusToggle(doc)}
                            title={doc.status === 1 ? "Active" : "Inactive"}
                            style={{
                              boxShadow:
                                doc.status === 1
                                  ? "0 0 5px 2px rgba(40, 167, 69, 0.6)"
                                  : "0 0 5px 2px rgba(220, 53, 69, 0.4)",
                              borderColor: doc.status === 1 ? "#28a745" : "#dc3545",
                              cursor: "pointer",
                            }}
                          />
                        )}

                        {storedUser?.level === "Level 3" && (
                          <input
                            className="form-check-input ms-2"
                            type="checkbox"
                            checked={doc.status2 === 1}
                            onChange={() => handleStatusToggle2(doc)}
                            title={doc.status2 === 1 ? "Active" : "Inactive"}
                            style={{
                              boxShadow:
                                doc.status === 1
                                  ? "0 0 5px 2px rgba(40, 167, 69, 0.6)"
                                  : "0 0 5px 2px rgba(220, 53, 69, 0.4)",
                              borderColor: doc.status === 1 ? "#28a745" : "#dc3545",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        />
      )}

      {editingDoc && (
        <EditDocumentModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveDocument={saveDocument}
          closeEditModal={() => setEditingDoc(null)}
          committees={committees}          // ✅ added
          subcommittees={subcommittees}    // ✅ added
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}