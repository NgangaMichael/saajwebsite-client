import React from "react";
import { X } from "lucide-react";

export default function EditDocumentModal({ formData, handleEditChange, saveDocument, closeEditModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Document</h3>
          <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="documentName"
            value={formData.documentName}
            onChange={handleEditChange}
            placeholder="Document Name"
            className="w-full border rounded p-2"
            required
          />

          <input
            type="text"
            name="uploadedBy"
            value={formData.uploadedBy}
            onChange={handleEditChange}
            placeholder="Uploaded By"
            className="w-full border rounded p-2"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleEditChange}
            placeholder="Description"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={closeEditModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={saveDocument}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
