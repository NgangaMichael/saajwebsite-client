import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SurveyAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({}); // questionIndex -> { option -> count }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch survey details
        const surveyRes = await api.get(`/survey/${id}`);
        console.log("Survey response:", surveyRes);
        
        // Handle different response structures
        const surveyData = surveyRes.data?.data || surveyRes.data;
        
        // Validate survey data
        if (!surveyData) {
          throw new Error("No survey data received");
        }
        
        setSurvey(surveyData);

        // Fetch analytics
        const analyticsRes = await api.get(`/survey/${id}/analytics`);
        console.log("Analytics response:", analyticsRes);
        
        // Handle different response structures for analytics
        const analyticsData = analyticsRes.data?.data || analyticsRes.data;
        let responsesData = analyticsData?.responses || analyticsData || [];
        
        // Parse the answers field if it's a JSON string
        responsesData = responsesData.map(response => ({
          ...response,
          answers: typeof response.answers === 'string' 
            ? JSON.parse(response.answers) 
            : response.answers
        }));
        
        setResponses(responsesData);

        // Build counts per question - with null checks
        const counts = {};
        const questions = surveyData.questions || [];
        
        questions.forEach((q, idx) => {
          counts[idx] = {};
        });

        // Process responses with proper null checks
        if (Array.isArray(responsesData)) {
          responsesData.forEach(r => {
            if (r.answers && Array.isArray(r.answers)) {
              r.answers.forEach(a => {
                if (a.questionIndex !== undefined && a.answer) {
                  if (!counts[a.questionIndex]) {
                    counts[a.questionIndex] = {};
                  }
                  if (!counts[a.questionIndex][a.answer]) {
                    counts[a.questionIndex][a.answer] = 0;
                  }
                  counts[a.questionIndex][a.answer] += 1;
                }
              });
            }
          });
        }

        setStats(counts);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h5>Error</h5>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="alert alert-warning" role="alert">
        <p>Survey not found</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const questions = survey.questions || [];
  const totalResponses = responses.length || 0;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>{survey.title} - Analytics</h4>
          <p className="text-muted">{survey.description}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      
      <hr />

      {questions.length === 0 ? (
        <div className="alert alert-info">
          No questions found in this survey.
        </div>
      ) : (
        questions.map((q, idx) => (
          <div key={idx} className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                Question {idx + 1}: {q.questionText}
              </h5>
              
              {stats[idx] && Object.keys(stats[idx]).length > 0 ? (
                <ul className="list-group list-group-flush mt-3">
                  {Object.entries(stats[idx])
                    .sort((a, b) => b[1] - a[1]) // Sort by count descending
                    .map(([option, count]) => {
                      const percentage = totalResponses > 0 
                        ? ((count / totalResponses) * 100).toFixed(1)
                        : 0;
                      
                      return (
                        <li key={option} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{option}</span>
                            <span className="badge bg-primary rounded-pill">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="progress mt-2" style={{ height: '10px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${percentage}%` }}
                              aria-valuenow={percentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <p className="text-muted mt-2">No responses yet for this question.</p>
              )}
            </div>
          </div>
        ))
      )}

      <div className="card bg-light">
        <div className="card-body">
          <h5 className="card-title">Summary</h5>
          <p className="card-text mb-0">
            <strong>Total Responses:</strong> {totalResponses}
          </p>
        </div>
      </div>
    </div>
  );
}