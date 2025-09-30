import React from "react";

export default function AddCommitteeModal({ newCommittee, handleAddChange, addCommittee, closeAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add Committee</h3>

        <div className="space-y-3">
          <input name="name" value={newCommittee.name} onChange={handleAddChange} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="head" value={newCommittee.head} onChange={handleAddChange} placeholder="Head" className="w-full border p-2 rounded" required />
          <input name="subCommittee" value={newCommittee.subCommittee} onChange={handleAddChange} placeholder="Sub Committee" className="w-full border p-2 rounded" />
          <input type="number" name="totalMembers" value={newCommittee.totalMembers} onChange={handleAddChange} placeholder="Total Members" className="w-full border p-2 rounded" />
          <textarea name="description" value={newCommittee.description} onChange={handleAddChange} placeholder="Description" className="w-full border p-2 rounded" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={closeAddModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          <button onClick={addCommittee} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
        </div>
      </div>
    </div>
  );
}
