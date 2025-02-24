const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  task_data:String,
  status: { type: String, enum: ["Doing", "Later",  "Completed"], default: "Doing" },
});

module.exports = mongoose.model("Task", TaskSchema);
