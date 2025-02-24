const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project_title: String,
  project_date:String,
  description: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
