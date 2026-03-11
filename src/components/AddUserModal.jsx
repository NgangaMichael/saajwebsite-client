import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { userFields } from "./userFields";
import api from "../services/api";

export default function AddUserModal({ newUser, handleAddChange, addUser, closeAddModal, context }) {
  const [committees, setCommittees] = useState([]);
  const [subCommittees, setSubCommittees] = useState([]);

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
      if (field.required && !newUser[field.name]) {
        alert(`${field.label} is required`);
        return;
      }
    }
    addUser();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add User</h3>
          <button onClick={closeAddModal} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {userFields.map((field) => {
            
            // 1. Logic for STAFF page: Hide specific fields
            if (context === "staff") {
              const hiddenStaffFields = ["committee", "subCommittee", "membertype", "level", "employmentstatus", "subscription", "approveStatus", "waveSubscriptionStatus"];
              if (hiddenStaffFields.includes(field.name)) return null;
              
              // Also hide designation if it's already hardcoded to 'Staff'
              if (field.name === "designation" && newUser.designation === "Staff") return null;
            }

            // 2. Logic for USERS page: Filter Designation dropdown
            let options = field.options || [];

            if (field.name === "designation" && context === "user") {
              // Remove "Staff" from the options list
              options = options.filter(opt => opt !== "Staff");
            }

            // 3. Inject Dynamic DB Data
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
                    value={newUser[field.name]}
                    onChange={handleAddChange}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {options.map((option) => (
                      <option
                        key={option.value || option}
                        value={option.value || option}
                      >
                        {option.label || option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={newUser[field.name]}
                    onChange={handleAddChange}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required={field.required}
                    readOnly={field.readonly}
                  />
                )}
              </div>
            );
          })}

          <div className="col-span-2 flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
