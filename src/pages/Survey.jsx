import React, { useEffect, useState } from "react";
import { Plus, Eye, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSurveys } from "../services/survery";
import AddSurveyModal from "../components/AddSurveyModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Survey() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

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

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Surveys</h5>

        {/* Admin only (optional role check) */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setAdding(true)}
        >
          <Plus size={16} /> Create Survey
        </button>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {surveys.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No surveys available
              </td>
            </tr>
          ) : (
            surveys.map((survey, idx) => (
              <tr key={survey.id}>
                <td>{idx + 1}</td>
                <td>{survey.title}</td>
                <td>{survey.description || "-"}</td>
                <td>
                  {survey.alreadySubmitted ? (
                    <span className="text-success">
                      <CheckCircle size={16} /> Submitted
                    </span>
                  ) : (
                    <span className="text-warning">Pending</span>
                  )}
                </td>
                <td>
                   {survey.alreadySubmitted ? (
                    <span className="text-success">
                      <CheckCircle size={16} /> Submitted
                    </span>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`respond/${survey.id}`)}
                    >
                      Respond
                    </button>
                  )}
            
                   {/* Admin Analytics Button */}
                  {isLevel3 && (
                    <button
                      className="btn btn-info btn-sm mx-2"
                      onClick={() => navigate(`analytics/${survey.id}`)}
                    >
                      View Analytics
                    </button>
                  )}
                </td>
                {/* <td>
                  {!isLevel3 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/survey/respond/${survey.id}`)}
                    >
                      Respond
                    </button>
                  )}
                </td> */}
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
        />
      )}

    <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
