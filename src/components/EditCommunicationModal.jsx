import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import { getCommittees } from "../services/committees";

export default function EditCommunicationModal({
  formData,
  handleEditChange,
  saveComm,
  closeEditModal,
  userLevel
}) {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, committeeData] = await Promise.all([
          getUsers(),
          getCommittees(),
        ]);

        setUsers(
          Array.isArray(userData)
            ? userData
            : userData?.data || userData?.users || []
        );
        setCommittees(
          Array.isArray(committeeData)
            ? committeeData
            : committeeData?.data || committeeData?.committees || []
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const sendtoName = selectedOption.getAttribute("data-name");
    const sendtoId = e.target.value;

    handleEditChange({ target: { name: "sendto", value: sendtoName } });
    handleEditChange({ target: { name: "sendtoid", value: sendtoId } });
  };

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommittees = committees.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h5 className="text-xl font-semibold mb-4">
          <u>Edit Communication</u>
        </h5>

        <div className="space-y-3">
          <input
            name="title"
            value={formData.title || ""}
            onChange={handleEditChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="info"
            value={formData.info || ""}
            onChange={handleEditChange}
            placeholder="Info"
            className="w-full border p-2 rounded mt-2"
            required
          />

          <input
            type="text"
            placeholder="Search user or committee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          />

          <select
            name="sendto"
            value={formData.sendtoid || ""}
            onChange={handleSelectChange}
            className="w-full border p-2 rounded mt-2"
            required
          >
            <option value="">-- Select recipient --</option>

            {/* Global broadcast options */}
            {userLevel !== "Level 1" && (
              <>
                <option value="0" data-name="All">All</option>
                <option value="staff_group" data-name="All Staff">All Staff</option>
                <option value="level2" data-name="Level 2">Level 2</option>
                {/* ✅ New additions */}
                <option value="0" data-name="Direct Members">Direct Members</option>
                <option value="0" data-name="Indirect Members">Indirect Members</option>
              </>
            )}

            <optgroup label="Sub-Committees">
              {filteredCommittees.map((committee) => (
                <option key={committee.id} value={committee.id} data-name={committee.name}>
                  {committee.name}
                </option>
              ))}
            </optgroup>

            {userLevel !== "Level 1" && (
              <optgroup label="Users">
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id} data-name={user.username || user.name}>
                    {user.username || user.name}
                  </option>
                ))}
              </optgroup>
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
            onClick={saveComm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}