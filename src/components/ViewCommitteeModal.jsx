import React from "react";
import { X } from "lucide-react";

export default function ViewCommitteeModal({ committee, closeViewModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Committee Details</h3>
          <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <ul className="space-y-2 text-gray-700">
          <li><strong>Name:</strong> {committee.name}</li>
          <li><strong>Head:</strong> {committee.head}</li>
          <li><strong>Sub-Committee:</strong> {committee.subCommittee || "-"}</li>
          <li><strong>Total Members:</strong> {committee.totalMembers || "-"}</li>
          <li><strong>Description:</strong> {committee.description || "-"}</li>
        </ul>

        <div className="flex justify-end mt-6">
          <button onClick={closeViewModal} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}
