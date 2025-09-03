import express from "express";
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getUserTasks);
router.put("/:id", protect, updateTask);   // ✅ full update
router.delete("/:id", protect, deleteTask);

export default router;
