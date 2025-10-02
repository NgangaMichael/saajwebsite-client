import React from "react";

export default function EditCommunicationModal({ formData, handleEditChange, saveComm, closeEditModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Communication</h3>

        <div className="space-y-3">
          <input name="memberNumber" value={formData.memberNumber} onChange={handleEditChange} placeholder="Member Number" className="w-full border p-2 rounded" required />
          <input name="title" value={formData.title} onChange={handleEditChange} placeholder="Title" className="w-full border p-2 rounded" required />
          <textarea name="info" value={formData.info} onChange={handleEditChange} placeholder="Info" className="w-full border p-2 rounded" required />
          <select name="level" value={formData.level} onChange={handleEditChange} className="w-full border p-2 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input name="postedBy" value={formData.postedBy} onChange={handleEditChange} placeholder="Posted By" className="w-full border p-2 rounded" required />
          <input name="to" value={formData.to} onChange={handleEditChange} placeholder="To" className="w-full border p-2 rounded" required />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={closeEditModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          <button onClick={saveComm} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
        </div>
      </div>
    </div>
  );
}
