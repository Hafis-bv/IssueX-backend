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

export async function getTask(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    return res.json(task);
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

export async function getUsersTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("User id is required", 404));
  }
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return next(new AppError("User not found", 404));

    const tasks = await prisma.task.findMany({
      where: { assigneeId: id },
    });
    return res.json(tasks);
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Id is required", 400));
  }
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    await prisma.task.delete({ where: { id } });
    return res.json({ message: "Task deleted successfully", task });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  if (!id) {
    return next(new AppError("Id is required", 400));
  }
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
      },
    });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    return res.json({ message: "Task updated successfully", task });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
