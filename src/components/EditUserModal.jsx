import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { userFields } from "./userFields";
import api from "../services/api";

export default function EditUserModal({
  formData,
  handleEditChange,
  saveUser,
  closeEditModal,
  context,
  allUsers = []
}) {
  const [committees, setCommittees] = useState([]);
  const [subCommittees, setSubCommittees] = useState([]);

  // Filter out direct members
  const directMembers = allUsers.filter(u => u.membertype === "Direct");

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [committeeRes, subcommitteeRes] = await Promise.all([
          api.get("/committees"),
          api.get("/subcommittees"),
        ]);
        setCommittees(committeeRes.data.data || []);
        setSubCommittees(subcommitteeRes.data.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let field of userFields) {
      const value = formData[field.name];

      // Hide conditional loops if Indirect logic is matched
      if (formData.membertype === "Indirect") {
        const hiddenIndirectFields = ["subscription", "fileNumber", "approveStatus", "waveSubscriptionStatus"];
        if (hiddenIndirectFields.includes(field.name)) continue;
      }

      if (field.name === "password" && (!value || value.trim() === "")) {
        continue; 
      }

      if (field.required && !value) {
        alert(`${field.label} is required`);
        return;
      }

      if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        alert("Invalid email format");
        return;
      }
      
      if (field.type === "number" && value && isNaN(value)) {
        alert(`${field.label} must be a number`);
        return;
      }
    }

    if (formData.membertype === "Indirect" && !formData.associatedDirectMember) {
      alert("Please select an associated Direct Member");
      return;
    }

    saveUser();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit User</h3>
          <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {userFields.map((field) => {
            
            // Enforce Indirect structural visibility drop rules
            if (formData.membertype === "Indirect") {
              const hiddenIndirectFields = ["subscription", "fileNumber", "approveStatus", "waveSubscriptionStatus"];
              if (hiddenIndirectFields.includes(field.name)) return null;
            }

            let options = field.options || [];

            if (field.name === "committee") {
              options = committees.map((c) => ({ label: c.name, value: c.name }));
            }
            if (field.name === "subCommittee") {
              options = subCommittees.map((s) => ({ label: s.name, value: s.name }));
            }

            return (
              <div key={field.name}>
                <label className="block text-gray-700 mb-1 capitalize">{field.label}</label>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {options.map((option) => (
                      <option key={option.value || option} value={option.value || option}>
                        {option.label || option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={field.name === "password" ? false : field.required}
                    readOnly={field.readonly}
                  />
                )}
              </div>
            );
          })}

          {/* Conditional Dropdown for Edit Layout */}
          {formData.membertype === "Indirect" && (
            <div className="col-span-2 border p-3 rounded bg-gray-50 animate-fadeIn">
              <label className="block text-gray-700 mb-1 font-semibold">Associated Direct Member</label>
              <select
                name="associatedDirectMember"
                value={formData.associatedDirectMember || ""}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
              >
                <option value="">Select the sponsor Direct Member</option>
                {directMembers.map((member) => (
                  <option key={member.id} value={member.username}>
                    {member.username} ({member.fileNumber || "No Member No."})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-span-2 flex justify-end mt-6 gap-3">
            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}