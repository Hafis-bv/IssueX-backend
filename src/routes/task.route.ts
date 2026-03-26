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

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get one task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getTask);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - assigneeId
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fix login bug
 *               description:
 *                 type: string
 *                 example: User cannot login with Google
 *               assigneeId:
 *                 type: string
 *                 example: 2f8d4f39-2a4e-4e67-9a93-f3ab8e6c2f91
 *               projectId:
 *                 type: string
 *                 example: 9e00b471-7897-4c31-8041-ee3c74ef06d5
 *     responses:
 *       200:
 *         description: Task created successfully
 *       400:
 *         description: Title is required
 *       500:
 *         description: Internal server error
 */
router.post("/", createTask);

/**
 * @swagger
 * /api/tasks/user/{id}:
 *   get:
 *     summary: Get all tasks of a specific user
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User tasks fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:id", getUsersTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Id is required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       400:
 *         description: Id is required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteTask);

export { router as taskRouter };
