import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body;
  if (!name) {
    return next(new AppError("Project must have name", 400));
  }
  try {
    const project = await prisma.project.create({
      data: {
        name,
      },
    });
    return res.json({ message: "Project created successfully", project });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Id is required", 400));
  }
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError("Project not found", 404));
    }
    await prisma.project.delete({ where: { id } });
    return res.json({ message: "Project deleted successfully", project });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { name } = req.body;
  if (!id) {
    return next(new AppError("Id is required", 400));
  }
  if (!name) {
    return next(new AppError("Project must have name", 400));
  }
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
      },
    });
    if (!project) {
      return next(new AppError("Project not found", 404));
    }
    return res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function getAllProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projects = await prisma.project.findMany();
    return res.json(projects);
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
