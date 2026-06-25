import React, { useEffect, useState } from "react";
import { Plus, Check, AlertTriangle, Clock, Pencil, Eye, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getTasks, createTask, updateTaskStatus, deleteTask } from "../services/tasks";
import TaskModal from "../components/TaskModal";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // view | create | edit | challenge

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  
  const isLevel3 = loggedInUser?.level === "Level 3";
  const isLevel2 = loggedInUser?.level === "Level 2";

  const fetchTasks = async () => {
    try {
      let data;
      if (isLevel3) {
        data = await getTasks({ creatorId: loggedInUser.id });
      } else if (isLevel2) {
        data = await getTasks({ assigneeId: loggedInUser.id });
      } else {
        data = await getTasks();
      }
      setTasks(data.data || data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalMode("create");
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalMode("edit");
  };

  const openChallengeModal = (task) => {
    setSelectedTask(task);
    setModalMode("challenge");
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setModalMode("view");
  };

  const handleModalSave = async (formData) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        const payload = {
          ...formData,
          assigneeId: Number(formData.assigneeId),
          createdById: loggedInUser?.id,
          createdByUsername: loggedInUser?.username,
          status: "Pending",
        };
        await createTask(payload);
        toast.success("Task assigned successfully!");
      } else if (modalMode === "edit") {
        // ✅ Pass currentUser payload to allow verification filtering on backend
        await updateTaskStatus(selectedTask.id, {
          ...formData,
          assigneeId: Number(formData.assigneeId),
          currentUser: loggedInUser
        });
        toast.success("Task updated successfully!");
      } else if (modalMode === "challenge") {
        // ✅ Pass currentUser payload to safely target only challengesDescription
        await updateTaskStatus(selectedTask.id, {
          status: "Challenges",
          challengesDescription: formData.challengesDescription,
          currentUser: loggedInUser
        });
        toast.warn("Roadblock report submitted.");
      }

      const modalEl = document.getElementById("taskModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task records.");
    } finally {
      setSubmitting(false);
    }
  };

  const markAsCompleted = async (taskId) => {
    if (window.confirm("Mark this task as completed?")) {
      try {
        await updateTaskStatus(taskId, { 
          status: "Completed", 
          challengesDescription: null,
          currentUser: loggedInUser // ✅ Pass user details for tracking
        });
        toast.success("Task completed successfully!");
        fetchTasks();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update status.");
      }
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Delete this assignment permanently?")) {
      try {
        await deleteTask(taskId);
        toast.success("Assignment cleared.");
        fetchTasks();
      } catch (err) {
        console.error(err);
        toast.error("Deletion failed.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading Workspace Tasks...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Tasks Operational Board</h2>
        {isLevel3 && (
          <button 
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
            onClick={openCreateModal}
          >
            <Plus size={16} /> Create & Allocate Task
          </button>
        )}
      </div>

      <hr />

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Task Title</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Status</th>
              <th className="text-center">Execution Controls</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted italic py-3">No tracking tasks present.</td>
              </tr>
            ) : (
              tasks.map((t, idx) => {
                const isPending = t.status === "Pending" || t.status === "Challenges" || t.status === "In Progress";
                const isComplete = t.status === "Completed";

                return (
                  <tr key={t.id || idx}>
                    <td>{idx + 1}</td>
                    <td><span className="fw-bold">{t.title}</span></td>
                    <td>{t.assigneeUsername} <small className="text-muted d-block">by {t.createdByUsername}</small></td>
                    <td>
                      <span className="text-nowrap d-flex align-items-center gap-1 small text-secondary">
                        <Clock size={13} /> {t.dueDate}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        t.status === "Completed" ? "bg-success" :
                        t.status === "Challenges" ? "bg-danger" : "bg-warning text-dark"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => openViewModal(t)}
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          data-bs-toggle="modal"
                          data-bs-target="#taskModal"
                        >
                          <Eye size={14} /> View
                        </button>

                        {/* ✅ Level 3 can edit anytime if not completed to add updates or read comments */}
                        {isLevel3 && !isComplete && (
                          <button
                            onClick={() => openEditModal(t)}
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                            data-bs-toggle="modal"
                            data-bs-target="#taskModal"
                          >
                            <Pencil size={14} /> Edit / Review
                          </button>
                        )}

                        {isLevel2 && !isComplete && (
                          <>
                            <button onClick={() => markAsCompleted(t.id)} className="btn btn-success btn-sm d-flex align-items-center gap-1"><Check size={14} /> Complete</button>
                            <button
                              onClick={() => openChallengeModal(t)}
                              className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                              data-bs-toggle="modal"
                              data-bs-target="#taskModal"
                            >
                              <AlertTriangle size={14} /> Challenges
                            </button>
                          </>
                        )}

                        {isLevel3 && t.status === "Pending" && (
                          <button onClick={() => handleTaskDelete(t.id)} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"><Trash2 size={14} /> Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TaskModal task={selectedTask} mode={modalMode} onSave={handleModalSave} onClose={() => setSelectedTask(null)} submitting={submitting} />
    </div>
  );
}