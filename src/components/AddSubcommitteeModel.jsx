import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import { getCommittees } from "../services/committees"; // ✅ Import committee service

export default function AddSubCommitteeModal({
  newSubCommittee,
  handleAddChange,
  addsubCommittee,
  closeAddModal,
}) {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCommittees, setLoadingCommittees] = useState(true);

  // Fetch users and committees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, committeesRes] = await Promise.all([
          getUsers(),
          getCommittees(),
        ]);
        setUsers(usersRes.data);
        setCommittees(committeesRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      } finally {
        setLoadingUsers(false);
        setLoadingCommittees(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add Sub-Committee</h3>

        <div>
          {/* Name */}
          <input
            name="name"
            value={newSubCommittee.name}
            onChange={handleAddChange}
            placeholder="Sub-Committee Name"
            className="form-control mt-2"
            required
          />

          {/* Head Dropdown */}
          <select
            name="head"
            value={newSubCommittee.head}
            onChange={handleAddChange}
            className="form-control mt-2"
            required
          >
            <option value="">Select Head</option>
            {loadingUsers ? (
              <option>Loading users...</option>
            ) : (
              users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))
            )}
          </select>

          {/* Committee Dropdown */}
          <select
            name="committee"
            value={newSubCommittee.committee}
            onChange={handleAddChange}
            className="form-control mt-2"
            required
          >
            <option value="">Select Committee</option>
            {loadingCommittees ? (
              <option>Loading committees...</option>
            ) : (
              committees.map((committee) => (
                <option key={committee.id} value={committee.name}>
                  {committee.name}
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
            onClick={addsubCommittee}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
