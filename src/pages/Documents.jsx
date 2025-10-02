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

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userLevel = storedUser?.level || "";

  const [newDoc, setNewDoc] = useState({
    documentName: "",
    uploadedBy: storedUser?.username || storedUser?.email || "", // ✅ auto-fill
    description: "",
    file: null,
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
      await apiDeleteDocument(id);
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
      if (newDoc.file) form.append("file", newDoc.file);

      const data = await apiAddDocument(form);
      setDocs((prev) => [...prev, data.data]);
      setAdding(false);
      setNewDoc({ documentName: "", uploadedBy: storedUser?.username || "", description: "", file: null });
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

  if (loading) return <p className="p-6">Loading documents...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Documents</h2>

        {/* ✅ Hide Add button if Level 1 */}
        {userLevel !== "Level 1" && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={18} /> Add Document
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border">ID</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Uploaded By</th>
              <th className="px-4 py-3 border">Type</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  No documents found
                </td>
              </tr>
            ) : (
              docs.map((doc, idx) => (
                <tr
                  key={doc.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 border">{doc.id}</td>
                  <td className="px-4 py-3 border">{doc.documentName}</td>
                  <td className="px-4 py-3 border">{doc.uploadedBy}</td>
                  <td className="px-4 py-3 border">{doc.type || "-"}</td>
                  <td className="px-4 py-3 border">
                    <div className="flex justify-center gap-3">
                      {/* ✅ Everyone can view */}
                      <button onClick={() => viewDocument(doc)} className="text-blue-500 hover:text-blue-700">
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
