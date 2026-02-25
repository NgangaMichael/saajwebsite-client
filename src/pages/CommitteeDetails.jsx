// src/pages/CommitteeDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getDocuments } from "../services/documents"; 
import { getUsers } from "../services/users"; 
import { getsubCommittees } from "../services/subcommittees"; // Import subcommittee service
import { ArrowLeft, FileText, Users as UsersIcon, LayoutGrid } from "lucide-react";

export default function CommitteeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [committee, setCommittee] = useState(null);
  const [torDocument, setTorDocument] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [departments, setDepartments] = useState([]); // State for filtered subcommittees
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Committee
        const committeeRes = await api.get(`/committees/${id}`);
        const committeeData = committeeRes.data.data;
        setCommittee(committeeData);

        if (committeeData) {
          const committeeNameLower = committeeData.name.toLowerCase().trim();

          // 2. Fetch and Filter Users (Members)
          const usersRes = await getUsers();
          const allUsers = usersRes.data || [];
          const matchedMembers = allUsers.filter(
            (u) => u.committee?.toLowerCase().trim() === committeeNameLower
          );
          setMemberCount(matchedMembers.length);

          // 3. Fetch and Filter Subcommittees (Departments)
          const subRes = await getsubCommittees();
          const allSubs = subRes.data || [];
          const matchedDepartments = allSubs.filter(
            (sub) => sub.committee?.toLowerCase().trim() === committeeNameLower
          );
          setDepartments(matchedDepartments);

          // 4. Fetch and Match TOR Document
          const docsRes = await getDocuments();
          const allDocs = docsRes.data || [];
          const foundTor = allDocs.find((doc) => {
            const isTorType = doc.type === "TOR";
            const docName = doc.documentName ? doc.documentName.toLowerCase() : "";
            return isTorType && docName.includes(committeeNameLower);
          });
          setTorDocument(foundTor);
        }
      } catch (err) {
        console.error("Error fetching committee details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openTor = () => {
    if (torDocument?.path) {
      window.open(`${api.defaults.baseURL}${torDocument.path}`, "_blank");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading details...</div>;
  if (!committee) return <div className="p-6 text-red-500 text-center">Committee not found.</div>;

  return (
    <div className="container p-6">
      <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center">
        <ArrowLeft size={18} className="me-2" /> Back to Committees
      </button>

      <div className="card shadow border-0 overflow-hidden">
        <div className="card-header bg-primary text-white p-4">
          <h2 className="mb-0 h3 font-weight-bold">{committee.name}</h2>
          <p className="mb-0 opacity-75">Committee Management Profile</p>
        </div>
        
        <div className="card-body p-4">
          <div className="row g-4">
            {/* Left Column: Basic Info */}
            <div className="col-md-6 space-y-4">
              <div>
                <label className="text-muted small text-uppercase font-weight-bold">Committee Head</label>
                <p className="h5">{committee.head || "Not Assigned"}</p>
              </div>
              <div>
                <label className="text-muted small text-uppercase font-weight-bold">MC Representative</label>
                <p className="h5">{committee.mcrep || "Not Assigned"}</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <UsersIcon size={20} className="text-primary" />
                <div>
                  <label className="text-muted small text-uppercase font-weight-bold d-block">Active Members</label>
                  <span className="badge bg-light text-primary border">{memberCount} Registered</span>
                </div>
              </div>
            </div>

            {/* Right Column: Departments & Documents */}
            <div className="col-md-6">
              <div className="mb-4">
                <label className="text-muted small text-uppercase font-weight-bold d-flex align-items-center gap-2 mb-2">
                  <LayoutGrid size={16} /> Departments (Sub-committees)
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <span key={dept.id} className="badge bg-info text-white py-2 px-3">
                        {dept.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted italic">No departments linked to this committee.</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-light rounded border">
                <label className="text-muted small text-uppercase font-weight-bold d-block mb-2">Terms of Reference (TOR)</label>
                {torDocument ? (
                  <button 
                    onClick={openTor}
                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                  >
                    <FileText size={16} /> View Official TOR
                  </button>
                ) : (
                  <div className="text-muted small">
                    <p className="mb-1">{committee.description || "No description provided."}</p>
                    <span className="badge bg-secondary">No TOR Document Found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}