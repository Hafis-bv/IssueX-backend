import { NextFunction, Request, Response } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const date = new Date().toISOString();
  console.log(`[${date}] ${req.method} ${req.originalUrl}`);
  next();
}
