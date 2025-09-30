// src/pages/CommitteeDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";

export default function CommitteeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [committee, setCommittee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCommittee = async () => {
    try {
      const res = await api.get(`/committees/${id}`);
      setCommittee(res.data.data);
    } catch (err) {
      console.error("Error fetching committee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading committee details...</p>
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="p-6">
        <p className="text-red-600">Committee not found</p>
        <button
          onClick={() => navigate("/committees")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Committees
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
        <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
            <ArrowLeft size={18} className="mr-2" />
            Back
        </button>
      <h2 className="text-2xl font-semibold mb-4">{committee.name}</h2>
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <p><strong>ID:</strong> {committee.id}</p>
        <p><strong>Head:</strong> {committee.head}</p>
        <p><strong>Total Members:</strong> {committee.totalMembers || "N/A"}</p>
        <p><strong>Sub Committee:</strong> {committee.subCommittee || "N/A"}</p>
        <p><strong>Description:</strong> {committee.description || "N/A"}</p>
      </div>
      
    </div>
  );
}
