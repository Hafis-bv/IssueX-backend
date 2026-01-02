import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  getUsersTasks,
  updateTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.get("/user/:id", getUsersTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export { router as taskRouter };
