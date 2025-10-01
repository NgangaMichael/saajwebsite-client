import React from "react";
import { X } from "lucide-react";

export default function AddDocumentModal({ newDoc, handleAddChange, handleFileChange, addDocument, closeAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Document</h3>
          <button onClick={closeAddModal}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="documentName"
            value={newDoc.documentName}
            onChange={handleAddChange}
            placeholder="Document Name"
            className="w-full border rounded p-2"
            required
          />

          <input
            type="text"
            name="uploadedBy"
            value={newDoc.uploadedBy}
            onChange={handleAddChange}
            placeholder="Uploaded By"
            className="w-full border rounded p-2"
            required
          />

          <textarea
            name="description"
            value={newDoc.description}
            onChange={handleAddChange}
            placeholder="Description"
            className="w-full border rounded p-2"
          />

          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={closeAddModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={addDocument}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
