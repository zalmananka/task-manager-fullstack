import React, { useEffect, useState } from "react";
import API from "../api/api"; // Axios instance
import Button from "./Button";
import CardList from "./CardList";
import TaskModal from "./TaskModal";
import toast from "react-hot-toast";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("time_desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  // 🔄 Fetch tasks from backend
  useEffect(() => {
    API.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // ➕ Add or Edit task
  const handleSubmitTask = (taskData) => {
    const timestamp = new Date().toISOString();

    if (taskData._id) {
      // Update existing task
      API.put(`/tasks/${taskData._id}`, { ...taskData })
        .then((res) => {
          setTasks((prev) =>
            prev.map((task) => (task._id === taskData._id ? res.data : task))
          );
          toast.success("Task updated");
        })
        .catch(() => toast.error("Failed to update task"));
    } else {
      // Add new task
      API.post("/tasks", { ...taskData, timestamp, completed: false })
        .then((res) => {
          setTasks((prev) => [...prev, res.data]);
          toast.success("Task added");
        })
        .catch(() => toast.error("Failed to add task"));
    }

    setModalOpen(false);
  };

  const handleDelete = (id) => {
    API.delete(`/tasks/${id}`)
      .then(() => {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success("Task deleted");
      })
      .catch(() => toast.error("Failed to delete task"));
  };

  const toggleComplete = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    API.put(`/tasks/${id}`, { ...task, completed: !task.completed })
      .then((res) => {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        toast(`Marked as ${!task.completed ? "completed" : "incomplete"}`);
      })
      .catch(() => toast.error("Failed to update status"));
  };

  const handleAdd = () => {
    setModalTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setModalTask(task);
    setModalOpen(true);
  };

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      toast.error("No tasks to export");
      return;
    }

    const headers = [
      "Sr No",
      "Title",
      "Note",
      "Urgency",
      "Completed",
      "Timestamp",
    ];
    const rows = tasks.map((task, index) => [
      index + 1,
      `"${task.title}"`,
      `"${task.note?.replace(/"/g, '""') || ""}"`,
      task.urgency,
      task.completed ? "Yes" : "No",
      new Date(task.timestamp).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "task-list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Tasks exported as CSV");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Task Manager</h1>

        <div className="flex justify-end mb-4">
          <Button onClick={handleAdd}>Add Task</Button>
        </div>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div>
            <label className="text-sm mr-2 font-medium">
              Filter by Urgency:
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="border px-2 py-1 text-sm rounded"
            >
              <option>All</option>
              <option>Urgent & Important</option>
              <option>Not Urgent but Important</option>
              <option>Urgent but Not Important</option>
              <option>Not Urgent & Not Important</option>
            </select>
          </div>
          <div>
            <label className="text-sm mr-2 font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-2 py-1 text-sm rounded"
            >
              <option value="time_desc">Time (Newest)</option>
              <option value="time_asc">Time (Oldest)</option>
              <option value="urgency">Urgency</option>
            </select>
          </div>
          <Button
            onClick={handleExportCSV}
            className="bg-blue-500 text-white px-4 py-2 text-sm"
          >
            Export CSV
          </Button>
        </div>

        {tasks.some((t) => t.completed) && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => {
                const count = tasks.filter((t) => t.completed).length;
                const toKeep = tasks.filter((t) => !t.completed);
                const deletions = tasks.filter((t) => t.completed);

                Promise.all(
                  deletions.map((task) => API.delete(`/tasks/${task._id}`))
                ).then(() => {
                  setTasks(toKeep);
                  toast.success(`${count} completed task(s) cleared`);
                });
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
            >
              Clear Completed
            </Button>
          </div>
        )}

        <CardList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={(task) => setViewingTask(task)}
          onToggleComplete={toggleComplete}
          filter={urgencyFilter}
          sortBy={sortBy}
        />

        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitTask}
          editingTask={modalTask}
        />

        {viewingTask && (
          <div className="fixed inset-0  bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-amber-100 rounded-lg p-6 w-full max-w-md relative shadow-xl">
              <button
                onClick={() => setViewingTask(null)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-2">{viewingTask.title}</h2>
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                {viewingTask.note || "No note provided"}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Urgency: {viewingTask.urgency}
              </p>
              <p className="text-xs text-gray-400">
                Added: {new Date(viewingTask.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;
