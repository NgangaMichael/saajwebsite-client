import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import { getCommittees } from "../services/committees"; // ✅ Import committee service

export default function EditSubCommitteeModal({
  formData,
  handleEditChange,
  saveSubCommittee,
  closeEditModal,
}) {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCommittees, setLoadingCommittees] = useState(true);

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
        <h3 className="text-xl font-semibold mb-4">Edit Sub-Committee</h3>

        <div>
          {/* Name */}
          <input
            name="name"
            value={formData.name}
            onChange={handleEditChange}
            placeholder="Sub-Committee Name"
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
            value={formData.committee}
            onChange={handleEditChange}
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
            onClick={closeEditModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={saveSubCommittee}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
