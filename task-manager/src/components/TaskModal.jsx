import React, { useState, useEffect } from "react";
import Button from "./Button";

const urgencyOptions = [
  "Urgent & Important",
  "Not Urgent but Important",
  "Urgent but Not Important",
  "Not Urgent & Not Important",
];

function TaskModal({ isOpen, onClose, onSubmit, editingTask }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [urgency, setUrgency] = useState(urgencyOptions[0]);

  // Populate inputs if editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setNote(editingTask.note || "");
      setUrgency(editingTask.urgency || urgencyOptions[0]);
    } else {
      setTitle("");
      setNote("");
      setUrgency(urgencyOptions[0]);
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      ...editingTask,
      title,
      note,
      urgency,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      {" "}
      <div
        className="bg-amber-100 
       rounded-lg p-6 w-full max-w-md relative shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {editingTask ? "Edit Task" : "Add Task"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border px-3 py-2 rounded text-sm"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border px-3 py-2 rounded text-sm"
              placeholder="Optional note"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full bg-white border px-3 py-2 rounded text-sm"
            >
              {urgencyOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <Button onClick={handleSubmit}>
              {editingTask ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
