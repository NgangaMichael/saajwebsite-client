import React from "react";
import { X } from "lucide-react";
import { userFields } from "./userFields";

export default function AddUserModal({ newUser, handleAddChange, addUser, closeAddModal }) {

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    for (let field of userFields) {
      if (field.required && !newUser[field.name]) {
        alert(`${field.label} is required`);
        return;
      }
      if (field.type === "email" && newUser[field.name] && !/\S+@\S+\.\S+/.test(newUser[field.name])) {
        alert("Invalid email format");
        return;
      }
      if (field.type === "number" && newUser[field.name] && isNaN(newUser[field.name])) {
        alert(`${field.label} must be a number`);
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
          {userFields.map((field) => (
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
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
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
          ))}

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
