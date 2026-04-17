import React, { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import { getCommittees } from "../services/committees";

export default function AddCommunicationModal({ newComm, handleAddChange, addComm, closeAddModal, userLevel }) {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isStaff = currentUser?.designation?.toLowerCase() === "staff";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, committeeData] = await Promise.all([
          getUsers(),
          getCommittees(),
        ]);

        const allUsers = Array.isArray(userData) ? userData : userData?.data || [];
        
        // ✅ STRICR FILTER: If Staff, they ONLY get Level 3 users.
        if (isStaff) {
          setUsers(allUsers.filter(u => u.level === "Level 3"));
          setCommittees([]); // ✅ Staff see ZERO committees
        } else {
          setUsers(allUsers);
          setCommittees(Array.isArray(committeeData) ? committeeData : committeeData?.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [isStaff]);

  const handleSelectChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const sendtoName = selectedOption.getAttribute("data-name");
    const sendtoId = e.target.value;

    handleAddChange({ target: { name: "sendto", value: sendtoName } });
    handleAddChange({ target: { name: "sendtoid", value: sendtoId } });
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h5 className="text-xl font-semibold mb-4 text-gray-800">
          <u>{newComm.replyMode ? "Reply to Message" : "New Communication"}</u>
        </h5>

        <div className="space-y-3">
          {newComm.replyMode ? (
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <label className="text-xs font-bold text-blue-600 uppercase">Replying To Admin:</label>
              <div className="text-sm font-semibold">{newComm.sendto}</div>
            </div>
          ) : (
            <>
              {/* Search input only searches filtered list (Level 3 for staff) */}
              {/* <input
                list="recipient-options"
                type="text"
                placeholder={isStaff ? "Search Admins..." : "Search user or Sub-committee..."}
                className="w-full border p-2 rounded mt-2"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  const match = users.find(item => (item.username || item.name) === e.target.value);
                  if (match) {
                    handleAddChange({ target: { name: "sendtoid", value: match.id } });
                    handleAddChange({ target: { name: "sendto", value: e.target.value } });
                  }
                }}
              /> */}
              <datalist id="recipient-options">
                {filteredUsers.map(user => (
                  <option key={user.id} value={user.username || user.name} />
                ))}
              </datalist>

              <select
                name="sendto"
                value={newComm.sendtoid}
                onChange={handleSelectChange}
                className="w-full border p-2 rounded mt-2"
                required
              >
                <option value="">-- Select Recipient --</option>
                
                {/* 1. BROADCAST OPTIONS: Hidden for Staff */}
                {!isStaff && userLevel !== "Level 1" && (
                  <>
                    <option value="0" data-name="All">All Members</option>
                    <option value="0" data-name="All Staff">All Staff</option>
                    <option value="0" data-name="Level 2">Level 2</option>
                  </>
                )}

                {/* 2. USERS: If staff, this only contains Level 3 */}
                <optgroup label={isStaff ? "Authorized Admins (Level 3)" : "Users"}>
                  {filteredUsers.map(user => (
                    <option key={user.id} value={user.id} data-name={user.username || user.name}>
                      {user.username || user.name} {isStaff ? " (Admin)" : ""}
                    </option>
                  ))}
                </optgroup>

                {/* 3. COMMITTEES: Hidden for Staff */}
                {!isStaff && committees.length > 0 && (
                  <optgroup label="Committees">
                    {committees.map(committee => (
                      <option key={committee.id} value={committee.id} data-name={committee.name}>
                        {committee.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </>
          )}

          <input
            name="title"
            value={newComm.title}
            onChange={handleAddChange}
            placeholder="Subject"
            className="w-full border p-2 rounded mt-2"
            required
          />

          <textarea
            name="info"
            value={newComm.info}
            onChange={handleAddChange}
            placeholder="Type your message here..."
            className="w-full border p-2 rounded mt-2 h-32"
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={closeAddModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
            Cancel
          </button>
          <button onClick={addComm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            {newComm.replyMode ? "Send Reply" : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}