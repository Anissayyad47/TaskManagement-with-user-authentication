require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB=require("./db");
const User = require("./Models/User");
const Project=require("./Models/Project_Title");
const Task=require("./Models/TaskList")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
// Connect Database ************
connectDB();

//  Sign Up **********************
app.post('/sign-up', async (req, res) => {
    try {
        const { username, password, Name } = req.body;
  
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User Already Exists" });
        }
  
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newUser = new User({
            username: username,
            password: hashedPassword,
            display_name: Name
        });
  
        const savedUser = await newUser.save(); // Save and get the newly created user
  
        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
        res.status(201).json({ message: "User registered successfully", token, userId: savedUser._id });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while registering the user" });
    }
});


// Login ***********************
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Incorrect Username");
            return res.status(401).json({ error: "Incorrect Username" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect Password");
            return res.status(401).json({ error: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", token, userId: user._id });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
  });

// Create Project ******************************
app.post("/createProject", async (req, res) => {
  const { userId, project_title } = req.body;

  if (!userId || !project_title) {
      return res.status(400).json({ error: "User ID and Project Title are required" });
  }

  try {
      // 🔥 Check if user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // 🔥 Check if project title already exists
      const existingProject = await Project.findOne({ project_title });
      if (existingProject) {
          return res.status(409).json({ error: "Project name already Exists" });
      }

      // 🔥 Create a new project linked to the user
      const newProject = new Project({
          userId,         
          project_title
      });

      await newProject.save();  // Save project in the database

      res.status(201).json({ message: "Project Created Successfully", projectId: newProject._id,project_title:newProject.project_title});
      console.log("Successfully created: " + project_title);
  } catch (err) {
      console.error("Error creating project:", err);
      res.status(500).json({ error: "An error occurred while creating the project" });
  }
});


// create Task for each project ***********************************
app.post("/createTask", async (req, res) => {
  const { projectId, title } = req.body;

  if (!projectId || !title) {
      return res.status(400).json({ error: "project id and task are required" });
  }

  try {
      // 🔥 Check if user exists
      const project = await Project.findById(projectId);
      if (!project) {
          return res.status(404).json({ error: "Project is not found" });
      }

      // 🔥 Create a new project linked to the user
      const newTask = new Task({ 
        projectId,         // Store user ID to link with project
        title 
      });

      await newTask.save();  // Save project in the database

      res.status(200).json({ message: "Task Created Successfully" });
      console.log("successfuly : "+title)
  } catch (err) {
      console.error("Error creating task:", err);
      res.status(500).json({ error: "An error occurred while creating the task" });
  }
});


//  Get User Name *****************************
app.get("/userName/:userId", async (req, res) => {
  try {
      const { userId } = req.params; // Extract userId from params
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: "Invalid user ID" });
      }
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ display_name: user.display_name });
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
  }
});


// Get all project list ***********************

app.get("/projects/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const projects = await Project.find({ userId }); // 🔥 Find all projects linked to this user
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// Get all task list ***********************
app.get("/tasks/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
      const task = await Task.find({ projectId }); // 🔥 Find all projects linked to this user
      res.status(200).json(task);
  } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch taks" });
  }
});

// update task Status
app.put("/tasks/:taskId/status", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;  // New status value

  try {
      // Find the task by its ID and update its status
      const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { status },
          { new: true }  // Return the updated document
      );

      if (!updatedTask) {
          return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task status updated", task: updatedTask });
  } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Edite Task
app.put("/editeTask/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;  // New status value

  try {
      // Find the task by its ID and update its status
      const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { title },
          { new: true }  // Return the updated document
      );

      if (!updatedTask) {
          return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task edited", task: updatedTask });
  } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Task
app.delete("/deleteTasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
      const deletedTask = await Task.findByIdAndDelete(taskId);

      if (!deletedTask) {
          return res.status(404).json({ error: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
