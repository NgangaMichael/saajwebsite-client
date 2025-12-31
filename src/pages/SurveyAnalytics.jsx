import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SurveyAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({}); // questionIndex -> { option -> count }

  useEffect(() => {
    const fetchAnalytics = async () => {
  try {
    const surveyRes = await api.get(`/survey/${id}`);
    const surveyData = surveyRes.data.data; // <-- access inner `data`
    setSurvey(surveyData);

    const analyticsRes = await api.get(`/survey/${id}/analytics`);
    const responsesData = analyticsRes.data.data.responses; // <-- depends on your backend
    setResponses(responsesData);

    // Build counts per question
    const counts = {};
    surveyData.questions.forEach((q, idx) => {
      counts[idx] = {};
    });

    responsesData.forEach(r => {
      r.answers.forEach(a => {
        if (!counts[a.questionIndex][a.answer]) counts[a.questionIndex][a.answer] = 0;
        counts[a.questionIndex][a.answer] += 1;
      });
    });

    setStats(counts);
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
  }
};

    fetchAnalytics();
  }, [id]);

  if (!survey) return <p>Loading...</p>;

  return (
    <div>
      <h4>{survey.title} - Analytics</h4>
      <p>{survey.description}</p>
      <hr />

      {survey.questions.map((q, idx) => (
        <div key={idx} className="mb-4">
          <strong>{q.questionText}</strong>
          <ul>
            {stats[idx] &&
              Object.entries(stats[idx]).map(([option, count]) => (
                <li key={option}>
                  {option}: {count} ({((count / responses.length) * 100).toFixed(1)}%)
                </li>
              ))}
          </ul>
        </div>
      ))}

      <h5>Total Responses: {responses.length}</h5>
    </div>
  );
}
