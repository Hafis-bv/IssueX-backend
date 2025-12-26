import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, assigneeId, projectId } = req.body;
  if (!title) {
    return next(new AppError("Title is requierd", 400));
  }
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId,
        projectId,
      },
    });
    return res.json({ message: "Task created successfully", task });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function getAllTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tasks = await prisma.task.findMany();
    return res.json(tasks);
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
