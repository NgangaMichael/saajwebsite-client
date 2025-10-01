import api from "./api";

// ------------------ DOCUMENTS API ------------------

// Get all documents
export const getDocuments = async () => {
  const res = await api.get("/documents");
  return res.data;
};

// Add a document (with file upload)
// export const addDocument = async (docData) => {
//   const formData = new FormData();
//   Object.keys(docData).forEach((key) => {
//     if (docData[key]) {
//       formData.append(key, docData[key]);
//     }
//   });

//   const res = await api.post("/documents", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// services/documents.js
export const addDocument = async (formData) => {
  const res = await api.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


// Update a document
export const updateDocument = async (id, docData) => {
  const res = await api.put(`/documents/${id}`, docData);
  return res.data;
};

// Delete a document
export const deleteDocument = async (id) => {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
};
