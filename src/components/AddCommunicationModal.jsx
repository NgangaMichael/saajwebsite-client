import React from "react";

export default function AddCommunicationModal({ newComm, handleAddChange, addComm, closeAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add Communication</h3>

        <div className="space-y-3">
          <input name="memberNumber" value={newComm.memberNumber} onChange={handleAddChange} placeholder="Member Number" className="w-full border p-2 rounded" required />
          <input name="title" value={newComm.title} onChange={handleAddChange} placeholder="Title" className="w-full border p-2 rounded" required />
          <textarea name="info" value={newComm.info} onChange={handleAddChange} placeholder="Info" className="w-full border p-2 rounded" required />
          <select name="level" value={newComm.level} onChange={handleAddChange} className="w-full border p-2 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input name="postedBy" value={newComm.postedBy} onChange={handleAddChange} placeholder="Posted By" className="w-full border p-2 rounded" required />
          <input name="to" value={newComm.to} onChange={handleAddChange} placeholder="To" className="w-full border p-2 rounded" required />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={closeAddModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          <button onClick={addComm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
        </div>
      </div>
    </div>
  );
}
