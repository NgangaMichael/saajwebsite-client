import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";

export default function AddCommitteeModal({
  newCommittee,
  handleAddChange,
  addCommittee,
  closeAddModal,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Custom handler for multi-select block
  const handleMultiSelectChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    // Pass the array up to your state handler
    handleAddChange({
      target: {
        name: "head",
        value: selectedValues
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add Sub-Committee</h3>

        <div className="space-y-3">
          <input
            name="name"
            value={newCommittee.name || ""}
            onChange={handleAddChange}
            placeholder="Name"
            className="w-full border p-2 rounded mt-2"
            required
          />

          {/* Head Dropdown (Multi-Select) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Select Heads (Hold Ctrl / Cmd to select multiple)
            </label>
            <select
              name="head"
              multiple
              value={newCommittee.head || []} // Needs to be an array []
              onChange={handleMultiSelectChange}
              className="w-full border p-2 rounded h-28" 
              required
            >
              {loading ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* mcrep Dropdown */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Select MC-REP
            </label>
            <select
              name="mcrep"
              value={newCommittee.mcrep || ""}
              onChange={handleAddChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select MC-REP</option>
              {loading ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={closeAddModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={addCommittee}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}