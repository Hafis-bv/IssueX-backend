import { type Response } from "express";
import jwt from "jsonwebtoken";

interface GenerateTokenAndSetCookies {
  (res: Response, userId: string): string;
}

export const generateTokenAndSetCookies: GenerateTokenAndSetCookies = (
  res,
  userId,
) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

res.cookie("token", token, {
  httpOnly: true,
  secure: true,          // always true in prod — Render is always HTTPS
  sameSite: "none",      // required for cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

  return token;
};
