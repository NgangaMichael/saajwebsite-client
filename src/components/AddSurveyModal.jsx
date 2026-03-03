import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { createSurvey, updateSurvey } from "../services/survery";
import { toast } from "react-toastify";

export default function AddSurveyModal({ closeModal, refresh, editData }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isEditing = !!editData;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setDescription(editData.description || "");
      
      // Parse questions and ensure options is an array
      const sanitized = (editData.questions || []).map(q => {
        let opt = q.options;
        if (typeof opt === 'string') {
          try { opt = JSON.parse(opt); } catch(e) { opt = []; }
        }
        return { ...q, options: Array.isArray(opt) ? opt : [] };
      });
      setQuestions(sanitized);
    }
  }, [editData]);

  if (storedUser?.level !== "Level 3") return null;

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", questionType: "text", options: [] }]);
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
    if (!Array.isArray(updated[qIndex].options)) updated[qIndex].options = [];
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
      toast.warning("Title and at least one question required");
      return;
    }
    try {
      const payload = { title, description, questions };
      if (isEditing) {
        await updateSurvey(editData.id, payload);
        toast.success("Updated!");
      } else {
        await createSurvey(payload);
        toast.success("Created!");
      }
      refresh();
      closeModal();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? "Edit Survey" : "Create Survey"}</h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="mb-3">
              <label className="form-label fw-bold">Title</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <hr />
            <div className="d-flex justify-content-between mb-2">
              <h6>Questions</h6>
              <button className="btn btn-sm btn-primary" onClick={addQuestion}><Plus size={14}/> Add</button>
            </div>

            {questions.map((q, idx) => (
              <div key={idx} className="border rounded p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between mb-2">
                  <span className="badge bg-dark">Question {idx + 1}</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeQuestion(idx)}><Trash2 size={14}/></button>
                </div>
                <input className="form-control mb-2" placeholder="Question Text" value={q.questionText} onChange={(e) => updateQuestion(idx, "questionText", e.target.value)} />
                <select className="form-select mb-2" value={q.questionType} onChange={(e) => updateQuestion(idx, "questionType", e.target.value)}>
                  <option value="text">Text</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>

                {q.questionType === "multiple_choice" && (
                  <div className="ms-3 p-2 border-start">
                    {Array.isArray(q.options) && q.options.map((opt, i) => (
                      <div key={i} className="d-flex gap-2 mb-2">
                        <input className="form-control form-control-sm" value={opt} onChange={(e) => updateOption(idx, i, e.target.value)} />
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeOption(idx, i)}><X size={14}/></button>
                      </div>
                    ))}
                    <button className="btn btn-sm btn-link text-decoration-none" onClick={() => addOption(idx)}>+ Add Option</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="btn btn-success" onClick={submitSurvey}>
              {isEditing ? "Update Survey" : "Save Survey"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}