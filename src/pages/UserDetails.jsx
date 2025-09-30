import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600">User not found</p>
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

      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">{user.username}</h2>
        <p className="text-gray-700 mb-2"><span className="font-medium">Email:</span> {user.email}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Age:</span> {user.age || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Gender:</span> {user.gender || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Level:</span> {user.level || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Marital Status:</span> {user.maritalStatus || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Committee:</span> {user.committee || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Sub-Committee:</span> {user.subCommittee || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Designation:</span> {user.designation || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Subscription:</span> {user.subscription || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">File Number:</span> {user.fileNumber || "-"}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Approve Status:</span> {user.approveStatus || "-"}</p>
        <p className="text-gray-700"><span className="font-medium">Wave Subscription Status:</span> {user.waveSubscriptionStatus || "-"}</p>
      </div>
    </div>
  );
}
