import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskModal({ task, mode, onSave, onClose, submitting }) {
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const isLevel3 = loggedInUser.level === "Level 3";
  const isLevel2 = loggedInUser.level === "Level 2";
  
  const todayStr = new Date().toISOString().split("T")[0]; 

  const [form, setForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
    assigneeUsername: "",
    dueDate: "",
    reminderAt: "",
    challengesDescription: "",
    adminComments: "", // ✅ Track state changes dynamically
  });

  const [level2Users, setLevel2Users] = useState([]);

  useEffect(() => {
    if (mode === "create" || mode === "edit") {
      axios.get("http://localhost:8080/api/users")
        .then((res) => {
          const allUsers = res.data.data || res.data;
          const l2Users = allUsers.filter(u => u.level === "Level 2");
          setLevel2Users(l2Users);
        })
        .catch(err => console.error("Error loading assignees:", err));
    }
  }, [mode]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        assigneeId: task.assigneeId || "",
        assigneeUsername: task.assigneeUsername || "",
        dueDate: task.dueDate || "",
        reminderAt: task.reminderAt ? task.reminderAt.substring(0, 16) : "",
        challengesDescription: task.challengesDescription || "",
        adminComments: task.adminComments || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        assigneeId: "",
        assigneeUsername: "",
        dueDate: "",
        reminderAt: "",
        challengesDescription: "",
        adminComments: "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "assigneeId") {
      const selectedUser = level2Users.find(u => u.id === Number(value));
      setForm(prev => ({
        ...prev,
        assigneeId: value,
        assigneeUsername: selectedUser ? selectedUser.username : ""
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal fade" id="taskModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 fw-bold">
              {mode === "create" && "➕ Assign New Task"}
              {mode === "edit" && "✏️ Modify & Review Task"}
              {mode === "challenge" && "⚠️ Report Task Challenges"}
              {mode === "view" && "📋 Task Details"}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              
              {/* LEVEL 3 CREATION & MODIFICATION FORM */}
              {(mode === "create" || mode === "edit") && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Task Title</label>
                    <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required disabled={mode === "edit"} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Assignee (Level 2 Officers)</label>
                    <select name="assigneeId" className="form-select" value={form.assigneeId} onChange={handleChange} required disabled={mode === "edit"}>
                      <option value="">-- Choose Allocatee --</option>
                      {level2Users.map(u => (
                        <option key={u.id} value={u.id}>{u.username} ({u.committee || 'General'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Task Instructions</label>
                    <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} required disabled={mode === "edit"}></textarea>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-semibold">Timeline Due Date</label>
                      <input type="date" name="dueDate" min={todayStr} className="form-control" value={form.dueDate} onChange={handleChange} required disabled={mode === "edit"} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-semibold">Send Reminder Alarm</label>
                      <input type="datetime-local" min={`${todayStr}T00:00`} name="reminderAt" className="form-control" value={form.reminderAt} onChange={handleChange} disabled={mode === "edit"} />
                    </div>
                  </div>

                  {/* ✅ EDIT MODE: Show Challenges as Read-Only and Comments as Editable for L3 */}
                  {mode === "edit" && isLevel3 && (
                    <div className="mt-3 border-top pt-3">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-danger">Reported Blocker/Challenges (Read-Only)</label>
                        <div className="p-2 bg-light rounded text-muted small border">
                          {form.challengesDescription || <span className="text-muted italic">No task bottlenecks logged by ground operators.</span>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold text-primary">Oversight Administrative Comments (Editable)</label>
                        <textarea 
                          name="adminComments" 
                          className="form-control" 
                          rows="3" 
                          placeholder="Provide dynamic directives or response feedback notes..."
                          value={form.adminComments} 
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* LEVEL 2 CHALLENGE FILING FORM */}
              {mode === "challenge" && (
                <div className="mb-3">
                  <div className="alert alert-danger py-2 small mb-3">
                    <strong>Task Title:</strong> {task?.title}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-danger">Describe Your Roadblocks / Challenges</label>
                    <textarea 
                      name="challengesDescription" 
                      className="form-control" 
                      rows="3" 
                      placeholder="Provide details on why this task is stuck..."
                      value={form.challengesDescription} 
                      onChange={handleChange} 
                      required
                    ></textarea>
                  </div>

                  {/* ✅ Level 2 can see L3 comments side-by-side while logging an issue */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary">Latest Admin Comments (Read-Only)</label>
                    <div className="p-2 bg-light rounded text-muted small border">
                      {form.adminComments || <span className="text-muted italic">No management review notes added yet.</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* READ ONLY LOOKUPS (VIEW MODE) */}
              {mode === "view" && task && (
                <div>
                  <h5 className="fw-bold text-primary">{task.title}</h5>
                  <p className="bg-light p-2 rounded small text-secondary">{task.description}</p>
                  <hr />
                  <p className="mb-1 small"><strong>Due Date:</strong> {task.dueDate}</p>
                  <p className="mb-1 small"><strong>Status:</strong> {task.status}</p>
                  
                  {/* ✅ Structured Read-Only Layout Blocks */}
                  <div className="row mt-3">
                    <div className="col-6">
                      <label className="fw-bold text-danger small d-block mb-1">⚠️ Ground Challenges</label>
                      <div className="p-2 bg-danger-subtle rounded border small text-dark min-height-64">
                        {task.challengesDescription || <span className="text-muted italic">None reported.</span>}
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="fw-bold text-primary small d-block mb-1">💬 Admin Comments</label>
                      <div className="p-2 bg-primary-subtle rounded border small text-dark min-height-64">
                        {task.adminComments || <span className="text-muted italic">No response comments logged.</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={onClose}>
                Close
              </button>
              {mode !== "view" && (
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? "Saving changes..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}