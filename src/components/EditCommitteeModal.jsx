import React from "react";

export default function EditCommitteeModal({ formData, handleEditChange, saveCommittee, closeEditModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Committee</h3>

        <div className="space-y-3">
          <input name="name" value={formData.name} onChange={handleEditChange} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="head" value={formData.head} onChange={handleEditChange} placeholder="Head" className="w-full border p-2 rounded" required />
          <input name="subCommittee" value={formData.subCommittee} onChange={handleEditChange} placeholder="Sub Committee" className="w-full border p-2 rounded" />
          <input type="number" name="totalMembers" value={formData.totalMembers} onChange={handleEditChange} placeholder="Total Members" className="w-full border p-2 rounded" />
          <textarea name="description" value={formData.description} onChange={handleEditChange} placeholder="Description" className="w-full border p-2 rounded" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={closeEditModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          <button onClick={saveCommittee} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
        </div>
      </div>
    </div>
  );
}
