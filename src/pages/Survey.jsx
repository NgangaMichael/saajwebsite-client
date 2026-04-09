import React, { useEffect, useState } from "react";
import { Plus, Eye, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSurveys, deleteSurvey } from "../services/survery";
import AddSurveyModal from "../components/AddSurveyModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Survey() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const pendingCount = surveys.filter(s => !s.alreadySubmitted).length;
  const [editingSurvey, setEditingSurvey] = useState(null);

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLevel3 = storedUser?.level === "Level 3";

  const fetchSurveys = async () => {
    try {
      const res = await getSurveys(storedUser.id);
      setSurveys(res.data);
    } catch (err) {
      console.error("Error fetching surveys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  if (loading) {
    return <p className="text-center text-muted">Loading surveys...</p>;
  }

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this survey?")) return;
    try {
      await deleteSurvey(id);
      toast.success("Survey deleted successfully");
      fetchSurveys(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete survey");
    }
  };

  const handleEdit = (survey) => {
    setEditingSurvey(survey);
    setAdding(true); 
  };

  const handleCloseModal = () => {
    setAdding(false);
    setEditingSurvey(null); // Reset so the next "Create" is empty
  };

  // Add this logic inside your Survey component, before the return
  const filteredSurveys = surveys.filter((survey) => {
    const userLevel = storedUser?.level;

    // 1. If it's an "all" survey, everyone sees it
    if (survey.level === "all") return true;

    // 2. If it's a "level 2" survey, only Level 2 and Level 3 users see it
    if (survey.level === "level 2") {
      return userLevel === "Level 2" || userLevel === "Level 3";
    }

    // 3. (Optional) If you have "level 3" specific surveys
    if (survey.level === "level 3") {
      return userLevel === "Level 3";
    }

    return false;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>
          Surveys 
          {pendingCount > 0 && (
            <span className="badge bg-danger ms-2" style={{ fontSize: '0.7rem' }}>
              {pendingCount} Pending
            </span>
          )}
        </h5>

        {/* Admin only (optional role check) */}
        {storedUser?.level !== "Level 1" && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setAdding(true)}
          >
            <Plus size={16} /> Create Survey
          </button>
        )}
      </div>

      <hr />

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Level</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
  {filteredSurveys.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        No surveys available
      </td>
    </tr>
  ) : (
    filteredSurveys.map((survey, idx) => (
      <tr key={survey.id}>
        <td>{idx + 1}</td>
        <td>{survey.title}</td>
        <td>{survey.description || "-"}</td>
        <td>
          {survey.alreadySubmitted ? (
            <span className="text-success fw-bold">
              <CheckCircle size={16} /> Submitted
            </span>
          ) : (
            <span className="text-warning fw-bold">Pending</span>
          )}
        </td>
        <td>{survey.level}</td>
        
        {/* ACTION COLUMN: Respond button for users */}
        <td>
          {!survey.alreadySubmitted ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => navigate(`respond/${survey.id}`)}
            >
              Respond
            </button>
          ) : (
            <button className="btn btn-outline-secondary btn-sm" disabled>
              Completed
            </button>
          )}
        </td>

        {/* ADMIN COLUMN: Analytics, Edit, Delete */}
        <td>
          {isLevel3 && (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-info btn-sm text-white" 
                onClick={() => navigate(`analytics/${survey.id}`)}
                title="Analytics"
              >
                <Eye size={14} />
              </button>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => handleEdit(survey)}
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleDelete(survey.id)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
      </table>

      {/* Add Survey Modal */}
      {adding && (
        <AddSurveyModal
          closeModal={() => setAdding(false)}
          refresh={fetchSurveys}
          editData={editingSurvey}
        />
      )}

    <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
