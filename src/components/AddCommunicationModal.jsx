import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import { getCommittees } from "../services/committees";

export default function AddCommunicationModal({ newComm, handleAddChange, addComm, closeAddModal }) {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users & committees on mount
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [userData, committeeData] = await Promise.all([
        getUsers(),
        getCommittees(),
      ]);

      // ✅ handle if response is object with nested arrays
      setUsers(Array.isArray(userData) ? userData : userData?.data || userData?.users || []);
      setCommittees(Array.isArray(committeeData) ? committeeData : committeeData?.data || committeeData?.committees || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  fetchData();
}, []);


  // Handle selection change
  const handleSelectChange = (e) => {
  const selectedOption = e.target.selectedOptions[0];
  const sendtoName = selectedOption.getAttribute("data-name");
  const sendtoId = e.target.value;

  handleAddChange({ target: { name: "sendto", value: sendtoName } });
  handleAddChange({ target: { name: "sendtoid", value: sendtoId } });
};



  // Filtered lists for search
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommittees = committees.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h5 className="text-xl font-semibold mb-4"><u>Add Communication</u></h5>

        <div className="space-y-3">
          <input
            name="title"
            value={newComm.title}
            onChange={handleAddChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="info"
            value={newComm.info}
            onChange={handleAddChange}
            placeholder="Info"
            className="w-full border p-2 rounded mt-2"
            required
          />

          {/* Search box */}
          <input
            type="text"
            placeholder="Search user or committee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          />

          {/* Dropdown */}
          <select
  name="sendto"
  value={newComm.sendtoid} // optional, you can still use sendto
  onChange={handleSelectChange}
  className="w-full border p-2 rounded mt-2"
  required
>
  <option value="">-- Select recipient --</option>
  <option value="0" data-name="All" data-type="all">All</option>

  <optgroup label="Users">
    {filteredUsers.map(user => (
      <option
        key={user.id}
        value={user.id}
        data-name={user.username || user.name}
        data-type="user"
      >
        {user.username || user.name}
      </option>
    ))}
  </optgroup>

  <optgroup label="Committees">
    {filteredCommittees.map(committee => (
      <option
        key={committee.id}
        value={committee.id}
        data-name={committee.name}
        data-type="committee"
      >
        {committee.name}
      </option>
    ))}
  </optgroup>
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
            onClick={addComm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
