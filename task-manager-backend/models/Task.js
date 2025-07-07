const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  note: String,
  urgency: String,
  completed: Boolean,
  timestamp: Date,
});

module.exports = mongoose.model("Task", taskSchema);
