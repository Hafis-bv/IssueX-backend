import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";
import { AppError } from "../utils/AppError";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError("User alredy exists", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    generateTokenAndSetCookies(res, newUser.id);

    return res
      .status(201)
      .json({ message: "User successfully registered!", newUser });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ err: "All fields are required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    return res.status(200).json({
      message: "Login successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
