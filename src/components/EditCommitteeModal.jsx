import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";

export default function EditCommitteeModal({
  formData,
  handleEditChange,
  saveCommittee,
  closeEditModal,
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
    
    // Pass the array up to your shared state handler
    handleEditChange({
      target: {
        name: "head",
        value: selectedValues
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Sub-Committee</h3>

        <div className="space-y-3">
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleEditChange}
            placeholder="Name"
            className="w-full border p-2 rounded mt-1"
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
              value={formData.head || []} // Safely falls back to an array
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
              value={formData.mcrep || ""}
              onChange={handleEditChange}
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
            onClick={closeEditModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={saveCommittee}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}