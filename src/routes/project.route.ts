import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getUserProjects,
  updateProject,
} from "../controllers/project.controller";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get projects by user ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User projects fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getUserProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   post:
 *     summary: Create project for user
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Project
 *     responses:
 *       200:
 *         description: Project created successfully
 *       400:
 *         description: Missing name
 *       404:
 *         description: User id is required
 *       500:
 *         description: Internal server error
 */
router.post("/:id", createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       400:
 *         description: Id is required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   patch:
 *     summary: Update project name
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Missing id or name
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", updateProject);

export { router as projectRouter };
