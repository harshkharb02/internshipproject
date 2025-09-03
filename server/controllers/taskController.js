import Task from "../models/Task.js";

// Create new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      deadline,
      assignedTo: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Create Task Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get tasks for logged-in user
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("❌ Fetch Tasks Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update task fully
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (deadline) task.deadline = deadline;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("❌ Update Task Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Task Error:", error);
    res.status(500).json({ message: error.message });
  }
};
