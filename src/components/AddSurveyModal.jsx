import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { createSurvey } from "../services/survery";

export default function AddSurveyModal({ closeModal, refresh }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser?.level !== "Level 3") return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        options: []
      }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const submitSurvey = async () => {
    if (!title || questions.length === 0) {
      alert("Survey title and at least one question are required.");
      return;
    }

    try {
      await createSurvey({
        title,
        description,
        questions
      });

      refresh();
      closeModal();
    } catch (err) {
      console.error("Error creating survey:", err);
      alert("Failed to create survey");
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5>Create Survey</h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Survey Title</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <hr />

            <h6>Questions</h6>

            {questions.map((q, idx) => (
              <div key={idx} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Question {idx + 1}</strong>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeQuestion(idx)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <input
                  className="form-control mt-2"
                  placeholder="Question text"
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestion(idx, "questionText", e.target.value)
                  }
                />

                <select
                  className="form-select mt-2"
                  value={q.questionType}
                  onChange={(e) =>
                    updateQuestion(idx, "questionType", e.target.value)
                  }
                >
                  <option value="text">Text</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>

                {q.questionType === "multiple_choice" && (
                  <div className="mt-3">
                    <strong>Options</strong>
                    {q.options.map((opt, i) => (
                      <div key={i} className="d-flex gap-2 mt-2">
                        <input
                          className="form-control"
                          value={opt}
                          onChange={(e) =>
                            updateOption(idx, i, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeOption(idx, i)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    <button
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={() => addOption(idx)}
                    >
                      <Plus size={14} /> Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              className="btn btn-outline-secondary"
              onClick={addQuestion}
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={submitSurvey}>
              Save Survey
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
