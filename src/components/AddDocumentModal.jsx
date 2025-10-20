import React from "react";
import { X } from "lucide-react";

export default function AddDocumentModal({ newDoc, handleAddChange, handleFileChange, addDocument, closeAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-semibold">Add Document</h5>
          <button onClick={closeAddModal}>
            <X size={20} />
          </button>
        </div>

        <hr />
       <div className="">
  <input
    type="text"
    name="documentName"
    value={newDoc.documentName}
    onChange={handleAddChange}
    placeholder="Document Name"
    className="w-full border rounded p-2 mb-2"
    required
  />

  <input
    type="text"
    name="uploadedBy"
    value={newDoc.uploadedBy}
    onChange={handleAddChange}
    placeholder="Uploaded By"
    className="w-full border rounded p-2 mb-2"
    required
  />

  <textarea
    name="description"
    value={newDoc.description}
    onChange={handleAddChange}
    placeholder="Description"
    className="w-full border rounded p-2 mb-2"
  />

  {/* ✅ Type Dropdown */}
  <select
    name="type"
    value={newDoc.type}
    onChange={handleAddChange}
    className="w-full border rounded p-2 mb-2"
  >
    <option value="">-- Select Document Type --</option>
    <option value="SOP">SOP</option>
    <option value="TOR">TOR</option>
    <option value="REPORTS">REPORTS</option>
    <option value="CONSTITUTION">CONSTITUTION</option>
  </select>

  {/* ✅ File Upload */}
  <input
    type="file"
    name="file"
    onChange={handleFileChange}
    className="w-full mb-2"
  />

  {/* ✅ Status Checkbox */}
  <div className="flex items-center gap-2 mb-2">
    <input
      type="checkbox"
      name="status"
      checked={newDoc.status === 1}
      onChange={(e) =>
        handleAddChange({
          target: { name: "status", value: e.target.checked ? 1 : 0 },
        })
      }
    />
    <label className="text-sm">
      {newDoc.status === 1 ? "Active" : "Inactive"}
    </label>
  </div>
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
