import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";
import { AppError } from "../utils/AppError";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

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

    const token = generateTokenAndSetCookies(res, user.id);

    return res.status(200).json({
      message: "Login successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "Logged out successfully" });
}

export async function forgot(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedOtp,
        resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendEmail(
      email,
      "Forgot your password",
      `
      <h1>Forgot your password</h1>
      <h2>Here is your OTP code</h2>
      <h3>${otp}</h3>
      `
    );
    return res.json({ message: "Your otp sent successfully" });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}

export async function reset(req: Request, res: Response, next: NextFunction) {
  const { otp, email, newPassword } = req.body;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (hashedOtp !== user.resetPasswordToken) {
      return next(new AppError("Otp code is wrong", 400));
    }
    if (
      !user.resetPasswordExpiry ||
      user.resetPasswordExpiry?.getTime() < Date.now()
    ) {
      return next(new AppError("Otp expired", 400));
    }
    if (!newPassword || newPassword.length < 6) {
      return next(
        new AppError("Password must be at least 6 characters long", 400)
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });
    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
}
