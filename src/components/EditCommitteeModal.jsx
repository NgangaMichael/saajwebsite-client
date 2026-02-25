import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users"; // ✅ import

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
        setUsers(data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Sub-Committee</h3>

        <div className="">
          <input
            name="name"
            value={formData.name}
            onChange={handleEditChange}
            placeholder="Name"
            className="form-control mt-1"
            required
          />

          {/* Head Dropdown */}
          <select
            name="head"
            value={formData.head}
            onChange={handleEditChange}
            className="form-control mt-2"
            required
          >
            <option value="">Select Head</option>
            {loading ? (
              <option>Loading users...</option>
            ) : (
              users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))
            )}
          </select>

          {/* mcrep Dropdown */}
          <select
            name="mcrep"
            value={formData.mcrep}
            onChange={handleEditChange}
            className="form-control mt-2"
            required
          >
            <option value="">Select MC-REP</option>
            {loading ? (
              <option>Loading users...</option>
            ) : (
              users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))
            )}
          </select>

          
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
