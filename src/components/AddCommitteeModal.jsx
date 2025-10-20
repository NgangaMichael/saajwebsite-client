import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users"; // ✅ import your users service

export default function AddCommitteeModal({
  newCommittee,
  handleAddChange,
  addCommittee,
  closeAddModal,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
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
        <h3 className="text-xl font-semibold mb-4">Add Committee</h3>

        <div className="">
          <input
            name="name"
            value={newCommittee.name}
            onChange={handleAddChange}
            placeholder="Name"
            className="form-control mt-2"
            required
          />

          {/* Head Dropdown */}
          <select
            name="head"
            value={newCommittee.head}
            onChange={handleAddChange}
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
