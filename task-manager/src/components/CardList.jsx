import React from "react";
import Button from "./Button";

// Priority sort helper
const urgencyOrder = {
  "Urgent & Important": 1,
  "Not Urgent but Important": 2,
  "Urgent but Not Important": 3,
  "Not Urgent & Not Important": 4,
};

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function urgencyColorClass(urgency) {
  switch (urgency) {
    case "Urgent & Important":
      return "bg-red-500 text-white";
    case "Not Urgent but Important":
      return "bg-yellow-400 text-black";
    case "Urgent but Not Important":
      return "bg-blue-400 text-white";
    case "Not Urgent & Not Important":
      return "bg-gray-400 text-white";
    default:
      return "bg-gray-200";
  }
}

function CardList({
  tasks,
  onEdit,
  onDelete,
  onShow,
  onToggleComplete,
  filter,
  sortBy,
}) {
  let filtered = tasks;

  // Filter by urgency
  if (filter && filter !== "All") {
    filtered = filtered.filter((t) => t.urgency === filter);
  }

  // Sort
  if (sortBy === "time_desc") {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortBy === "time_asc") {
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (sortBy === "urgency") {
    filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  }

  return (
    <div className="w-full max-w-5xl p-6 bg-amber-100 border border-gray-200 rounded-lg shadow-sm h-[440px] overflow-y-auto">
      <div className="mb-4 font-semibold text-xl text-gray-800">Your Tasks</div>

      {/* Header */}
      <div className="grid grid-cols-[60px_1fr_130px_140px_160px] items-center text-sm font-semibold text-gray-600 border-b pb-2">
        <div>Sr No</div>
        <div>Title</div>
        <div>Urgency</div>
        <div className="text-center">Time</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Tasks */}
      <ul className="divide-y divide-gray-200">
        {filtered.map((task, index) => (
          <li
            key={task._id}
            className={`grid grid-cols-[60px_1fr_130px_140px_160px] items-center py-3 text-sm ${
              task.completed ? "opacity-50 line-through" : ""
            }`}
          >
            <div>{index + 1}</div>
            <div
              className="truncate text-blue-600 cursor-pointer hover:underline pr-4"
              onClick={() => onShow(task)}
            >
              {task.title}
            </div>
            <div>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded ${urgencyColorClass(
                  task.urgency
                )}`}
              >
                {task.urgency}
              </span>
            </div>
            <div className="text-center">{formatTime(task.timestamp)}</div>
            <div className="flex justify-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task._id)}
                className="mr-2"
              />
              <Button
                onClick={() => onEdit(task)}
                className="bg-yellow-400 text-black px-3 py-1 text-xs"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(task._id)}
                className="bg-red-500 text-white px-3 py-1 text-xs"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CardList;
