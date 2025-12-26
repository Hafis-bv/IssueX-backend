import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/project.controller";

const router = Router();

router.get("/", getAllProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.patch("/:id", updateProject);

export { router as projectRouter };
