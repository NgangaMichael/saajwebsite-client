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

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userLevel = storedUser?.level || "";

  const [newDoc, setNewDoc] = useState({
    documentName: "",
    uploadedBy: storedUser?.username || storedUser?.email || "", // ✅ auto-fill
    description: "",
    file: null,
    type: "",      // ✅ added
    status: 0,     // ✅ added
  });

  const [formData, setFormData] = useState({
    documentName: "",
    uploadedBy: "",
    description: "",
  });


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
  }, []);

  // Delete
  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await apiDeleteDocument(id, storedUser.username);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Add handlers
  const handleAddChange = (e) => {
    setNewDoc((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFileChange = (e) => {
    setNewDoc((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const addDocument = async () => {
  try {
    const form = new FormData();
    form.append("documentName", newDoc.documentName);
    form.append("uploadedBy", newDoc.uploadedBy);
    form.append("description", newDoc.description);
    form.append("type", newDoc.type);
    form.append("status", newDoc.status);
    if (newDoc.file) form.append("file", newDoc.file);

    const data = await apiAddDocument(form);
    setDocs((prev) => [...prev, data.data]);
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
      setEditingDoc(null);
    } catch (err) {
      console.error("Error updating:", err);
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

  const filteredDocuments = docs.filter((u) =>
    u.documentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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



  if (loading) return <p className="p-6">Loading documents...</p>;

  return (
    <div className="">
      <div>

        {userLevel !== "Level 1" && <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>Add Document</button>}
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

      <div className="">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Document</th>
              <th scope="col">Uploaded By</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments
  // 🧠 Only show:
  // - status = 1 → everyone
  // - status = 0 → only Level 3
  .filter((doc) => {
    if (doc.status === 1) return true;
    if (doc.status === 0 && userLevel === "Level 3") return true;
    return false;
  })
  .map((doc, idx) => (
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
      <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
      <td>
        <div className="flex justify-center gap-3">
          {/* ✅ Everyone can view */}
          <button
            onClick={() => viewDocument(doc)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* ✅ Hide Edit/Delete for Level 1 */}
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

              {/* ✅ Only Level 3 can toggle Active/Inactive */}
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
        />
      )}

      {editingDoc && (
        <EditDocumentModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveDocument={saveDocument}
          closeEditModal={() => setEditingDoc(null)}
        />
      )}
    </div>
  );
}
