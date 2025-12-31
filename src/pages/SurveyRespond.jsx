import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSurveyById, submitSurveyResponse } from "../services/survery";

export default function SurveyRespond() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({}); // key: questionIndex, value: answer

  useEffect(() => {
    const fetchSurvey = async () => {
      const res = await getSurveyById(id);
      setSurvey(res);
    };
    fetchSurvey();
  }, [id]);

  const handleAnswerChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const validateAnswers = () => {
    if (!survey) return false;

    for (let i = 0; i < survey.questions.length; i++) {
        if (
        answers[i] === undefined ||
        answers[i] === null ||
        answers[i] === ""
        ) {
        return false;
        }
    }
    return true;
    };

    const submit = async () => {
        if (!validateAnswers()) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const payload = {
            surveyId: survey.id,
            userId: storedUser.id,
            answers: Object.entries(answers).map(([qIndex, answer]) => ({
            questionIndex: Number(qIndex),
            answer
            }))
        };

        try {
            await submitSurveyResponse(payload);
            alert("Survey submitted!");
            navigate("/dashboard/survey");
        } catch (err) {
            alert("Failed to submit survey");
        }
        };



//   const submit = async () => {
//     const payload = {
//       surveyId: survey.id,
//       userId: storedUser.id,
//       answers: Object.entries(answers).map(([qIndex, answer]) => ({
//         questionIndex: Number(qIndex),
//         answer
//       }))
//     };
//     await submitSurveyResponse(payload);
//     alert("Survey submitted!");
//     navigate("/dashboard/survey");
//   };

  if (!survey) return <p>Loading survey...</p>;

  return (
    <div>
      <h5>Title: {survey.title}</h5>
      <p>Description: {survey.description}</p>
      <hr />

      {survey.questions.map((q, idx) => {
        const options =
            typeof q.options === "string"
            ? JSON.parse(q.options) // for '["Yes","No"]'
            : q.options;

        return (
            <div key={idx} className="mb-4">
            <strong>{q.questionText}</strong>

            {q.questionType === "text" ? (
                <input
                type="text"
                className="form-control mt-2"
                value={answers[idx] || ""}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                required
                />
            ) : (
                Array.isArray(options) &&
                options.map((opt, i) => (
                <div key={i} className="form-check mt-2">
                    <input
                    type="radio"
                    name={`q-${idx}`}
                    className="form-check-input"
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    required
                    />
                    <label className="form-check-label">{opt}</label>
                </div>
                ))
            )}
            </div>
        );
        })}

      <button className="btn btn-success" onClick={submit}>
        Submit
      </button>
    </div>
  );
}
