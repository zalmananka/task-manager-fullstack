const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ timestamp: -1 });
  res.json(tasks);
});

// Add new task
router.post("/", async (req, res) => {
  const newTask = new Task(req.body);
  const saved = await newTask.save();
  res.status(201).json(saved);
});

// Update task
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;
